import React from 'react'

interface IChatForm {
  formData: { message: string },
  setFormData?: any,
  handleSubmit?: (data: any) => void
}

export default function ChatForm({ handleSubmit, setFormData, formData }: IChatForm) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        name="message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Describe qué tipo de película o libro buscas..."
        className="flex-1 border-slate-200 focus:border-purple-300 focus:ring-purple-200"
      />
      <button
        type="submit"
        className="bg-gray-600 hover:bg-slate-800 text-white px-4 py-2 rounded-2xl"
      >
        Enviar
      </button>
    </form>
  )
}
