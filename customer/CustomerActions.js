var Order = require('./orderProcessor'),
    tables = require('../utilities/tables'),
    confirm = require('inquirer-confirm'),
    message = require('../utilities/feedbacks'),
    inquirer = require('inquirer'),
    customer = require('./bamazonCustomer'),
    validator = require('../utilities/dataValidation'),
    connection = require('../utilities/db_connection');


function displayProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(`      W E L C O M E  T O  B A M A Z O N!!`);
        tables.makeProductsTable(res);
        console.log("\n");
        confirmPurchase();
        // getProductID();
    });
}


function confirmPurchase() {
    confirm("Please confirm. Do you still want to buy a product?")
        .then(function confirmed() {
            getProductID();
        }, function cancelled() {
            console.log("\x1b[34m", `Thanks for your time. Please come back again.`);
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
                !res.length ? (message.info(), Order.customerReroute()) : (tables.makeProductTable(res),
                    setTimeout(promptForQuantity, 1000, res))
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