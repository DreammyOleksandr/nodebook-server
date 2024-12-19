import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  Patch,
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
import { AuthenticatedGuard } from 'src/auth/authenticated.guard'
import {
  AddCommentRequest,
  AddRatingRequest,
} from 'src/requests/reviews.requests'

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

  @Patch(':id')
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

  @Post(':id/comment')
  @UseGuards(AuthenticatedGuard)
  @SwaggerUpsert('Add comment to the book', AddCommentRequest, BooksResponse)
  async addComment(
    @Param('id') bookId: string,
    @Body() comment: AddCommentRequest,
    @Req() req,
  ): Promise<Book> {
    console.log(`This is a comment: ${comment.comment}`)
    return this.booksService.addComment(
      bookId,
      req.user.userId,
      comment.comment,
    )
  }

  @Post(':id/review')
  @UseGuards(AuthenticatedGuard)
  @SwaggerUpsert('Add rating to the book', AddRatingRequest, BooksResponse)
  async addReview(
    @Param('id') bookId: string,
    @Body() rating: AddRatingRequest,
    @Req() req,
  ): Promise<Book> {
    return this.booksService.addReview(bookId, req.user.userId, rating.rating)
  }
}
