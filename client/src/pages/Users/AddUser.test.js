import React from 'react';

import {ApolloProvider} from 'react-apollo';
import userEvent from '@testing-library/user-event';

import {any} from 'prop-types';
import {createMemoryHistory} from 'history';
import {createStore} from 'redux';
import {Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import reducers from '../../reducers';
import {render as rtlRender, screen} from '@testing-library/react';

import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import {waitForLoadingToFinish} from '../../test/utils/test-utils';

import {adminOne, getAllUsers} from '../../test/data/users';
import {AddUser} from './AddUser';

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

test('should create new user', async () => {
  const testEmail = adminOne.email;
  const testUsername = 'userThree';
  const testUserNamePosition = 'Nurse';
  const addedUser = jest.fn();

  window.sessionStorage.setItem('email', testEmail);

  render(<AddUser addedUser={addedUser} />);
  expect(screen.getByDisplayValue(testEmail)).toBeInTheDocument();

  userEvent.type(
    screen.getByLabelText(/form_input_fullname_add_user/i),
    testUsername,
  );
  userEvent.type(
    screen.getByLabelText(/form_input_nameposition_add_user/i),
    testUserNamePosition,
  );
  userEvent.click(screen.getByLabelText(/add_user_form_button_add_user/i));
  await waitForLoadingToFinish();

  const allUsers = getAllUsers();

  expect(allUsers).toHaveLength(3);
  expect(allUsers[2].owner.email).toBe(testEmail);
  expect(allUsers[2].fullname).toBe(testUsername);
  expect(allUsers[2].position.namePosition).toBe(testUserNamePosition);
});
