import cases from 'jest-in-case';
import isPasswordAllowed from './auth';
import hashPassword from './hashPassword';

function iterator(obj) {
  return Object.entries(obj).map(([name, password]) => ({
    name: `${password} - ${name}`,
    password,
  }));
}

cases(
  'isPasswordAllowed: valid passwords',
  ({password}) => {
    expect(isPasswordAllowed(password)).toBe(true);
  },
  iterator({'valid password': '!aBc123'}),
);

cases(
  'isPasswordAllowed: invalid passwords',
  ({password}) => {
    expect(isPasswordAllowed(password)).toBe(false);
  },
  iterator({
    'too short': 'a2c!',
    'no letters': '123456!',
    'no numbers': 'ABCdef!',
    'no uppercase letters': 'abc123!',
    'no lowercase letters': 'ABC123!',
    'no non-alphanumeric characters': 'ABCdef123',
  }),
);

test('Should throw an error if password not allowed', () => {
  expect(() => hashPassword('12345')).toThrowError(
    'Password must be 6 characters or longer, contains non-alphanumeric/digit/capital/lowercase letter ',
  );
});
