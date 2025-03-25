import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { Book } from '../../domain/entities/book.entity';
import { NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Partial<BookRepository>;

  beforeEach(async () => {
    // Mock repository
    bookRepository = {
      findAll: jest.fn(),
      findByCode: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: BookRepository, useValue: bookRepository },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      // Arrange
      const books: Book[] = [
        Object.assign(new Book(), { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 }),
        Object.assign(new Book(), { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 }),
      ];
      
      bookRepository.findAll = jest.fn().mockResolvedValue(books);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBe(books);
      expect(bookRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findByCode', () => {
    it('should return a book when a valid code is provided', async () => {
      // Arrange
      const book = Object.assign(new Book(), { 
        code: 'JK-45', 
        title: 'Harry Potter', 
        author: 'J.K Rowling', 
        stock: 1 
      });
      
      bookRepository.findByCode = jest.fn().mockResolvedValue(book);

      // Act
      const result = await service.findByCode('JK-45');

      // Assert
      expect(result).toBe(book);
      expect(bookRepository.findByCode).toHaveBeenCalledWith('JK-45');
    });

    it('should throw NotFoundException when book is not found', async () => {
      // Arrange
      bookRepository.findByCode = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByCode('NONEXISTENT')).rejects.toThrow(NotFoundException);
      expect(bookRepository.findByCode).toHaveBeenCalledWith('NONEXISTENT');
    });
  });

  describe('create', () => {
    it('should create and return a new book', async () => {
      // Arrange
      const createBookDto = {
        code: 'NEW-1',
        title: 'New Book',
        author: 'New Author',
        stock: 5
      };

      const newBook = Object.assign(new Book(), createBookDto);
      bookRepository.save = jest.fn().mockResolvedValue(newBook);

      // Act
      const result = await service.create(createBookDto);

      // Assert
      expect(result).toBe(newBook);
      expect(bookRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        code: 'NEW-1',
        title: 'New Book',
        author: 'New Author',
        stock: 5
      }));
    });
  });

  describe('update', () => {
    it('should update and return the book with the updated properties', async () => {
      // Arrange
      const existingBook = Object.assign(new Book(), {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1
      });

      const updateBookDto = {
        title: 'Harry Potter Updated',
        stock: 2
      };

      const updatedBook = Object.assign(new Book(), {
        ...existingBook,
        ...updateBookDto
      });

      bookRepository.findByCode = jest.fn().mockResolvedValue(existingBook);
      bookRepository.update = jest.fn().mockResolvedValue(updatedBook);

      // Act
      const result = await service.update('JK-45', updateBookDto);

      // Assert
      expect(result).toBe(updatedBook);
      expect(bookRepository.findByCode).toHaveBeenCalledWith('JK-45');
      expect(bookRepository.update).toHaveBeenCalledWith(expect.objectContaining({
        code: 'JK-45',
        title: 'Harry Potter Updated',
        author: 'J.K Rowling',
        stock: 2
      }));
    });

    it('should only update the specified properties', async () => {
      // Arrange
      const existingBook = Object.assign(new Book(), {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1
      });

      // Only updating the author
      const updateBookDto = {
        author: 'J.K. Rowling (Updated)'
      };

      const updatedBook = Object.assign(new Book(), {
        ...existingBook,
        author: 'J.K. Rowling (Updated)'
      });

      bookRepository.findByCode = jest.fn().mockResolvedValue(existingBook);
      bookRepository.update = jest.fn().mockResolvedValue(updatedBook);

      // Act
      const result = await service.update('JK-45', updateBookDto);

      // Assert
      expect(result).toBe(updatedBook);
      expect(bookRepository.update).toHaveBeenCalledWith(expect.objectContaining({
        code: 'JK-45',
        title: 'Harry Potter', // Unchanged
        author: 'J.K. Rowling (Updated)', // Updated
        stock: 1 // Unchanged
      }));
    });

    it('should throw NotFoundException when trying to update a non-existent book', async () => {
      // Arrange
      bookRepository.findByCode = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(service.update('NONEXISTENT', { title: 'New Title' })).rejects.toThrow(NotFoundException);
      expect(bookRepository.findByCode).toHaveBeenCalledWith('NONEXISTENT');
      expect(bookRepository.update).not.toHaveBeenCalled();
    });
  });
});
