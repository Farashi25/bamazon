var mysql = require('mysql'),
    validator = require('../utilities/dataValidation'),
    confirm = require('inquirer-confirm'),
    message = require('../utilities/feedbacks'),
    index = require('../index'),
    inquirer = require('inquirer'),
    faker = require('faker');

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_DB", //You can replace 'bamazon_DB' with your mysql database to run the app on your local environment.
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

//This function prompts the user for confirmation before seeding the database or redirect the user back to the profile page.
function confirmAction() {
    confirm("Please confirm. Do you really want to seed database?")
        .then(function confirmed() {
            authenticateUser();
        }, function cancelled() {
            index.selectRole();
        });
}

//This function prompts for password and authenticates user input.
function authenticateUser() {
    var itemID;
    inquirer.prompt([{
            name: "password",
            message: "Enter password (password)",
            validate: validator.validatePassword
        }])
        .then(function () {
            createProductsTable();
        });
}


//Drops the products table if there is any and create a new one
function createProductsTable() {
    console.log('LOGS.');
    console.log('=============================');
    connection.query('DROP TABLE IF EXISTS products', function (err, res) {
        err ? (message.dbError(), index.selectRole()) : console.log('Creating products table...');
    });
    var query = `CREATE TABLE products (
        item_id INT NOT NULL AUTO_INCREMENT,
        product_name varchar(255) UNIQUE NOT NULL,
        department_name varchar(255),
        price DECIMAL(10,2) DEFAULT '0.00',
        stock_quantity int(11) DEFAULT '0.00',
        product_sales DECIMAL(10,2) DEFAULT '0.00',
        PRIMARY KEY (item_id))`;

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("Products table created");
        createDepartmentTable();
    });
}


//Drops the departments table if there is any and create a new one
function createDepartmentTable() {
    connection.query('DROP TABLE IF EXISTS departments', function (err, res) {
        err ? (message.dbError(), index.selectRole()) : console.log('Creating department table...');
    });
    var query = `CREATE TABLE departments (
        department_id INT NOT NULL AUTO_INCREMENT,
        department_name varchar(255) UNIQUE NOT NULL,
        over_head_costs DECIMAL(10,2) DEFAULT '0.00',
        PRIMARY KEY (department_id))`;

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("Department table created");
        generateData();
    });
}


//Generate ten(10) new products along with their departments
function generateData() {
    console.log('Generating data....');
    var prodTracker = [], departTracker = [],
        products = [], departments = [];
    for (var i = 0; prodTracker.length < 100; i++) {
    //create new product
        var product_name = faker.fake("{{commerce.productName}}"),
            department_name = faker.fake("{{commerce.department}}"),
            price = faker.fake("{{commerce.price}}"),
            stock_quantity = Math.floor((Math.random() * 50) + 5);
        
            // validate product is not a duplicate
        if (prodTracker.indexOf(product_name) === -1) {
            var prodRow = [];
            prodTracker.push(product_name);
            prodRow.push(product_name, department_name, price, stock_quantity);
            products.push(prodRow);

            //create new department
            var depart_name = department_name,
                over_head_costs = Math.floor((Math.random() * 5000) + 1000);

          // validate department is not a duplicate
            if (departTracker.indexOf(depart_name) === -1) {
                var departRow = [];
                departTracker.push(depart_name);
                departRow.push(depart_name, over_head_costs);
                departments.push(departRow);
            }
        }
    }
    seedDatabase(products, departments);
}


function seedDatabase(products, departments) {
    console.log('Seeding Database...');
    //create and send product query to the database
    var prodductQuery = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
    connection.query(prodductQuery, [products], function (err, res) {
       err?(message.dbError(),index.selectRole()):console.log('Products are created.....');

    //create and send department query to the database       
        var departmentQuery = "INSERT INTO departments (department_name, over_head_costs) VALUES ?";
        connection.query(departmentQuery, [departments], function (err, res) {
            err?(message.dbError(),index.selectRole()):console.log('Products are created.....');
        });
    });
    console.log('Success! Seeding completed!');
    console.log('=============================\n');
    index.selectRole();
}

module.exports = connection;
module.exports.confirmAction = confirmAction;