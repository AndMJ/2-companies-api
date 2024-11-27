const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
//const Joi = require("joi") //returns a Class, so by convention, capital fist letter
const config = require("config")
const app = express()

//config module gets the current NODE.ENV value from .env file and loads accordingly
//console.log(`loaded config: ${config.get("name")}`)
//console.log(`loaded config: ${config.get("db_password")}`)

//middleware
app.use(express.json())
app.use(helmet()) //Help secure Express apps by setting HTTP response headers.

//middleware to log HTTP requests
if(process.env.NODE_ENV === "development"){
    app.use(morgan("tiny"))
    console.log("[DEV ENV] Using Morgan..")
}

//set port
app.set("port", process.env.PORT)

//import company routes
require("./api/routes/routeCompany")(app)

app.listen(app.get("port"), () => {
    console.log(`Listening to port ${app.get("port")}..`)
})
