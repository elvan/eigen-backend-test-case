import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { MemberController } from './member.controller';
import { BorrowingController } from './borrowing.controller';
import { ServiceModule } from '../../application/services/service.module';

@Module({
  imports: [ServiceModule],
  controllers: [BookController, MemberController, BorrowingController],
})
export class ControllerModule {}
