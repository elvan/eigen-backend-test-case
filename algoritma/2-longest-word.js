/**
 * Problem 2: Find the longest word in a sentence
 * If there are words with the same length, return any one of them
 * 
 * Input: "Saya sangat senang mengerjakan soal algoritma"
 * Output: "mengerjakan: 11 character"
 */

function longest(sentence) {
    // Split the sentence into words
    const words = sentence.split(' ');
    
    // Find the longest word
    let longestWord = '';
    
    for (const word of words) {
        if (word.length > longestWord.length) {
            longestWord = word;
        }
    }
    
    return `${longestWord}: ${longestWord.length} character`;
}

// Test case
const sentence = "Saya sangat senang mengerjakan soal algoritma";
const result = longest(sentence);
console.log(`Input: "${sentence}"`);
console.log(`Output: ${result}`);

// Export function
module.exports = { longest };

// Run the function
// node 2-longest-word.js
