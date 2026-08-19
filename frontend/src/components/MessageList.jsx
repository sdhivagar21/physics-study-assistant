export default function MessageList({ messages, isThinking }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pb-4 pt-8">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={
              m.role === "user"
                ? "max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm leading-relaxed text-white"
                : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm leading-relaxed text-ink shadow-sm ring-1 ring-line"
            }
          >
            {m.content}
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex justify-start">
          <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-line">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
          </div>
        </div>
      )}
    </div>
  );
}
