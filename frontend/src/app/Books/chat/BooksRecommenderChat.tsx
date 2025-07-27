"use client"
import ChatForm from '@/components/chat/ChatForm';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatWellcomeMessage from '@/components/chat/ChatWellcomeMessage';
import { getAllMessages, postRecommendation } from '@/services/BooksApi';
import { Imessage } from '@/types/interfaces/interface-messages';
import React, { useEffect, useState } from 'react';

export default function BooksRecommenderChat() {
  const [messages, setMessages] = useState<Imessage[]>([])

  //Estado para guardar el prompt del usuario
  const [formData, setFormData] = useState({
    message: "",
  });

  //Estado para controlar errores 
  //Debe estar, ya que los componentes se deben encargar de mostrar los errores. 
  const [error, setError] = useState<string | null>(null);

  //Cargar mensajes iniciales
  useEffect(() => {
    const fetchData = async () => {
      //Se capturan errores ya que el servicio puede devolver uno, ya que no los esta controlando todos.
      try {
        const response = await getAllMessages();

        //Validar que la respuesta sea un array
        if (Array.isArray(response)) {
          setMessages(response);
        }

      } catch (error) {
        setError(
          error instanceof Error && error.message ?
            error.message
            : 'Error al cargar el historial de conversación')
      }
    }

    fetchData();
  }, [])

  const handleSubmitPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      setError('El mensaje no puede estar vacío');
      return;
    }

    //Limpiar error
    setError(null);

    try {
      //Formatear mensaje del usuario para que contenga lo que se necesita
      const newMessage: Imessage = {
        // id_message: messages.length + 1,
        role: "user",
        content: formData.message,
        create_date: new Date().toISOString(),
      };

      //Agregar mensaje del usuario
      setMessages(prev => [...prev, newMessage]);

      //Limpiar input o fomulario
      setFormData({ message: "" });

      //Respuestas de la IA
      const response = await postRecommendation(newMessage);

      //Formatear respuesta 
      const formatResponse: Imessage = {
        // id_message: messages.length + 1,
        role: "assistant",
        content: response,
        create_date: new Date().toISOString(),
      }

      //Agregar respuesta de la IA
      setMessages(prev => [...prev, formatResponse]);

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al enviar el mensaje')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] flex flex-col">
        <ChatHeader
          nameBot='Libro AI'
          presentationBot='Tu asistente personal para descubrir libros increíbles'
        />

        <div className="flex-1 flex flex-col border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-md overflow-hidden">
          <ChatWellcomeMessage
            title={"¡Hola! Soy tu asistente de recomendaciones"}
            description="Cuéntame qué tipo de libros te gustan, tu estado de ánimo, o cualquier preferencia que tengas. Te ayudaré a encontrar algo perfecto para ti."
          // suggestions={[
          //   "Libros de ciencia ficción",
          //   "Libros de misterio",
          //   "Algo para relajarme"
          // ]}
          />

          <div className='flex-1 overflow-y-auto px-4 py-2 space-y-2'>
            {
              (Array.isArray(messages) && messages.length > 0) &&
              messages.map((message, i) => (
                <ChatMessages
                  key={i + i}
                  message={message}
                />
              ))
            }

            {
              error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-red-600 mr-2">🔴</span>
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            }
          </div>

          <div className="border-t border-slate-200 p-4">
            <ChatForm
              handleSubmit={handleSubmitPrompt}
              setFormData={setFormData}
              formData={formData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
