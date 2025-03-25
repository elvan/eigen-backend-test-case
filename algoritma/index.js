/**
 * Index file to run all algorithm solutions
 */

// Import solutions from individual files
const { reverseStringKeepNumbers } = require('./1-reverse-string');
const { longest } = require('./2-longest-word');
const { countOccurrences } = require('./3-array-query');
const { diagonalDifference } = require('./4-matrix-diagonal');

console.log('====== EIGEN ALGORITHM SOLUTIONS ======\n');

// Problem 1: Reverse String
console.log('PROBLEM 1: REVERSE STRING KEEPING NUMBERS');
const input1 = "NEGIE1";
console.log(`Input: ${input1}`);
console.log(`Output: ${reverseStringKeepNumbers(input1)}`);
console.log('\n');

// Problem 2: Longest Word
console.log('PROBLEM 2: FIND LONGEST WORD');
const input2 = "Saya sangat senang mengerjakan soal algoritma";
console.log(`Input: "${input2}"`);
console.log(`Output: ${longest(input2)}`);
console.log('\n');

// Problem 3: Count Occurrences
console.log('PROBLEM 3: COUNT OCCURRENCES');
const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];
console.log('INPUT =', JSON.stringify(INPUT));
console.log('QUERY =', JSON.stringify(QUERY));
const result3 = countOccurrences(INPUT, QUERY);
console.log('OUTPUT =', result3);
console.log('Explanation:');
QUERY.forEach((q, index) => {
    console.log(`'${q}' appears ${result3[index]} time(s) in INPUT`);
});
console.log('\n');

// Problem 4: Matrix Diagonal Difference
console.log('PROBLEM 4: MATRIX DIAGONAL DIFFERENCE');
const matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];
console.log('Matrix =', JSON.stringify(matrix));
const pd = matrix[0][0] + matrix[1][1] + matrix[2][2];
const sd = matrix[0][2] + matrix[1][1] + matrix[2][0];
console.log(`Primary diagonal sum = ${matrix[0][0]} + ${matrix[1][1]} + ${matrix[2][2]} = ${pd}`);
console.log(`Secondary diagonal sum = ${matrix[0][2]} + ${matrix[1][1]} + ${matrix[2][0]} = ${sd}`);
console.log('Diagonal difference =', diagonalDifference(matrix));
