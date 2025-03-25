import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import { BorrowingRepository } from '../../infrastructure/repositories/borrowing.repository';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';
import { Book } from '../../domain/entities/book.entity';
import { Member } from '../../domain/entities/member.entity';
import { Borrowing } from '../../domain/entities/borrowing.entity';

describe('BorrowingService', () => {
  let service: BorrowingService;
  let borrowingRepository: Partial<BorrowingRepository>;
  let bookRepository: Partial<BookRepository>;
  let memberRepository: Partial<MemberRepository>;

  beforeEach(async () => {
    // Mock repositories
    borrowingRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findActiveBorrowingsByMember: jest.fn(),
      findActiveBorrowingByBook: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    bookRepository = {
      findByCode: jest.fn(),
      update: jest.fn(),
    };

    memberRepository = {
      findByCode: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowingService,
        { provide: BorrowingRepository, useValue: borrowingRepository },
        { provide: BookRepository, useValue: bookRepository },
        { provide: MemberRepository, useValue: memberRepository },
      ],
    }).compile();

    service = module.get<BorrowingService>(BorrowingService);
  });

  describe('borrowBook', () => {
    it('should successfully borrow a book', async () => {
      // Arrange
      const book = new Book();
      book.code = 'TEST-1';
      book.title = 'Test Book';
      book.stock = 1;
      book.borrowings = [];
      jest.spyOn(book, 'isAvailable').mockReturnValue(true);

      const member = new Member();
      member.code = 'M001';
      member.name = 'Test Member';
      member.borrowings = [];
      jest.spyOn(member, 'canBorrowBooks').mockReturnValue(true);

      bookRepository.findByCode = jest.fn().mockResolvedValue(book);
      memberRepository.findByCode = jest.fn().mockResolvedValue(member);

      const newBorrowing = new Borrowing();
      newBorrowing.id = 'borrowing-id';
      newBorrowing.book = book;
      newBorrowing.book_code = book.code;
      newBorrowing.member = member;
      newBorrowing.member_code = member.code;
      newBorrowing.borrowDate = new Date();

      borrowingRepository.save = jest.fn().mockResolvedValue(newBorrowing);

      // Act
      const result = await service.borrowBook({
        bookCode: book.code,
        memberCode: member.code,
      });

      // Assert
      expect(result).toBe(newBorrowing);
      expect(bookRepository.findByCode).toHaveBeenCalledWith(book.code);
      expect(memberRepository.findByCode).toHaveBeenCalledWith(member.code);
      expect(borrowingRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when book not found', async () => {
      // Arrange
      bookRepository.findByCode = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.borrowBook({
          bookCode: 'NON-EXISTENT',
          memberCode: 'M001',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when member not found', async () => {
      // Arrange
      const book = new Book();
      book.code = 'TEST-1';
      
      bookRepository.findByCode = jest.fn().mockResolvedValue(book);
      memberRepository.findByCode = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.borrowBook({
          bookCode: book.code,
          memberCode: 'NON-EXISTENT',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when book is not available', async () => {
      // Arrange
      const book = new Book();
      book.code = 'TEST-1';
      book.title = 'Test Book';
      jest.spyOn(book, 'isAvailable').mockReturnValue(false);

      const member = new Member();
      member.code = 'M001';
      
      bookRepository.findByCode = jest.fn().mockResolvedValue(book);
      memberRepository.findByCode = jest.fn().mockResolvedValue(member);

      // Act & Assert
      await expect(
        service.borrowBook({
          bookCode: book.code,
          memberCode: member.code,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when member cannot borrow more books', async () => {
      // Arrange
      const book = new Book();
      book.code = 'TEST-1';
      book.title = 'Test Book';
      jest.spyOn(book, 'isAvailable').mockReturnValue(true);

      const member = new Member();
      member.code = 'M001';
      member.name = 'Test Member';
      jest.spyOn(member, 'canBorrowBooks').mockReturnValue(false);
      jest.spyOn(member, 'isPenalized').mockReturnValue(false);

      bookRepository.findByCode = jest.fn().mockResolvedValue(book);
      memberRepository.findByCode = jest.fn().mockResolvedValue(member);

      // Act & Assert
      await expect(
        service.borrowBook({
          bookCode: book.code,
          memberCode: member.code,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('returnBook', () => {
    it('should successfully return a book', async () => {
      // Arrange
      const book = new Book();
      book.code = 'TEST-1';
      
      const member = new Member();
      member.code = 'M001';

      const borrowing = new Borrowing();
      borrowing.id = 'borrowing-id';
      borrowing.book = book;
      borrowing.book_code = book.code;
      borrowing.member = member;
      borrowing.member_code = member.code;
      borrowing.borrowDate = new Date();
      borrowing.returnDate = null;

      borrowingRepository.findById = jest.fn().mockResolvedValue(borrowing);
      borrowingRepository.update = jest.fn().mockImplementation(async (b) => b);

      // Mock the returnBook method
      const returnBookSpy = jest.spyOn(borrowing, 'returnBook');

      // Act
      await service.returnBook({ borrowingId: borrowing.id });

      // Assert
      expect(borrowingRepository.findById).toHaveBeenCalledWith(borrowing.id);
      expect(returnBookSpy).toHaveBeenCalled();
      expect(borrowingRepository.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when borrowing not found', async () => {
      // Arrange
      borrowingRepository.findById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.returnBook({
          borrowingId: 'NON-EXISTENT',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when book is already returned', async () => {
      // Arrange
      const borrowing = new Borrowing();
      borrowing.id = 'borrowing-id';
      borrowing.returnDate = new Date(); // Already returned

      borrowingRepository.findById = jest.fn().mockResolvedValue(borrowing);

      // Act & Assert
      await expect(
        service.returnBook({
          borrowingId: borrowing.id,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
