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

import {getAllSchedules, dayForTest, reset} from '../../test/data/schedules';

import Modal from './ModalSchedule';

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

describe('testing modal schedule window', () => {
  test('should be displayed modal window for the schedule with its all elements', () => {
    render(<Modal data={[dayForTest]} />);
    expect(
      screen.queryByLabelText(/schedule_modal_empty_edit_chosen_field/i),
    ).toBeNull();
    expect(
      screen.getByLabelText(/schedule_modal_edit_chosen_field/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_edit_close_button/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_number_days/i).textContent,
    ).toBe('You have chosen 1 days.');

    expect(
      screen.getByLabelText(/schedule_modal_params_work_firstStartWork/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_params_work_firstStopWork/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_params_work_secondStartWork/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/schedule_modal_params_work_secondStopWork/i),
    ).toBeInTheDocument();

    //type of day
    Object.keys(dayForTest.kind).forEach((type) => {
      expect(
        screen.getByLabelText(`schedule_modal_params_day_${type}`),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByLabelText(/schedule_modal_submit_button/i),
    ).toBeInTheDocument();
  });
  test('should update the schedule, employee userOne, first day of month', () => {
    const handleClose = jest.fn();
    const handleChangeValue = jest.fn();
    const handleClearSelection = jest.fn();

    render(
      <Modal
        handleClose={handleClose}
        data={[dayForTest]}
        handleChangeValue={handleChangeValue}
        handleClearSelection={handleClearSelection}
      />,
    );

    expect(
      getAllSchedules()[2].employees[0].daysOfEmployee[0].kind.businessTrip,
    ).toBeFalsy();
    userEvent.click(
      screen.getByLabelText(/schedule_modal_params_day_businessTrip/i),
    );

    userEvent.click(screen.getByLabelText(/schedule_modal_submit_button/i));
    expect(
      getAllSchedules()[2].employees[0].daysOfEmployee[0].kind.businessTrip,
    ).toBeTruthy();
    reset();
  });
});
