import { Module } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { MemberRepository } from './member.repository';
import { BorrowingRepository } from './borrowing.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [BookRepository, MemberRepository, BorrowingRepository],
  exports: [BookRepository, MemberRepository, BorrowingRepository],
})
export class RepositoryModule {}
