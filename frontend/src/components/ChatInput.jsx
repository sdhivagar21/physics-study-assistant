import { useRef, useState } from "react";

export default function ChatInput({ onSend, onUpload, disabled, uploadedFiles }) {
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4">
      {uploadedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {uploadedFiles.map((f) => (
            <span
              key={f.id}
              className="rounded-full bg-accentSoft px-3 py-1 text-xs font-medium text-accent"
            >
              {f.name}
            </span>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 rounded-2xl border border-line bg-white/90 backdrop-blur px-3 py-2 shadow-lg focus-within:border-accent/50"
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload a file"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accentSoft text-accent transition hover:bg-blush"
        >
          {/* Upload-to-tray icon — unambiguously "upload a file" */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) onUpload(e.target.files[0]);
            e.target.value = "";
          }}
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a physics question..."
          rows={1}
          className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none"
        />

        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white transition disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
      <p className="mt-2 text-center text-xs text-muted">
        Can make mistakes — always check important formulas and results.
      </p>
    </div>
  );
}
