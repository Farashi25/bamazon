var connection = require('../utilities/db_connection'),
    inquirer = require('inquirer'),
    validate = require('../utilities/dataValidation'),
    tables = require('../utilities/tables'),
    faker = require('faker'),
    index = require('../index');


// console.log(table);


function displaySales() {
    console.log("Selecting all departments...\n");
    var query = `SELECT departments.department_id, departments.department_name,departments.over_head_costs, products.product_sales
    FROM departments
    LEFT JOIN products ON departments.department_name = products.department_name
    ORDER BY products.product_sales`;
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(`         S A L E S  B Y  D E P A R T M E N T`);
        tables.makeSupervisorTable(res);
        console.log("\n");
        setTimeout(reroute, 2000);
    });
}


function createDepartment() {
    inquirer.prompt([{
                name: "department",
                type: "input",
                message: "Enter the department name",
                validate: validate.emptyValidator
            },
            {
                name: "overheadCost",
                type: "input",
                message: "Enter the department overhead cost",
                validate:validate.emptyValidator
            }
        ])
        .then(function (answer) {
            var newDepartment = {
                department_name: answer.department,
                over_head_costs: answer.overheadCost
            };
            console.log("Adding  new department...\n");
            var query = 'INSERT INTO departments SET ?';
            connection.query(query, newDepartment, function (err, res) {
                if(err){
                    console.log('\x1b[31m', 'SORRY!! That department Already Exist!\n'); 
                }else{
                    console.log("\x1b[32m",`${res.affectedRows} New Department name: ${newDepartment.department_name} created\n`);
                }
            });
            setTimeout(reroute, 2000);
        });

}


function reroute() {
    inquirer.prompt([{
            name: "actions",
            type: 'list',
            choices: ['View Product Sales by Department', 'Create New Department', 'EXIT Supervisor Role'],
            message: "What will you like to do again?"
        }])
        .then(function (answer) {
            answer.actions === 'Create New Department' ? createDepartment() :
                answer.actions === 'View Product Sales by Department' ? displaySales() :
                index.selectRole();
        });
}











module.exports = {
    displaySales: displaySales,
    createDepartment: createDepartment,
};