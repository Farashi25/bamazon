function validateNumbers(input) {
    if (typeof input !== 'number') {
        console.log('it is not a #');
        // return;
    }
}

function emptyValidator(input) {
    return input !== '';
}


function validateString(input) {
    if (typeof input !== 'string') {
        console.log('it is not a string');
        // return;
    }
}



module.exports = {
    validateNumbers: validateNumbers,
    validateString: validateString,
    emptyValidator: emptyValidator
};

