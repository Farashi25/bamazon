var output, config, data, {
    table
} = require('table');


function makeSupervisorTable(res) {
    data = [
        ['Id', 'Department Name', 'Overhead Cost', 'Totals Sales', 'Total Profit']
    ];
    res.forEach(d => {
        var dataRow = [];
        dataRow.push(d.department_id);
        dataRow.push(d.department_name);
        dataRow.push((Number(d.over_head_costs)).toFixed(2));
        dataRow.push((Number(d.product_sales)).toFixed(2));
        dataRow.push(((Number(d.product_sales)) - (Number(d.over_head_costs))).toFixed(2));
        dataRow.push();
        data.push(dataRow);
    });
    config = {
        columns: {
            0: {
                padding: 0.3
            },
            1: {
                width: 15,
                padding: 0.3
            },
            2: {
                width: 13,
                padding: 0.3
            },
            3: {
                width: 12,
                padding: 0.3
            },
            4: {
                width: 12,
                padding: 0.3
            }
        }
    };

    output = table(data, config);
    console.log(output);
}

function makeManagerTables(res) {
    data = [
        ['Item Id', 'Product Name', 'Price', 'Quantity']
    ];
    res.forEach(product => {
        var dataRow = [];
        dataRow.push(product.item_id);
        dataRow.push(product.product_name);
        dataRow.push((Number(product.price)).toFixed(2));
        dataRow.push(product.stock_quantity);
        data.push(dataRow);
    });
    config = {
        columns: {
            0: {
                padding: 0.3
            },
            1: {
                width: 30,
                padding: 0.3
            },
            2: {
                width: 7,
                padding: 0.3
            },
            3: {
                width: 8,
                padding: 0.3
            }
        }
    };

    output = table(data, config);
    console.log(output);
}

function makeProductTable(res) {
    console.log('      S E L E C T E D  P R O D U C T');
    data = [
        ['Item ID', res[0].item_id],
        ['Product Name', res[0].product_name],
        ['Unit Price', '$' + res[0].price]
    ];

    config = {
        columns: {
            0: {
                width: 15,
                padding: 0.3
            },
            1: {
                width: 25,
                padding: 0.3
            },
        }
    };

    output = table(data, config);
    console.log(output);
}

function makeOrderSummaryTable(product_name, quantity, price) {
    console.log('      O R D E R  S U M M A R Y');
    data = [
        ['Product Name', product_name],
        ['Quantity', quantity],
        ['Unit Price', '$' + price],
        ['Order Total', '$' + (quantity * price).toFixed(2)]
    ];

    config = {
        columns: {
            0: {
                width: 15,
                padding: 0.3
            },
            1: {
                width: 25,
                padding: 0.3
            },
        }
    };

    output = table(data, config);
    console.log(output);
}



function makeProductsTable(res) {
    data = [
        ['Item Id', 'Product Name', 'Price']
    ];
    res.forEach(product => {
        var dataRow = [];
        dataRow.push(product.item_id);
        dataRow.push(product.product_name);
        dataRow.push((Number(product.price)).toFixed(2));
        data.push(dataRow);
    });
    config = {
        columns: {
            0: {
                padding: 0.3
            },
            1: {
                width: 30,
                padding: 0.3
            },
            2: {
                width: 7,
                padding: 0.3
            }
        }
    };

    output = table(data, config);
    console.log(output);
}

module.exports = {
    makeManagerTables: makeManagerTables,
    makeProductsTable: makeProductsTable,
    makeProductTable: makeProductTable,
    makeOrderSummaryTable: makeOrderSummaryTable,
    makeSupervisorTable: makeSupervisorTable
};