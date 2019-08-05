import {AuthenticationError} from 'apollo-server-express';
import {checkToken, login, logout} from './users';

jest.mock('fs');
jest.mock('jsonwebtoken', () => ({
  verify: (token) => {
    if (token === 'validToken') {
      return true;
    }

    throw new Error('invalidToken');
  },
  sign: () => 'validToken',
}));

jest.mock('crypto', () => ({
  createHmac: () => ({
    update: () => ({
      digest: () => 'hashed-password',
    }),
  }),
}));

describe('logic - users - checkToken', () => {
  it('returns the decoded token when it is valid', () => {
    expect(checkToken('validToken')).toBeTruthy();
  });

  it('returns null when the the token is invalid', () => {
    expect(checkToken('some other token')).toBeNull();
  });
});

describe('logic - users - login',  () => {
  it('returns the token when username and password are valid', async () => {
    const mysql = {
      execute: () => [[{password: 'hashed-password'}]]
    };

    const {token} = await login({username: 'someuser', password: 'some-unhashed-password'}, {mysql});
    expect(token).toEqual('validToken');
  });

  it('throws when either password is invalid', async () => {
    const mysql = {
      execute: () => [[{password: 'incorrect-hashed-password'}]]
    };

    try {
      await login({username: 'someuser', password: 'some-unhashed-password'}, {mysql});
    } catch(e) {
      expect(e).toEqual(new AuthenticationError('Invalid credentials'))
    }
  });
});

describe('logic - users - logout', () => {
  it('sets user context to undefined', () => {
    const context = {user: 'someuser'};

    expect(logout(context));
    expect(context.user).toBeUndefined();
  });
});
