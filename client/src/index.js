import React from 'react';
import ReactDOM from 'react-dom';
import {register} from './serviceWorker';

import './i18n';

import './index.scss';
import App from './App';

import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {Provider} from 'react-redux';

import {ApolloLink} from 'apollo-link';
import {onError} from 'apollo-link-error';

import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {createStore, applyMiddleware, compose} from 'redux';

import reduxThunk from 'redux-thunk';

import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

console.log('test', process.env.REACT_APP_API_URL);
const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
  credentials: 'include',
});

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    graphQLErrors.map(({message, locations, path}) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const link = ApolloLink.from([errorLink, httpLink]);

const client = new ApolloClient({
  // link: httpLink,
  link,
  cache: new InMemoryCache(),
});

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk)),
);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
);

register();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

//for testing

export {store};
