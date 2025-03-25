import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Borrowing } from './borrowing.entity';

@Entity('books')
export class Book {
  @PrimaryColumn()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.book)
  borrowings: Borrowing[];

  // Domain methods
  isAvailable(): boolean {
    return this.getAvailableStock() > 0;
  }

  getAvailableStock(): number {
    // Filter active borrowings (those that haven't been returned)
    const activeBorrowings =
      this.borrowings?.filter((b) => !b.returnDate) || [];
    return this.stock - activeBorrowings.length;
  }
}
