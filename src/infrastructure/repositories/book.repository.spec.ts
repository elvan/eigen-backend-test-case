import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookRepository } from './book.repository';
import { Book } from '../../domain/entities/book.entity';

describe('BookRepository', () => {
  let repository: BookRepository;
  let typeOrmRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookRepository,
        {
          provide: getRepositoryToken(Book),
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

    repository = module.get<BookRepository>(BookRepository);
    typeOrmRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      // Arrange
      const books: Book[] = [
        Object.assign(new Book(), {
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K Rowling',
          stock: 1,
          borrowings: []
        }),
        Object.assign(new Book(), {
          code: 'SHR-1',
          title: 'A Study in Scarlet',
          author: 'Arthur Conan Doyle',
          stock: 1,
          borrowings: []
        }),
      ];
      
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(books);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toEqual(books);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        relations: ['borrowings'],
      });
    });
  });

  describe('findByCode', () => {
    it('should find a book by code', async () => {
      // Arrange
      const book = Object.assign(new Book(), {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
        borrowings: []
      });
      
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(book);

      // Act
      const result = await repository.findByCode('JK-45');

      // Assert
      expect(result).toEqual(book);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'JK-45' },
        relations: ['borrowings'],
      });
    });

    it('should return null when book is not found', async () => {
      // Arrange
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);

      // Act
      const result = await repository.findByCode('NONEXISTENT');

      // Assert
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { code: 'NONEXISTENT' },
        relations: ['borrowings'],
      });
    });
  });

  describe('save', () => {
    it('should save a book and return it', async () => {
      // Arrange
      const book = Object.assign(new Book(), {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
      });
      
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(book);

      // Act
      const result = await repository.save(book);

      // Assert
      expect(result).toEqual(book);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(book);
    });
  });

  describe('update', () => {
    it('should update a book and return it', async () => {
      // Arrange
      const book = Object.assign(new Book(), {
        code: 'JK-45',
        title: 'Harry Potter Updated',
        author: 'J.K Rowling',
        stock: 2,
      });
      
      // Mock the update method to return a valid UpdateResult
      const mockUpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: []
      };
      
      jest.spyOn(typeOrmRepository, 'update').mockResolvedValue(mockUpdateResult);
      jest.spyOn(repository, 'findByCode').mockResolvedValue(book);

      // Act
      const result = await repository.update(book);

      // Assert
      expect(result).toEqual(book);
      expect(typeOrmRepository.update).toHaveBeenCalledWith(
        { code: book.code }, 
        book
      );
      expect(repository.findByCode).toHaveBeenCalledWith(book.code);
    });
  });
});
