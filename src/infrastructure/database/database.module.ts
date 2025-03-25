import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Book } from '../../domain/entities/book.entity';
import { Member } from '../../domain/entities/member.entity';
import { Borrowing } from '../../domain/entities/borrowing.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'library_management'),
        entities: [Book, Member, Borrowing],
        synchronize: true, // Set to false in production
      }),
    }),
    TypeOrmModule.forFeature([Book, Member, Borrowing]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
