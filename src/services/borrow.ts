import Borrow from '../models/Borrow';

import { BorrowDocument } from '../types/types';

// adds to borrowed List
const addBorrow = async (userId: string, bookId: string) => {
  const borrowDoc = new Borrow({
    bookId,
    userId,
  });
  borrowDoc.save();
  return borrowDoc; // to be useable in controllers
};

// Find one book borrowed by userID
const findBorrowedBookByUserId = async (
  userId: string,
  bookId: string,
): Promise<BorrowDocument> => {
  return (await Borrow.findOne({ userId, bookId }).exec()) as BorrowDocument;
};

// Find all books borrowed by userID
const findBorrowedBooksByUserId = async (
  userId: string,
): Promise<BorrowDocument[]> => {
  if (!userId) {
    throw new Error('Book not found in borrowed books');
  }
  return (await Borrow.find({ userId })
    .sort({ timestamps: -1 })
    .exec()) as BorrowDocument[];
};

// Removes from borrowed List
const deleteBorrowed = (borrowId: string): Promise<BorrowDocument | null> => {
  if (!borrowId) {
    throw new Error('Book not found in borrowed books');
  }
  return Borrow.findByIdAndRemove(borrowId).exec();
};

export default {
  addBorrow,
  deleteBorrowed,
  findBorrowedBookByUserId,
  findBorrowedBooksByUserId,
};
