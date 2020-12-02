import React from 'react';

import {ApolloProvider} from 'react-apollo';
import userEvent from '@testing-library/user-event';

import {any} from 'prop-types';
import {createMemoryHistory} from 'history';
import {createStore} from 'redux';
import {Router} from 'react-router-dom';
import {Provider} from 'react-redux';
import reducers from '../../reducers';
import {deletedSchedule} from '../../actions/';
import {render as rtlRender, screen} from '@testing-library/react';

import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import {waitForLoadingToFinish} from '../../test/utils/test-utils';

import {adminOne} from '../../test/data/admins';
import {
  scheduleFullForTest,
  getAllSchedules,
  reset,
} from '../../test/data/schedules';

import {ModalScheduleDel} from './ModalScheduleDel';

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

describe('testing modal window for delete a schedule', () => {
  test('should be displayed modal window for delete the schedule with its all elements', () => {
    window.sessionStorage.setItem('email', adminOne.email);
    render(
      <ModalScheduleDel
        id={scheduleFullForTest.id}
        name={scheduleFullForTest.nameSchedule}
        deletedSchedule={deletedSchedule}
      />,
    );

    expect(
      screen.getByLabelText(/schedule_modal_delete_schedule/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_delete_close_button/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_name_schedule/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_name_schedule/i).textContent,
    ).toBe(`"${scheduleFullForTest.nameSchedule}"`);
    expect(
      screen.getByLabelText(/schedule_modal_yes_button/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_no_button/i),
    ).toBeInTheDocument();
  });

  test('should delete the schedule', async () => {
    window.sessionStorage.setItem('email', adminOne.email);
    render(
      <ModalScheduleDel
        id={scheduleFullForTest.id}
        name={scheduleFullForTest.nameSchedule}
        deletedSchedule={deletedSchedule}
      />,
    );

    expect(getAllSchedules()).toHaveLength(3);

    userEvent.click(screen.getByLabelText(/schedule_modal_yes_button/i));
    await waitForLoadingToFinish();

    expect(getAllSchedules()).toHaveLength(2);
    reset();
  });
});
