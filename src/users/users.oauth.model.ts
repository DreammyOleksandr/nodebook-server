import * as mongoose from 'mongoose'

export const OAuthUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
      enum: ['GOOGLE'],
    },
  },
  { timestamps: true },
)

export interface OAuthUser extends mongoose.Document {
  _id: string
  email: string
  username: string
  service: string
}
