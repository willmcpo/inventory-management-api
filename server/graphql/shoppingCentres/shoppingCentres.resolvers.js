import {addShoppingCentre, removeShoppingCentre, updateShoppingCentre, getShoppingCentre} from '../../logic/shoppingCentres/shoppingCentres';
import {getMediaAssets} from '../../logic/mediaAssets/mediaAssets';

export const shoppingCentreQueries = {
  getShoppingCentre({input}, context) {
    return getShoppingCentre(input, context);
  }
};

export const shoppingCentreMutations = {
  addShoppingCentre({input}, context) {
    return addShoppingCentre(input, context);
  },
  async removeShoppingCentre({input}, context) {
    await removeShoppingCentre(input, context);
    return true;
  },
  async updateShoppingCentre({input}, context) {
    await updateShoppingCentre(input, context);
    return true;
  }
};

export const shoppingCentreCustomResolver = {
  ShoppingCentre: {
    mediaAssets: async (shoppingCentre, _, context) => (
      await getMediaAssets({associatedShoppingCentreId: shoppingCentre.id}, context)
    ).map(({id}) => id),
  }
};
