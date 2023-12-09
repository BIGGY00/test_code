const sql = require("./db");

const Employee = function(employee){
    this.fullname = employee.fullname;
    this.salary = employee.salary;
    this.position = employee.position;
}

Employee.getAllrecords = (result) => {
    sql.query("SELECT * FROM employees", (err, res) => {
        if(err) {
            console.log("Query err: " + err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Employee.getRecordById = (employeeID, result) => {
    sql.query("SELECT * FROM employees WHERE id = ?", [employeeID], (err, res) => {
        if(err) {
            console.log("Query err: " + err);
            result(err, null);
            return;
        }
        if(res.length === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res[0]);
    });
};

Employee.createNewEmployee = (newEmployee, result) => {
    sql.query("INSERT INTO employees SET ?", newEmployee, (err, res) => {
        if(err) {
            console.log("Query err: " + err);
            result(err, null);
            return;
        }
        console.log("Create employee: ", { id: res.insertId, ...newEmployee });
        result(null, { id: res.insertId, ...newEmployee });
    });
};

Employee.updateEmployeeById = (employeeId, updateEmployee, result) => {
    sql.query("UPDATE employees SET fullname=?, salary=?, position=? WHERE id=?", [updateEmployee.fullname, updateEmployee.salary, updateEmployee.position, employeeId], (err, res) => {
        if(err) {
            console.log("Query err: " + err);
            result(err, null);
            return;
        }
        if(res.affectedRows === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, { message: 'Employee updated successfully' });
    });
};

Employee.deleteEmployeeById = (employeeID, result) => {
    sql.query("DELETE FROM employees WHERE id = ?", [employeeID], (err, res) => {
        if(err) {
            console.log("Query err: " + err);
            result(err, null);
            return;
        }
        if(res.affectedRows === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, { message: 'Employee deleted successfully' });
    });
};

module.exports = Employee;