import {graphqlEndpoint, neverExpiringAuthorisationTokenForDemoPurposesONLY} from '../consts';

const query = `#
query getShoppingCentre {
  shoppingCentres {
    getShoppingCentre(input: {id: 2}) {
      name
      address
      mediaAssets
      lastModifiedAt
      lastModifiedBy
    }
  }
}

mutation addShoppingCentre {
  shoppingCentres {
    addShoppingCentre(input: {name: "Westfield Chatswood", address: "Oxford St, Bondi Junction, NSW, 2000"}) {
      id
    }
  }
}

mutation removeShoppingCentre {
  shoppingCentres {
    removeShoppingCentre(input: {id: 1})
  }
}

mutation updateShoppingCentre {
  shoppingCentres {
    updateShoppingCentre(input: {id: 2, address: "King St, Sydney, NSW, 2000"})
  }
}
`;

export default {
  endpoint: graphqlEndpoint,
  name: 'shoppingCentres',
  query,
  headers: {
    authorization: neverExpiringAuthorisationTokenForDemoPurposesONLY
  }
}
