import { messageType } from "@/components/LiveChat";
import Messages from "@/components/Messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

interface openConnectionProps {
    clientId: string
    handleAction: (id: string) => void

}

const OpenConnections = ({ clientId, handleAction}: openConnectionProps) => {
    const [isConnected, setIsConnected] = useState<boolean>(false)

    const handleClick = () => {
        setIsConnected(!isConnected)
        handleAction(clientId)
    }
    
    return (
        <div className="w-full h-20 shadow-md rounded-md border-[#373E40] p-4">
            <h3 className="font-semibold">{clientId}</h3>
            <div className="flex items-center justify-between">
                <h3 className="text-sm">{isConnected ? 'Connected' : 'Waiting for connection'}</h3>
                <Button size={'sm'} className="bg-[#488286]" onClick={handleClick}>{isConnected ? 'Disconnect' : 'Connect'}</Button>
            </div>
        </div>
)
}

function AdminChat() {
    const [unique_id, setId] = useState<string>(uuid())

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<messageType[]>([]);
    const [message, setMessage] = useState<string>('');
    const [client, setClient] = useState<string>('');
    const [clientList, setClientList] = useState<string[]>([]);
    const [connectionErrorMessage, setConnectionErrorMessage] = useState<string>("")
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const establishConnection = () => {
        if (!socket) {
            const ws = new WebSocket('ws://localhost:8000');
            
            ws.onopen = () => {
                const message : messageType = { type: 'initial-connect', sentid: unique_id, desid: null, timestamp: new Date().toISOString(), message: 'admin' }
                ws.send(JSON.stringify(message));
            };
    
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionErrorMessage("Failed to connect, Try Again")
                setSocket(null)
            };
            
            ws.onmessage = (event) => {
                const recievedMessage = JSON.parse(event.data) as messageType
    
                if (recievedMessage.type === 'open-connections') {
                    if (recievedMessage.sentid === 's-1') {
                        setIsConnected(true)
                        setClientList(recievedMessage.message as string[])
                        setSocket(ws)
                    }
                }
                else if (recievedMessage.type === 'message') {
                    if (recievedMessage.desid === unique_id) {
                        setMessages((prev) => [recievedMessage, ...prev]);
                        console.log(messages)
                    } else {
                        console.log("Message not intended for User")
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

    const handleClientSelect = (clientId: string) => {
        if (!client) {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const sendMessage: messageType = {type: 'admin-connect', sentid: unique_id, desid: clientId, timestamp: new Date().toISOString(), message: "200"}
                socket.send(JSON.stringify(sendMessage))
                setClient(clientId)
            }    
        }
        else {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const sendMessage: messageType = {type: 'connection-closed', sentid: unique_id, desid: clientId, timestamp: new Date().toISOString(), message: "200"}
                socket.send(JSON.stringify(sendMessage))

                const index = clientList.indexOf(clientId);
                const temp = [...clientList]
                if (index > -1) { // only splice array when item is found
                    temp.splice(index, 1); // 2nd parameter means remove one item only
                    setClientList([...temp])
                }
                setMessages([])
                setMessage('')
                setClient('')
            }    
        }
        
    }
  
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };
  
    const handleSendMessage = () => {
        if (message.trim() !== "") {
            if (socket && socket.readyState === WebSocket.OPEN) {
                const sendMessage: messageType = {type: 'message', sentid: unique_id, desid: client, timestamp: new Date().toISOString(), message: message}
                socket.send(JSON.stringify(sendMessage));
                setMessages([sendMessage, ...messages]); // Add the new message to the list
                setMessage(""); // Clear the input
            } else {
                console.log('Cannot send message: WebSocket is not open');
            }
            
        }
    };
    
    return (
        <div className="flex">
            <div className="flex flex-col w-[30%] h-screen p-10 space-y-4 border-r-2">
                <div className="text-lg font-bold bg-[#B7D5D4] p-2 rounded-md border border-[#373E40]">Open Connections</div>
                {clientList.map((data, index) => (
                    <OpenConnections key={index} clientId={data} handleAction={handleClientSelect}/>    
                ))} 
            </div>
            <div className="flex flex-col w-[70%] h-screen">
                <div className="p-4 border-b bg-[#305252] text-white flex justify-between items-center">
                    <span>Admin Chat</span>
                    {!isConnected && <Button className="bg-[#488286]" onClick={establishConnection}>Connect to Server</Button>}
                </div>
                <div className="px-5">
                    {client ? <Messages messages={messages} id={client!} size="h-[590px]"/> : 
                        <div className="h-[590px]">
                            <div className="h-full w-full flex flex-col items-center justify-center space-y-5">
                                <h2>Connect with a Client</h2>
                                <h2 className=" text-[#77878B]">{connectionErrorMessage}</h2>
                            </div>
                        </div>
                    }    
                </div>
                <div className="flex flex-col space-y-1 px-5">
                    {isConnected ? <h2 className="text-[#77878B] text-sm">Connected to server</h2> : <h2 className="text-[#77878B] text-sm">Disconnected</h2>}
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            value={message}
                            placeholder="Type a message..."
                            className="flex-1 border border-[#77878B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#305252]"
                            onChange={handleMessageChange}
                            disabled={!client}
                        />
                        <Button className="bg-[#488286]" onClick={handleSendMessage} disabled={!client}>Send</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminChat