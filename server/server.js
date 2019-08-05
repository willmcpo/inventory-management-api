// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
import express from 'express';
import next from 'next';
import mysql from 'mysql2/promise';
import {importSchema} from 'graphql-import';
import dotEnv from 'dotenv';
import {ApolloServer, AuthenticationError} from 'apollo-server-express';
import path from 'path';
import resolvers from './graphql/schema.resolvers';
import {checkToken} from './logic/users/users';
import logger from './utils/logger';

dotEnv.config();

let playgroundTabs;
if (process.env.NODE_ENV !== 'production') {
  playgroundTabs = [
    require('./playground/loginTab').default,
    require('./playground/shoppingCentresTab').default,
    require('./playground/mediaAssetsTab').default,
  ]
}

require('./utils/logger');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});

app.prepare().then(async () => {
  // create the connection to database
  const mysqlConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'test'
  });

  const typeDefs = importSchema(path.join(__dirname, 'graphql/schema.graphql'));
  const apolloServer = new ApolloServer({
    // debug: false, // Set this for production to hide stack traces from client
    typeDefs,
    resolvers,
    formatError: (err) => {
      logger.error(err.message);

      // Mask database errors
      if (err.message.toLowerCase().indexOf('database') > -1) {
        return new Error('Internal server error');
      }

      // Otherwise return the original error.  The error can also
      // be manipulated in other ways, so long as it's returned.
      return err;
    },
    context: ({ req }) => {
      // get the users token from the headers
      const {headers: {authorization}} = req;
      const token = authorization ? authorization.split(' ')[1] : '';

      if (!token) {
        return {mysql: mysqlConnection};
      }

      // verify token is valid
      const decoded = checkToken(token);

      // optionally block the users
      // we could also check users roles/permissions here
      if (!decoded) throw new AuthenticationError('you must be logged in');

      // add the token (and username) to the context
      const {username} = decoded;
      return { token, username, mysql: mysqlConnection };
    },
    playground: {
      tabs: playgroundTabs,
    }
  });
  const appServer = express();
  appServer.get('/', (req, res) => {
    res.redirect('/graphql');
  });

  apolloServer.applyMiddleware({ app: appServer });

  appServer.listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  })
});
