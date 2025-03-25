import { Test } from '@nestjs/testing';
import { Member } from './member.entity';
import { Borrowing } from './borrowing.entity';
import { Book } from './book.entity';

describe('Member Entity', () => {
  let member: Member;
  let book1: Book;
  let book2: Book;

  beforeEach(() => {
    member = new Member();
    member.code = 'M001';
    member.name = 'Test Member';
    member.borrowings = [];

    book1 = new Book();
    book1.code = 'B001';
    book1.title = 'Book 1';
    book1.stock = 1;

    book2 = new Book();
    book2.code = 'B002';
    book2.title = 'Book 2';
    book2.stock = 1;
  });

  describe('getActiveBorrowings', () => {
    it('should return empty array when no borrowings exist', () => {
      expect(member.getActiveBorrowings()).toEqual([]);
    });

    it('should return only active borrowings', () => {
      // Create 1 active and 1 returned borrowing
      const activeBorrowing = new Borrowing();
      activeBorrowing.book = book1;
      activeBorrowing.member = member;
      activeBorrowing.borrowDate = new Date();
      activeBorrowing.returnDate = null;

      const returnedBorrowing = new Borrowing();
      returnedBorrowing.book = book2;
      returnedBorrowing.member = member;
      returnedBorrowing.borrowDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      returnedBorrowing.returnDate = new Date();

      member.borrowings = [activeBorrowing, returnedBorrowing];
      
      const activeBorrowings = member.getActiveBorrowings();
      expect(activeBorrowings.length).toBe(1);
      expect(activeBorrowings[0]).toBe(activeBorrowing);
    });
  });

  describe('canBorrowBooks', () => {
    it('should return true when member has no active borrowings and no penalty', () => {
      expect(member.canBorrowBooks()).toBe(true);
    });

    it('should return true when member has 1 active borrowing and no penalty', () => {
      const borrowing = new Borrowing();
      borrowing.book = book1;
      borrowing.member = member;
      borrowing.borrowDate = new Date();
      borrowing.returnDate = null;

      member.borrowings = [borrowing];
      
      expect(member.canBorrowBooks()).toBe(true);
    });

    it('should return false when member has 2 active borrowings', () => {
      const borrowing1 = new Borrowing();
      borrowing1.book = book1;
      borrowing1.member = member;
      borrowing1.borrowDate = new Date();
      borrowing1.returnDate = null;

      const borrowing2 = new Borrowing();
      borrowing2.book = book2;
      borrowing2.member = member;
      borrowing2.borrowDate = new Date();
      borrowing2.returnDate = null;

      member.borrowings = [borrowing1, borrowing2];
      
      expect(member.canBorrowBooks()).toBe(false);
    });

    it('should return false when member is penalized', () => {
      // Create a returned borrowing with a penalty (returned after 8 days)
      const borrowing = new Borrowing();
      borrowing.book = book1;
      borrowing.member = member;
      
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - 8); // 8 days ago
      borrowing.borrowDate = borrowDate;
      
      borrowing.returnDate = new Date(); // Today
      
      // Mock the isPenalized method on borrowing
      jest.spyOn(borrowing, 'isPenalized').mockReturnValue(true);
      
      member.borrowings = [borrowing];
      
      expect(member.isPenalized()).toBe(true);
      expect(member.canBorrowBooks()).toBe(false);
    });
  });

  describe('calculatePenaltyEndDate', () => {
    it('should return null when there are no penalties', () => {
      expect(member.calculatePenaltyEndDate()).toBeNull();
    });

    it('should calculate penalty end date correctly (3 days from return date)', () => {
      // Create a returned borrowing with a penalty (returned after 8 days)
      const borrowing = new Borrowing();
      borrowing.book = book1;
      borrowing.member = member;
      
      const borrowDate = new Date();
      borrowDate.setDate(borrowDate.getDate() - 8); // 8 days ago
      borrowing.borrowDate = borrowDate;
      
      const returnDate = new Date();
      borrowing.returnDate = returnDate;
      
      // Mock the isPenalized method
      jest.spyOn(borrowing, 'isPenalized').mockReturnValue(true);
      
      member.borrowings = [borrowing];
      
      const expectedPenaltyEndDate = new Date(returnDate);
      expectedPenaltyEndDate.setDate(expectedPenaltyEndDate.getDate() + 3);
      
      const penaltyEndDate = member.calculatePenaltyEndDate();
      expect(penaltyEndDate).toEqual(expectedPenaltyEndDate);
    });
  });
});
