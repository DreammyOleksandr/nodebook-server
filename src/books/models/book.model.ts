import { Schema, Document, Types } from 'mongoose'

export interface Book extends Document {
  name: string
  pageQuantity: number
  description: string
  author: string
  categoryId: Types.ObjectId
  averageRating: number
  comments: { userId: Types.ObjectId; comment: string }[]
  reviews: { userId: Types.ObjectId; rating: number; comment: string }[]
  likes: Types.ObjectId[]
}

export const BookSchema = new Schema<Book>({
  name: { type: String, required: true },
  pageQuantity: { type: Number, required: true },
  description: { type: String, required: false },
  author: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'category', required: true },
  averageRating: { type: Number, default: 0 },
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
      comment: { type: String, required: true },
    },
  ],
  reviews: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
      rating: { type: Number, required: true, min: 0, max: 5 },
      comment: { type: String, required: false },
    },
  ],
  likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
})

export type BookSearchCriteria = {
  name?: string
  author?: string
  minPages?: number
  maxPages?: number
  minRating?: number
  maxRating?: number
}

export class BookSearchCriteriaBuilder {
  private criteria: BookSearchCriteria = {}

  setName(name?: string): this {
    if (name) this.criteria.name = name
    return this
  }

  setAuthor(author?: string): this {
    if (author) this.criteria.author = author
    return this
  }

  setMinPages(minPages?: number): this {
    if (minPages !== undefined) this.criteria.minPages = minPages
    return this
  }

  setMaxPages(maxPages?: number): this {
    if (maxPages !== undefined) this.criteria.maxPages = maxPages
    return this
  }

  setMinRating(minRating?: number): this {
    if (minRating !== undefined) this.criteria.minRating = minRating
    return this
  }

  setMaxRating(maxRating?: number): this {
    if (maxRating !== undefined) this.criteria.maxRating = maxRating
    return this
  }

  build(): BookSearchCriteria {
    const criteria = { ...this.criteria }
    return Object.fromEntries(
      Object.entries(criteria).filter((v) => v !== undefined),
    )
  }
}
