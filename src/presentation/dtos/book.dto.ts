import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
  @ApiProperty({ description: 'Unique book code', example: 'JK-45' })
  code: string;

  @ApiProperty({ description: 'Book title', example: 'Harry Potter' })
  title: string;

  @ApiProperty({ description: 'Book author', example: 'J.K Rowling' })
  author: string;

  @ApiProperty({ description: 'Total stock', example: 1 })
  stock: number;

  @ApiProperty({ description: 'Available stock (not borrowed)', example: 1 })
  availableStock: number;
}

export class CreateBookDto {
  @ApiProperty({ description: 'Unique book code', example: 'JK-45' })
  code: string;

  @ApiProperty({ description: 'Book title', example: 'Harry Potter' })
  title: string;

  @ApiProperty({ description: 'Book author', example: 'J.K Rowling' })
  author: string;

  @ApiProperty({ description: 'Total stock', example: 1 })
  stock: number;
}

export class UpdateBookDto {
  @ApiProperty({ description: 'Book title', example: 'Harry Potter', required: false })
  title?: string;

  @ApiProperty({ description: 'Book author', example: 'J.K Rowling', required: false })
  author?: string;

  @ApiProperty({ description: 'Total stock', example: 1, required: false })
  stock?: number;
}
