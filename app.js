const express = require("express")
const sequelize = require("./src/db/db")
const http = require("http")

const mainRoutes = require("./src/routes/routes")

const app = express();
app.use(express.json())

app.use(mainRoutes.mainRoute)

server = http.createServer(app)

server.listen(4000)