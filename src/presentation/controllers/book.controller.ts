import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookService } from '../../application/services/book.service';
import { CreateBookDto, BookDto } from '../dtos/book.dto';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all books with their available quantities',
    type: [BookDto],
  })
  @Get()
  async findAll(): Promise<BookDto[]> {
    const books = await this.bookService.findAll();
    return books.map((book) => ({
      code: book.code,
      title: book.title,
      author: book.author,
      stock: book.stock,
      availableStock: book.getAvailableStock(),
    }));
  }

  @ApiOperation({ summary: 'Get a book by code' })
  @ApiParam({ name: 'code', description: 'Book code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a book by code',
    type: BookDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  @Get(':code')
  async findByCode(@Param('code') code: string): Promise<BookDto> {
    const book = await this.bookService.findByCode(code);
    return {
      code: book.code,
      title: book.title,
      author: book.author,
      stock: book.stock,
      availableStock: book.getAvailableStock(),
    };
  }

  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Book created successfully',
    type: BookDto,
  })
  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<BookDto> {
    const book = await this.bookService.create(createBookDto);
    return {
      code: book.code,
      title: book.title,
      author: book.author,
      stock: book.stock,
      availableStock: book.getAvailableStock(),
    };
  }

  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'code', description: 'Book code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book updated successfully',
    type: BookDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() updateBookDto: Partial<CreateBookDto>,
  ): Promise<BookDto | null> {
    const book = await this.bookService.update(code, updateBookDto);

    if (book) {
      return {
        code: book.code,
        title: book.title,
        author: book.author,
        stock: book.stock,
        availableStock: book.getAvailableStock(),
      };
    }
    return null;
  }
}
