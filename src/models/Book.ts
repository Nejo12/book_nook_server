import { Schema, model } from 'mongoose';

import { BookDocument } from '../types/types';

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  copies: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  publisher: {
    type: String,
  },
});

export default model<BookDocument>('Book', bookSchema);
