import { useEffect, useRef, useState } from "react";
import Greeting from "./components/Greeting.jsx";
import ChatInput from "./components/ChatInput.jsx";
import MessageList from "./components/MessageList.jsx";
import PhotoScatter from "./components/PhotoScatter.jsx";
import ChocolatePopup from "./components/ChocolatePopup.jsx";
import HiPopup from "./components/HiPopup.jsx";
import { uploadFile, sendMessage } from "./api.js";

const STUDENT_NAME = "Keerthi";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async (text) => {
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setIsThinking(true);
    try {
      const answer = await sendMessage(text, nextMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Something went wrong: ${err.message}` },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleUpload = async (file) => {
    setUploadStatus(`Reading ${file.name}...`);
    try {
      const { document } = await uploadFile(file);
      setUploadedFiles((prev) => [...prev, document]);
      setUploadStatus(null);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Got it — I've read through "${file.name}" (${document.chunks} sections). Ask me anything about it.`,
        },
      ]);
    } catch (err) {
      setUploadStatus(null);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Couldn't process that file: ${err.message}` },
      ]);
    }
  };

  const hasStarted = messages.length > 0;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <PhotoScatter />
      <ChocolatePopup />
      <HiPopup />

      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto">
        {!hasStarted ? (
          // Centered hero layout — greeting + search box together in the
          // middle of the screen, not pinned to the bottom.
          <div className="flex h-full flex-col items-center justify-center gap-8 px-4">
            <Greeting name={STUDENT_NAME} />
            {uploadStatus && (
              <p className="text-center text-xs text-muted">{uploadStatus}</p>
            )}
            <div className="w-full">
              <ChatInput
                onSend={handleSend}
                onUpload={handleUpload}
                disabled={isThinking}
                uploadedFiles={uploadedFiles}
              />
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isThinking={isThinking} />
        )}
      </div>

      {hasStarted && (
        <div className="relative z-10 pb-6 pt-2">
          {uploadStatus && (
            <p className="mx-auto mb-1 text-center text-xs text-muted">{uploadStatus}</p>
          )}
          <ChatInput
            onSend={handleSend}
            onUpload={handleUpload}
            disabled={isThinking}
            uploadedFiles={uploadedFiles}
          />
        </div>
      )}
    </div>
  );
}
