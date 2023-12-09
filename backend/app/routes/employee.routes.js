module.exports = (app) => {
    const employee_controller = require("../controllers/employee.controller");
    var router = require("express").Router();
    router.get("/", employee_controller.getAllEmployees);
    router.post("/add", employee_controller.createNewEmployee);
    router.get("/:id", employee_controller.getEmployeeById);
    router.put("/:id", employee_controller.updateEmployeeById);
    router.delete("/:id", employee_controller.deleteEmployeeById);
    app.use("/api/employee", router);
};