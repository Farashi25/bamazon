var inquirer = require('inquirer'),
    index = require('../index'),
    managerRole = require('./managerActions');
   
var displayOptions = function () {
    inquirer.prompt([{
            name: "option",
            type: "list",
            message: 'What will you like to do?.',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'EXIT Manager Role']
        }])
        .then(function (answer) {
            switch (answer.option) {
                case "View Products for Sale":
                    managerRole.displayProducts();
                    break;

                case "View Low Inventory":
                    managerRole.displayLowItems();
                    break;

                case "Add to Inventory":
                    managerRole.replenishInventory();
                    break;

                case "Add New Product":
                    managerRole.addNewProduct();
                    break;

                case "EXIT Manager Role":
                    index.selectRole();
                    break;
            }
        });
};


module.exports.displayOptions = displayOptions;