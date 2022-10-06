const express = require("express");
const http = require("http");
const ws = require("ws");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "./public")));
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")) });

const httpServer = http.createServer(app);
const wss = new ws.Server({ server: httpServer });

var connections = [];

wss.on("connection", function(ws, request ) {
    console.log("Client connected ws:,ws, " request:",request );
    connections.push(ws);
    
    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
    });
    
    ws.on('message', function (message) {
        console.log('message:', message);
        broadcast(JSON.stringify(JSON.parse(message)));
    });
});
    
function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(message);
    });
};

const port = process.env.PORT || 3000;
httpServer.listen(port, () => { console.log("Server started. Port: ", port); });
