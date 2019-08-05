import {graphqlEndpoint} from '../consts';

const query = `#
mutation login {
  users {
    login(input: {username: "user", password: "password"}) {
      token
    }
  }
}

mutation logout {
  users {
    logout
  }
}
`;

export default {
  endpoint: graphqlEndpoint,
  name: 'login',
  query,
  headers: {}
}
