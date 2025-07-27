import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { ConfigModule } from '@nestjs/config';
import { BooksController } from './books.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BooksProviders } from './books.providers';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [
    ...BooksProviders,
    BooksService
  ],
  controllers: [BooksController],
})
export class BooksModule {}
