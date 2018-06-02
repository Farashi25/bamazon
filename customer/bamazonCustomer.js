var index = require('../index'),
    inquirer = require('inquirer'),
    customerRole = require('./customerActions');


var displayOptions = function () {
    inquirer.prompt([{
            name: "option",
            type: "list",
            message: 'What will you like to do?.',
            choices: ['Enter Store', 'EXIT customer role']
        }])
        .then(function (answer) {
            switch (answer.option) {
                case 'Enter Store':
                    customerRole.displayProducts();
                    break;

                case 'EXIT customer role':
                    index.selectRole();
                    break;
            }
        });
};


module.exports.displayOptions = displayOptions;