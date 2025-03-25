import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, IsNull, UpdateResult } from 'typeorm';
import { BorrowingRepository } from './borrowing.repository';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { Book } from '../../domain/entities/book.entity';
import { Member } from '../../domain/entities/member.entity';

describe('BorrowingRepository', () => {
  let repository: BorrowingRepository;
  let typeOrmRepository: Repository<Borrowing>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowingRepository,
        {
          provide: getRepositoryToken(Borrowing),
          useClass: Repository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<BorrowingRepository>(BorrowingRepository);
    typeOrmRepository = module.get<Repository<Borrowing>>(getRepositoryToken(Borrowing));
  });

  // Helper function to create mock borrowings for testing
  function createMockBorrowing(id: string, bookCode: string, memberCode: string, isReturned: boolean): Borrowing {
    const book = new Book();
    book.code = bookCode;
    book.title = 'Test Book';
    
    const member = new Member();
    member.code = memberCode;
    member.name = 'Test Member';
    
    const borrowing = new Borrowing();
    borrowing.id = id;
    borrowing.book = book;
    borrowing.book_code = bookCode;
    borrowing.member = member;
    borrowing.member_code = memberCode;
    borrowing.borrowDate = new Date();
    borrowing.returnDate = isReturned ? new Date() : null;
    
    return borrowing;
  }

  describe('findAll', () => {
    it('should return an array of borrowings', async () => {
      // Arrange
      const borrowings: Borrowing[] = [
        createMockBorrowing('1', 'JK-45', 'M001', false),
        createMockBorrowing('2', 'SHR-1', 'M002', true),
      ];
      
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(borrowings);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toEqual(borrowings);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        relations: ['book', 'member'],
      });
    });
  });

  describe('findById', () => {
    it('should find a borrowing by id', async () => {
      // Arrange
      const borrowing = createMockBorrowing('1', 'JK-45', 'M001', false);
      
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(borrowing);

      // Act
      const result = await repository.findById('1');

      // Assert
      expect(result).toEqual(borrowing);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['book', 'member'],
      });
    });

    it('should return null when borrowing is not found', async () => {
      // Arrange
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      // Act
      const result = await repository.findById('NONEXISTENT');

      // Assert
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'NONEXISTENT' },
        relations: ['book', 'member'],
      });
    });
  });

  describe('findActiveBorrowingsByMember', () => {
    it('should find active borrowings for a member', async () => {
      // Arrange
      const memberCode = 'M001';
      const borrowings: Borrowing[] = [
        createMockBorrowing('1', 'JK-45', memberCode, false),
        createMockBorrowing('2', 'SHR-1', memberCode, false),
      ];
      
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(borrowings);

      // Act
      const result = await repository.findActiveBorrowingsByMember(memberCode);

      // Assert
      expect(result).toEqual(borrowings);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: {
          member_code: memberCode,
          returnDate: IsNull(),
        },
        relations: ['book', 'member'],
      });
    });
  });

  describe('findActiveBorrowingByBook', () => {
    it('should find active borrowings for a book', async () => {
      // Arrange
      const bookCode = 'JK-45';
      const borrowings: Borrowing[] = [
        createMockBorrowing('1', bookCode, 'M001', false),
      ];
      
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(borrowings);

      // Act
      const result = await repository.findActiveBorrowingByBook(bookCode);

      // Assert
      expect(result).toEqual(borrowings);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: {
          book_code: bookCode,
          returnDate: IsNull(),
        },
        relations: ['book', 'member'],
      });
    });
  });

  describe('save', () => {
    it('should save a borrowing and return it', async () => {
      // Arrange
      const borrowing = createMockBorrowing('1', 'JK-45', 'M001', false);
      
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(borrowing);

      // Act
      const result = await repository.save(borrowing);

      // Assert
      expect(result).toEqual(borrowing);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(borrowing);
    });
  });

  describe('update', () => {
    it('should update a borrowing and find it by id', async () => {
      // Arrange
      const borrowing = createMockBorrowing('1', 'JK-45', 'M001', true);
      
      // Create a mock UpdateResult
      const mockUpdateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: []
      };
      
      jest.spyOn(typeOrmRepository, 'update').mockResolvedValue(mockUpdateResult);
      jest.spyOn(repository, 'findById').mockResolvedValue(borrowing);

      // Act
      const result = await repository.update(borrowing);

      // Assert
      expect(result).toEqual(borrowing);
      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        { id: borrowing.id }, 
        borrowing
      );
      expect(repository.findById).toHaveBeenCalledWith(borrowing.id);
    });
  });
});
