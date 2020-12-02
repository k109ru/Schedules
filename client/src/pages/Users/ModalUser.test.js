import React from 'react';
import {render, screen} from '@testing-library/react';
import {ApolloProvider} from 'react-apollo';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';
import ApolloClient from 'apollo-boost';

import {userOne} from '../../test/data/users';

import ModalUser from './ModalUser';

const url = process.env.REACT_APP_API_URL;

export const client = new ApolloClient({
  uri: `${url}/graphql`,

  // Use explicit `window.fetch` so tha outgoing requests
  // are captured and deferred until the Service Worker is ready.
  fetch: (...args) => fetch(...args),
});

test('should render the modal update user window', () => {
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

  const handleClose = jest.fn();

  render(
    <ApolloProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ModalUser
          handleClose={handleClose}
          show={true}
          // children={<div></div>}
          data={[userOne]}
        />
      </I18nextProvider>
    </ApolloProvider>,
  );

  expect(screen.getByLabelText(/modal_update_user/i)).toBeInTheDocument();
  expect(
    screen.getByLabelText(/modal_close_button_update_user/i),
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText(/modal_close_button_update_user/i),
  ).toHaveTextContent('Close');
  expect(screen.getByDisplayValue(userOne.fullname)).toBeInTheDocument();

  listOfItems.forEach((item) => {
    expect(
      screen.getByLabelText(`form_input_${item}_update_user`),
    ).toBeInTheDocument();
  });
  listOfItems.forEach((item) => {
    expect(
      screen.getByLabelText(`form_label_${item}_update_user`),
    ).toBeInTheDocument();
  });
});
