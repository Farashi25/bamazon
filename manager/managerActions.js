var connection = require('../utilities/db_connection'),
    validator = require('../utilities/dataValidation'),
    inquirer = require('inquirer'),
    faker = require('faker'),
    index = require('../index'),
    message = require('../utilities/feedbacks'),
    tables = require('../utilities/tables');


function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        err ? (message.dbError(), reroute()) :
        (console.log(` I N V E N T O R Y  `),
        tables.makeManagerTables(res),
        setTimeout(reroute, 2000))
    });
}


function displayLowItems() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 20", function (err, res) {
        err ? (message.dbError(), reroute()) :
        (console.log(`L O W   I N V E N T O R Y  `),
        tables.makeManagerTables(res),
        setTimeout(reroute, 2000))
    });
}


function replenishInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        err ? (message.dbError(), reroute()) :
        (console.log(`                I N V E N T O R Y  `),
        tables.makeManagerTables(res),
        setTimeout(promptManager, 1000))
    });

}


function promptManager() {
    var itemID;
    inquirer.prompt([{
            name: "item_id",
            message: "Enter the ID of the product you will like to replenish?",
            validate: validator.validatePositive
        }])
        .then(function (answer) {
            itemID = parseInt(answer.item_id);
                connection.query(`SELECT * FROM products WHERE item_id = ${itemID}`, function (err, res) {
                    !res.length? (message.info(), reroute()) :
                    (console.log(` P R O D U C T  T O  B E  R E O R D E R E D  `),
                    tables.makeManagerTables(res),
                    setTimeout(promptForQuantity, 1000, itemID, res[0].stock_quantity))
                });

        });
}



function promptForQuantity(id, qty) {
    inquirer.prompt([{
            name: "quantity",
            message: "How many would you like to add?",
            validate: validator.validatePositive
        }])
        .then(function (answer) {
            var query = connection.query(
                "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: qty + Number(answer.quantity)
                    },
                    {
                        item_id: id
                    }
                ],
                function (err, res) {
                    err ? message.dbError() : message.confirmReorder();
                }
            );
            setTimeout(reroute, 2000);
        });
}


function addNewProduct() {
    var newProduct;
    inquirer.prompt([{
            name: "product",
            type: 'input',
            message: "Enter new product name.",
            validate: validator.validateWord
        }, {
            name: "department",
            type: 'input',
            message: "Enter department.",
            validate: validator.validateWord
        }, {
            name: "price",
            type: 'input',
            message: "Enter price.",
            validate: validator.validatePositive
        }, {
            name: "quantity",
            type: 'input',
            message: "Enter quantity.",
            validate: validator.validatePositive
        }])
        .then(function (answer) {
            newProduct = {
                product_name: answer.product,
                department_name: answer.department,
                price: Number(answer.price),
                stock_quantity: Number(answer.quantity)
            };
            var query = 'INSERT INTO products SET ?';
            connection.query(query, newProduct, function (err, res) {
                err ? message.dupProduct() : message.addProduct(res.affectedRows, newProduct.product_name);
            });
            setTimeout(reroute, 2000);
        });
}


function reroute() {
    inquirer.prompt([{
            name: "actions",
            type: 'list',
            choices: ['VIEW ALL PRODUCTS', 'VIEW LOW INVENTORY', 'REPLENISH INVENTORY', 'ADD A NEW PRODUCT', 'EXIT MANAGER ROLE'],
            message: "What will you like to do again manager?"
        }])
        .then(function (answer) {
            answer.actions === 'VIEW ALL PRODUCTS' ? displayProducts() :
                answer.actions === 'VIEW LOW INVENTORY' ? displayLowItems() :
                answer.actions === 'REPLENISH INVENTORY' ? replenishInventory() :
                answer.actions === 'ADD A NEW PRODUCT' ? addNewProduct() :
                index.selectRole();
        });
}




module.exports = {
    displayProducts: displayProducts,
    displayLowItems: displayLowItems,
    replenishInventory: replenishInventory,
    addNewProduct: addNewProduct
};