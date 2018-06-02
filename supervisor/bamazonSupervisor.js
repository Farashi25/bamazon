var index = require('../index'),
    inquirer = require('inquirer'),
    supervisorRole = require('./supervisorActions');



var displayOptions = function () {
    inquirer.prompt([{
            name: "option",
            type: "list",
            message: 'What will you like to do?.',
            choices: ['View Product Sales by Department', 'Create New Department', 'EXIT Supervisor Role']
        }])
        .then(function (answer) {
            switch (answer.option) {
                case "View Product Sales by Department":
                    supervisorRole.displaySales();
                    break;

                case "Create New Department":
                    supervisorRole.createDepartment();
                    break;
                case "EXIT Supervisor Role":
                    index.selectRole();
                    break;
            }
        });
};


module.exports.displayOptions = displayOptions;