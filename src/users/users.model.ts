import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export interface User extends mongoose.Document {
  _id: string
  email: string
  username: string
  password: string
}
