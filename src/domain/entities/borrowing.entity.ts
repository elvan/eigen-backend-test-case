import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Member } from './member.entity';

@Entity('borrowings')
export class Borrowing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, (book) => book.borrowings)
  @JoinColumn({ name: 'book_code' })
  book: Book;

  @Column()
  book_code: string;

  @ManyToOne(() => Member, (member) => member.borrowings)
  @JoinColumn({ name: 'member_code' })
  member: Member;

  @Column()
  member_code: string;

  @CreateDateColumn()
  borrowDate: Date;

  @Column({ nullable: true })
  returnDate: Date | null;

  // Domain methods
  isReturned(): boolean {
    return !!this.returnDate;
  }

  calculateBorrowingDurationDays(): number {
    if (!this.returnDate) {
      return 0;
    }

    const borrowTime = this.borrowDate.getTime();
    const returnTime = this.returnDate.getTime();
    const differenceInMs = returnTime - borrowTime;
    return Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  }

  isPenalized(): boolean {
    const borrowedDays = this.calculateBorrowingDurationDays();
    return borrowedDays > 7; // Penalty if returned after 7 days
  }

  returnBook(): void {
    if (this.returnDate) {
      throw new Error('This book has already been returned');
    }

    this.returnDate = new Date();
  }
}
