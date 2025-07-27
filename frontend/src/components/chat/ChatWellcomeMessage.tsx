import { IChatWellcomeMessage } from "@/types/interfaces/interface-chat-wellcome-message";
import { RiRobot2Line } from "react-icons/ri";

export default function ChatWellcomeMessage({ title, description, suggestions }: IChatWellcomeMessage) {
  return (
    <div className="text-center py-12">
      <RiRobot2Line className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto">
        {description}
      </p>
      {(Array.isArray(suggestions) && suggestions.length > 0) &&
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {
            suggestions.map((suggestion, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                {suggestion}
              </span>
            ))
          }
        </div>
      }
    </div>
  )
}

