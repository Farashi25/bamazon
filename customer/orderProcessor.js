var connection = require('../utilities/db_connection'),
    inquirer = require('inquirer'),
    index = require('../index'),
    tables = require('../utilities/tables'),
    customer = require('./customerActions');


function Order(item_id, productName, quantity, price) {
    this.item_id = item_id;
    this.productName = productName;
    this.quantity = quantity;
    this.price = (Number(price)).toFixed(2);
    this.sales = (Number(this.price * this.quantity)).toFixed(2);
}


Order.prototype.checkInventory = function (stock_quantity, product_sales) {
    if (this.quantity > stock_quantity) {
        console.log(`Sorry, we are low on stock. We only have ${stock_quantity} available.`);
        setTimeout(reroute, 2000);
    } else {
        console.log(`Processing your order for ${this.productName}...\n`);
        this.takeOrder(stock_quantity, product_sales);
    }
};


Order.prototype.takeOrder = function (stock_quantity, product_sales) {
    tables.makeOrderTable(this.productName, this.quantity, this.price);
    this.updateStock_quantity(stock_quantity, product_sales);
};


Order.prototype.updateStock_quantity = function (stock_quantity, product_sales) {
    var newStock_Quantity = stock_quantity - this.quantity;
    // console.log(`Updating product quantity...\n`);
    var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock_Quantity
            },
            {
                item_id: this.item_id
            }
        ],
        function (err, res) {
            // console.log(res.affectedRows + " products updated!\n");
        }
    );
    this.updateProduct_Sales(product_sales);
};

Order.prototype.updateProduct_Sales = function (product_sales) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
                product_sales: product_sales + Number(this.sales)
            },
            {
                item_id: this.item_id
            }
        ],
        function (err, res) {}
    );
    setTimeout(reroute, 2000);
};


function reroute() {
    inquirer.prompt([{
            name: "actions",
            type: 'list',
            choices: ['Purchase product', 'EXIT Customer Role'],
            message: "What will you like to do?"
        }])
        .then(function (answer) {
            answer.actions === 'Purchase product' ? customer.displayProducts() : index.selectRole();
        });
}



module.exports = Order;