var WebSocketServer = require("ws").WebSocketServer;
var http = require("http");
var webSocketsServerPort = 8000;
var clients = new Map();
var admins = new Map();
var server = http.createServer();
var wsServer = new WebSocketServer({ server: server });
server.listen(webSocketsServerPort, function () {
    console.log("WebSocket server is running on port ".concat(webSocketsServerPort));
});
wsServer.on('connection', function (connection) {
    console.log("Received a new connection.");
    connection.on("message", function (data) {
        var message = JSON.parse(data);
        if (message.type === 'initial-connect') {
            if (message.message === 'admin') {
                admins.set(message.sentid, connection);
                var sendMessage = { type: 'open-connections', sentid: message.sentid, desid: null, timestamp: new Date().toISOString(), message: getActiveClient() };
                connection.send(JSON.stringify(sendMessage));
            }
            else if (message.message === 'client') {
                clients.set(message.sentid, connection);
                var sendMessage_1 = { type: 'open-connections', sentid: message.sentid, desid: null, timestamp: new Date().toISOString(), message: getActiveClient() };
                admins.forEach(function (connection) {
                    connection.send(JSON.stringify(sendMessage_1));
                });
            }
            console.log("User identified as ".concat(message.message));
        }
        else if (message.type === 'admin-connect') {
            var client = clients.get(message.desid);
            client.send(JSON.stringify(message));
            console.log("Admin: ".concat(message.sentid, " connected with Client: ").concat(message.desid));
        }
        else if (message.type === 'message') {
            if (clients.has(message.desid)) {
                var client = clients.get(message.desid);
                client.send(JSON.stringify(message));
                console.log("Admin: ".concat(message.sentid, " sent message to Client: ").concat(message.desid));
            }
            else if (admins.has(message.desid)) {
                var admin = admins.get(message.desid);
                admin.send(JSON.stringify(message));
                console.log("Client: ".concat(message.sentid, " sent message to Admin: ").concat(message.desid));
            }
        }
    });
});
function getActiveClient() {
    var connectedClient = Array.from(clients.keys());
    return connectedClient;
}
