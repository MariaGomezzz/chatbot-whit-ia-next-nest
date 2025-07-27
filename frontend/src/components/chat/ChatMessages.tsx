import { Imessage } from '@/types/interfaces/interface-messages'
import React from 'react'
import { FaRegUser } from 'react-icons/fa6'
import { RiRobot2Line } from 'react-icons/ri'

export default function ChatMessages({ message }: { readonly message: Imessage }) {
  return (
    <div
      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar del Bot (solo se muestra para mensajes del asistente) */}
      {message.role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <RiRobot2Line className="w-4 h-4 text-purple-600" />
        </div>
      )}

      {/* Burbuja del Mensaje */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 
          ${message.role === "user"
            ? "bg-slate-900 text-white"  // Estilo para mensajes del usuario
            : "bg-slate-50 text-slate-800 border border-slate-200"  // Estilo para mensajes del bot
          }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
      </div>

      {/* Avatar del Usuario (solo se muestra para mensajes del usuario) */}
      {message.role === "user" && (
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
          <FaRegUser className="w-4 h-4 text-white" />
          {/* <User className="w-4 h-4 text-white" /> */}
        </div>
      )}
    </div>
  )
}
