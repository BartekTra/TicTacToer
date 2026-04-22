import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import client from "./apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </StrictMode>,
);
