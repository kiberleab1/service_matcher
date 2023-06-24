const express = require("express")
const sequelize = require("./src/db/db")
const http = require("http")
const bodyParser = require('body-parser');
const WebSocket = require("ws")
const cors = require('cors')

const mainRoutes = require("./src/routes/routes");
const talentRouter = require("./src/routes/talent.routes")

const path = require("path");
const { handleWsMessages } = require("./src/services/wsHelpers");

const app = express();
app.use(express.json())
app.use(cors())
// app.use("/client", express.static(path.resolve(__dirname, "./client")))
app.use(mainRoutes.mainRoute)
app.use("/talents", talentRouter.talentRouter)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const server = http.createServer(app)


const wsServer = new WebSocket.Server({
    noServer: true,
    path: '/ws',
})

wsServer.on("connection", function (ws, req) {
    // console.log(req.headers)
    ws.on("message", function (msg) {
        handleWsMessages(ws, msg)
    })
})

server.on("upgrade", async function upgrade(request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function done(ws) {
        wsServer.emit('connection', ws, request);
    });
})
server.listen(4000)