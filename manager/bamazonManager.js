var inquirer = require('inquirer'),
    index = require('../index'),
    managerRole = require('./managerActions');
   
var displayOptions = function () {
    inquirer.prompt([{
            name: "option",
            type: "list",
            message: 'What will you like to do?.',
            choices: ['VIEW ALL PRODUCTS', 'VIEW LOW INVENTORY', 'REPLENISH INVENTORY', 'ADD A NEW PRODUCT', 'EXIT MANAGER ROLE']
        }])
        .then(function (answer) {
            switch (answer.option) {
                case "VIEW ALL PRODUCTS":
                    managerRole.displayProducts();
                    break;

                case "VIEW LOW INVENTORY":
                    managerRole.displayLowItems();
                    break;

                case "REPLENISH INVENTORY":
                    managerRole.replenishInventory();
                    break;

                case "ADD A NEW PRODUCT":
                    managerRole.addNewProduct();
                    break;

                case "EXIT MANAGER ROLE":
                    index.selectRole();
                    break;
            }
        });
};


module.exports.displayOptions = displayOptions;