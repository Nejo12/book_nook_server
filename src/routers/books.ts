import express from 'express';

import book from '../controllers/book';
import roles from '../middlewares/roles';
import auth from '../middlewares/auth';

const router = express.Router();

// @route       GET api/books
// @description get all books
// @access      Public
router.get('/', book.allBooks);

// @route       POST api/books
// @description add/create/save book
// @access      Private
router.post(
  '/',
  // auth,
  // roles.grantAccess('createOwn', 'profile'),
  book.createBook,
);

// @route       GET api/books/:id
// @description get single book by id
// @access      Public
router.get('/:bookId', book.getBook);

// @route       PUT api/books/:id
// @description edit specific book by its Id
// @access      Private
router.put(
  '/:bookId',
  // auth,
  // roles.grantAccess('updateAny', 'profile'),
  book.updateBook,
);

// @route       DELETE api/books/:id
// @description delete book by id
// @access      Private
router.delete(
  '/:bookId',
  // auth,
  // roles.grantAccess('deleteAny', 'profile'),
  book.deleteBook,
);

export default router;
