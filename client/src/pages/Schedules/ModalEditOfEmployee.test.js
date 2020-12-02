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

import {
  getAllSchedules,
  reset,
  scheduleFullForTest,
} from '../../test/data/schedules';

import ModalEditOfEmployee from './ModalEditOfEmployee';

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

describe('testing modal edit of employee window', () => {
  test('should be displayed modal window for edit the employee', () => {
    const listOfNameFields = [
      'fullname',
      'rateOfWork',
      'hoursOfMonth',
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
    const id = scheduleFullForTest.id;
    const employee = scheduleFullForTest.employees[0];
    const showModal = true;
    render(
      <ModalEditOfEmployee
        handleClose={handleClose}
        id={id}
        employee={employee}
        show={showModal}
      />,
    );

    expect(
      screen.queryByLabelText(/schedule_modal_edit_employee_window/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/schedule_modal_edit_employee_close_button/i),
    ).toBeInTheDocument();

    //Input Fields
    expect(
      screen.queryByLabelText(/schedule_modal_edit_employee_field_fullname/i)
        .value,
    ).toBe('userOne');
    listOfNameFields.forEach((name) => {
      expect(
        screen.getByLabelText(`schedule_modal_edit_employee_field_${name}`),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByLabelText(/schedule_modal_edit_employee_submit_button/i),
    ).toBeInTheDocument();
  });

  test('should update employee fullname', () => {
    const nameEmployeeForTest = '0userOneUpdated';
    const handleClose = jest.fn();
    const id = scheduleFullForTest.id;
    const employee = scheduleFullForTest.employees[0];
    const showModal = true;
    render(
      <ModalEditOfEmployee
        handleClose={handleClose}
        id={id}
        employee={employee}
        show={showModal}
      />,
    );

    userEvent.clear(
      screen.getByLabelText(/schedule_modal_edit_employee_field_fullname/i),
    );
    userEvent.type(
      screen.getByLabelText(/schedule_modal_edit_employee_field_fullname/i),
      'userOneUpdated',
    );

    expect(
      screen.queryByLabelText(/schedule_modal_edit_employee_field_fullname/i)
        .value,
    ).toBe(nameEmployeeForTest);

    userEvent.click(
      screen.getByLabelText(/schedule_modal_edit_employee_submit_button/i),
    );

    expect(getAllSchedules()[2].employees[0].fullname).toBe(
      nameEmployeeForTest,
    );

    reset();
  });
});
