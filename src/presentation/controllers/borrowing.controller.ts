import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BorrowingService } from '../../application/services/borrowing.service';
import {
  BorrowBookDto,
  ReturnBookDto,
  BorrowingDto,
} from '../dtos/borrowing.dto';

@ApiTags('borrowings')
@Controller('borrowings')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @ApiOperation({ summary: 'Get all borrowings' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all borrowings',
    type: [BorrowingDto],
  })
  @Get()
  async findAll(): Promise<BorrowingDto[]> {
    const borrowings = await this.borrowingService.findAll();

    return borrowings.map((borrowing) => ({
      id: borrowing.id,
      bookCode: borrowing.book_code,
      memberCode: borrowing.member_code,
      borrowDate: borrowing.borrowDate,
      returnDate: borrowing.returnDate,
    }));
  }

  @ApiOperation({ summary: 'Get a borrowing by ID' })
  @ApiParam({ name: 'id', description: 'Borrowing ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a borrowing by ID',
    type: BorrowingDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Borrowing not found',
  })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<BorrowingDto> {
    const borrowing = await this.borrowingService.findById(id);

    return {
      id: borrowing.id,
      bookCode: borrowing.book_code,
      memberCode: borrowing.member_code,
      borrowDate: borrowing.borrowDate,
      returnDate: borrowing.returnDate,
    };
  }

  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Book borrowed successfully',
    type: BorrowingDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Cannot borrow book (already borrowed, member has reached limit, or member is penalized)',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Book or member not found',
  })
  @Post('borrow')
  async borrowBook(
    @Body() borrowBookDto: BorrowBookDto,
  ): Promise<BorrowingDto> {
    const borrowing = await this.borrowingService.borrowBook(borrowBookDto);

    return {
      id: borrowing.id,
      bookCode: borrowing.book_code,
      memberCode: borrowing.member_code,
      borrowDate: borrowing.borrowDate,
      returnDate: borrowing.returnDate,
    };
  }

  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book returned successfully',
    type: BorrowingDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Book already returned',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Borrowing not found',
  })
  @Post('return')
  async returnBook(
    @Body() returnBookDto: ReturnBookDto,
  ): Promise<BorrowingDto | null> {
    const borrowing = await this.borrowingService.returnBook(returnBookDto);

    if (borrowing) {
      return {
        id: borrowing.id,
        bookCode: borrowing.book_code,
        memberCode: borrowing.member_code,
        borrowDate: borrowing.borrowDate,
        returnDate: borrowing.returnDate,
      };
    }
    return null;
  }

  @ApiOperation({ summary: 'Get active borrowings by member code' })
  @ApiParam({ name: 'memberCode', description: 'Member code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all active borrowings for a member',
    type: [BorrowingDto],
  })
  @Get('member/:memberCode')
  async getActiveBorrowingsByMember(
    @Param('memberCode') memberCode: string,
  ): Promise<BorrowingDto[]> {
    const borrowings =
      await this.borrowingService.getActiveBorrowingsByMember(memberCode);

    return borrowings.map((borrowing) => ({
      id: borrowing.id,
      bookCode: borrowing.book_code,
      memberCode: borrowing.member_code,
      borrowDate: borrowing.borrowDate,
      returnDate: borrowing.returnDate,
    }));
  }
}
