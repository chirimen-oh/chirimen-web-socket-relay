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
    console.log("Client connected request: origin:",request.headers.origin, " url:",request.url );
    connections.push({socket:ws, url:request.url});
    
    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            var isTargetCon = (conn.socket === ws);
//            if ( isTargetCon ){
//                console.log("delete idx:",i, " url:",conn.url);
//            }
            return (isTargetCon) ? false : true;
        });
    });
    
    ws.on('message', function (message) {
//        console.log('message:', message);
        broadcast(JSON.stringify(JSON.parse(message)), request.url );
    });
});
    
function broadcast(message , url ) {
    connections.forEach(function (con, i) {
        if ( con.url == url ){
//            console.log("send:",con.url, " msg:",message);
            con.socket.send(message);
        } else {
//            console.log("skip send:",con.url);        
        }
    });
};

const port = process.env.PORT || 3000;
httpServer.listen(port, () => { console.log("Server started. Port: ", port); });
