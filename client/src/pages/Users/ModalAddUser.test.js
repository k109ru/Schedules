import React from 'react';

import {ApolloProvider} from 'react-apollo';

import {any} from 'prop-types';
import {createMemoryHistory} from 'history';
import {createStore} from 'redux';
import {Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import reducers from '../../reducers';
import {render as rtlRender, screen} from '@testing-library/react';

import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import {adminOne} from '../../test/data/users';
import ModalAddUser from './ModalAddUser';

//For graphql
import ApolloClient from 'apollo-boost';

const url = process.env.REACT_APP_API_URL;

// Isolate Apollo client so it could be reused
// in both application runtime and tests.
export const client = new ApolloClient({
  uri: `${url}/graphql`,

  // Use explicit `window.fetch` so tha outgoing requests
  // are captured and deferred until the Service Worker is ready.
  fetch: (...args) => fetch(...args),
});

//For route and redux
function render(
  ui,
  {
    initialState,
    store = createStore(reducers, initialState),
    route = '/',
    history = createMemoryHistory({initialEntries: [route]}),
    ...renderOptions
  } = {},
) {
  function Wrapper({children}) {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Router history={history}>{children}</Router>
          </I18nextProvider>
        </Provider>
      </ApolloProvider>
    );
  }

  Wrapper.propTypes = {children: any};

  return {
    ...rtlRender(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
    store,
    history,
  };
}

test('should render the modal add user window', () => {
  const listOfItems = [
    'fullname',
    'rateOfWork',
    'namePosition',
    'startWork',
    'endWork',
    'startSecondWork',
    'endSecondWork',
    'startLunch',
    'endLunch',
    'startSecondLunch',
    'endSecondLunch',
    'longOfDay',
    'fulltime',
  ];
  const testEmail = adminOne.email;
  const handleClose = jest.fn();
  window.sessionStorage.setItem('email', testEmail);

  render(<ModalAddUser handleClose={handleClose} show={true} />);

  expect(screen.getByLabelText(/form_add_user/i)).toBeInTheDocument();
  expect(
    screen.getByLabelText(/modal_close_button_add_user/i),
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText(/modal_close_button_add_user/i),
  ).toHaveTextContent('Close');
  expect(screen.getByDisplayValue(testEmail)).toBeInTheDocument();
  expect(screen.getByLabelText(/form_input_owner_add_user/i)).toBeDisabled();

  listOfItems.forEach((item) => {
    expect(
      screen.getByLabelText(`form_input_${item}_add_user`),
    ).toBeInTheDocument();
  });
  listOfItems.forEach((item) => {
    expect(
      screen.getByLabelText(`form_label_${item}_add_user`),
    ).toBeInTheDocument();
  });
});
