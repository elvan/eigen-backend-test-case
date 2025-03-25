import { Injectable, NotFoundException } from '@nestjs/common';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { Book } from '../../domain/entities/book.entity';
import { CreateBookDto } from '../../presentation/dtos/book.dto';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async findByCode(code: string): Promise<Book> {
    const book = await this.bookRepository.findByCode(code);
    if (!book) {
      throw new NotFoundException(`Book with code ${code} not found`);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = new Book();
    book.code = createBookDto.code;
    book.title = createBookDto.title;
    book.author = createBookDto.author;
    book.stock = createBookDto.stock;
    
    return this.bookRepository.save(book);
  }

  async update(code: string, updateBookDto: Partial<CreateBookDto>): Promise<Book | null> {
    const book = await this.findByCode(code);
    
    if (updateBookDto.title) book.title = updateBookDto.title;
    if (updateBookDto.author) book.author = updateBookDto.author;
    if (updateBookDto.stock !== undefined) book.stock = updateBookDto.stock;
    
    return this.bookRepository.update(book);
  }
}
