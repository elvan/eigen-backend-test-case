import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../../../domain/entities/book.entity';
import { Member } from '../../../domain/entities/member.entity';
import { Borrowing } from '../../../domain/entities/borrowing.entity';
import { DataSeeder } from './data.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Member, Borrowing])],
  providers: [DataSeeder],
  exports: [DataSeeder],
})
export class SeederModule {}
