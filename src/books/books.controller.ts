import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common'
import { Book } from './models/book.model'
import { ApiTags } from '@nestjs/swagger'
import {
  CreateBookRequest,
  UpdateBookRequest,
} from 'src/requests/books.requests'
import { BooksService } from './books.service'
import { BooksResponse } from 'src/responses/books.responses'
import {
  SwaggerUpsert,
  SwaggerDelete,
  SwaggerGet,
} from 'src/utils/swagger/swagger.decorators'

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @SwaggerUpsert('Create Book', CreateBookRequest, BooksResponse)
  async create(@Body() createBookRequest: CreateBookRequest): Promise<Book> {
    return this.booksService.create(createBookRequest)
  }

  @Get()
  @SwaggerGet('Get all Books', [BooksResponse])
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll()
  }

  @Get('search/:name')
  @SwaggerGet('Get Books by name', [BooksResponse])
  async findByName(@Query('name') name: string): Promise<Book[]> {
    return this.booksService.findByName(name)
  }

  @Get(':id')
  @SwaggerGet('Get Book by id', BooksResponse)
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id)
  }

  @Put(':id')
  @SwaggerUpsert('Update Book by id', UpdateBookRequest, BooksResponse)
  async update(
    @Param('id') id: string,
    @Body() updateBookRequest: UpdateBookRequest,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookRequest)
  }

  @Delete(':id')
  @SwaggerDelete('Delete Book by id')
  async remove(@Param('id') id: string): Promise<Book> {
    return this.booksService.remove(id)
  }
}
