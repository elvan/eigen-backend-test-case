import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { IBorrowingRepository } from '../../domain/repositories/borrowing.repository.interface';

@Injectable()
export class BorrowingRepository implements IBorrowingRepository {
  constructor(
    @InjectRepository(Borrowing)
    private borrowingRepository: Repository<Borrowing>,
  ) {}

  async findAll(): Promise<Borrowing[]> {
    return this.borrowingRepository.find({
      relations: ['book', 'member'],
    });
  }

  async findById(id: string): Promise<Borrowing | null> {
    return this.borrowingRepository.findOne({
      where: { id },
      relations: ['book', 'member'],
    });
  }

  async findActiveBorrowingsByMember(memberCode: string): Promise<Borrowing[]> {
    return this.borrowingRepository.find({
      where: {
        member_code: memberCode,
        returnDate: IsNull(),
      },
      relations: ['book', 'member'],
    });
  }

  async findActiveBorrowingByBook(bookCode: string): Promise<Borrowing[]> {
    return this.borrowingRepository.find({
      where: {
        book_code: bookCode,
        returnDate: IsNull(),
      },
      relations: ['book', 'member'],
    });
  }

  async save(borrowing: Borrowing): Promise<Borrowing> {
    return this.borrowingRepository.save(borrowing);
  }

  async update(borrowing: Borrowing): Promise<Borrowing | null> {
    await this.borrowingRepository.update({ id: borrowing.id }, borrowing);
    return this.findById(borrowing.id);
  }
}
