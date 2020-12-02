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

import ModalZero from './ModalScheduleZero';

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

test('should be displayed modal window for the schedule without chosen days', () => {
  render(<ModalZero />);
  expect(
    screen.getByLabelText(/schedule_modal_empty_edit_chosen_field/i),
  ).toBeInTheDocument();
  expect(
    screen.queryByLabelText(/schedule_modal_edit_chosen_field/i),
  ).toBeNull();
  expect(
    screen.getByLabelText(/schedule_modal_empty_number_zero/i),
  ).toBeInTheDocument();
  expect(
    screen.getByLabelText(/schedule_modal_empty_edit_close_button/i),
  ).toBeInTheDocument();
});
