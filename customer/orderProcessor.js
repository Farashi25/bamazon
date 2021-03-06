var connection = require('../utilities/db_connection'),
    inquirer = require('inquirer'),
    index = require('../index'),
    tables = require('../utilities/tables'),
    customer = require('./customerActions'),
    message = require('../utilities/feedbacks');


function Order(id, name, qty, price) {
    this.id = id;
    this.name = name;
    this.qty = qty;
    this.price = (Number(price)).toFixed(2);
    this.sales = (Number(this.price * this.qty)).toFixed(2);
}


Order.prototype.checkInventory = function (qty, sales) {
    if (this.qty > qty) {
        message.lowStock(qty);
        setTimeout(customerRedirect, 2000);
    } else {
        message.confirmOrder(this.name);
        this.takeOrder(qty, sales);
    }
};


Order.prototype.takeOrder = function (qty, sales) {
    tables.makeOrderSummaryTable(this.name, this.qty, this.price);
    this.updateStockQuantity(qty, sales);
};


Order.prototype.updateStockQuantity = function (qty, sales) {
    var newStock_Quantity = qty - this.qty;
    connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock_Quantity
            },
            {
                item_id: this.id
            }
        ],
        (err) => err ? (message.dbError(), customerRedirect()) : this.updateProductSales(sales)
    );
};


Order.prototype.updateProductSales = function (sales) {
    connection.query("UPDATE products SET ? WHERE ?", [{
            product_sales: sales + Number(this.sales)
        }, {
            item_id: this.id
        }],
        (err) => err ? (message.dbError(), customerRedirect()) : setTimeout(customerRedirect, 2000)
    );
};


function customerRedirect() {
    inquirer.prompt([{
            name: "actions",
            type: 'list',
            choices: ['PURCHASE A PRODUCT', 'EXIT STORE'],
            message: "What will you like to do?"
        }])
        .then(answer => answer.actions === 'PURCHASE A PRODUCT' ? customer.displayProducts() :
            (message.goodbye(),
                index.selectRole())
        );
}


module.exports = Order;
module.exports.customerRedirect = customerRedirect;