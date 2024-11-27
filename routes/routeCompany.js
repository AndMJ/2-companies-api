module.exports = (app) => {
    const controllerCompany = require("../controllers/controllerCompany")()

    app.route("/api/v1/companies/list").get(controllerCompany.getCompaniesList)
    app.route("/api/v1/companies/:id").get(controllerCompany.getCompaniesByID)
    app.route("/api/v1/companies/create").post(controllerCompany.createCompanies)
    app.route("/api/v1/companies/edit/:id").put(controllerCompany.editCompaniesByID)
    app.route("/api/v1/companies/delete/:id").delete(controllerCompany.deleteCompaniesByID)
}