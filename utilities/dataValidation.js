//Validate user input is not empty and is a number
 var validate = input => !!input;
 var validateNumber = input => validate(input) && !isNaN(parseInt(input));
 var validatePositive = input => validateNumber(input) && input > 0;

//Validate user input is not empty and is a word
 var validateWord = input => validate(input) && isNaN(parseInt(input));



module.exports = {
    validatePositive: validatePositive,
    validateWord: validateWord
};

