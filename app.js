const express = require("express")
const http = require("http")

const mainRoutes = require("./src/routes/routes")

const app = express();

app.use(mainRoutes.mainRoute)

server = http.createServer(app)

server.listen(4000)