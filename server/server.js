var WebSocketServer = require("ws").Server,
    express = require("express"),
    http = require("http"),
    app = express(),
    server = http.createServer(app);

app.post("/login", login);
app.get("/...", callSomething);
// ...

server.listen(8000);

var wss = new WebSocketServer({server: server, path: "/hereIsWS"});

wss.on("connection", function(ws){
   // ...
});
