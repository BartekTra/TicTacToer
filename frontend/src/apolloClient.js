// src/apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: import.meta.env.VITE_BACKEND_GRAPHQL_URL, // URL Twojego API GraphQL
  cache: new InMemoryCache(), // Apollo Client używa cache do przechowywania danych
});

export default client;
