var Order = require('./orderProcessor'),
    tables = require('../utilities/tables'),
    inquirer = require('inquirer'),
    validate = require('../utilities/dataValidation'),
    customer = require('./bamazonCustomer'),
    connection = require('../utilities/db_connection'),
    inquirerConfirm = require('inquirer-confirm');



function displayProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(`      W E L C O M E  T O  B A M A Z O N!!`);
        tables.makeProductsTable(res);
        console.log("\n");
        takeOptions();
    });
}


function takeOptions() {
    var confirm = require('inquirer-confirm');
    confirm("Please confirm. Do you still want to buy a product?")
        .then(function confirmed() {
            promptBuyer();
        }, function cancelled() {
            console.log('We are sad to see you go. Please come back sometimes.');
            customer.displayOptions();
        });
}


function promptBuyer() {
    inquirer.prompt([{
                message: "Enter the ID of the product you will like to buy?",
                name: 'item_id',
                type: 'input',
                // validate: item_id => typeof item_id === 'number'
                validate: validate.emptyValidator
            },
            {
                name: "order_quantity",
                message: "How many will you like to buy?",
                type: 'input',
                // validate: item_id => typeof item_id === 'number'
                validate: validate.emptyValidator
            }
        ])
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, {
                item_id: answer.item_id
            }, function (err, res) {
                if (err) {
                    console.log('\x1b[31m','SORRY!! You must have entered an invalid item ID. Try again!\n'); 
                }else{
                var order = new Order(answer.item_id, res[0].product_name, Number(answer.order_quantity), res[0].price);
                order.checkInventory(res[0].stock_quantity, res[0].product_sales);
                }
            });
        });
    }


module.exports.displayProducts = displayProducts;

