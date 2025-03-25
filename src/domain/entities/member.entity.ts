import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Borrowing } from './borrowing.entity';

@Entity('members')
export class Member {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @OneToMany(() => Borrowing, (borrowing) => borrowing.member)
  borrowings: Borrowing[];

  // Domain methods
  getActiveBorrowings(): Borrowing[] {
    return this.borrowings?.filter((borrowing) => !borrowing.returnDate) || [];
  }

  canBorrowBooks(): boolean {
    // Check if member has less than 2 active borrowings
    return this.getActiveBorrowings().length < 2 && !this.isPenalized();
  }

  isPenalized(): boolean | null {
    // Check if member has any active penalties
    const now = new Date();
    const penaltyEndDate = this.calculatePenaltyEndDate();

    return penaltyEndDate && penaltyEndDate > now;
  }

  calculatePenaltyEndDate(): Date | null {
    // Find the most recent penalty (if any)
    const latePenalties =
      this.borrowings
        ?.filter((borrowing) => borrowing.returnDate && borrowing.isPenalized())
        .sort((a, b) => {
          // Ensure both returnDates are not null before comparing
          if (a.returnDate && b.returnDate) {
            return b.returnDate.getTime() - a.returnDate.getTime();
          }
          return 0; // Default case, though we filtered for non-null returnDates above
        }) || [];

    if (latePenalties.length === 0) {
      return null;
    }

    const lastPenalty = latePenalties[0];
    // We know returnDate is not null due to our filter above
    if (!lastPenalty.returnDate) {
      return null;
    }
    
    const penaltyEndDate = new Date(lastPenalty.returnDate);
    penaltyEndDate.setDate(penaltyEndDate.getDate() + 3); // 3-day penalty

    return penaltyEndDate;
  }
}
