/**
 * Problem 1: Reverse alphabets in a string while keeping the numbers at the end
 * 
 * Input: "NEGIE1"
 * Output: "EIGEN1"
 */

function reverseStringKeepNumbers(str) {
    // Extract letters and numbers
    const letters = [];
    const numbers = [];
    
    for (let char of str) {
        if (isNaN(char)) {
            letters.push(char);
        } else {
            numbers.push(char);
        }
    }
    
    // Reverse the letters
    const reversedLetters = letters.reverse();
    
    // Combine letters and numbers
    return reversedLetters.join('') + numbers.join('');
}

// Test case
const input = "NEGIE1";
const result = reverseStringKeepNumbers(input);
console.log(`Input: ${input}`);
console.log(`Output: ${result}`);

// Export function
module.exports = { reverseStringKeepNumbers };

// Run the function
// node 1-reverse-string.js
