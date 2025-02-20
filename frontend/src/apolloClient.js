// src/apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.BACKEND_API_URL, // URL Twojego API GraphQL
  cache: new InMemoryCache(), // Apollo Client używa cache do przechowywania danych
});

export default client;
