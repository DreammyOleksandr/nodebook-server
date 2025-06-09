import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, isValidObjectId } from 'mongoose'
import { Book, BookSearchCriteria } from './models/book.model'
import {
  CreateBookRequest,
  UpdateBookRequest,
} from '../requests/books.requests'
import { SearchContext } from '../search-strategy/search.context'
import { BookSearchStrategyFactory } from './components/books.searchStrategyFactory'
import { ErrorMessages } from 'src/utils/errors/error.messages'

const MODEL_NAME = 'book'
const POPULATE_FIELDS = {
  CATEGORY: 'categoryId',
  COMMENTS: {
    PATH: 'comments.userId',
    SELECT: 'username email',
  },
  REVIEWS: {
    PATH: 'reviews.userId',
    SELECT: 'username email',
  },
}

const validateObjectId = (id: string, errorMsg: string) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestException(errorMsg)
  }
}

const validateRating = (rating: number) => {
  if (rating < 0 || rating > 5) {
    throw new BadRequestException(ErrorMessages.books.INVALID_RATING)
  }
}

const validateExists = <T>(entity: T | null, errorMsg: string) => {
  if (!entity) {
    throw new NotFoundException(errorMsg)
  }
}

const validateAlreadyLiked = (likes: Types.ObjectId[], userId: string) => {
  if (likes.some((likeId) => likeId.toString() === userId)) {
    throw new BadRequestException(ErrorMessages.books.ALREADY_LIKED)
  }
}

const validateNotLiked = (likes: Types.ObjectId[], userId: string) => {
  if (!likes.some((likeId) => likeId.toString() === userId)) {
    throw new BadRequestException(ErrorMessages.books.NOT_LIKED)
  }
}

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(MODEL_NAME) private bookModel: Model<Book>,
    private searchContext: SearchContext,
  ) {}

  private findBookById = async (id: string): Promise<Book> => {
    validateObjectId(id, ErrorMessages.books.INVALID_ID)
    const book = await this.bookModel.findById(id)
    validateExists(book, ErrorMessages.books.NOT_FOUND(id))
    return book
  }

  private populateBook = async (bookQuery: any): Promise<Book[]> => {
    return bookQuery
      .populate(POPULATE_FIELDS.CATEGORY)
      .populate(POPULATE_FIELDS.COMMENTS.PATH, POPULATE_FIELDS.COMMENTS.SELECT)
      .populate(POPULATE_FIELDS.REVIEWS.PATH, POPULATE_FIELDS.REVIEWS.SELECT)
      .exec()
  }

  create = async (createBookRequest: CreateBookRequest): Promise<Book> => {
    const existingBook = await this.bookModel.findOne({
      name: createBookRequest.name,
    })
    if (existingBook) {
      throw new ConflictException(ErrorMessages.books.EXISTS)
    }

    const newBook = (
      await new this.bookModel(createBookRequest).populate(
        POPULATE_FIELDS.CATEGORY,
      )
    ).save()

    return newBook
  }

  findAll = async (): Promise<Book[]> => {
    return this.populateBook(this.bookModel.find())
  }

  searchBooks = async (criteria: BookSearchCriteria): Promise<Book[]> => {
    this.searchContext = new SearchContext()
    const strategies = BookSearchStrategyFactory.createStrategies(criteria)
    this.searchContext.addStrategies(strategies)
    const query = this.searchContext.buildQuery(criteria)
    return this.populateBook(this.bookModel.find(query))
  }

  findOne = async (id: string): Promise<Book> => {
    validateObjectId(id, 'Invalid ID format')
    const book = await this.bookModel
      .findById(id)
      .populate(POPULATE_FIELDS.CATEGORY)
      .populate(POPULATE_FIELDS.COMMENTS.PATH, POPULATE_FIELDS.COMMENTS.SELECT)
      .populate(POPULATE_FIELDS.REVIEWS.PATH, POPULATE_FIELDS.REVIEWS.SELECT)

    validateExists(book, `Book with ID ${id} not found`)
    return book
  }

  update = async (
    id: string,
    updateBookRequest: UpdateBookRequest,
  ): Promise<Book> => {
    validateObjectId(id, ErrorMessages.books.INVALID_ID)

    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookRequest, { new: true })
      .populate(POPULATE_FIELDS.CATEGORY)

    validateExists(updatedBook, ErrorMessages.books.NOT_FOUND(id))
    return updatedBook
  }

  remove = async (id: string): Promise<Book> => {
    const deletedBook = await this.bookModel.findByIdAndDelete(id)
    return deletedBook
  }

  addComment = async (
    bookId: string,
    userId: string,
    comment: string,
  ): Promise<Book> => {
    const book = await this.findBookById(bookId)
    book.comments.push({ userId: new Types.ObjectId(userId), comment })
    return book.save()
  }

  addReview = async (
    bookId: string,
    userId: string,
    rating: number,
    comment: string,
  ): Promise<Book> => {
    validateRating(rating)
    const book = await this.findBookById(bookId)
    const existingReviewIndex = book.reviews.findIndex(
      (review) => review.userId.toString() === userId,
    )

    if (existingReviewIndex > -1) {
      book.reviews[existingReviewIndex].rating = rating
    } else {
      book.reviews.push({ userId: new Types.ObjectId(userId), rating, comment })
    }

    book.averageRating = this.calculateAverageRating(book.reviews)
    return book.save()
  }

  private calculateAverageRating = (reviews: { rating: number }[]): number => {
    let totalRatings = 0
    for (const review of reviews) {
      totalRatings += review.rating
    }
    return reviews.length === 0 ? 0 : totalRatings / reviews.length
  }

  likeBook = async (bookId: string, userId: string): Promise<Book> => {
    const book = await this.findBookById(bookId)
    validateAlreadyLiked(book.likes, userId)
    book.likes.push(new Types.ObjectId(userId))
    return book.save()
  }

  dislikeBook = async (bookId: string, userId: string): Promise<Book> => {
    const book = await this.findBookById(bookId)
    validateNotLiked(book.likes, userId)
    const likeIndex = book.likes.findIndex(
      (likeId) => likeId.toString() === userId,
    )
    book.likes.splice(likeIndex, 1)
    return book.save()
  }

  getLikedBooks = async (userId: string): Promise<Book[]> => {
    validateObjectId(userId, ErrorMessages.books.INVALID_ID)
    return this.populateBook(this.bookModel.find({ likes: userId }))
  }
}
