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

wss.on("connection", function (ws, request) {
    console.log("Client connected request: origin:", request.headers.origin, " url:", request.url);
    //接続されているクライアントの一覧をconnectionsに保存している。
    connections.push({ socket: ws, url: request.url });

    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            //Array.filterの第一引数は要素の値、第二引数は配列のインデックス
            var isTargetCon = (conn.socket === ws);
            //            if ( isTargetCon ){
            //                console.log("delete idx:",i, " url:",conn.url);
            //            }
            return (isTargetCon) ? false : true;
        });
    });

    //メッセージを受け取るとすぐにブロードキャストする
    ws.on('message', function (message) {
        console.log('message:', message);
        if (message == "" || message == "ping") {
        } else {
            try {
                //JSON文字列を一度パースしてから再度JSON文字列に戻す
                broadcast(JSON.stringify(JSON.parse(message)), request.url, ws);
            } catch (e) {
                // error skip
            }
        }
    });
});

function broadcast(message, url, ws) {
    connections.forEach(function (con, i) {
        if (con.url == url && con.socket !== ws) { // Send same channel(url) only. However, no echo back to the sender.
            //            console.log("send:",con.url, " msg:",message);
            con.socket.send(message);
        } else {
            //            console.log("skip send:",con.url);        
        }
    });
};

const port = process.env.PORT || 3000;
httpServer.listen(port, () => { console.log("Server started. Port: ", port); });
