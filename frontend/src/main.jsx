import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import client from './apolloClient'
import App from './App.jsx'
import store from './store/app/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  
      <ApolloProvider client={client}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
  
)
