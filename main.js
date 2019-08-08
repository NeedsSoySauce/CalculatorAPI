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

    // TBD - Check that operators and operands are correctly paired

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

