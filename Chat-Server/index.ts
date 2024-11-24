const { WebSocketServer } = require("ws");
const http = require("http");

type messaqgeType = {
    type: string;
    sentid: string | null;
    // name: string;
    desid: string | null;
    timestamp: string;
    message: string | string[];
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

            if (message.message === 'admin') {
                admins.set(message.sentid, connection)
                
                const sendMessage: messaqgeType = {type: 'open-connections', sentid: 's-1', desid: null, timestamp: new Date().toISOString(), message: getActiveClient()}
                connection.send(JSON.stringify(sendMessage))
                
            }
            else if (message.message === 'client') {
                clients.set(message.sentid, connection)
                const sendMessage: messaqgeType = {type: 'open-connections', sentid: 's-1', desid: null, timestamp: new Date().toISOString(), message: getActiveClient()}
                admins.forEach((admin) => {
                    admin.send(JSON.stringify(sendMessage))
                })

                connection.send(JSON.stringify({type: 'server-response', sentid: message.sentid, desid: null, timestamp: new Date().toISOString(), message: '200'}))
            }
            console.log(`User identified as ${message.message}`)
        }
        else if (message.type === 'admin-connect') {
            const client = clients.get(message.desid)

            client.send(JSON.stringify(message))
            console.log(`Admin: ${message.sentid} connected with Client: ${message.desid}`)
        }
        else if (message.type === 'message') {
            if (clients.has(message.desid)){
                const client = clients.get(message.desid)

                client.send(JSON.stringify(message))
                console.log(`Admin: ${message.sentid} sent message to Client: ${message.desid}`)
            }
            else if (admins.has(message.desid)){
                const admin = admins.get(message.desid)
                
                admin.send(JSON.stringify(message))
                console.log(`Client: ${message.sentid} sent message to Admin: ${message.desid}`)
            }
        }
        else if (message.type === 'connection-closed') {
            if (clients.has(message.desid)){
                const client = clients.get(message.desid)

                client.send(JSON.stringify(message))
                console.log(`Admin: ${message.sentid} closed connection to Client: ${message.desid}`)
            }
        }
    })
});

function getActiveClient() {
    const connectedClient = Array.from(clients.keys())
    return connectedClient
}