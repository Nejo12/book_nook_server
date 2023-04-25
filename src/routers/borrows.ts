import express from 'express';

import borrow from '../controllers/borrow';

const router = express.Router();

// @route       POST api/borrows/:userId/:bookId
// @description Add/Save to authenticated user's borrowed list.
// @access      Public
router.post('/', borrow.borrowBook);

// @route       GET api/borrows/all?userId
// @description Get all borrowed books by user
// @access      Private
router.get('/all', borrow.getBorrowedBooks);

// @route       GET api/books/borrow/get/:userId
// @description Get specific borrowed books by user
// @access      Public
router.get('/:userId/:bookId', borrow.getBorrowedBook);

// @route       DELETE api/borrows/delete/bookId/borrow_id
// @description Delete book by id
// @access      Public
router.delete('/delete/:bookId/:borrowId', borrow.deleteBorrowedBook);

export default router;
