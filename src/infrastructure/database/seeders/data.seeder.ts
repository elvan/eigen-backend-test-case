import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../../../domain/entities/book.entity';
import { Member } from '../../../domain/entities/member.entity';

@Injectable()
export class DataSeeder {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async seed() {
    const hasBooks = (await this.bookRepository.count()) > 0;
    const hasMembers = (await this.memberRepository.count()) > 0;

    if (!hasBooks) {
      await this.seedBooks();
    }

    if (!hasMembers) {
      await this.seedMembers();
    }
  }

  private async seedBooks() {
    const books = [
      {
        code: 'JK-45',
        title: 'Harry Potter',
        author: 'J.K Rowling',
        stock: 1,
      },
      {
        code: 'SHR-1',
        title: 'A Study in Scarlet',
        author: 'Arthur Conan Doyle',
        stock: 1,
      },
      {
        code: 'TW-11',
        title: 'Twilight',
        author: 'Stephenie Meyer',
        stock: 1,
      },
      {
        code: 'HOB-83',
        title: 'The Hobbit, or There and Back Again',
        author: 'J.R.R. Tolkien',
        stock: 1,
      },
      {
        code: 'NRN-7',
        title: 'The Lion, the Witch and the Wardrobe',
        author: 'C.S. Lewis',
        stock: 1,
      },
    ];

    await this.bookRepository.save(books);
    console.log('Seed books completed');
  }

  private async seedMembers() {
    const members = [
      {
        code: 'M001',
        name: 'Angga',
      },
      {
        code: 'M002',
        name: 'Ferry',
      },
      {
        code: 'M003',
        name: 'Putri',
      },
    ];

    await this.memberRepository.save(members);
    console.log('Seed members completed');
  }
}
