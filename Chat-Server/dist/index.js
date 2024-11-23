var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
            var sendMessage_1 = { type: 'open-connections', sentid: null, desid: null, timestamp: new Date().toISOString(), message: getActiveClient() };
            if (message.message === 'admin') {
                admins.set(message.sentid, connection);
                connection.send(JSON.stringify(sendMessage_1));
            }
            else if (message.message === 'client') {
                clients.set(message.sentid, connection);
                admins.forEach(function (connection) {
                    if (connection.readyState === WebSocketServer.OPEN) {
                        connection.send(JSON.stringify(sendMessage_1));
                    }
                });
            }
            console.log("User identified as ".concat(message.message));
        }
        else if (message.type === 'admin-connect') {
            var client = clients[message.desid];
            if (client.readyState === WebSocketServer.OPEN) {
                client.send(JSON.stringify(message));
                console.log("Admin: ".concat(message.sentid, " connected with Client: ").concat(message.desid));
            }
        }
        else if (message.type === 'message') {
            if (clients.has(message.desid)) {
                var client = clients[message.desid];
                if (client.readyState === WebSocketServer.OPEN) {
                    client.send(JSON.stringify(message));
                    console.log("Admin: ".concat(message.sentid, " sent message to Client: ").concat(message.desid));
                }
            }
            else if (admins.has(message.desid)) {
                var admin = admins[message.desid];
                if (admin.readyState === WebSocketServer.OPEN) {
                    admin.send(JSON.stringify(message));
                    console.log("Client: ".concat(message.sentid, " sent message to Admin: ").concat(message.desid));
                }
            }
        }
    });
});
function getActiveClient() {
    var connectedClient = __spreadArray([], clients.keys(), true);
    return connectedClient;
}
