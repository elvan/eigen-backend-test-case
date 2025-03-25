import { Book } from '../entities/book.entity';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByCode(code: string): Promise<Book | null>;
  save(book: Book): Promise<Book>;
  update(book: Book): Promise<Book | null>;
}
