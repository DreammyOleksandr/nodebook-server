import { Schema, Document, Types } from 'mongoose'

export interface Book extends Document {
  name: string
  pageQuantity: number
  author: string
  categoryId: Types.ObjectId
  averageRating: number
}

export const BookSchema = new Schema<Book>({
  name: { type: String, required: true },
  pageQuantity: { type: Number, required: true },
  author: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'category', required: true },
  averageRating: { type: Number, default: 0 },
})
