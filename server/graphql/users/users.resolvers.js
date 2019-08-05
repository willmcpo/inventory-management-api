import {login, logout} from '../../logic/users/users';

export const userMutations = {
  login({input}, {user, mysql}) {
    if (user) {
      return {
        token: user.token
      };
    }

    return login(input, {user, mysql});
  },

  logout(_, context) {
    return logout(context);
  }
};
