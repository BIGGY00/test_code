const Employee = require("../models/employee.model");

const getAllEmployees = (req, res) => {
    Employee.getAllrecords((err, data) => {
        if(err) {
            res.status(500).send({message: err.message || "Some error occured."});
        }
        else {
            res.send(data);
        }
    });
};

const getEmployeeById = (req, res) => {
    const employeeId = req.params.id;
    Employee.getRecordById(employeeId, (err, result) => {
        if(err) {
            console.error("Error retrieving employee:", err);
            if(err.kind === "not_found") {
                res.status(404).json({ error: 'Employee not found' });
            }
            else {
                res.status(500).json({ error: 'Internal Server Reeoe' });
            }
            return;
        }
        res.json(result);
    });
};

const createNewEmployee = (req, res) => {
    const { fullname, salary, position } = req.body;
    const newEmployee = new Employee({
        fullname: fullname,
        salary: salary,
        position: position
    });
    Employee.createNewEmployee(newEmployee, (err, result) => {
        if(err) {
            console.error("Error adding employee:", err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json(result);
    });
};

const updateEmployeeById = (req, res) => {
    const employeeId = req.params.id;
    const { fullname, salary, position } = req.body;
    const updateEmployee = {
        fullname: fullname,
        salary: salary,
        position: position
    };
    Employee.updateEmployeeById(employeeId, updateEmployee, (err, result) => {
        if(err) {
            console.error("Error updating employee:", err);
            if(err.kind === "not_found") {
                res.status(404).json({ error: 'Employee not found' });
            }
            else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            return;
        }
        res.json({ message: 'Employee updated successfully' });
    });
};

const deleteEmployeeById = (req, res) => {
    const employeeId = req.params.id;
    Employee.deleteEmployeeById(employeeId, (err, result) => {
        if(err) {
            console.error("Error deleting employee:", err);
            if(err.kind === "not_found") {
                res.status(404).json({ error: 'Employee not found' });
            }
            else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            return;
        }
        res.json({ message: 'Employee deleted successfully' });
    });
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    getEmployeeById,
    updateEmployeeById,
    deleteEmployeeById,
}