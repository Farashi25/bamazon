var connection = require('../utilities/db_connection'),
    validate = require('../utilities/dataValidation'),
    inquirer = require('inquirer'),
    faker = require('faker'),
    index = require('../index'),


    tables = require('../utilities/tables');


function displayProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(`                I N V E N T O R Y  `);
        tables.makeManagerTables(res);
        setTimeout(reroute, 2000);
    });
}


function displayLowItems() {
    console.log("Selecting all low products...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 20", function (err, res) {
        if (err) throw err;
        console.log(`             L O W   I N V E N T O R Y  `);
        tables.makeManagerTables(res);
        setTimeout(reroute, 2000);
    });
}


function replenishInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(`                I N V E N T O R Y  `);
        tables.makeManagerTables(res);
        setTimeout(promptManager, 1000);
    });

}


function promptManager() {
    var itemID;
    inquirer.prompt([{
            name: "item_id",
            message: "Enter the ID of the product you will like to replenish?",
            validate: validate.emptyValidator
        }])
        .then(function (answer) {
            itemID = answer.item_id;
            connection.query(`SELECT * FROM products WHERE item_id = ${itemID}`, function (err, res) {
                if (err) {
                    console.log('\x1b[31m', 'SORRY!! You must have entered an invalid item ID. Try again!\n');
                    setTimeout(reroute, 2000);  
                } else {
                    console.log(`           P R O D U C T  T O  B E  R E O R D E R E D  `);
                    tables.makeManagerTables(res);
                    setTimeout(promptForQuantity, 1000, itemID, res[0].stock_quantity);  
                }
                
            });

        });
}

function promptForQuantity(id, quantity) {
    inquirer.prompt([{
            name: "quantity",
            message: "How many would you like to add?",
            validate: validate.emptyValidator
        }])
        .then(function (answer) {
            var query = connection.query(
                "UPDATE products SET ? WHERE ?", [{
                        stock_quantity: quantity + Number(answer.quantity)
                    },
                    {
                        item_id: id
                    }
                ],
                function (err, res) {
                    if (err) {
                     console.log('\x1b[31m', 'SORRY!! You must have entered an invalid item ID. Try again!\n'); 
                    }
                    console.log("\x1b[32m",'SUCCESS!! Reorder is processed\n');
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
            validate: validate.emptyValidator
        }, {
            name: "department",
            type: 'input',
            message: "Enter department.",
            validate: validate.emptyValidator
        }, {
            name: "price",
            type: 'input',
            message: "Enter price.",
            validate: validate.emptyValidator
        }, {
            name: "quantity",
            type: 'input',
            message: "Enter quantity.",
            validate: validate.emptyValidator
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
                if (err) {
                    console.log('\x1b[31m', 'SORRY!! That Product Already Exist!\n');
                } else {
                    console.log("\x1b[32m", `${res.affectedRows} product name: ${newProduct.product_name} to inventory\n`);
                }
            });
            setTimeout(reroute, 2000);
        });
}


function reroute() {
    inquirer.prompt([{
            name: "actions",
            type: 'list',
            choices: ['Display all products', 'Display low inventory', 'Add more products', 'Add a new product', 'EXIT Manager Role'],
            message: "What will you like to do again manager?"
        }])
        .then(function (answer) {
            answer.actions === 'Display all products' ? displayProducts() :
                answer.actions === 'Display low inventory' ? displayLowItems() :
                answer.actions === 'Add more products' ? replenishInventory() :
                answer.actions === 'Add a new product' ? addNewProduct() :
                index.selectRole();
        });
}




module.exports = {
    displayProducts: displayProducts,
    displayLowItems: displayLowItems,
    replenishInventory: replenishInventory,
    addNewProduct: addNewProduct
};