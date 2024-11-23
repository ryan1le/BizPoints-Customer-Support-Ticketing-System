const { WebSocketServer } = require("ws");
const http = require("http");

type messaqgeType = {
    type: string;
    sentid: number | null;
    // name: string;
    desid: number | null;
    timestamp: string;
    message: string | number[];
};

const webSocketsServerPort = 8000;

const clients = new Map()
const admins = new Map()

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

server.listen(webSocketsServerPort, () => {
    console.log(`WebSocket server is running on port ${webSocketsServerPort}`);
});

wsServer.on('connection', function(connection) {
    console.log(`Received a new connection.`);

    connection.on("message", function(data: string) {
        const message: messaqgeType = JSON.parse(data)

        if (message.type === 'initial-connect') {
            const sendMessage: messaqgeType = {type: 'open-connections', sentid: null, desid: null, timestamp: new Date().toISOString(), message: getActiveClient()}

            if (message.message === 'admin') {
                admins.set(message.sentid, connection)
            
                connection.send(JSON.stringify(sendMessage))
                
            }
            else if (message.message === 'client') {
                clients.set(message.sentid, connection)
                admins.forEach((connection) => {
                    if (connection.readyState === WebSocketServer.OPEN) {
                        connection.send(JSON.stringify(sendMessage))
                    }
                })
            }
            console.log(`User identified as ${message.message}`)
        }
        else if (message.type === 'admin-connect') {
            const client = clients[message.desid]

            if (client.readyState === WebSocketServer.OPEN) {
                client.send(JSON.stringify(message))
                console.log(`Admin: ${message.sentid} connected with Client: ${message.desid}`)
            }
        }
        else if (message.type === 'message') {
            if (clients.has(message.desid)){
                const client = clients[message.desid]

                if (client.readyState === WebSocketServer.OPEN) {
                    client.send(JSON.stringify(message))
                    console.log(`Admin: ${message.sentid} sent message to Client: ${message.desid}`)
                }
            }
            else if (admins.has(message.desid)){
                const admin = admins[message.desid]

                if (admin.readyState === WebSocketServer.OPEN) {
                    admin.send(JSON.stringify(message))
                    console.log(`Client: ${message.sentid} sent message to Admin: ${message.desid}`)
                }
            }
        }
    })
});

function getActiveClient() {
    const connectedClient = [...clients.keys()]
    return connectedClient
}