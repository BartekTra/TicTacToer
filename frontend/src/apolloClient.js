// src/apolloClient.js
import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
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
    console.log("Access token", tokenParsed['access-token']);
    console.log("client token", tokenParsed['client']);


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

    if(headers.get("access-token")){
      console.log("Doing!");
      const tokenLocalStorage = localStorage.getItem("token");
      const tokenLocalStorageParsed = JSON.parse(tokenLocalStorage);
      tokenLocalStorageParsed["access-token"] = headers.get("access-token");
      console.log(JSON.stringify(tokenLocalStorageParsed));
      localStorage.setItem("token", JSON.stringify(tokenLocalStorageParsed));
    }

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
