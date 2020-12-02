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

import {Users} from './Users';

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

describe('testing users page', () => {
  //data with users in server-handlers.js
  test('should be displayed two users, button (Add user) and search field', async () => {
    render(<Users addUser={{names: []}} />);

    await waitForLoadingToFinish();
    expect(
      screen.queryByLabelText(/users_page_add_user_button/i).textContent,
    ).toBe(`Add User`);
    expect(
      screen.queryByLabelText(/users_page_search_user_field/i).placeholder,
    ).toBe(`Name of user`);

    expect(
      screen.queryByLabelText(/users_page_update_button_userOne/i).textContent,
    ).toBe(`userOne`);
    expect(
      screen.queryByLabelText(/users_page_update_button_userTwo/i).textContent,
    ).toBe(`userTwo`);
    expect(
      screen.queryByLabelText(/users_page_update_button_userThree/i),
    ).toBeNull();
  });

  test('can be opened and closed modal window for add new user', () => {
    render(<Users addUser={{names: []}} />);

    expect(screen.queryByLabelText(/modal_add_user/i)).toHaveClass(
      'display-none',
    );

    userEvent.click(screen.getByLabelText(/users_page_add_user_button/i));

    expect(screen.queryByLabelText(/modal_add_user/i)).toHaveClass(
      'display-block',
    );

    userEvent.click(screen.getByLabelText(/modal_close_button_add_user/i));

    expect(screen.queryByLabelText(/modal_add_user/i)).toHaveClass(
      'display-none',
    );
  });

  test('should be found correct user', () => {
    render(<Users addUser={{names: []}} />);

    userEvent.type(
      screen.getByLabelText(/users_page_search_user_field/i),
      'userTwo',
    );

    expect(
      screen.queryByLabelText(/users_page_update_button_userOne/i),
    ).toBeNull();
    expect(
      screen.queryByLabelText(/users_page_update_button_userTwo/i).textContent,
    ).toBe(`userTwo`);

    userEvent.clear(screen.getByLabelText(/users_page_search_user_field/i));

    userEvent.type(
      screen.getByLabelText(/users_page_search_user_field/i),
      'userOne',
    );

    expect(
      screen.queryByLabelText(/users_page_update_button_userOne/i).textContent,
    ).toBe(`userOne`);
    expect(
      screen.queryByLabelText(/users_page_update_button_userTwo/i),
    ).toBeNull();
  });

  test('can be opened and closed modal window for delete userOne', () => {
    render(<Users addUser={{names: []}} />);
    expect(screen.queryByLabelText(/modal_delete_user/i)).toHaveClass(
      'display-none',
    );

    userEvent.click(screen.getByLabelText(/users_page_delete_button_userOne/i));

    expect(screen.queryByLabelText(/modal_delete_user/i)).toHaveClass(
      'display-block',
    );

    expect(
      screen.queryByLabelText(/modal_text_username_delete_user/i).textContent,
    ).toBe(`"userOne"`);

    userEvent.click(screen.getByLabelText(/modal_close_button_delete_user/i));

    expect(screen.queryByLabelText(/modal_delete_user/i)).toHaveClass(
      'display-none',
    );
  });

  test("can be opened and closed modal window for update user's data", () => {
    render(<Users addUser={{names: []}} />);

    expect(screen.queryByLabelText(/modal_update_user/i)).toHaveClass(
      'display-none',
    );

    userEvent.click(screen.getByLabelText(/users_page_update_button_userOne/i));

    expect(screen.queryByLabelText(/modal_update_user/i)).toHaveClass(
      'display-block',
    );

    userEvent.click(screen.getByLabelText(/modal_close_button_update_user/i));

    expect(screen.queryByLabelText(/modal_update_user/i)).toHaveClass(
      'display-none',
    );
  });
});
