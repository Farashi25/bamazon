function Order(item_id, productName, quantity, price) {
    this.item_id = item_id;
    this.productName = productName;
    this.quantity = quantity;
    this.price = price;
}


Order.prototype.checkInventory = function (stock_quantity, connection) {
    if (this.quantity > stock_quantity) {
        console.log(`Sorry, we are low on stock. We only have ${stock_quantity} available.`);
        return;
    } else {
        console.log(`Processing your order for ${this.productName}...\n`);
        this.takeOrder(stock_quantity, connection);
    }
};


Order.prototype.takeOrder = function (stock_quantity, connection) {
    console.log(
        `******Order Confirmation******
        Product: ${this.productName}
        Quantity: ${this.quantity}
        Price: $${this.price}
        ________________________________
        Your Order Total: $${this.price * this.quantity}
        ================================
    `);
    this.updateStock_quantity(stock_quantity, connection);
};


Order.prototype.updateStock_quantity = function (stock_quantity, connection) {
    var newStock_Quantity = stock_quantity - this.quantity;
    console.log(`Updating product quantity...\n`);
    var query = connection.query(
        "UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock_Quantity
            },
            {
                item_id: this.item_id
            }
        ],
        function (err, res) {
            console.log(res.affectedRows + " products updated!\n");
            
        }
    );
};






module.exports = Order;