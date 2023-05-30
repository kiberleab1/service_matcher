const express = require("express")
const sequelize = require("./src/db/db")
const http = require("http")
const bodyParser = require('body-parser');

const mainRoutes = require("./src/routes/routes")

const app = express();
app.use(express.json())

app.use(mainRoutes.mainRoute)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
server = http.createServer(app)

server.listen(4000)