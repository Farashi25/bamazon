var mysql = require('mysql'),
    validator = require('../utilities/dataValidation'),
    confirm = require('inquirer-confirm'),
    message = require('../utilities/feedbacks'),
    index = require('../index'),
    inquirer = require('inquirer'),
    faker = require('faker');

var connection = mysql.createConnection({
    multipleStatements: true, //this for testing only. Will not use in real life
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon_DB",
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});


function confirmAction() {
    confirm("Please confirm. Do you really want to seed database?")
        .then(function confirmed() {
            authenticateUser();
        }, function cancelled() {
            index.selectRole();
        });
}


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

function createProductsTable() {
    console.log('LOGS.');
    console.log('=============================');
    connection.query('DROP TABLE IF EXISTS products', function (err, res) {
        err ? (message.dbError(),index.selectRole()): console.log('Creating products table...');
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

function createDepartmentTable() {
    connection.query('DROP TABLE IF EXISTS departments', function (err, res) {
        err ? (message.dbError(),index.selectRole()): console.log('Creating department table...');
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


function generateData() {
    console.log('Generating data....');
    var prodTracker = [],
        departTracker = [];
    prodData = [],
        departData = [];
    for (var i = 0; prodTracker.length < 11; i++) {
        var product = {
            product_name: faker.fake("{{commerce.productName}}"),
            department_name: faker.fake("{{commerce.department}}"),
            price: faker.fake("{{commerce.price}}"),
            stock_quantity: Math.floor((Math.random() * 50) + 10)
        };
        if (prodTracker.indexOf(product.product_name) === -1) {
            prodTracker.push(product.product_name);
            prodData.push(product);

            var department = {
                department_name: product.department_name,
                over_head_costs: Math.floor((Math.random() * 5000) + 1000)
            };
            if (departTracker.indexOf(department.department_name) === -1) {
                departTracker.push(department.department_name);
                departData.push(department);
            }
        }
    }
    seedDatabase(prodData, departData);
}


function seedDatabase(prodData, departData) {
    console.log('Seeding Database...')
    var departmentQuery;
prodData.forEach(dataRow => {
    var productQuery = 'INSERT INTO products SET ?';
    connection.query(productQuery, dataRow, function (err, res) {
        if(err){
            message.dbError();
            index.selectRole();
        }
    }); 
});

departData.forEach(dataRow => {
    departmentQuery = 'INSERT INTO departments SET ?',
    connection.query(departmentQuery, dataRow, function (err, res) {
        if(err){
            message.dbError();
            index.selectRole();
        }
    }); 
});

console.log('Success! Seeding completed!');
console.log('=============================\n');
index.selectRole();
}



module.exports = connection;
module.exports.confirmAction = confirmAction;