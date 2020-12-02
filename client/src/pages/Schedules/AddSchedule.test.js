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
import getYearMonthDays from '../../utils/getYearMonthDays';

import {adminOne} from '../../test/data/admins';
import {getAllSchedules, reset} from '../../test/data/schedules';

import AddSchedule from './AddSchedule';

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

describe('testing schedule page', () => {
  const testDataForSchedule = {
    year: getYearMonthDays().year,
    nameOfMonth: getYearMonthDays().month,
    daysOfMonth: getYearMonthDays().days,
    weekdays: getYearMonthDays().weekdays,
    weekends: getYearMonthDays().weekends,
    holidays: getYearMonthDays().holidays,
    beforeHolidays: getYearMonthDays().holidays,
  };

  test('should be displayed Addschedule page with all elements', async () => {
    window.sessionStorage.setItem('email', adminOne.email);
    render(<AddSchedule />);
    await waitForLoadingToFinish();
    //title
    expect(screen.queryByLabelText(/add_schedule_title/i).textContent).toBe(
      `The schedule for ${testDataForSchedule.nameOfMonth} ${testDataForSchedule.year}.`,
    );
    //header for four input fields
    expect(
      screen.queryByLabelText(/add_schedule_feature_header_nameSchedule/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/add_schedule_feature_header_theader/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/add_schedule_feature_header_typeOfWeek/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(
        /add_schedule_feature_header_amountOfWorkingHours/i,
      ),
    ).toBeInTheDocument();

    //days for selection
    expect(
      screen.queryAllByLabelText(/add_schedule_check_day_input_weekdays/i),
    ).toHaveLength(testDataForSchedule.daysOfMonth);
    expect(
      screen.queryAllByLabelText(/add_schedule_check_day_input_weekends/i),
    ).toHaveLength(testDataForSchedule.daysOfMonth);
    expect(
      screen.queryAllByLabelText(/add_schedule_check_day_input_holidays/i),
    ).toHaveLength(testDataForSchedule.daysOfMonth);
    expect(
      screen.queryAllByLabelText(
        /add_schedule_check_day_input_beforeHolidays/i,
      ),
    ).toHaveLength(testDataForSchedule.daysOfMonth);

    //colored days
    expect(
      screen.queryByLabelText(/add_schedule_colored_days/i),
    ).toBeInTheDocument();
    expect(
      screen.queryAllByLabelText(/add_schedule_item_colored_days/i),
    ).toHaveLength(testDataForSchedule.daysOfMonth);

    //users
    expect(
      screen.queryAllByLabelText(/add_schedule_table_user_item/i),
    ).toHaveLength(2);

    expect(
      screen.queryAllByLabelText(/add_schedule_user_list_item/i),
    ).toHaveLength(2);
    expect(
      screen.queryByLabelText(/add_schedule_user_list_button_select_all/i)
        .textContent,
    ).toBe(`Select All`);
    expect(
      screen.queryByLabelText(/add_schedule_user_list_button_clear_all/i)
        .textContent,
    ).toBe(`Clear All`);
  }, 35000);

  test('should create new schedule with name scheduleTestFour and userTwo as employee', async () => {
    const nameForSchedule = 'scheduleTestFour';
    window.sessionStorage.setItem('email', adminOne.email);
    render(<AddSchedule />);

    expect(getAllSchedules()).toHaveLength(3);
    userEvent.type(
      screen.getByLabelText(/add_schedule_feature_header_nameSchedule/i),
      nameForSchedule,
    );

    expect(
      screen.getByLabelText(/add_schedule_list_user_userOne/i),
    ).toBeChecked();
    userEvent.click(screen.getByLabelText(/add_schedule_list_user_userOne/i));
    expect(
      screen.queryByLabelText(/add_schedule_feature_header_nameSchedule/i)
        .value,
    ).toBe(nameForSchedule);
    expect(
      screen.getByLabelText(/add_schedule_list_user_userOne/i),
    ).not.toBeChecked();
    expect(
      screen.getByLabelText(/add_schedule_list_user_userTwo/i),
    ).toBeChecked();

    userEvent.click(screen.getByLabelText(/add_schedule_button_add_schedule/i));

    expect(getAllSchedules()).toHaveLength(4);
    expect(getAllSchedules()[3].owner).toBe(adminOne.email);
    expect(getAllSchedules()[3].nameSchedule).toBe(nameForSchedule);
    expect(getAllSchedules()[3].employees).toHaveLength(1);
    expect(getAllSchedules()[3].employees[0].fullname).toBe('userTwo');

    reset();
  });
});
