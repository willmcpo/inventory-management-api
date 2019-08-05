import {userMutations} from './users/users.resolvers';
import {mediaAssetQueries, mediaAssetMutations} from './mediaAssets/mediaAssets.resolvers';
import {shoppingCentreQueries, shoppingCentreMutations, shoppingCentreCustomResolver} from './shoppingCentres/shoppingCentres.resolvers';

export default {
  Query: {
    shoppingCentres: () => shoppingCentreQueries,
    mediaAssets: () => mediaAssetQueries,
  },

  Mutation: {
    users: () => userMutations,

    shoppingCentres: () => shoppingCentreMutations,
    mediaAssets: () => mediaAssetMutations,
  },

  ...shoppingCentreCustomResolver,
}
