var Order = require('./orderProcessor'),
    tables = require('../utilities/tables'),
    confirm = require('inquirer-confirm'),
    message = require('../utilities/feedbacks'),
    inquirer = require('inquirer'),
    customer = require('./bamazonCustomer'),
    validator = require('../utilities/dataValidation'),
    connection = require('../utilities/db_connection');

//Query database for all products
function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err || !res.length) {
            message.dbError();
            Order.customerRedirect();
        } else {
            tables.makeProductsTable(res);
            confirmPurchase();
        }
    });
}

//Confirm user wants to proceed with purchase or exit
function confirmPurchase() {
    confirm("Please confirm. Do you still want to buy a product?")
        .then(function confirmed() {
            getProductID();
        }, function cancelled() {
            message.goodbye();
            customer.displayOptions();
        });
}

//Prompts the customer for product ID and query the database 
function getProductID() {
    var itemID;
    inquirer.prompt([{
            name: "item_id",
            message: "Enter the ID of the product you will like to buy?",
            validate: validator.validatePositive
        }])
        .then(function (answer) {
            itemID = parseInt(answer.item_id);
            connection.query(`SELECT * FROM products WHERE item_id = ${itemID}`, function (err, res) {
                if (err || !res.length) {
                    message.info();
                    Order.customerRedirect();
                } else {
                    tables.makeProductTable(res);
                    setTimeout(promptForQuantity, 2000, res);
                }
            });

        });
}

//Prompts the customer for quantity and starts the order processing
function promptForQuantity(res) {
    var item = res[0];
    inquirer.prompt([{
            name: "qty",
            message: "How many will you like to buy?",
            validate: validator.validatePositive
        }])
        .then(function (answer) {
            //create a new order and pass down product ID, name, qunatity and price for processing
            var order = new Order(item.item_id, item.product_name, Number(answer.qty), item.price);
            order.checkInventory(item.stock_quantity, item.product_sales);
        });
}


module.exports.displayProducts = displayProducts;