import * as mongoose from 'mongoose'
export const OAuthUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: false,
    },
    service: {
      type: String,
      required: true,
      unique: false,
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
