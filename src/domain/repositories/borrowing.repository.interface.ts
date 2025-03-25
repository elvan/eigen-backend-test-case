import { Borrowing } from '../entities/borrowing.entity';

export interface IBorrowingRepository {
  findAll(): Promise<Borrowing[]>;
  findById(id: string): Promise<Borrowing | null>;
  findActiveBorrowingsByMember(memberCode: string): Promise<Borrowing[]>;
  findActiveBorrowingByBook(bookCode: string): Promise<Borrowing[]>;
  save(borrowing: Borrowing): Promise<Borrowing>;
  update(borrowing: Borrowing): Promise<Borrowing | null>;
}
