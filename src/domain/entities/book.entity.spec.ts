import { Test } from '@nestjs/testing';
import { Book } from './book.entity';
import { Borrowing } from './borrowing.entity';

describe('Book Entity', () => {
  let book: Book;

  beforeEach(() => {
    book = new Book();
    book.code = 'TEST-123';
    book.title = 'Test Book';
    book.author = 'Test Author';
    book.stock = 3;
    book.borrowings = [];
  });

  describe('isAvailable', () => {
    it('should return true when the book has available stock', () => {
      expect(book.isAvailable()).toBe(true);
    });

    it('should return false when all books are borrowed', () => {
      // Create 3 active borrowings (equal to stock)
      const borrowings: Partial<Borrowing>[] = [];
      for (let i = 0; i < 3; i++) {
        const borrowing = new Borrowing();
        borrowing.book = book;
        borrowing.borrowDate = new Date();
        borrowing.returnDate = null; // Not returned
        borrowings.push(borrowing);
      }
      
      book.borrowings = borrowings as Borrowing[];
      expect(book.isAvailable()).toBe(false);
    });
  });

  describe('getAvailableStock', () => {
    it('should return the total stock when no books are borrowed', () => {
      expect(book.getAvailableStock()).toBe(3);
    });

    it('should return the correct available stock when some books are borrowed', () => {
      // Create 1 active borrowing
      const borrowing = new Borrowing();
      borrowing.book = book;
      borrowing.borrowDate = new Date();
      borrowing.returnDate = null; // Not returned
      
      book.borrowings = [borrowing];
      expect(book.getAvailableStock()).toBe(2);
    });

    it('should count only active borrowings for available stock', () => {
      // Create 1 active borrowing and 1 returned borrowing
      const activeBorrowing = new Borrowing();
      activeBorrowing.book = book;
      activeBorrowing.borrowDate = new Date();
      activeBorrowing.returnDate = null; // Not returned
      
      const returnedBorrowing = new Borrowing();
      returnedBorrowing.book = book;
      returnedBorrowing.borrowDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
      returnedBorrowing.returnDate = new Date(); // Returned
      
      book.borrowings = [activeBorrowing, returnedBorrowing];
      expect(book.getAvailableStock()).toBe(2); // Only 1 book is currently borrowed
    });
  });
});
