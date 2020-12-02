import React from 'react';
import {render, screen} from '@testing-library/react';
import {ApolloProvider} from 'react-apollo';
import userEvent from '@testing-library/user-event';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';
import ApolloClient from 'apollo-boost';

import {waitForLoadingToFinish} from '../../test/utils/test-utils';
import {userOne, adminOne, getAllUsers, reset} from '../../test/data/users';

import UpdateUser from './UpdateUser';

const url = process.env.REACT_APP_API_URL;

export const client = new ApolloClient({
  uri: `${url}/graphql`,

  // Use explicit `window.fetch` so tha outgoing requests
  // are captured and deferred until the Service Worker is ready.
  fetch: (...args) => fetch(...args),
});

describe('testing update user component', () => {
  test('should render the modal add user window ', async () => {
    const handleClose = jest.fn();

    render(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <UpdateUser handleClose={handleClose} user={userOne} />
        </I18nextProvider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('form_update_user')).toBeInTheDocument();
    expect(
      screen.getByLabelText(/form_update_user_button_submit/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/form_update_user_button_submit/i),
    ).toHaveTextContent('Submit');
    expect(screen.getByDisplayValue(userOne.fullname)).toBeInTheDocument();
  });

  test('should update userOne', async () => {
    const testEmail = adminOne.email;
    const handleClose = jest.fn();
    const newName = 'userOneUpdated';
    const newUserNamePosition = 'Nurse';

    window.sessionStorage.setItem('email', testEmail);

    render(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
          <UpdateUser handleClose={handleClose} user={userOne} />
        </I18nextProvider>
      </ApolloProvider>,
    );

    userEvent.clear(screen.getByLabelText(/form_input_fullname_update_user/i));
    userEvent.type(
      screen.getByLabelText(/form_input_fullname_update_user/i),
      newName,
    );
    userEvent.clear(
      screen.getByLabelText(/form_input_nameposition_update_user/i),
    );
    userEvent.type(
      screen.getByLabelText(/form_input_nameposition_update_user/i),
      newUserNamePosition,
    );
    userEvent.click(screen.getByLabelText(/form_update_user_button_submit/i));
    await waitForLoadingToFinish();

    const allUsers = getAllUsers();

    expect(allUsers).toHaveLength(2);
    expect(allUsers[0].owner.email).toBe(testEmail);
    expect(allUsers[0].fullname).toBe(newName);
    expect(allUsers[0].position.namePosition).toBe(newUserNamePosition);

    reset();
  });
});
