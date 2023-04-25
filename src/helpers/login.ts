import Validator from 'validator';
import isEmpty from 'is-empty';

import { Errors, UserDocument } from '../types/types';

const validateLoginInput = ({ email, password }: UserDocument) => {
  // Instantiate our errors object
  const errors = {} as Errors;

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

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

export default validateLoginInput;
