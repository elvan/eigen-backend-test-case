import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { BorrowingRepository } from '../../infrastructure/repositories/borrowing.repository';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { BorrowBookDto, ReturnBookDto } from '../../presentation/dtos/borrowing.dto';

@Injectable()
export class BorrowingService {
  constructor(
    private readonly borrowingRepository: BorrowingRepository,
    private readonly bookRepository: BookRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async findAll(): Promise<Borrowing[]> {
    return this.borrowingRepository.findAll();
  }

  async findById(id: string): Promise<Borrowing> {
    const borrowing = await this.borrowingRepository.findById(id);
    if (!borrowing) {
      throw new NotFoundException(`Borrowing with ID ${id} not found`);
    }
    return borrowing;
  }

  async borrowBook(borrowBookDto: BorrowBookDto): Promise<Borrowing> {
    const { bookCode, memberCode } = borrowBookDto;
    
    // Get book and member with their relations
    const book = await this.bookRepository.findByCode(bookCode);
    if (!book) {
      throw new NotFoundException(`Book with code ${bookCode} not found`);
    }
    
    const member = await this.memberRepository.findByCode(memberCode);
    if (!member) {
      throw new NotFoundException(`Member with code ${memberCode} not found`);
    }
    
    // Check if the book is available
    if (!book.isAvailable()) {
      throw new BadRequestException(`Book ${book.title} is not available for borrowing`);
    }
    
    // Check if the member can borrow more books
    if (!member.canBorrowBooks()) {
      if (member.isPenalized()) {
        throw new BadRequestException(`Member ${member.name} is currently penalized and cannot borrow books`);
      } else {
        throw new BadRequestException(`Member ${member.name} has already borrowed the maximum number of books (2)`);
      }
    }
    
    // Create the borrowing record
    const borrowing = new Borrowing();
    borrowing.book = book;
    borrowing.book_code = bookCode;
    borrowing.member = member;
    borrowing.member_code = memberCode;
    borrowing.borrowDate = new Date();
    
    return this.borrowingRepository.save(borrowing);
  }

  async returnBook(returnBookDto: ReturnBookDto): Promise<Borrowing | null> {
    const { borrowingId } = returnBookDto;
    
    // Get the borrowing record with relations
    const borrowing = await this.borrowingRepository.findById(borrowingId);
    if (!borrowing) {
      throw new NotFoundException(`Borrowing with ID ${borrowingId} not found`);
    }
    
    // Check if book is already returned
    if (borrowing.returnDate) {
      throw new BadRequestException('This book has already been returned');
    }
    
    // Update return date
    borrowing.returnBook();
    
    // Save and return the updated borrowing
    return this.borrowingRepository.update(borrowing);
  }

  async getActiveBorrowingsByMember(memberCode: string): Promise<Borrowing[]> {
    return this.borrowingRepository.findActiveBorrowingsByMember(memberCode);
  }

  async getActiveBorrowingsByBook(bookCode: string): Promise<Borrowing[]> {
    return this.borrowingRepository.findActiveBorrowingByBook(bookCode);
  }
}
