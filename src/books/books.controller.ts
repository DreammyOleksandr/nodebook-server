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
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger'
import {
  CreateBookRequest,
  UpdateBookRequest,
} from 'src/requests/books.requests'
import { BooksService } from './books.service'

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create Book' })
  @ApiBody({ type: CreateBookRequest })
  async create(@Body() createBookRequest: CreateBookRequest): Promise<Book> {
    return this.booksService.create(createBookRequest)
  }

  @Get()
  @ApiOperation({ summary: 'Get all Books' })
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll()
  }

  @Get('search/:name')
  @ApiOperation({ summary: 'Get Books by name' })
  async findByName(@Query('name') name: string): Promise<Book[]> {
    return this.booksService.findByName(name)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Book by id' })
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Book by id' })
  @ApiBody({ type: UpdateBookRequest })
  async update(
    @Param('id') id: string,
    @Body() updateBookRequest: UpdateBookRequest,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookRequest)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Book by id' })
  async remove(@Param('id') id: string): Promise<Book> {
    return this.booksService.remove(id)
  }
}
