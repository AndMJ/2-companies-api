const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const Joi = require("joi") //returns a Class, so by convention, capital fist letter
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

let companies = [
    {
        id: "1e5fa50d-67a9-4a85-a1c1-4ae3dd63de16",
        name: "Toyota",
        industry: "automotive"
    },
    {
        id: "388eefa4-8cba-4f87-9fba-4ac8f51d67e5",
        name: "Ford",
        industry: "automotive"
    },
]

//validation company schema
const companySchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(3).required(),
    industry: Joi.string().min(5).required()
})

//find company method
const findCompany = async (key, value) => {
    return companies.find((company) => company[key] === value)
}

//methods
const getCompaniesList = async (req, res) => {
    return res.status(200).json(JSON.parse(JSON.stringify(companies)))
}

const getCompaniesByID = async (req, res) => {
    try {
        const found = await findCompany("id", req.params.id)
        if (!found){
            return res.status(404).json({"code": 404, "message": "Company not found."})
        }
        return res.status(200).json(JSON.parse(JSON.stringify(found)))
    } catch (e) {
        return res.status(404).json({"code": 404, "message": e})
    }

}

const createCompanies = async (req, res) => {
    try {
        const validResult = companySchema.validate({
            id: crypto.randomUUID(),
            name: req.body.name,
            industry: req.body.industry
        })

        if(validResult.error){
            return res.status(404).json(validResult.error.details[0].message)
        }

        const found = await findCompany("name", validResult.value.name)
        if (found){
            return res.status(404).json({"code": 404, "message": "Company with that name already exists."})
        }

        //add to array
        companies.push(validResult.value)

        return res.status(200).json(JSON.parse(JSON.stringify(validResult.value)))
    } catch (e) {
        return res.status(404).json({"code": 404, "message": e})
    }
}

const editCompaniesByID = async (req, res) => {
    try {
        const validResult = companySchema.validate({
            id: req.params.id,
            name: req.body.name,
            industry: req.body.industry
        })

        if(validResult.error) {
            return res.status(404).json(validResult.error.details[0].message)
        }

        const found = await findCompany("id", validResult.value.id)
        if (!found){
            return res.status(404).json({"code": 404, "message": "Company not found."})
        }

        //edit
        found.name = validResult.value.name
        found.industry = validResult.value.industry

        return res.status(200).json(JSON.parse(JSON.stringify(found)))
    } catch (e) {
        return res.status(404).json({"code": 404, "message": e})
    }
}

const deleteCompaniesByID = async (req, res) => {
    try {
        const found = await findCompany("id", req.params.id)
        if (!found){
            return res.status(404).json({"code": 404, "message": "Company doesnt exist."})
        }

        //delete
        companies = companies.filter(company => company.id !== req.params.id)

        return res.status(200).json({"code": 200, "message": "Company deleted."})
    } catch (e) {
        return res.status(404).json({"code": 404, "message": e})
    }

}

//routes
app.route("/api/v1/companies/list").get(getCompaniesList)
app.route("/api/v1/companies/:id").get(getCompaniesByID)
app.route("/api/v1/companies/create").post(createCompanies)
app.route("/api/v1/companies/edit/:id").put(editCompaniesByID)
app.route("/api/v1/companies/delete/:id").delete(deleteCompaniesByID)

app.listen(app.get("port"), () => {
    console.log(`Listening to port ${app.get("port")}..`)
})
