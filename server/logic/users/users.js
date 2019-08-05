import {AuthenticationError} from 'apollo-server-express';
import fs from 'fs';
import path from 'path'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const jwtPrivateKey = fs.readFileSync(path.join(__dirname, '/../../../rs256.key'));
const jwtPublicKey = fs.readFileSync(path.join(__dirname, '/../../../rs256.key.pub'));

export function checkToken(token) {
  try {
    return jwt.verify(token, jwtPublicKey);
  } catch(err) {
    console.error('Invalid token');
    return null;
  }
}

export async function login({username, password}, {mysql}) {
  const passwordHash = crypto.createHmac("sha256", jwtPrivateKey)
    .update(password)
    .digest("hex");

  const [[row]] = await mysql.execute('SELECT user, password FROM users WHERE user = ?', [username]);

  if (row && row.password === passwordHash) {
    // We set expiration to something massive for the convenience of being able to test this API
    // without having to re-log in later.
    const token = jwt.sign({username}, jwtPrivateKey, { expiresIn: '365d', algorithm: 'RS256' });
    return {token};
  }

  throw new AuthenticationError('Invalid credentials');
}

export function logout(context) {
  context.user = undefined;
  return true;
}
