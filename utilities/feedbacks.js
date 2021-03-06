
//product error/infor
var info = () => console.log('\x1b[31m', 'That ID does not match any product. Please check the ID and try again!\n');
var lowStock = (number) => console.log("\x1b[32m", `We are currently low on stock. We only have ${number} in stock.\n`);
var confirmOrder = (name) => console.log("\x1b[34m", `ORDER CONFIRMATION! \nYour order for ${name} has been placed. See details below:`);
var goodbye = () => console.log("\x1b[34m", `Thanks for your time. Please come back again.\n`);

//database error
var dbError = () => console.log('\x1b[31m', 'Something may have gone wrong with connection to database. Please check back later.\n');

//manager messages
var dupProduct = () => console.log('\x1b[31m', 'Product Already Exist\n');
var addProduct = (row, name) => console.log("\x1b[32m", `${row} product name: ${name} to inventory\n`);
var confirmReorder = () => console.log("\x1b[32m", 'SUCCESS!! Reorder is processed\n');
var inventoryInfo = () => console.log("\x1b[32m", 'Inventory is fully stocked.\n');

//supervisor messages
var dupDepartment = () => console.log('\x1b[31m', 'Department Already Exist\n');
var addDepartment = (row, name) => console.log("\x1b[32m", `${row} Department name: ${name} has been created.\n`);

module.exports = {
    info: info,
    goodbye: goodbye,
    dbError: dbError,
    lowStock: lowStock,
    dupProduct: dupProduct,
    addProduct: addProduct,
    confirmOrder: confirmOrder,
    inventoryInfo:inventoryInfo,
    dupDepartment: dupDepartment,
    addDepartment: addDepartment,
    confirmReorder: confirmReorder
};