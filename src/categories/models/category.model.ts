import { Schema, Document } from 'mongoose'

export interface Category extends Document {
  name: string
}

export const CategorySchema = new Schema<Category>({
  name: { type: String, required: true },
})
