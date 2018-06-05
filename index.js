var supervisor = require('./supervisor/bamazonSupervisor'),
    connection = require('./utilities/db_connection'),
    inquirer = require('inquirer'),
    customer = require('./customer/bamazonCustomer'),
    manager = require('./manager/bamazonManager');


function selectRole() {
    inquirer.prompt([{
            name: "user",
            type: "list",
            message: 'Please select your role.',
            choices: ['CUSTOMER', 'MANAGER', 'SUPERVISOR', 'EXIT APP', 'SEED DATABASE']
        }])
        .then(function (answer) {
            if (answer.user === 'CUSTOMER') {
                customer.displayOptions();
            } else if (answer.user === 'MANAGER') {
                manager.displayOptions();
            } else if (answer.user === 'SUPERVISOR') {
                supervisor.displayOptions();
            } else if (answer.user === 'SEED DATABASE') {
                connection.confirmAction();
            } else {
                console.log('You Are Signed Out!');
                process.exit();
            }
        });
}

selectRole();


module.exports.selectRole = selectRole;