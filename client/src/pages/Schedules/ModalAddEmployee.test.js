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

import {
  reset,
  scheduleFullForTest,
  scheduleWithAllUsers,
} from '../../test/data/schedules';

import {ModalAddEmployee} from './ModalAddEmployee';

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

describe('testing modal add of employee window', () => {
  test('should be displayed modal window for add the employee', async () => {
    const handleClose = jest.fn();
    const addedEmployee = jest.fn();
    const id = scheduleWithAllUsers.schedule.id;
    const showModal = true;
    render(
      <ModalAddEmployee
        handleClose={handleClose}
        id={id}
        show={showModal}
        addedEmployee={addedEmployee}
      />,
    );
    await waitForLoadingToFinish();

    expect(
      screen.getByLabelText(/schedule_modal_add_employee_window/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_add_employee_table/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_add_employee_close_button/i),
    ).toBeInTheDocument();

    expect(
      screen.queryAllByLabelText(/schedule_modal_add_employee_row_table/i),
    ).toHaveLength(scheduleWithAllUsers.users.length);
    expect(
      screen.queryAllByLabelText(/schedule_modal_add_employee_add_button/i),
    ).toHaveLength(scheduleWithAllUsers.users.length);
  });

  test('should add new employee to the schedule', async () => {
    const handleClose = jest.fn();
    const addedEmployee = jest.fn();
    const id = scheduleWithAllUsers.schedule.id;
    const showModal = true;
    render(
      <ModalAddEmployee
        handleClose={handleClose}
        id={id}
        show={showModal}
        addedEmployee={addedEmployee}
      />,
    );
    expect(
      screen.queryAllByLabelText(/schedule_modal_add_employee_add_button/i),
    ).toHaveLength(scheduleWithAllUsers.users.length);
    expect(scheduleFullForTest.employees).toHaveLength(2);

    userEvent.click(
      screen.queryAllByLabelText(/schedule_modal_add_employee_add_button/i)[0],
    );

    expect(scheduleFullForTest.employees).toHaveLength(3);
    expect(scheduleFullForTest.employees[2].fullname).toBe('userFive');

    reset();
  });
});
