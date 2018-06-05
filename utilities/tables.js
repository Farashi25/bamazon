var output, config, data, {
    table
} = require('table');


function makeSupervisorTable(res) {
    console.log("\n");
    console.log(`         S A L E S  B Y  D E P A R T M E N T`);
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
    printTable(output);
}


function makeManagerTables(res, type) {
    console.log("\n");
    type === 'reorder' ? console.log(` P R O D U C T  T O  B E  R E O R D E R E D  `) :
        type === 'inventory' ? console.log(`                I N V E N T O R Y  `) :
        type === 'lowInventory' ? console.log(`L O W   I N V E N T O R Y  `) : console.log('');
    data = [
            ['Item Id', 'Product Name', 'Price', 'Quantity']
        ],
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
    printTable(output);
}


function makeProductTable(res) {
    console.log("\n");
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
    printTable(output);
}

function makeOrderSummaryTable(name, qty, price) {
    console.log("\n");
    console.log('      O R D E R  S U M M A R Y');
    data = [
        ['Product Name', name],
        ['Quantity', qty],
        ['Unit Price', '$' + price],
        ['Order Total', '$' + (qty * price).toFixed(2)]
    ];

    config = {
        columns: {
            0: {
                width: 15,
                padding: 0.3
            },
            width: 25,
            padding: 0.3
        },
    };
    output = table(data, config);
    printTable(output);
}


function makeProductsTable(res) {
    console.log("\n");
    console.log(`      W E L C O M E  T O  B A M A Z O N!!`);
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
    printTable(output);
}


printTable = output => console.log(output), console.log("\n");


module.exports = {
    makeManagerTables: makeManagerTables,
    makeProductsTable: makeProductsTable,
    makeProductTable: makeProductTable,
    makeOrderSummaryTable: makeOrderSummaryTable,
    makeSupervisorTable: makeSupervisorTable
};