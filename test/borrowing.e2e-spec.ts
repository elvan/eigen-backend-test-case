import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../src/domain/entities/book.entity';
import { Member } from '../src/domain/entities/member.entity';
import { Borrowing } from '../src/domain/entities/borrowing.entity';

describe('BorrowingController (e2e)', () => {
  let app: INestApplication;
  let bookRepository: Repository<Book>;
  let memberRepository: Repository<Member>;
  let borrowingRepository: Repository<Borrowing>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    bookRepository = moduleFixture.get(getRepositoryToken(Book));
    memberRepository = moduleFixture.get(getRepositoryToken(Member));
    borrowingRepository = moduleFixture.get(getRepositoryToken(Borrowing));
  });

  beforeEach(async () => {
    // Clear the database before each test
    await borrowingRepository.query('DELETE FROM borrowings');
    await bookRepository.query('DELETE FROM books');
    await memberRepository.query('DELETE FROM members');

    // Seed test data
    const book = new Book();
    book.code = 'TEST-1';
    book.title = 'Test Book 1';
    book.author = 'Test Author';
    book.stock = 1;
    await bookRepository.save(book);

    const book2 = new Book();
    book2.code = 'TEST-2';
    book2.title = 'Test Book 2';
    book2.author = 'Test Author 2';
    book2.stock = 1;
    await bookRepository.save(book2);

    const book3 = new Book();
    book3.code = 'TEST-3';
    book3.title = 'Test Book 3';
    book3.author = 'Test Author 3';
    book3.stock = 1;
    await bookRepository.save(book3);

    const member = new Member();
    member.code = 'M001';
    member.name = 'Test Member';
    await memberRepository.save(member);
  });

  it('/borrowings/borrow (POST) - should be able to borrow a book', async () => {
    const response = await request(app.getHttpServer())
      .post('/borrowings/borrow')
      .send({
        bookCode: 'TEST-1',
        memberCode: 'M001',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('bookCode', 'TEST-1');
    expect(response.body).toHaveProperty('memberCode', 'M001');
    expect(response.body).toHaveProperty('borrowDate');
    expect(response.body).toHaveProperty('returnDate', null);
  });

  it('/borrowings/borrow (POST) - should not allow borrowing more than 2 books', async () => {
    // Borrow first book
    await request(app.getHttpServer())
      .post('/borrowings/borrow')
      .send({
        bookCode: 'TEST-1',
        memberCode: 'M001',
      })
      .expect(201);

    // Borrow second book
    await request(app.getHttpServer())
      .post('/borrowings/borrow')
      .send({
        bookCode: 'TEST-2',
        memberCode: 'M001',
      })
      .expect(201);

    // Try to borrow third book - should fail
    const response = await request(app.getHttpServer())
      .post('/borrowings/borrow')
      .send({
        bookCode: 'TEST-3',
        memberCode: 'M001',
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('maximum number of books');
  });

  it('/borrowings/borrow (POST) - should not allow borrowing already borrowed books', async () => {
    // Borrow book
    await request(app.getHttpServer())
      .post('/borrowings/borrow')
      .send({
        bookCode: 'TEST-1',
        memberCode: 'M001',
      })
      .expect(201);

    // Add another member
    const member2 = new Member();
    member2.code = 'M002';
    member2.name = 'Test Member 2';
    await memberRepository.save(member2);

    // Try to borrow the same book with another member - should fail
    const response = await request(app.getHttpServer())
      .post('/borrowings/borrow')
      .send({
        bookCode: 'TEST-1',
        memberCode: 'M002',
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('not available');
  });

  it('/borrowings/return (POST) - should be able to return a book', async () => {
    // Borrow book
    const borrowResponse = await request(app.getHttpServer())
      .post('/borrowings/borrow')
      .send({
        bookCode: 'TEST-1',
        memberCode: 'M001',
      })
      .expect(201);

    const borrowingId = borrowResponse.body.id;

    // Return book
    const returnResponse = await request(app.getHttpServer())
      .post('/borrowings/return')
      .send({
        borrowingId,
      })
      .expect(200);

    expect(returnResponse.body).toHaveProperty('id', borrowingId);
    expect(returnResponse.body).toHaveProperty('bookCode', 'TEST-1');
    expect(returnResponse.body).toHaveProperty('memberCode', 'M001');
    expect(returnResponse.body).toHaveProperty('borrowDate');
    expect(returnResponse.body).toHaveProperty('returnDate');
    expect(returnResponse.body.returnDate).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
