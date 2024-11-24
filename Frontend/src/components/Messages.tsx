import { messageType } from "./LiveChat";

interface MessagesProps{
  messages: messageType[]
  agentId: string
}


function Messages({ messages, agentId }: MessagesProps) {

  return (
    <div className="h-[600px] w-full overflow-y-auto flex flex-col-reverse scrollbar">
      {messages.length === 0 ? (
        <p className="text-sm text-gray-700 self-start">No messages yet...</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="text-sm text-white bg-[#488286] rounded-md shadow-md mb-2 px-3 py-2 w-fit break-words max-w-full">
            {msg.message}
          </div>
        ))
      )}
    </div>
  );
}

export default Messages;
