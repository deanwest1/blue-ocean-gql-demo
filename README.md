# blue-ocean-gql-demo

A minimal Twitter-like GraphQL API written in Node using the [NestJS](https://nestjs.com/) framework. This demostration only includes a back-end. Rather than requests being made from a user interface, it's expected that the user will issue GraphQL queries and mutations directly using either [GraphiQL](https://graphql-dotnet.github.io/docs/getting-started/graphiql/) or [Postman](https://www.postman.com/).

## Quick Start

```
npm install
nest start
```

## Features

This API allows for the following operations:

#### Mutations

- Signing up as a new user
  - Unique email addresses are enforced for each user
  - Passwords are hashed before being stored
- Logging in as an existing user
  - A successful login will return a JWT `accessToken` which needs to be included in the `Authorization` header of protected mutations
- Creating new posts as a logged in user
- Updating existsing posts as a logged in user
  - You can only update posts that belong to you
- Removing existing posts as a logged in user
  - You can only remove posts that belong to you
- Following another user as a logged in user

#### Queries

- Get all users
- Get a specific user by ID
- Get all posts
- Get all posts by a given author email address
- Get a specific post by ID

## Limitations

This API is for demonstration purposes and is far from a production-quality solution. This is not necessarily an exhaustive list of all the limitations. Here are some of the most notable limitations of this demo:

- There's no user interface! Kind of a big deal. An application's frontend is supposed to make interfacing with the back end effortless. There are some notable limitations you may notice:
  - Of course, you're writing queries and mutations yourself
  - You also have to manually set the `Authorization` header for protected routes.
  - There's a workaround for handling login requests through GraphQL. Since the `passport-local` strategy relies on examining a simple JSON payload in `request.body` for a login credentials, it's not feasible to use that Passport stategy from a resolver. Rather, it's much more straight-forward to implement login functionality from a simple REST endpoint. Rather than require you, the user to leave GraphiQL and issue a separate `curl` or Postman request to a REST endpoint to login, I've included a `login` GraphQL mutation that will act as a proxy for the actual login REST endpoint. If you indeed used a REST endpoint that lived separately from your GraphQL API to authenticate a user and issue an `accessToken`, if you had a frontend, this would be completely concealed from the end user.
- There are no tests whatsoever, which is obviously not okay for a real application. I like to deliver solid, testable code that I can feel good and confident about because I like to sleep at night. I would never want to deliver a production application that has no tests.
- There's no data persistence. Beyond just the annoyance of all your users and posts getting nuked every time you restart the server, a data store would likely change the way the application is written, and it would very likely improve performance due to a database's built-in optimizations, the ability to more easily batch queries together, database indexes, etc.
- Since there's no data store, the main resources (users and posts) are plain old JavaScript arrays, and users and posts are stored in separate arrays because they need to be queried and mutated independent of each other.
  - Arrays are a logical construct for representing a collection of resources in GraphQL, but since the fetching and joining logic is implemented directly in JavaScript, as opposed to being handled by a data store, there are some performance implications:
    - Finding a record in an array will always have, at minimum, an O(n) time complexity because we're iterating over an entire array. There are no indexes to limit the scope of our search, and there is no hash table to allow for immediate lookups.
    - Performing joins (for example, find a user and then get all of his/her posts) will always have at least an O(n^2) time complexity. For the example of getting all posts by a user, since there are no indexes or hash tables, we have to iterate over every single post to be sure we've included every post by that user.
- The JWT generated when a user successfully logs in is signed with the secret, `"secret"`, which is included directly in the source code. In a real application, this would be a much more secure secret, stored securely, say as a SecureString in AWS Param Store. It would never be exposed in source code.
- There is no reading of configurations of any kind: not from env variables, secret vaults, or anywhere else. As a result, nothing is configurable! Not even the application's port number. Of course, in a real app, you'd make as much as feasible configurable, so that certain changes to your application could happen without having to deploy a code change. Nest makes this easy with the `ConfigModule` from `@nestjs/config`.
- We are not addressing the GraphQL n+1 problem in this demo. For certain fields, this means significant time complexity. There are detailed notes about this in the field resolvers for the user entity, but in general there's a ton of room for optimizations here in the form of batching operations (e.g. using DataLoader), using key/val storage where possible instead of arrays (Because key/val lookups are O(1) instead of O(n)), and utilizing database optimizations, both built-in and those achieved by having useful indexes.
- We are not explicitly addressing caching in this demo.
- While we are using TypeScript, We're not always using it to its full potential: Ideally, all of your data: inputs, outputs and otherwise would have explicit type declarations to make your code not only more self-documenting, but to make it harder to screw something up. This, along with proper testing, goes a long way toward eliminating silly mistakes.

## Sample Mutations

Mutations are listed with the GraphQL mutation syntax listed above the JSON values that are to be used in the "Query Variables" pane in the GraphiQL editor.

### Sign Up

```graphql
mutation signUp($signUpInput: SignUpInput!) {
  signUp(signUpInput: $signUpInput) {
    id
    firstName
    lastName
    email
  }
}
```

```json
{
  "signUpInput": {
    "firstName": "Dean",
    "lastName": "West",
    "email": "dean@example.com",
    "password": "secret"
  }
}
```

### Login

```graphql
mutation login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    accessToken
  }
}
```

```json
{
  "loginInput": {
    "email": "dean@example.com",
    "password": "secret"
  }
}
```

Take the `accessToken` that's returned from the `login` mutation and include it in the `Authorization` header, e.g.:

```
Authorization: Bearer <accessToken>
```

If you're using the GraphiQL UI in the browser, you may wish to use a browser extension like [ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj) to make it easy to modify the `Authorization` header.

If you want to change users, you need to login as another user and change the `Authorization` token again.

The following mutations require you to be logged in to perform:

### Create A Post

```graphql
mutation createPost($body: String!) {
  createPost(body: $body) {
    id
    body
    createdAt
    updatedAt
  }
}
```

```json
{
  "body": "Try the pumpkin spice!"
}
```

### Update A Post

```graphql
mutation updatePost($id: ID!, $body: String!) {
  updatePost(id: $id, body: $body) {
    id
    body
    createdAt
    updatedAt
  }
}
```

```json
{
  "id": "1633198316021",
  "body": "I changed my mind about the pumpkin spice."
}
```

### Delete A Post

```graphql
mutation removePost($id: ID!) {
  removePost(id: $id) {
    id
    body
    createdAt
  }
}
```

```json
{
  "id": "1633205054607"
}
```

### Update A User

```graphql
mutation updateUser($id: ID!, $updateUserInput: UpdateUserInput!) {
  updateUser(id: $id, updateUserInput: $updateUserInput) {
    id
    firstName
    lastName
    email
    bio
  }
}
```

```json
{
  "id": "1633198188831",
  "updateUserInput": {
    "firstName": "Captain",
    "lastName": "Tweetmeister",
    "bio": "I'm out to save the world, one tweet at a time."
  }
}
```

### Follow Another User

```graphql
mutation followUser($email: String!) {
  followUser(email: $email) {
    id
    firstName
    lastName
  }
}
```

```json
{
  "email": "johnny@example.com"
}
```

## Sample Queries

You can query users and posts in the following ways:

- Users
  - Get all users
  - Get an individual user by user ID
- Posts
  - Get all posts
  - Get posts by a given user ID
  - Get an individual post by post ID

Below are just two examples, one for getting all users and one for getting all posts:

### Get All Users Example

```graphql
{
  allUsers {
    id
    firstName
    lastName
    email
    bio
    signUpDate
    followers {
      firstName
      lastName
      email
    }
    following {
      firstName
      lastName
      email
    }
    posts {
      body
    }
  }
}
```

### Get All Posts Example

```graphql
{
  allPosts {
    id
    body
    createdAt
    updatedAt
    author {
      id
      firstName
      lastName
      email
    }
  }
}
```
