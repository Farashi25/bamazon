var index = require('../index'),
    inquirer = require('inquirer'),
    customerRole = require('./customerActions');

//This function prompts the user for options
var displayOptions = function () {
    inquirer.prompt([{
            name: "option",
            type: "list",
            message: 'What will you like to do?.',
            choices: ['ENTER STORE', 'EXIT CUSTOMER ROLE']
        }])
        .then(function (answer) {
            switch (answer.option) {
                case 'ENTER STORE':
                    customerRole.displayProducts();
                    break;

                case 'EXIT CUSTOMER ROLE':
                    index.selectRole();
                    break;
            }
        });
};


module.exports.displayOptions = displayOptions;