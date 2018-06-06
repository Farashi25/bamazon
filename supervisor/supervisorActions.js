var connection = require('../utilities/db_connection'),
    inquirer = require('inquirer'),
    validator = require('../utilities/dataValidation'),
    message = require('../utilities/feedbacks'),
    tables = require('../utilities/tables'),
    faker = require('faker'),
    index = require('../index');


function displaySales() {
    var query = `SELECT departments.department_id, departments.department_name,departments.over_head_costs, products.product_sales
    FROM departments
    LEFT JOIN products ON departments.department_name = products.department_name
    GROUP BY departments.department_id ORDER BY products.product_sales DESC`;
    connection.query(query, function (err, res) {
        var tableType = 'sales';
        err ? message.dbError() :tables.makeSupervisorTable(res, tableType);
    });
    setTimeout(redirect, 2000);
}


function createDepartment() {
    inquirer.prompt([{
                name: "department",
                type: "input",
                message: "Enter the department name",
                validate: validator.validateWord
            },
            {
                name: "overheadCost",
                type: "input",
                message: "Enter the department overhead cost",
                validate: validator.validatePositive
            }
        ])
        .then(function (answer) {
            var department = {
                department_name: answer.department,
                over_head_costs: answer.overheadCost
            };
            var query = 'INSERT INTO departments SET ?';
            connection.query(query, department, function (err, res) {
                err ? message.dupDepartment() : 
                message.addDepartment(res.affectedRows, department.department_name);
            });
            setTimeout(redirect, 2000);
        });
}


function redirect() {
    inquirer.prompt([{
            name: "actions",
            type: 'list',
            choices: ['VIEW SALES BY DEPARTMENT', 'CREATE NEW DEPARTMENT', 'EXIT SUPERVISOR ROLE'],
            message: "What will you like to do again?"
        }])
        .then(function (answer) {
            answer.actions === 'CREATE NEW DEPARTMENT' ? createDepartment() :
                answer.actions === 'VIEW SALES BY DEPARTMENT' ? displaySales() :
                index.selectRole();
        });
}



module.exports = {
    displaySales: displaySales,
    createDepartment: createDepartment,
};