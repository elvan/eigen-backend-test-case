/**
 * Problem 3: Count occurrences of QUERY strings in INPUT array
 * 
 * Input: 
 * INPUT = ['xc', 'dz', 'bbb', 'dz']
 * QUERY = ['bbb', 'ac', 'dz']
 * 
 * Output: 
 * [1, 0, 2]
 * - 'bbb' appears 1 time in INPUT
 * - 'ac' appears 0 times in INPUT
 * - 'dz' appears 2 times in INPUT
 */

function countOccurrences(input, query) {
    const result = [];
    
    for (const q of query) {
        let count = 0;
        
        for (const item of input) {
            if (item === q) {
                count++;
            }
        }
        
        result.push(count);
    }
    
    return result;
}

// Test case
const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];
const result = countOccurrences(INPUT, QUERY);

console.log('INPUT =', JSON.stringify(INPUT));
console.log('QUERY =', JSON.stringify(QUERY));
console.log('OUTPUT =', result);
console.log('Explanation:');
QUERY.forEach((q, index) => {
    console.log(`'${q}' appears ${result[index]} time(s) in INPUT`);
});

// Export function
module.exports = { countOccurrences };

// Run the function
// node 3-array-query.js
