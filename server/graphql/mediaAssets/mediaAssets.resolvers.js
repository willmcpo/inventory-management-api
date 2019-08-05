import {getMediaAssets, addMediaAsset, removeMediaAsset, associateMediaAssetWithShoppingCentre, disassociateMediaAssetFromShoppingCentre, updateMediaAssetStatus} from '../../logic/mediaAssets/mediaAssets';

export const mediaAssetQueries = {
  getMediaAssets({input}, context) {
    return getMediaAssets(input, context);
  }
};

export const mediaAssetMutations = {
  addMediaAsset({input}, context) {
    return addMediaAsset(input, context);
  },
  async removeMediaAsset({input}, context) {
    await removeMediaAsset(input, context);
    return true;
  },
  async associateMediaAssetWithShoppingCentre({input}, context) {
    await associateMediaAssetWithShoppingCentre(input, context);
    return true;
  },
  async disassociateMediaAssetFromShoppingCentre({input}, context) {
    await disassociateMediaAssetFromShoppingCentre(input, context);
    return true;
  },
  async updateMediaAssetStatus({input}, context) {
    await updateMediaAssetStatus(input, context);
    return true;
  }
};

