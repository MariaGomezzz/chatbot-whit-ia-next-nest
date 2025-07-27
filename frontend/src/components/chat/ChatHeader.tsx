import { IChatHeader } from "@/types/interfaces/interface-chat-header";
import { LuSparkles } from "react-icons/lu";


export default function ChatHeader({ nameBot, presentationBot }: IChatHeader) {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <LuSparkles className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold text-slate-800">{nameBot}</h1>
      </div>
      {presentationBot && <p className="text-slate-600 text-sm">{presentationBot}</p>}
    </div>
  )
}
