import Book from '../models/Book';

import { BookDocument } from '../types/types';

function findAllBooks(): Promise<BookDocument[]> {
  return Book.find().sort({ title: 1 }).exec();
}

function createBook(book: BookDocument): Promise<BookDocument> {
  return book.save();
}

function findBookById(bookId: string): Promise<BookDocument | null> {
  return Book.findById(bookId).exec();
}

async function updateBook(
  bookId: string,
  update: Partial<BookDocument>,
): Promise<BookDocument> {
  const book = await Book.findById(bookId).exec();
  if (!book) {
    throw new Error(`Book ${bookId} Not Found`);
  }
  if (update.title) {
    book.title = update.title;
  }
  if (update.isbn) {
    book.isbn = update.isbn;
  }
  if (update.author) {
    book.author = update.author;
  }
  if (update.copies) {
    book.copies = update.copies;
  }
  if (update.description) {
    book.description = update.description;
  }
  if (update.publishedDate) {
    book.publishedDate = update.publishedDate;
  }
  if (update.publisher) {
    book.publisher = update.publisher;
  }
  return await book.save();
}

function deleteBook(bookId: string): Promise<BookDocument | null> {
  return Book.findByIdAndDelete(bookId).exec();
}

export default {
  findAllBooks,
  createBook,
  findBookById,
  updateBook,
  deleteBook,
};
