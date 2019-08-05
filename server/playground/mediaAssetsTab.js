import {graphqlEndpoint, neverExpiringAuthorisationTokenForDemoPurposesONLY} from '../consts';

const query = `#
query getMediaAssetsName {
	mediaAssets {
    getMediaAssets(input: {name: "Big one"}) {
      id
      name
      dimensions {
        width
        height
      }
      associatedShoppingCentre {
        id
        location
      }
      status
      lastModifiedAt
      lastModifiedBy
    }
  }
}

query getMediaAssetsInactive {
	mediaAssets {
    getMediaAssets(input: {status: inactive}) {
      id
      name
      dimensions {
        width
        height
      }
      associatedShoppingCentre {
        id
        location
      }
      # status
      # lastModifiedAt
      # lastModifiedBy
    }
  }
}

mutation addMediaAsset {
  mediaAssets {
    addMediaAsset(input: {name: "Big one", width: 15, height: 5}) {
      id
    }
  }
}

mutation removeMediaAsset {
  mediaAssets {
    removeMediaAsset(input: {id: "1"})
  }
}

mutation updateMediaAssetStatus {
  mediaAssets {
    updateMediaAssetStatus(input: {id: 2, status: active})
  }
}

mutation associateMediaAssetWithShoppingCentre {
  mediaAssets {
    associateMediaAssetWithShoppingCentre(input: {id: 2, associatedShoppingCentreId: 2, associatedShoppingCentreLocation: "front door"}) 
  }
}

mutation disassociateMediaAssetFromShoppingCentre {
  mediaAssets {
    disassociateMediaAssetFromShoppingCentre(input: {id: 1})
  }
}
`;

export default {
  endpoint: graphqlEndpoint,
  name: 'mediaAssets',
  query,
  headers: {
    authorization: neverExpiringAuthorisationTokenForDemoPurposesONLY
  }
}
