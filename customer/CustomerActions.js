var Order = require('./orderProcessor'),
    tables = require('../utilities/tables'),
    confirm = require('inquirer-confirm'),
    message = require('../utilities/feedbacks'),
    inquirer = require('inquirer'),
    customer = require('./bamazonCustomer'),
    validator = require('../utilities/dataValidation'),
    connection = require('../utilities/db_connection');


function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        err ||!res.length ? (message.dbError(), Order.customerRedirect()) : (tables.makeProductsTable(res),
            confirmPurchase());
    });
}


function confirmPurchase() {
    confirm("Please confirm. Do you still want to buy a product?")
        .then(function confirmed() {
            getProductID();
        }, function cancelled() {
            message.goodbye();
            customer.displayOptions();
        });
}


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
                err ||!res.length ? (message.info(), Order.customerRedirect()) : (tables.makeProductTable(res),
                    setTimeout(promptForQuantity, 2000, res));
            });

        });
}


function promptForQuantity(res) {
    var item = res[0];
    inquirer.prompt([{
            name: "qty",
            message: "How many will you like to buy?",
            validate: validator.validatePositive
        }])
        .then(function (answer) {
            var order = new Order(item.item_id, item.product_name, Number(answer.qty), item.price);
            order.checkInventory(item.stock_quantity, item.product_sales);

        });
}


module.exports.displayProducts = displayProducts;