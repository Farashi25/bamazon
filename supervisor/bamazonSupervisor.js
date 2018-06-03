var index = require('../index'),
    inquirer = require('inquirer'),
    supervisorRole = require('./supervisorActions');



var displayOptions = function () {
    inquirer.prompt([{
            name: "option",
            type: "list",
            message: 'What will you like to do?.',
            choices: ['VIEW SALES BY DEPARTMENT', 'CREATE NEW DEPARTMENT', 'EXIT SUPERVISOR ROLE']
        }])
        .then(function (answer) {
            switch (answer.option) {
                case "VIEW SALES BY DEPARTMENT":
                    supervisorRole.displaySales();
                    break;

                case "CREATE NEW DEPARTMENT":
                    supervisorRole.createDepartment();
                    break;
                case "EXIT SUPERVISOR ROLE":
                    index.selectRole();
                    break;
            }
        });
};


module.exports.displayOptions = displayOptions;