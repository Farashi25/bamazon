var inquirer = require('inquirer'),
    faker = require('faker'),
    mysql = require('mysql'),
    Order = require('./orderProcessor');


var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
});

//===============================================
//this function is for seeding the database
//===============================================
//   function createProduct() {
//     console.log("Inserting a new product...\n");
//     for (let i = 0; i < 11; i++) {
//         var product = {
//             product_name: (faker.fake(`{{commerce.productName}}`)),
//             department_name: (faker.fake(`{{commerce.department}}`)),
//             price: Math.floor(faker.fake(`{{commerce.price}}`)),
//             stock_quantity: Math.floor((Math.random() * 30) + 10)
//         };

//     var query = 'INSERT INTO products SET ?';

//     connection.query(query, product, function(err, res) {
//         // console.log(res.affectedRows + " product inserted!\n");
//         // Call updateProduct AFTER the INSERT completes
//         readProducts();
//       }
//     );
//     // logs the actual query being run
//     // console.log(query.sql);
//   }
// }


function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(`******WELCOME TO MY STORE********`);
        console.log(`Item_id     Product Name    Price`);
        console.log(`-----------------------------------`);
        res.forEach(product => {
            console.log(`${product.item_id} - ${product.product_name} - $${product.price}`);
        }); 
        promptBuyer();
    });
}


// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

function promptBuyer() {
    inquirer.prompt([{
            name: "item_id",
            message: "What is the ID of the product you will like to buy?"
        }, {
            name: "order_quantity",
            message: "How many whould you like to buy?"
        }])
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, {
                item_id: answer.item_id
            }, function (err, res) {
                var order = new Order(answer.item_id, res[0].product_name, answer.order_quantity, res[0].price);
                order.checkInventory(res[0].stock_quantity, connection);
            });
        });
}


