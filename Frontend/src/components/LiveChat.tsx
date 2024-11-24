import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"

import { MdMessage } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { v4 as uuid } from "uuid";
import { useState } from "react";
import { Input } from "./ui/input";
import Messages from "./Messages";
  

export type messageType = {
    type: string;
    sentid: string | null;
    // name: string;
    desid: string | null;
    timestamp: string;
    message: string | string[];
};

  
function LiveChat() {
    const unique_id = uuid();

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<messageType[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [connectionErrorMessage, setConnectionErrorMessage] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [adminConnected, setAdminConnected] = useState<string | null>(null)
  
    const establishConnection = () => {
      if (!socket) {
        const ws = new WebSocket('ws://localhost:8000');
      
        ws.onopen = () => {
          const message : messageType = { type: 'initial-connect', sentid: unique_id, desid: null, timestamp: new Date().toISOString(), message: 'client' }
          ws.send(JSON.stringify(message));
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionErrorMessage("Failed to connect, Try Again")
          setSocket(null)
        };
      
        ws.onmessage = (event) => {
          const recievedMessage = JSON.parse(event.data) as messageType

          if (recievedMessage.type === 'server-response') {
            if (recievedMessage.message === '200') {
              setIsConnected(true)
              setConnectionErrorMessage("")
              setSocket(ws)
            }
            else {
              console.log("Failed to connect to Websocket Server")
              setConnectionErrorMessage("Failed to connect to Websocket Server")
              setSocket(null)
            }
          }
          else if (recievedMessage.type === 'admin-connect') {
            setAdminConnected(recievedMessage.sentid)
          }
          else if (recievedMessage.type === 'message') {
            if (recievedMessage.desid === unique_id && recievedMessage.sentid === adminConnected) {
              setMessages([recievedMessage, ...messages]);
            } else {
              console.log("Message not intended for User")
            }
          }
          else if (recievedMessage.type === 'connection-closed') {
            if (recievedMessage.desid === unique_id && recievedMessage.sentid === adminConnected) {
              setAdminConnected(null)
              setIsConnected(false)
              setConnectionErrorMessage("The agent has closed the live chat")
              setMessages([])
              setMessage('')
              ws.close();
            } else {
              console.log("Failed to close connection")
            }
          }
        }; 

        ws.onclose = () => {
          console.log('WebSocket closed');
          setSocket(null); // Reset the socket
        }; 
      } else {
        console.log('WebSocket is already connected');
      }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    };

    const handleSendMessage = () => {
      if (message.trim() !== "") {
        if (adminConnected && socket && socket.readyState === WebSocket.OPEN) {
          const sendMessage: messageType = {type: 'message', sentid: unique_id, desid: adminConnected, timestamp: new Date().toISOString(), message: message}
          socket.send(JSON.stringify(sendMessage));
          setMessages([sendMessage, ...messages]); // Add the new message to the list
          setMessage(""); // Clear the input
        } else {
          console.log('Cannot send message: WebSocket is not open');
        }
        
      }
    };

    return (
      <div className="fixed bottom-16 flex justify-end w-full pr-5">
        <Sheet open={isOpen} onOpenChange={() => setIsOpen(true)}>
          <SheetTrigger asChild><Button size="icon" className="bg-[#305252] h-12 w-12 rounded-[30px] shadow-lg"><MdMessage size={"25"}/></Button></SheetTrigger>
          <SheetContent className="space-y-4">
            <SheetHeader className="bg-[#373E40] rounded-md">
              <div className='flex items-center space-x-20 pb-2 h-full w-full pt-2 pl-4'>
                <FaArrowLeft onClick={() => setIsOpen(false)} className="hover:cursor-pointer" color="white"/>
                <SheetTitle className="text-white">Support Chat</SheetTitle>  
              </div>
            </SheetHeader>
            {isConnected ? <Messages messages={messages} agentId={adminConnected!}/> : 
            <div className="h-[600px]">
              <div className="h-full w-full flex flex-col items-center justify-center space-y-5">
                <h2>Connect with Support Agent</h2>
                <Button size='sm' className="bg-[#305252]" onClick={establishConnection}>Connect</Button>
                <h2 className=" text-[#77878B]">{connectionErrorMessage}</h2>
              </div>
            </div>
            }
            <div className="flex flex-col space-y-1">
              {isConnected ? <h2 className={`text-sm ${adminConnected ? `text-[#488286]`: `text-[#77878B]`}`}>{adminConnected ? 'Connected' : 'Waiting for support agent...'}</h2> : <h2 className="text-[#77878B] text-sm">Disconnected</h2>}
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={message}
                  placeholder="Type a message..."
                  className="flex-1 border border-[#77878B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#305252]"
                  onChange={handleMessageChange}
                  disabled={!adminConnected}
                />
                <Button className="bg-[#488286]"onClick={handleSendMessage} disabled={!adminConnected}>Send</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
}
  
export default LiveChat
  