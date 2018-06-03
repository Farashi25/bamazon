// function Feedbacks (err){
//         this.err = err;
// }

// Feedbacks.prototype.info = function(){
//     console.log('\x1b[31m', 'ID is invalid. Try again!\n');
// };

//product id error
var info = () => console.log('\x1b[31m', 'That ID does not match any product. Please check the ID and try again!\n');

//database error
var dbError = () => console.log('\x1b[31m', 'Something went wrong.\n');

//manager messages
var dupProduct = () => console.log('\x1b[31m', 'Product Already Exist\n');
var addProduct = (row, name) => console.log("\x1b[32m", `${row} product name: ${name} to inventory\n`);
var confirmReorder = () => console.log("\x1b[32m", 'SUCCESS!! Reorder is processed\n');

//supervisor messages
var dupDepartment = () => console.log('\x1b[31m', 'Department Already Exist\n');
var addDepartment = (row, name) => console.log("\x1b[32m", `${row} Department name: ${name} has been created.\n`);






module.exports = {
    info:info,
    dbError:dbError,
    dupProduct:dupProduct,
    addProduct:addProduct,
    confirmReorder:confirmReorder,
    dupDepartment:dupDepartment,
    addDepartment:addDepartment
};