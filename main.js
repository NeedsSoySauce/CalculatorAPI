const express = require('express');
const app = express();
const port = 3000;
const OPERATORS = ['+', '-', '*', '/', '^', '(', ')'];
const BASE_SYMBOLS = "0123456789abcdefghijklmnopqrstuvwxyz";

app.use(express.json()); // Middleware

app.listen(port, () => {
    console.log("Listening on " + port);
})


/**
 * Returns an array containing the operands and operators in a mathematical expression in order
 * @param {string} equation a mathematical expression containing operators and operands
 * @returns {string[]} an array containing operators and operands in order
 */
function splitEquation(equation) {
    console.log(equation);
    let parts = [];
    let part = "";

    let i = 0;
    for (let i = 0; i < equation.length; i++) {
        let char = equation.charAt(i);

        if (OPERATORS.includes(char)) {
            if (part) {
                parts.push(part);
                part = "";
            }
            parts.push(char);
        } else {
            part += char;
        }
    }

    if (part) {
        parts.push(part);
    }


    return parts;
}


/**
 * Returns true if all of the operators and operands in the given equation are valid
 * and all brackets are closed
 * @param {string[]} equation an array containing operators and operands to check
 * @param {number} base the base which this equation is being calculated in
 * @returns {boolean} true if the given equation is valid, otherwise false
 */
function isValidEquation(equation, base) {

    // Check that all brackets are closed
    let openBrackets = 0;
    equation.forEach(elem => {
        if (elem === "(") {
            openBrackets++;
        } else if (elem === ")") {
            openBrackets--;
        }
    });

    if (openBrackets != 0) {
        return false;
    }

    // Check that all symbols are valid
    let isSymbolsValid = true;
    equation.forEach(elem => {
        if (!OPERATORS.includes(elem) && !isValidNumberInBase(elem, base)) {
            isSymbolsValid = false;
        }
    });

    if (!isSymbolsValid) {
        return false;
    }
    
    let isOperand = false;
    let expectingOperand = false;
    // Check that operators and operands are correctly paired
    for (let i = 0; i < equation.length; i++) {
        switch (equation[i]) {
            case "-":
                // A sequence of minus signs if valid if there is an operand of some 
                // kind at the end of it
                expectingOperand = true;
                break;
            case "+":
            case "*":
            case "/":
            case "^":
                // Check that there's an operand on both sides of this operator

                // These operators can't be the first item in an equation or the last
                // and they also can't be the next item if we're expecting an operand
                // and the last item must've been an operand

                if (expectingOperand || 
                    !isOperand ||
                    i === 0 || 
                    i === equation.length - 1) {
                    return false;
                }

                expectingOperand = true;

                break;
            case "(":
                // An open bracket can have anything before it, 
                // and can be considered an operand
                break;
            case ")":
                // An open bracket is not an operand
                if (expectingOperand) return false;
                break;
            default:
                isOperand = true;
                expectingOperand = false;
        }
    }

    // If we got to the end of the equation and are still expecting an operand
    // then there was a sequence of '-' signs without an operand at the end.
    if (expectingOperand) {
        return false;
    }

    return true;

}


/**
 * Returns true if the given number is valid in the given base
 * @param {string} number the number to check
 * @param {number} base the base to check for
 * @returns {boolean} true if the given number is valid, otherwise false
 */
function isValidNumberInBase(number, base) {
    let validSymbols = BASE_SYMBOLS.substr(0, base);
    let characters = number.toLowerCase();

    for (let i = 0; i < characters.length; i++) {
        let char = characters.charAt(i);
        if (!validSymbols.includes(char)) {
            return false;
        }
    }

    return true;
}


/**
 * Returns an array containing the operands and operators in a mathematical expression in order
 * @param {string} equation a mathematical expression containing operators and operands
 * @param {number} base the base which this equation is being calculated in
 * @returns {string[]} an array containing the operands and operators in a mathematical expression in order
 */
function parseEquation(equation, base) {

    let equationParts = splitEquation(equation);

    if (!isValidEquation(equationParts, base)) {
        throw "Invalid equation";
    }

    return equationParts;
}


app.get("/:base/:equation", (req, res) => {

    let params = req.params;

    console.log(req.params);

    if (isNaN(params.base)) {
        res.status(400).send();
        return;
    }

    console.log(parseEquation(params.equation, params.base))

    res.status(200).json(req.params);
})

