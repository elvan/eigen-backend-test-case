import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../domain/entities/book.entity';
import { IBookRepository } from '../../domain/repositories/book.repository.interface';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      relations: ['borrowings'],
    });
  }

  async findByCode(code: string): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { code },
      relations: ['borrowings'],
    });
  }

  async save(book: Book): Promise<Book> {
    return this.bookRepository.save(book);
  }

  async update(book: Book): Promise<Book | null> {
    await this.bookRepository.update({ code: book.code }, book);
    return this.findByCode(book.code);
  }
}
