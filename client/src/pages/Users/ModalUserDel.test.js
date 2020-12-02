import React from 'react';
import {render, screen} from '@testing-library/react';
import {ApolloProvider} from 'react-apollo';
import userEvent from '@testing-library/user-event';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';
import ApolloClient from 'apollo-boost';

import {waitForLoadingToFinish} from '../../test/utils/test-utils';

import {
  userOne,
  userTwo,
  adminOne,
  getAllUsers,
  reset,
} from '../../test/data/users';
import ModalUserDel from './ModalUserDel';

const url = process.env.REACT_APP_API_URL;

export const client = new ApolloClient({
  uri: `${url}/graphql`,

  // Use explicit `window.fetch` so tha outgoing requests
  // are captured and deferred until the Service Worker is ready.
  fetch: (...args) => fetch(...args),
});

describe('testing modal delete user', () => {
  test('renders the modal user delete window', () => {
    const handleClose = jest.fn();
    const name = 'userOne';

    render(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <ModalUserDel
            handleClose={handleClose}
            show={true}
            id={'laksjdflasjdl'}
            name={name}
          />
        </I18nextProvider>
      </ApolloProvider>,
    );

    expect(
      screen.queryByLabelText(/modal_close_button_delete_user/i).textContent,
    ).toBe(`Close`);
    expect(
      screen.queryByLabelText(/modal_text_username_delete_user/i).textContent,
    ).toBe(`"${name}"`);
    expect(
      screen.queryByLabelText(/modal_button_yes_delete_user/i).textContent,
    ).toBe(` Yes `);
    expect(
      screen.queryByLabelText(/modal_button_no_delete_user/i).textContent,
    ).toBe(` No `);
  });

  test('should delete userOne', async () => {
    const testEmail = adminOne.email;
    const handleClose = jest.fn();
    const name = userOne.fullname;
    const id = userOne.id;

    window.sessionStorage.setItem('email', testEmail);

    render(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <ModalUserDel
            handleClose={handleClose}
            show={true}
            id={id}
            name={name}
          />
        </I18nextProvider>
      </ApolloProvider>,
    );

    userEvent.click(screen.getByLabelText(/modal_button_yes_delete_user/i));
    await waitForLoadingToFinish();

    const allUsers = getAllUsers();

    expect(allUsers).toHaveLength(1);
    expect(allUsers[0].fullname).toBe(userTwo.fullname);

    reset();
  });
});
