import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, isValidObjectId } from 'mongoose'
import { Book } from './models/book.model'
import {
  CreateBookRequest,
  UpdateBookRequest,
} from '../requests/books.requests'
import { SearchContext } from '../search-strategy/search.context'
import { NameSearchStrategy } from '../search-strategy/books/search-name.strategy'
import { AuthorSearchStrategy } from '../search-strategy/books/search-author.strategy'
import { PageQuantitySearchStrategy } from '../search-strategy/books/search-page-quantity.strategy'
import { RatingSearchStrategy } from '../search-strategy/books/search-rating.strategy'

@Injectable()
export class BooksService {
  constructor(
    @InjectModel('book') private bookModel: Model<Book>,
    private searchContext: SearchContext,
  ) {}

  async create(createBookRequest: CreateBookRequest): Promise<Book> {
    const existingBook = await this.bookModel.findOne({
      name: createBookRequest.name,
    })
    if (existingBook) {
      throw new ConflictException('A book with this name already exists')
    }

    const newBook = (
      await new this.bookModel(createBookRequest).populate('categoryId')
    ).save()

    return newBook
  }

  private async populateBook(bookQuery: any): Promise<Book[]> {
    return bookQuery
      .populate('categoryId')
      .populate('comments.userId', 'username email')
      .populate('reviews.userId', 'username email')
      .exec()
  }

  async findAll(): Promise<Book[]> {
    return await this.bookModel
      .find()
      .populate('categoryId')
      .populate('comments.userId', 'username email')
      .populate('reviews.userId', 'username email')
  }

  async searchBooks(params: {
    name?: string
    author?: string
    minPages?: number
    maxPages?: number
    minRating?: number
    maxRating?: number
  }): Promise<Book[]> {
    this.searchContext = new SearchContext()

    if (params.name) {
      this.searchContext.addStrategy(new NameSearchStrategy())
    }

    if (params.author) {
      this.searchContext.addStrategy(new AuthorSearchStrategy())
    }

    if (params.minPages !== undefined || params.maxPages !== undefined) {
      this.searchContext.addStrategy(new PageQuantitySearchStrategy())
    }

    if (params.minRating !== undefined || params.maxRating !== undefined) {
      this.searchContext.addStrategy(new RatingSearchStrategy())
    }

    const query = this.searchContext.buildQuery(params)
    return this.populateBook(this.bookModel.find(query))
  }

  async findOne(id: string): Promise<Book> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const book = await this.populateBook(this.bookModel.findById(id))[0]

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`)
    }
    return book
  }

  async update(
    id: string,
    updateBookRequest: UpdateBookRequest,
  ): Promise<Book> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookRequest, { new: true })
      .populate('categoryId')

    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`)
    }

    return updatedBook
  }

  async remove(id: string): Promise<Book> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const deletedBook = await this.bookModel.findByIdAndDelete(id)
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`)
    }

    return deletedBook
  }
  async addComment(
    bookId: string,
    userId: string,
    comment: string,
  ): Promise<Book> {
    if (!isValidObjectId(bookId)) {
      throw new BadRequestException('Invalid Book ID format')
    }

    const book = await this.bookModel.findById(bookId)
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`)
    }

    book.comments.push({ userId: new Types.ObjectId(userId), comment })
    return await book.save()
  }

  async addReview(
    bookId: string,
    userId: string,
    rating: number,
    comment: string,
  ): Promise<Book> {
    if (!isValidObjectId(bookId)) {
      throw new BadRequestException('Invalid Book ID format')
    }
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5')
    }

    const book = await this.bookModel.findById(bookId)
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`)
    }

    const existingReviewIndex = book.reviews.findIndex(
      (review) => review.userId.toString() === userId,
    )

    if (existingReviewIndex > -1) {
      book.reviews[existingReviewIndex].rating = rating
    } else {
      book.reviews.push({ userId: new Types.ObjectId(userId), rating, comment })
    }

    const totalRatings = book.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    )
    book.averageRating = totalRatings / book.reviews.length

    return await book.save()
  }

  async likeBook(bookId: string, userId: string): Promise<Book> {
    if (!isValidObjectId(bookId)) {
      throw new BadRequestException('Invalid Book ID format')
    }

    const book = await this.bookModel.findById(bookId)
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`)
    }

    if (book.likes.includes(new Types.ObjectId(userId))) {
      throw new BadRequestException('You have already liked this book')
    }

    book.likes.push(new Types.ObjectId(userId))
    return await book.save()
  }

  async dislikeBook(bookId: string, userId: string): Promise<Book> {
    if (!isValidObjectId(bookId)) {
      throw new BadRequestException('Invalid Book ID format')
    }

    const book = await this.bookModel.findById(bookId)
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`)
    }

    const likeIndex = book.likes.indexOf(new Types.ObjectId(userId))
    if (likeIndex === -1) {
      throw new BadRequestException('You have not liked this book yet')
    }

    book.likes.splice(likeIndex, 1)
    return await book.save()
  }

  async getLikedBooks(userId: string): Promise<Book[]> {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('Invalid User ID format')
    }

    const books = await this.bookModel
      .find({ likes: userId })
      .populate('categoryId')
      .populate('comments.userId', 'username email')
      .populate('reviews.userId', 'username email')

    return books
  }
}
