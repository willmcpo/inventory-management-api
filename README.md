# Inventory Management API

Here is some info to quickly run the API, about the [rationale](#rationales-and-thinking), as well as 
instructions on how to [validate the solution](#solution-validation-instructions).

## Quick Start Instructions
### To Run
First, get the `.env`, `rs256.key` and `rs256.key.pub` files separately and drop them in the root directory of this repo.

Then do this:

```
npm i yarn -g
yarn
yarn dev
```

### To Test
```
yarn test
```

## Rationales and Thinking
### NextJS
* I chose this in case I wanted the quick scaffolding for a UI as well as an API
* In the end, I didn't need NextJS and could've just set up a plain Node/Express/GraphQL server,
  which would really be a subset of what I've done in this task

### API Framework - GraphQL
* Chose this approach because I have enjoyed this way of API development so much since I discovered it
* Could've done the same using REST API but I find it more frictionless to use GraphQL in API development
* in the `ShoppingCentre` GraphQL type, if you do not query for the `mediaAssets` field, it won't run the
associated MySQL query which is cool.
````graphql
type ShoppingCentre {
  id: ID!
  name: String!
  address: String!
  mediaAssets: [ID]!

  lastModifiedAt: String!
  lastModifiedBy: String!
} 
````
* Example of query of a `shoppingCentre` without `mediaAssets`:
````graphql
query getShoppingCentre {
  shoppingCentres {
    getShoppingCentre(input: {id: 2}) {
      name
      address
      # mediaAssets
      lastModifiedAt
      lastModifiedBy
    }
  }
}
````
* Performance of GraphQL can be a question mark, but there are ways to minimise any impact - further,
  the endpoint is B2B rather than B2C, which *may mean* performance is not *as* critical of a factor.
* As always, there are trade-offs to consider - developer experience / speed vs application performance - 
  with respect to the individual application's needs and realistic performance measurements/projections. 

### API Playground
* Use this to query the GraphQL API
* The pre-prepared tabs with queries can be used/modified to manage inventory

### AWS RDS MySQL Database
* Created a AWS trial account in order to deploy a free tier RDS MySQL instance
* I did this instead of requiring this API's evaluator to download/install MySQL server, import the DB, etc etc
* The instance is public - you can use MySQLWorkbench or whatever to query the tables/schema directly as part of the
  validation (in addition to querying the GraphQL endpoint via Playground)

### Shortcuts Taken
* Didn't build a quick and dirty UI - I think Graphql Playground is a way more cool way to test the API than a rough and incomplete UI
* 365 day token (for authentication) was created for the purpose of running the GraphQL queries without any issues
* Related to the above point, there is no token refresh logic
* Didn't pay too much attention to getting it Prod ready nor implement/test Prod build steps
* No linting/prettier

## Solution Validation Instructions 
1. Drop the `.env` file in the root (this has the relevant credentials, keys, etc) - this file is
   not committed as part of the repo.
2. Run this once: `npm i yarn -g && yarn` 
3. Run: `yarn dev` to start the server
4. Go to `http://localhost:3000` which should redirect to `http://localhost:3000/graphql`
5. You should see 3 tabs in the Playground IDE: *login*, *shoppingCentres*, *mediaAssets*  
6. Before pressing the > (Play) button to run a query, there is a bug (in the IDE) where you need to make an edit in each of the tabs
   (like add a blank line or remove the `#` comment at the top of the tab)
7. After you make that dummy edit (in each tab), you can press the > (Play) button and it should show a 
   drop-down where you can select the query/mutation to run
8. You do NOT need to run `mutation login` - if you look at the *shoppingCentres* and *mediaAssets* tabs,
   there is a HTTP Headers field below, which should have been pre-populated with the 365d token,
   which means you're all set to execute the queries/mutations.
   Although you *can* re-login, and get a new token, then replace the pre-populated token with the new one.    
9. Feel free to customise the inputs into each query/mutation to see the different results.
10. Also, feel free to customise the fields returned in a query/mutation (if you wish)
