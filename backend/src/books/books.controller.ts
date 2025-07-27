import { Body, Controller, Get, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { MessageDto } from 'src/dto/message.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly BooksService: BooksService) { }

  /**
   * Debe ser una funcion asincronica para que no se bloque el servidor
   * mientras espera la respuesta del proceso del servicie
   * asi se puede continuar escuchando otras peticiones
   */

  @Get('/conversation')
  async getAllMessages() {
    return await this.BooksService.messagesForFrontend();
  }

  @Post('/only')
  async sendOneRecommendation(
    @Body('message') message: string
  ) {
    return await this.BooksService.sendToGeminiForOneRecommendation(message);
  }

  @Post('/conversation')
  async sendConversationMessage(
    @Body() body: MessageDto
  ) {
    return await this.BooksService.sendToGeminiForConversation(body);
  }
}

//#region ¿Por qué no uso trycatch?
/**
 * El error no se puede manejar de esta forma porque
 * new Error(error) convierte tod0 el error original en un texto plano, lo que:
 *   - Elimina la información útil como status, name, response, etc.
 *   - Hace que NestJS no pueda mapear el error a un código HTTP apropiado.
 *   - Si tu servicio lanza una excepción como BadRequestException, al capturarla así, la encapsulas en una Error común (500) y pierdes la intención original.
 */
// @Get('/conversation')
// async getAllMessages() {
//   try {
//     return await this.BooksService.messagesForFrontend();
//   } catch (error) {
//     return new Error(error)
//   }
// }

// @Post('/only')
// async sendOneRecommendation(
//   @Body('message') message: string
// ) {
//   try {
//     return await this.BooksService.sendToGeminiForOneRecommendation(message);
//   } catch (error) {
//     return new Error(error)
//   }
// }

// @Post('/conversation')
// async sendConversationMessage(
//   @Body() body: MessageDto
// ) {
//   try {
//     return await this.BooksService.sendToGeminiForConversation(body);
//   } catch (error) {
//     return new Error(error)
//   }
// }

// -----------------------------------------------------------------------

/**
 * El error se puede manejar asi, perooooo SonarQube dice que esta mal
 * ¿Este throw error está bien?
 *    Sí, en este caso sí está bien, porque:
 *      - Estás lanzando la excepción tal como viene del servicio (throw error)
 *      - No estás alterando ni encapsulando el error (como antes con new Error(error))
 *      - Las excepciones que lanza el servicio (BadRequestException, InternalServerErrorException) ya son correctas y específicas, así que llegan al cliente como deben
 *
 * ¿Por qué SonarQube lo marca como mal?
 *    Porque el catch no aporta ninguna lógica útil:
 *     - No lo logueas
 *     - No transformas el error
 *     - No haces nada con él
 *     - Y simplemente lo vuelves a lanzar
 *     - Entonces: ¿para qué capturarlo si no haces nada con él?
 */
// @Get('/conversation')
// async getAllMessages() {
//   try {
//     return await this.BooksService.messagesForFrontend();
//   } catch (error) {
//     return error;
//   }
// }

// @Post('/only')
// async sendOneRecommendation(
//   @Body('message') message: string
// ) {
//   try {
//     return await this.BooksService.sendToGeminiForOneRecommendation(message);
//   } catch (error) {
//     return error;
//   }
// }

// @Post('/conversation')
// async sendConversationMessage(
//   @Body() body: MessageDto
// ) {
//   try {
//     return await this.BooksService.sendToGeminiForConversation(body);
//   } catch (error) {
//     return error;
//   }
// }

//#endregion