import { messageType } from "@/components/LiveChat";
import { useState } from "react";
import { v4 as uuid } from "uuid";

function AdminChat() {
    const unique_id = uuid();

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
                    }
                }
                else if (recievedMessage.type === 'message') {
                    if (recievedMessage.desid === unique_id) {
                        setMessages([recievedMessage, ...messages]);
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
        <div>AdminChat</div>
    )
}

export default AdminChat