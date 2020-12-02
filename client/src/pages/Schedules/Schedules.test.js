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

import {scheduleOne, scheduleTwo} from '../../test/data/schedules';

import {Schedules} from './Schedules';

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

describe('testing schedules page', () => {
  test('should be displayed schedules, button (Add schedule),select year, select month and search field', async () => {
    const refresh = jest.fn();
    render(<Schedules delSchedule={{deletedSchedule: []}} refresh={refresh} />);
    await waitForLoadingToFinish();

    expect(screen.getByText('Add Schedule')).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/form_schedule_search_input/i).placeholder,
    ).toBe(`Name of schedule`);
    expect(
      screen.queryByLabelText(/form_schedule_select_year/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/form_schedule_select_month/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleOne/i).textContent,
    ).toBe(
      `1. ${scheduleOne.year} - ${scheduleOne.month.nameOfMonth} - ${scheduleOne.nameSchedule}`,
    );
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleTwo/i).textContent,
    ).toBe(
      `2. ${scheduleTwo.year} - ${scheduleTwo.month.nameOfMonth} - ${scheduleTwo.nameSchedule}`,
    );
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleThree/i),
    ).toBeNull();
  });

  test('should be found correct schedule', () => {
    const refresh = jest.fn();
    render(<Schedules delSchedule={{deletedSchedule: []}} refresh={refresh} />);

    userEvent.type(
      screen.getByLabelText(/form_schedule_search_input/i),
      scheduleTwo.nameSchedule,
    );
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleTwo/i).textContent,
    ).toBe(
      `2. ${scheduleTwo.year} - ${scheduleTwo.month.nameOfMonth} - ${scheduleTwo.nameSchedule}`,
    );
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleOne/i),
    ).toBeNull();

    userEvent.clear(screen.getByLabelText(/form_schedule_search_input/i));

    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleOne/i).textContent,
    ).toBe(
      `1. ${scheduleOne.year} - ${scheduleOne.month.nameOfMonth} - ${scheduleOne.nameSchedule}`,
    );
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleTwo/i).textContent,
    ).toBe(
      `2. ${scheduleTwo.year} - ${scheduleTwo.month.nameOfMonth} - ${scheduleTwo.nameSchedule}`,
    );

    userEvent.type(
      screen.getByLabelText(/form_schedule_search_input/i),
      scheduleOne.nameSchedule,
    );
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleOne/i).textContent,
    ).toBe(
      `1. ${scheduleOne.year} - ${scheduleOne.month.nameOfMonth} - ${scheduleOne.nameSchedule}`,
    );
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleTwo/i),
    ).toBeNull();

    userEvent.clear(screen.getByLabelText(/form_schedule_search_input/i));

    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleOne/i).textContent,
    ).toBe(
      `1. ${scheduleOne.year} - ${scheduleOne.month.nameOfMonth} - ${scheduleOne.nameSchedule}`,
    );
    expect(
      screen.queryByLabelText(/schedule_name_text_scheduleTwo/i).textContent,
    ).toBe(
      `2. ${scheduleTwo.year} - ${scheduleTwo.month.nameOfMonth} - ${scheduleTwo.nameSchedule}`,
    );
  });

  test('should select correct year and month', async () => {
    let listOfMonth = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const refresh = jest.fn();
    render(<Schedules delSchedule={{deletedSchedule: []}} refresh={refresh} />);
    //we can't use simple year as a number ---
    //we get current year from our function getYeraMonthDays in the schedules component
    //also month.
    let initialYear = getYearMonthDays().year;
    let initialMonth = getYearMonthDays().month;

    //we don't need curren month for testing
    let notCurrentMonth = initialMonth === 'October' ? 'June' : 'July';

    expect(screen.getByText((initialYear - 1).toString())).toBeInTheDocument();
    userEvent.selectOptions(
      screen.queryByLabelText(/form_schedule_select_year/i),
      (initialYear + 1).toString(),
    );
    await waitForLoadingToFinish();
    expect(screen.getByText(initialYear.toString()).selected).toBe(false);
    expect(screen.getByText((initialYear + 1).toString()).selected).toBe(true);
    expect(screen.getByText((initialYear + 2).toString()).selected).toBe(false);
    expect(
      screen.queryByText((initialYear - 1).toString()),
    ).not.toBeInTheDocument();

    listOfMonth.forEach((month) => {
      if (month === initialMonth) {
        expect(screen.getByText(month).selected).toBe(true);
      } else {
        expect(screen.getByText(month).selected).toBe(false);
      }
    });

    userEvent.selectOptions(
      screen.queryByLabelText(/form_schedule_select_month/i),
      notCurrentMonth,
    );
    await waitForLoadingToFinish();

    listOfMonth.forEach((month) => {
      if (month === notCurrentMonth) {
        expect(screen.getByText(month).selected).toBe(true);
      } else {
        expect(screen.getByText(month).selected).toBe(false);
      }
    });
  });
});
