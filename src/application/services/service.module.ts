import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { MemberService } from './member.service';
import { BorrowingService } from './borrowing.service';
import { RepositoryModule } from '../../infrastructure/repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [BookService, MemberService, BorrowingService],
  exports: [BookService, MemberService, BorrowingService],
})
export class ServiceModule {}
