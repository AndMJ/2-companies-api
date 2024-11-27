const Joi = require("joi");

module.exports = () => {
    const controller = []

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
    controller.getCompaniesList = async (req, res) => {
        return res.status(200).json(JSON.parse(JSON.stringify(companies)))
    }

    controller.getCompaniesByID = async (req, res) => {
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

    controller.createCompanies = async (req, res) => {
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

    controller.editCompaniesByID = async (req, res) => {
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

    controller.deleteCompaniesByID = async (req, res) => {
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

    return controller

}