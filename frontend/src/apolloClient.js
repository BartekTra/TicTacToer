// src/apolloClient.js
import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink, Observable } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_GRAPHQL_URL
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  console.log(token);
  if(token){
    const tokenParsed = JSON.parse(token);
    console.log(tokenParsed);
    console.log("client token", tokenParsed['client']);
    console.log("Access token", tokenParsed['access-token']);

    return {
      headers: {
        ...headers,
        Authorization: tokenParsed['Authorization'].replace("Bearer ", ""),
        client: tokenParsed['client'],
        "access-token": tokenParsed['access-token'],
        "token-type": tokenParsed['token-type'],
      }
    }
  }
});

const responseLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const headers = context.response?.headers;

    async function testFunction() {
      const newAccessToken = await headers.get("access-token");
      console.log("apolloClient.js 33# ", newAccessToken);
      return newAccessToken;
    }
    let newAccessToken = testFunction();

    if (newAccessToken) localStorage.setItem("AccessToken", newAccessToken);
    return response;
  });
});


const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    responseLink,
    httpLink
  ]), // URL Twojego API GraphQL
  cache: new InMemoryCache(), // Apollo Client używa cache do przechowywania danych
});



export default client;
