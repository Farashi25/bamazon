var connection = require('../utilities/db_connection'),
    validator = require('../utilities/dataValidation'),
    inquirer = require('inquirer'),
    message = require('../utilities/feedbacks'),
    message = require('../utilities/feedbacks'),
    tables = require('../utilities/tables'),
    faker = require('faker'),
    index = require('../index');
    
    


function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        var tableType = 'inventory';
        err ? (message.dbError(), redirect()) :(tables.makeManagerTables(res, tableType),
                setTimeout(redirect, 2000));
    });
}


function displayLowItems() {
    var tableType = 'lowInventory';
    connection.query("SELECT * FROM products WHERE stock_quantity < 20", function (err, res) {
        err ? (message.dbError(), redirect()) :(tables.makeManagerTables(res, tableType),
                setTimeout(redirect, 2000));
    });
}


function replenishInventory() {
    var tableType = 'inventory';
    connection.query("SELECT * FROM products", function (err, res) {
        err ? (message.dbError(), redirect()) :(tables.makeManagerTables(res, tableType),
                setTimeout(promptManager, 1000));
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
            var tableType = 'reorder';
            connection.query(`SELECT * FROM products WHERE item_id = ${itemID}`, function (err, res) {
                err ||!res.length ? (message.info(), redirect()) :(tables.makeManagerTables(res,tableType),
                        setTimeout(promptForQuantity, 1000, itemID, res[0].stock_quantity));
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
            var query = connection.query("UPDATE products SET ? WHERE ?", [{
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
            setTimeout(redirect, 2000);
        });
}


function addNewProduct() {
    var newProduct;
    inquirer.prompt([{
            name: "product",
            message: "Enter new product name.",
            validate: validator.validateWord
        }, {
            name: "department",
            message: "Enter department.",
            validate: validator.validateWord
        }, {
            name: "price",
            message: "Enter price.",
            validate: validator.validatePositive
        }, {
            name: "quantity",
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
            setTimeout(redirect, 2000);
        });
}


function redirect() {
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