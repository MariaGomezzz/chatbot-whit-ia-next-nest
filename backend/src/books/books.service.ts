import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { PROMPTS } from 'src/books/prompts';
import { Repository } from 'typeorm';
import { BooksEntity } from './books.entity';
import { MessageDto } from 'src/dto/message.dto';

@Injectable()
export class BooksService {
  private readonly ai: GoogleGenAI;
  constructor(
    private readonly configService: ConfigService, //Inyeccion variables de entorno

    @Inject('BOOKS_REPOSITORY') private readonly booksRepository: Repository<BooksEntity>,  //Inyeccion del repostorio de la entidad
  ) {
    this.ai = new GoogleGenAI({ apiKey: this.configService.get("GEMINI_API_KEY") }); //Algo con la conexion a la IA
  }

  //Obtner todos los mensajes de la base de datos
  async getAllMensagges() {
    try {
      return await this.booksRepository.find();
    } catch (error) {
      //Para que SonarQube no moleste porque no se esta haciendo nada con error
      // y no se envia error en el InternalServerErrorException por metivos de seguridad, para que el usuario no sepa exactamente que paso
      console.error('Error inesperado:', error);
      throw new InternalServerErrorException('Error al generar respuesta');
    }
  }

  //Formatear historial de mensajes para gemini
  async formatMessagesForGeminiHistory() {
    try {
      //Obtiene todos los mensajes de la base de datos
      const messages = await this.getAllMensagges();

      //Da el formato segun lo que espera Gemini
      if (Array.isArray(messages) && messages.length > 0) {
        return messages.map(item => ({
          "role": `${item.role}`,
          "parts": [{ text: item.content }]
        }));
      }

      return [];
    } catch (error) {
      //Para que SonarQube no moleste porque no se esta haciendo nada con error
      // y no se envia error en el InternalServerErrorException por metivos de seguridad, para que el usuario no sepa exactamente que paso
      console.error('Error inesperado:', error);
      throw new InternalServerErrorException('Error al generar respuesta');
    }

  }

  //Formatear datos para la base de datos
  formatDataForBD(message: string) {
    return {
      role: "model", // este nombre lo indica gemini
      content: message,
      create_date: new Date().toString()
    }
  }

  //Metodo Formatear datos para enviar historial de mensajes al front
  async messagesForFrontend() {
    try {
      const messages = await this.getAllMensagges();

      if (Array.isArray(messages) && messages.length > 0) {
        return messages.map(item => ({
          id: item.id,
          role: item.role,
          content: item.content,
          create_date: item.create_date
        }))
      }

      return [];
    } catch (error) {
      //Para que SonarQube no moleste porque no se esta haciendo nada con error
      // y no se envia error en el InternalServerErrorException por metivos de seguridad, para que el usuario no sepa exactamente que paso
      console.error('Error inesperado:', error);
      throw new InternalServerErrorException('Error al generar respuesta');
    }

  }


  // Método para recomendación individual (La IA no continúa sigue el hilo conversación)
  async sendToGeminiForOneRecommendation(message: string) {
    try {
      if (!message || message.trim() === '') {
        throw new BadRequestException("El mensaje no puede estar vacío");
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          thinkingConfig: { thinkingBudget: 0 }, // Desactiva la capacidad de pensar
          systemInstruction: PROMPTS.systemInstruction,
        }
      });

      return JSON.stringify(response.text);

    } catch (error) {
      //Para que SonarQube no moleste porque no se esta haciendo nada con error
      // y no se envia error en el InternalServerErrorException por metivos de seguridad, para que el usuario no sepa exactamente que paso
      console.error('Error inesperado:', error);
      throw new InternalServerErrorException('Error al generar respuesta');
    }
  }


  //CONVERSACION
  //Metodo para tener una conversacion (La IA sigue el hilo de la conversación)
  async sendToGeminiForConversation(message: MessageDto) {
    try {
      if (!message || message.content.trim() === '') {
        throw new BadRequestException("El mensaje no puede estar vacío");
      }

      const messagesHistory = await this.formatMessagesForGeminiHistory();

      //Conexión con Gemini
      const chat = this.ai.chats.create({
        model: "gemini-2.5-flash",
        history: messagesHistory,
        config: {
          thinkingConfig: { thinkingBudget: 0 }, // Desactiva la capacidad de pensar
          systemInstruction: PROMPTS.systemInstruction,
        }
      });

      //Envia el nuevo mensaje del usuario a Gemini
      const response = await chat.sendMessage({
        message: message.content,
      });

      //#region Código antes de usar Promise.all([]) 
      //Guarda el mensaje del usuario 
      // await this.booksRepository.save(message);

      //Guarda la respuesta de Gemini
      // const messageModel = this.formatDataForBD(response.text ?? '');
      // await this.booksRepository.save(messageModel);
      //#endregion

      //#region  ¿Qué es Promise?
      /**
       * ¿Qué es Promise?
       * Promise es una característica nativa de JavaScript (no es una librería externa). Es un objeto que representa una operación que eventualmente terminará (exitosa o fallida).
       * 
       * ¿De dónde sale Promise?
       * javascript
       * Promise está built-in en JavaScript (como console, Array, Object)
       * console.log(Promise); // [Function: Promise]
       * 
       * m // No necesitas importarlo, siempre está disponible
       * 
       * const miPromesa = new Promise((resolve, reject) => {
       *  m // código aquí
       * });
       */
      //#endregion

      //#region Peomise.all()
      /**
       * Promise.all() es una función que ejecuta múltiples operaciones asíncronas en paralelo (al mismo tiempo) en lugar de una tras otra.
       * ¿Por qué funciona en paralelo?
       *   - Estas dos operaciones son independientes:
       *   - Guardar el mensaje del usuario no depende de guardar la respuesta de la IA
       *   - Guardar la respuesta de la IA no depende de guardar el mensaje del usuario
       *   - Ambas pueden ejecutarse simultáneamente
       * 
       * Solo se hace cuando una operación no depende de otra. 
       */
      //#endregion

      await Promise.all([
        //Guarda mensaje de usuario
        this.booksRepository.save(message),

        //Guarda el mensaje de Gemini
        this.booksRepository.save(
          this.formatDataForBD(response.text ?? '')
        )
      ]);

      return JSON.stringify(response.text);
    } catch (error) {
      //Para que SonarQube no moleste porque no se esta haciendo nada con error
      // y no se envia error en el InternalServerErrorException por metivos de seguridad, para que el usuario no sepa exactamente que paso
      console.error('Error inesperado:', error);
      throw new InternalServerErrorException('Error al generar respuesta');
    }

  }
}
