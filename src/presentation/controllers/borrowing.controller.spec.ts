import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingController } from './borrowing.controller';
import { BorrowingService } from '../../application/services/borrowing.service';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { Book } from '../../domain/entities/book.entity';
import { Member } from '../../domain/entities/member.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BorrowBookDto, ReturnBookDto, BorrowingDto } from '../dtos/borrowing.dto';

describe('BorrowingController', () => {
  let controller: BorrowingController;
  let borrowingService: Partial<BorrowingService>;

  beforeEach(async () => {
    // Mock service
    borrowingService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      getActiveBorrowingsByMember: jest.fn(),
      borrowBook: jest.fn(),
      returnBook: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingController],
      providers: [
        { provide: BorrowingService, useValue: borrowingService },
      ],
    }).compile();

    controller = module.get<BorrowingController>(BorrowingController);
  });

  describe('findAll', () => {
    it('should return an array of borrowings', async () => {
      // Arrange
      const borrowings: Borrowing[] = [
        createMockBorrowing('1', 'JK-45', 'M001', false),
        createMockBorrowing('2', 'SHR-1', 'M002', true),
      ];
      
      // Expected DTO response
      const expectedDTOs: BorrowingDto[] = borrowings.map(b => ({
        id: b.id,
        bookCode: b.book_code,
        memberCode: b.member_code,
        borrowDate: b.borrowDate,
        returnDate: b.returnDate
      }));
      
      borrowingService.findAll = jest.fn().mockResolvedValue(borrowings);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(expectedDTOs);
      expect(borrowingService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a borrowing when a valid id is provided', async () => {
      // Arrange
      const borrowing = createMockBorrowing('1', 'JK-45', 'M001', false);
      
      // Expected DTO response
      const expectedDTO: BorrowingDto = {
        id: borrowing.id,
        bookCode: borrowing.book_code,
        memberCode: borrowing.member_code,
        borrowDate: borrowing.borrowDate,
        returnDate: borrowing.returnDate
      };
      
      borrowingService.findById = jest.fn().mockResolvedValue(borrowing);

      // Act
      const result = await controller.findById('1');

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(borrowingService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when borrowing is not found', async () => {
      // Arrange
      borrowingService.findById = jest.fn().mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(controller.findById('NONEXISTENT')).rejects.toThrow(NotFoundException);
      expect(borrowingService.findById).toHaveBeenCalledWith('NONEXISTENT');
    });
  });

  describe('getActiveBorrowingsByMember', () => {
    it('should return borrowings for a specific member', async () => {
      // Arrange
      const memberCode = 'M001';
      const borrowings: Borrowing[] = [
        createMockBorrowing('1', 'JK-45', memberCode, false),
        createMockBorrowing('2', 'SHR-1', memberCode, false),
      ];
      
      // Expected DTO response
      const expectedDTOs: BorrowingDto[] = borrowings.map(b => ({
        id: b.id,
        bookCode: b.book_code,
        memberCode: b.member_code,
        borrowDate: b.borrowDate,
        returnDate: b.returnDate
      }));
      
      borrowingService.getActiveBorrowingsByMember = jest.fn().mockResolvedValue(borrowings);

      // Act
      const result = await controller.getActiveBorrowingsByMember(memberCode);

      // Assert
      expect(result).toEqual(expectedDTOs);
      expect(borrowingService.getActiveBorrowingsByMember).toHaveBeenCalledWith(memberCode);
    });
  });

  describe('borrowBook', () => {
    it('should borrow a book successfully', async () => {
      // Arrange
      const borrowBookDto: BorrowBookDto = {
        bookCode: 'JK-45',
        memberCode: 'M001',
      };
      
      const newBorrowing = createMockBorrowing('1', 'JK-45', 'M001', false);
      
      // Expected DTO response
      const expectedDTO: BorrowingDto = {
        id: newBorrowing.id,
        bookCode: newBorrowing.book_code,
        memberCode: newBorrowing.member_code,
        borrowDate: newBorrowing.borrowDate,
        returnDate: newBorrowing.returnDate
      };
      
      borrowingService.borrowBook = jest.fn().mockResolvedValue(newBorrowing);

      // Act
      const result = await controller.borrowBook(borrowBookDto);

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(borrowingService.borrowBook).toHaveBeenCalledWith(borrowBookDto);
    });

    it('should throw BadRequestException when member has already borrowed 2 books', async () => {
      // Arrange
      const borrowBookDto: BorrowBookDto = {
        bookCode: 'JK-45',
        memberCode: 'M001'
      };

      const error = new BadRequestException('Member has reached maximum number of books that can be borrowed');
      borrowingService.borrowBook = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(controller.borrowBook(borrowBookDto)).rejects.toThrow(BadRequestException);
      expect(borrowingService.borrowBook).toHaveBeenCalledWith(borrowBookDto);
    });

    it('should throw BadRequestException when book is not available', async () => {
      // Arrange
      const borrowBookDto: BorrowBookDto = {
        bookCode: 'JK-45',
        memberCode: 'M001',
      };
      
      borrowingService.borrowBook = jest.fn().mockRejectedValue(new BadRequestException('Book is not available'));

      // Act & Assert
      await expect(controller.borrowBook(borrowBookDto)).rejects.toThrow(BadRequestException);
      expect(borrowingService.borrowBook).toHaveBeenCalledWith(borrowBookDto);
    });

    it('should throw BadRequestException when member is penalized', async () => {
      // Arrange
      const borrowBookDto: BorrowBookDto = {
        bookCode: 'JK-45',
        memberCode: 'M001'
      };

      const error = new BadRequestException('Member is currently penalized and cannot borrow books');
      borrowingService.borrowBook = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(controller.borrowBook(borrowBookDto)).rejects.toThrow(BadRequestException);
      expect(borrowingService.borrowBook).toHaveBeenCalledWith(borrowBookDto);
    });
  });

  describe('returnBook', () => {
    it('should return a book successfully', async () => {
      // Arrange
      const returnBookDto: ReturnBookDto = {
        borrowingId: '1'
      };

      const borrowing = createMockBorrowing('1', 'JK-45', 'M001', true);
      
      // Expected DTO response
      const expectedDTO: BorrowingDto = {
        id: borrowing.id,
        bookCode: borrowing.book_code,
        memberCode: borrowing.member_code,
        borrowDate: borrowing.borrowDate,
        returnDate: borrowing.returnDate
      };
      
      borrowingService.returnBook = jest.fn().mockResolvedValue(borrowing);

      // Act
      const result = await controller.returnBook(returnBookDto);

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(borrowingService.returnBook).toHaveBeenCalledWith(returnBookDto);
    });

    it('should throw NotFoundException when borrowing is not found', async () => {
      // Arrange
      const returnBookDto: ReturnBookDto = {
        borrowingId: 'NONEXISTENT'
      };

      borrowingService.returnBook = jest.fn().mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(controller.returnBook(returnBookDto)).rejects.toThrow(NotFoundException);
      expect(borrowingService.returnBook).toHaveBeenCalledWith(returnBookDto);
    });

    it('should throw BadRequestException when book is already returned', async () => {
      // Arrange
      const returnBookDto: ReturnBookDto = {
        borrowingId: '1'
      };

      const error = new BadRequestException('This book has already been returned');
      borrowingService.returnBook = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(controller.returnBook(returnBookDto)).rejects.toThrow(BadRequestException);
      expect(borrowingService.returnBook).toHaveBeenCalledWith(returnBookDto);
    });
  });

  // Helper function to create a mock borrowing
  function createMockBorrowing(id: string, bookCode: string, memberCode: string, isReturned: boolean): Borrowing {
    const borrowDate = new Date();
    const returnDate = isReturned ? new Date(borrowDate.getTime() + 86400000) : null; // Next day if returned
    
    const book = new Book();
    book.code = bookCode;
    book.title = 'Test Book';
    book.author = 'Test Author';
    
    const member = new Member();
    member.code = memberCode;
    member.name = 'Test Member';
    
    const borrowing = new Borrowing();
    borrowing.id = id;
    borrowing.book = book;
    borrowing.book_code = bookCode;
    borrowing.member = member;
    borrowing.member_code = memberCode;
    borrowing.borrowDate = borrowDate;
    borrowing.returnDate = returnDate;
    
    return borrowing;
  }
});
