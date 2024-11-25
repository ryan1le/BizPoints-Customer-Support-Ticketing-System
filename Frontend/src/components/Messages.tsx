import { messageType } from "./LiveChat";

interface MessagesProps{
  messages: messageType[]
  id: string
  size: string
}


function Messages({ messages, id, size }: MessagesProps) {

  return (
    <div className={`${size} w-full overflow-y-auto flex px-2 flex-col-reverse scrollbar`}>
      {messages.length === 0 ? (
        <p className="text-sm text-gray-700 self-start">No messages yet...</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.desid === id ? 'justify-end' : 'justify-start'}`}>
            <div className={`text-sm text-white rounded-md shadow-md mb-2 px-3 py-2 w-fit break-words max-w-[90%] ${msg.desid === id ? 'bg-[#488286]' : 'bg-[#B7D5D4]'}`}>
              {msg.message}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Messages;
