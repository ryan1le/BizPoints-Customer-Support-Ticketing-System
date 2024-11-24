import { Button } from "@/components/ui/button";
import { useState } from "react";
import Messages from "./Messages";

export const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false); // Tracks if the chat is open
  const [message, setMessage] = useState(""); // Tracks the current message being typed
  const [messages, setMessages] = useState<string[]>([]); // Stores all sent messages

  // Toggle chat pop-up visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle message input change
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Handle message send
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setMessages([message, ...messages]); // Add the new message to the list
      setMessage(""); // Clear the input
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        variant="default"
        size="default"
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-[#305252] text-white hover:bg-blue-600 z-50 flex items-center space-x-2"
      >
        <img
          src="src/assets/chat_icon.png"
          alt="Chat"
          className="w-5 h-5"
        />
      </Button>

      {/* Chat Pop-up */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-80 bg-white shadow-lg border rounded-lg z-50">
          <div className="p-4 border-b bg-[#305252] text-white flex justify-between items-center">
            <span>Chat</span>
            <button onClick={toggleChat} className="text-white">
              ✕
            </button>
          </div>
          <div className="p-4 space-y-4">
            {/* Chat Messages */}
            <Messages messages={messages}/>
            {/* Message Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={handleMessageChange}
                className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#305252]"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#305252] text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
