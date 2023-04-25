import express from 'express';

import user from '../controllers/user';
import auth from '../middlewares/auth';
import roles from '../middlewares/roles';

const router = express.Router();

// @route       POST api/users/register
// @description register a new user
// @access      Public
router.post('/register', user.register);

// @route       POST api/users/login
// @description login a registered user
// @access      Public
router.post('/login', user.login);

// @route       GET api/users
// @description Get all registered user
// @access      Private
router.get('/', user.getUsers);

// @route       GET api/users/:userId
// @description Get one registered user
// @access      Private
router.get('/:userId', user.getUser);

// @route       DELETE api/users/:userId
// @description Remove one registered user
// @access      Private
router.delete(
  '/:userId',
  auth,
  roles.grantAccess('deleteAny', 'profile'),
  user.deleteUser,
);

// @route       PATCH api/users/update/:userId
// @description update user's credentials
// @access      Private
router.patch(
  '/:userId',
  auth,
  roles.grantAccess('updateAny', 'profile'),
  user.updateCredentials,
);

// @route       POST api/users/logout
// @description Log out a logged in user
// @access      Public
router.get('/logout', user.logout);

export default router;
