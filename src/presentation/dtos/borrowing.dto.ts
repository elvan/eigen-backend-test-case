import { ApiProperty } from '@nestjs/swagger';

export class BorrowingDto {
  @ApiProperty({ description: 'Borrowing ID', example: 'a1b2c3d4-e5f6-g7h8-i9j0' })
  id: string;

  @ApiProperty({ description: 'Book code', example: 'JK-45' })
  bookCode: string;

  @ApiProperty({ description: 'Member code', example: 'M001' })
  memberCode: string;

  @ApiProperty({ description: 'Borrowing date', example: '2025-03-20T10:30:00Z' })
  borrowDate: Date;

  @ApiProperty({ description: 'Return date (null if not returned yet)', example: null, required: false })
  returnDate: Date | null;
}

export class BorrowBookDto {
  @ApiProperty({ description: 'Book code to borrow', example: 'JK-45' })
  bookCode: string;

  @ApiProperty({ description: 'Member code who is borrowing', example: 'M001' })
  memberCode: string;
}

export class ReturnBookDto {
  @ApiProperty({ description: 'Borrowing ID', example: 'a1b2c3d4-e5f6-g7h8-i9j0' })
  borrowingId: string;
}
