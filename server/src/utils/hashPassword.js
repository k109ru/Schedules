import bcrypt from 'bcryptjs';
import isPasswordAllowed from './auth';

const hashPassword = (password) => {
  if (!isPasswordAllowed(password)) {
    throw new Error(
      'Password must be 6 characters or longer, contains non-alphanumeric/digit/capital/lowercase letter ',
    );
  }

  return bcrypt.hash(password, 12);
};

export {hashPassword as default};
