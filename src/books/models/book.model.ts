import { Schema, Document, Types } from 'mongoose'

export interface Book extends Document {
  name: string
  pageQuantity: number
  author: string
  categoryId: Types.ObjectId
  averageRating: number
  comments: { userId: Types.ObjectId; comment: string }[]
  reviews: { userId: Types.ObjectId; rating: number }[]
}

export const BookSchema = new Schema<Book>({
  name: { type: String, required: true },
  pageQuantity: { type: Number, required: true },
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
      rating: { type: Number, required: true, min: 1, max: 5 },
    },
  ],
})
