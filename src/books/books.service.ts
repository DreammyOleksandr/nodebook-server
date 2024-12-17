import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId } from 'mongoose'
import { Book } from './models/book.model'
import {
  CreateBookRequest,
  UpdateBookRequest,
} from 'src/requests/books.requests'

@Injectable()
export class BooksService {
  constructor(@InjectModel('book') private bookModel: Model<Book>) {}

  async create(createBookRequest: CreateBookRequest): Promise<Book> {
    const existingBook = await this.bookModel.findOne({
      name: createBookRequest.name,
    })
    if (existingBook) {
      throw new ConflictException('A book with this name already exists')
    }

    const newBook = new this.bookModel(createBookRequest)
    return await newBook.save()
  }

  async findAll(): Promise<Book[]> {
    return await this.bookModel.find().populate('categoryId')
  }

  async findByName(name: string): Promise<Book[]> {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Name query cannot be empty')
    }

    return await this.bookModel
      .find({
        name: { $regex: name, $options: 'i' },
      })
      .populate('categoryId')
  }

  async findOne(id: string): Promise<Book> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format')
    }

    const book = await this.bookModel.findById(id).populate('categoryId')
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

    const updatedBook = await this.bookModel.findByIdAndUpdate(
      id,
      updateBookRequest,
      { new: true },
    )

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
}
