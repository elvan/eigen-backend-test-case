import { Test } from '@nestjs/testing';
import { Borrowing } from './borrowing.entity';
import { Book } from './book.entity';
import { Member } from './member.entity';

describe('Borrowing Entity', () => {
  let borrowing: Borrowing;
  let book: Book;
  let member: Member;

  beforeEach(() => {
    borrowing = new Borrowing();
    borrowing.id = 'test-id';

    book = new Book();
    book.code = 'B001';
    book.title = 'Test Book';

    member = new Member();
    member.code = 'M001';
    member.name = 'Test Member';

    borrowing.book = book;
    borrowing.book_code = book.code;
    borrowing.member = member;
    borrowing.member_code = member.code;
    borrowing.borrowDate = new Date();
    borrowing.returnDate = null;
  });

  describe('isReturned', () => {
    it('should return false when book has not been returned', () => {
      borrowing.returnDate = null;
      expect(borrowing.isReturned()).toBe(false);
    });

    it('should return true when book has been returned', () => {
      borrowing.returnDate = new Date();
      expect(borrowing.isReturned()).toBe(true);
    });
  });

  describe('calculateBorrowingDurationDays', () => {
    it('should return 0 when book has not been returned', () => {
      borrowing.returnDate = null;
      expect(borrowing.calculateBorrowingDurationDays()).toBe(0);
    });

    it('should calculate correct duration for same-day return', () => {
      borrowing.borrowDate = new Date();
      borrowing.returnDate = new Date();
      expect(borrowing.calculateBorrowingDurationDays()).toBe(0);
    });

    it('should calculate correct duration for multi-day borrowing', () => {
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - 5); // 5 days ago
      borrowing.borrowDate = borrowDate;

      borrowing.returnDate = new Date();
      expect(borrowing.calculateBorrowingDurationDays()).toBe(5);
    });
  });

  describe('isPenalized', () => {
    it('should return false when borrowed for 7 days or less', () => {
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - 7); // 7 days ago
      borrowing.borrowDate = borrowDate;

      borrowing.returnDate = new Date();
      expect(borrowing.isPenalized()).toBe(false);
    });

    it('should return true when borrowed for more than 7 days', () => {
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - 8); // 8 days ago
      borrowing.borrowDate = borrowDate;

      borrowing.returnDate = new Date();
      expect(borrowing.isPenalized()).toBe(true);
    });
  });

  describe('returnBook', () => {
    it('should set return date to current date', () => {
      borrowing.returnDate = null;
      borrowing.returnBook();

      expect(borrowing.returnDate).toBeDefined();

      // Check that the return date is close to now (within 1 second)
      const now = new Date();
      // We know returnDate is not null here because returnBook() was just called
      const diff = Math.abs(now.getTime() - (borrowing.returnDate as unknown as Date).getTime());
      expect(diff).toBeLessThan(1000);
    });

    it('should throw error if book is already returned', () => {
      borrowing.returnDate = new Date();

      expect(() => {
        borrowing.returnBook();
      }).toThrow('This book has already been returned');
    });
  });
});
