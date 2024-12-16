import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Book } from './models/book.model'
import {
  CreateBookRequest,
  UpdateBookRequest,
} from 'src/requests/books.requests'

@Injectable()
export class BooksService {
  constructor(@InjectModel('book') private bookModel: Model<Book>) {}

  async create(createBookRequest: CreateBookRequest): Promise<Book> {
    const newBook = new this.bookModel(createBookRequest)
    return await newBook.save()
  }

  async findAll(): Promise<Book[]> {
    return await this.bookModel.find()
  }

  async findByName(name: string): Promise<Book[]> {
    return await this.bookModel.find({
      name: { $regex: name, $options: 'i' },
    })
  }

  async findOne(id: string): Promise<Book> {
    return await this.bookModel.findById(id)
  }

  async update(
    id: string,
    updateBookRequest: UpdateBookRequest,
  ): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, updateBookRequest, {
      new: true,
    })
  }

  async remove(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id)
  }
}
