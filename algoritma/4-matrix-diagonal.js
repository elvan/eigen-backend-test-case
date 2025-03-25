/**
 * Problem 4: Find the absolute difference between the sums of diagonals in an NxN matrix
 * 
 * Input: 
 * Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]
 * 
 * Output: 
 * 3
 * 
 * Explanation:
 * - Primary diagonal: 1 + 5 + 9 = 15
 * - Secondary diagonal: 0 + 5 + 7 = 12
 * - Absolute difference: |15 - 12| = 3
 */

function diagonalDifference(matrix) {
    const n = matrix.length;
    let primaryDiagonalSum = 0;
    let secondaryDiagonalSum = 0;
    
    for (let i = 0; i < n; i++) {
        // Primary diagonal: elements where row index equals column index
        primaryDiagonalSum += matrix[i][i];
        
        // Secondary diagonal: elements where row index + column index = n - 1
        secondaryDiagonalSum += matrix[i][n - 1 - i];
    }
    
    // Calculate absolute difference
    return Math.abs(primaryDiagonalSum - secondaryDiagonalSum);
}

// Test case
const matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];
const result = diagonalDifference(matrix);

console.log('Matrix =', JSON.stringify(matrix));
console.log('Primary diagonal sum =', matrix[0][0], '+', matrix[1][1], '+', matrix[2][2], '=', matrix[0][0] + matrix[1][1] + matrix[2][2]);
console.log('Secondary diagonal sum =', matrix[0][2], '+', matrix[1][1], '+', matrix[2][0], '=', matrix[0][2] + matrix[1][1] + matrix[2][0]);
console.log('Diagonal difference =', result);

// Export function
module.exports = { diagonalDifference };

// Run the function
// node 4-matrix-diagonal.js
