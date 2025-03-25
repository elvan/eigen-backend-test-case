import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from '../../application/services/book.service';
import { Book } from '../../domain/entities/book.entity';
import { CreateBookDto, UpdateBookDto, BookDto } from '../dtos/book.dto';
import { NotFoundException } from '@nestjs/common';

describe('BookController', () => {
  let controller: BookController;
  let bookService: Partial<BookService>;

  beforeEach(async () => {
    // Mock service
    bookService = {
      findAll: jest.fn(),
      findByCode: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        { provide: BookService, useValue: bookService },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
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
          borrowings: [],
          getAvailableStock: jest.fn().mockReturnValue(1)
        }),
        Object.assign(new Book(), { 
          code: 'SHR-1', 
          title: 'A Study in Scarlet', 
          author: 'Arthur Conan Doyle', 
          stock: 1,
          borrowings: [],
          getAvailableStock: jest.fn().mockReturnValue(1)
        }),
      ];
      
      // Expected DTO response
      const expectedDTOs: BookDto[] = books.map(b => ({
        code: b.code,
        title: b.title,
        author: b.author,
        stock: b.stock,
        availableStock: b.getAvailableStock()
      }));
      
      bookService.findAll = jest.fn().mockResolvedValue(books);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(expectedDTOs);
      expect(bookService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByCode', () => {
    it('should return a book when a valid code is provided', async () => {
      // Arrange
      const book = Object.assign(new Book(), { 
        code: 'JK-45', 
        title: 'Harry Potter', 
        author: 'J.K Rowling', 
        stock: 1,
        borrowings: [],
        getAvailableStock: jest.fn().mockReturnValue(1)
      });
      
      // Expected DTO response
      const expectedDTO: BookDto = {
        code: book.code,
        title: book.title,
        author: book.author,
        stock: book.stock,
        availableStock: book.getAvailableStock()
      };
      
      bookService.findByCode = jest.fn().mockResolvedValue(book);

      // Act
      const result = await controller.findByCode('JK-45');

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(bookService.findByCode).toHaveBeenCalledWith('JK-45');
    });

    it('should throw NotFoundException when book is not found', async () => {
      // Arrange
      bookService.findByCode = jest.fn().mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(controller.findByCode('NONEXISTENT')).rejects.toThrow(NotFoundException);
      expect(bookService.findByCode).toHaveBeenCalledWith('NONEXISTENT');
    });
  });

  describe('create', () => {
    it('should create and return a new book', async () => {
      // Arrange
      const createBookDto: CreateBookDto = {
        code: 'NEW-1',
        title: 'New Book',
        author: 'New Author',
        stock: 5
      };

      const newBook = Object.assign(new Book(), {
        ...createBookDto,
        getAvailableStock: jest.fn().mockReturnValue(5)
      });
      
      // Expected DTO response
      const expectedDTO: BookDto = {
        code: newBook.code,
        title: newBook.title,
        author: newBook.author,
        stock: newBook.stock,
        availableStock: newBook.getAvailableStock()
      };
      
      bookService.create = jest.fn().mockResolvedValue(newBook);

      // Act
      const result = await controller.create(createBookDto);

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(bookService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('update', () => {
    it('should update and return the book with the updated properties', async () => {
      // Arrange
      const existingBook = Object.assign(new Book(), {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
        borrowings: []
      });

      const updateBookDto: UpdateBookDto = {
        title: 'Harry Potter Updated',
        stock: 2
      };

      const updatedBook = Object.assign(new Book(), {
        ...existingBook,
        title: 'Harry Potter Updated',
        stock: 2,
        getAvailableStock: jest.fn().mockReturnValue(2)
      });
      
      // Expected DTO response
      const expectedDTO: BookDto = {
        code: updatedBook.code,
        title: updatedBook.title,
        author: updatedBook.author,
        stock: updatedBook.stock,
        availableStock: updatedBook.getAvailableStock()
      };

      bookService.update = jest.fn().mockResolvedValue(updatedBook);

      // Act
      const result = await controller.update('JK-45', updateBookDto);

      // Assert
      expect(result).toEqual(expectedDTO);
      expect(bookService.update).toHaveBeenCalledWith('JK-45', updateBookDto);
    });

    it('should throw NotFoundException when trying to update a non-existent book', async () => {
      // Arrange
      bookService.update = jest.fn().mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(controller.update('NONEXISTENT', { title: 'New Title' })).rejects.toThrow(NotFoundException);
      expect(bookService.update).toHaveBeenCalledWith('NONEXISTENT', { title: 'New Title' });
    });
  });
});
