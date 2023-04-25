import { Schema, model } from 'mongoose';

import { BorrowDocument } from '../types/types';

const borrowSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default model<BorrowDocument>('Borrow', borrowSchema);
