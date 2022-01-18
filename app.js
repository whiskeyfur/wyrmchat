const express = require('express');
const ws = require('ws');

const app = express();

app.use(express.static("./www"))
app.use(express.json())

const wss = new ws.Server({ noServer: true });
const server = app.listen(3000);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data, isBinary) {
        console.log(data);
        wss.clients.forEach(function each(client) {
            if (client !== ws) {
                if (client.readyState === ws.OPEN) {
                    client.send(data, {binary: isBinary});
                } else {
                    // remove this client.
                }
            }
        });
    });
});