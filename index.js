var supervisor = require('./supervisor/bamazonSupervisor'),
    inquirer = require('inquirer'),
    customer = require('./customer/bamazonCustomer'),
    manager = require('./manager/bamazonManager');


function selectRole() {
    inquirer.prompt([{
            name: "user",
            type: "list",
            message: 'Please select your role.',
            choices: ['CUSTOMER', 'MANAGER', 'SUPERVISOR', 'EXIT APP']
        }])
        .then(function (answer) {
            if (answer.user === 'CUSTOMER') {
                customer.displayOptions();
            } else if (answer.user === 'MANAGER') {
                manager.displayOptions();
            } else if (answer.user === 'SUPERVISOR') {
                supervisor.displayOptions();
            } else {
                console.log('You Are Signed Out!');
                process.exit();
            }
        });
}

selectRole();


module.exports.selectRole = selectRole;