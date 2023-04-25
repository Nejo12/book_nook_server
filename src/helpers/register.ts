import Validator from 'validator';
import isEmpty from 'is-empty';

import { Errors, UserDocument } from '../types/types';

// Export the func, which takes in data as a parameter (sent from our frontend registration form)
const validateRegisterInput = ({
  firstName,
  lastName,
  email,
  password,
}: UserDocument) => {
  // Instantiate our errors object
  const errors = {} as Errors;
  // Since validator only works with strings, Convert empty fields to an empty string so we can use validator functions
  firstName = !isEmpty(firstName) ? firstName : '';
  lastName = !isEmpty(lastName) ? lastName : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  // Names checks
  if (!Validator.isLength(firstName, { min: 2, max: 20 })) {
    errors.firstName = 'Name must be between 2 to 20 characters long.';
  }
  if (process.env.NODE_ENV !== 'test' && Validator.isEmpty(firstName)) {
    errors.firstName = 'Please fill in your first name.';
  }

  if (!Validator.isLength(lastName, { min: 2, max: 20 })) {
    errors.lastName = 'Name must be between 2 to 20 characters long.';
  }
  if (process.env.NODE_ENV !== 'test' && Validator.isEmpty(lastName)) {
    errors.lastName = 'Please fill in your last name.';
  }

  // Email checks
  if (Validator.isEmpty(email)) {
    errors.email = 'Email is required.';
  } else if (!Validator.isEmail(email)) {
    errors.email = 'Provided eMail is invalid.';
  }

  // Password checks
  if (!Validator.isLength(password, { min: 6, max: 20 })) {
    errors.password = 'Password must be between 6 to 20 characters long.';
  }
  if (Validator.isEmpty(password)) {
    errors.password = 'Password is required.';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateRegisterInput;
