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

import {adminOne} from '../../test/data/admins';
import {
  fileDownloaded,
  scheduleFullForTest,
  reset,
} from '../../test/data/schedules';

import {Schedule} from './Schedule';

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
  test('should be displayed schedule with all elements', async () => {
    const match = {
      params: {
        id: scheduleFullForTest.id,
      },
    };

    render(
      <Schedule
        match={match}
        addEmployee={{deletedEmployee: [], addedEmployee: []}}
      />,
    );
    await waitForLoadingToFinish();

    //we have two tables for buttons and for days.

    //delete buttons
    expect(
      screen.queryAllByLabelText(/schedule_page_button_delete_employee/i),
    ).toHaveLength(4);
    expect(
      screen.queryAllByLabelText(/schedule_page_button_delete_employee/i)[0],
    ).toBeInTheDocument();
    expect(
      screen.queryAllByLabelText(/schedule_page_button_delete_employee/i)[1],
    ).toBeInTheDocument();
    expect(
      screen.queryAllByLabelText(/schedule_page_button_delete_employee/i)[2],
    ).toBeInTheDocument();
    expect(
      screen.queryAllByLabelText(/schedule_page_button_delete_employee/i)[3],
    ).toBeInTheDocument();

    expect(
      screen.getByText(scheduleFullForTest.nameSchedule),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(scheduleFullForTest.employees[0].fullname)[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(scheduleFullForTest.employees[1].fullname)[0],
    ).toBeInTheDocument();

    scheduleFullForTest.month.weekdays.forEach((day) => {
      //selectable or not selectable days
      expect(
        screen.queryAllByLabelText(`day_${day.num}`)[0],
      ).toBeInTheDocument();
      expect(
        screen.queryAllByLabelText(`day_${day.num}`)[1],
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByLabelText(/schedule_page_button_select_all/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/schedule_page_button_clear_selection/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/schedule_page_button_add_employee/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/schedule_page_button_edit_chosen_field/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/schedule_page_button_delete_schedule/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/schedule_page_button_download_odt_file/i),
    ).toBeInTheDocument();
  });

  test('should delete employee with name userTwo', async () => {
    const match = {
      params: {
        id: scheduleFullForTest.id,
      },
    };

    render(
      <Schedule
        match={match}
        addEmployee={{deletedEmployee: [], addedEmployee: []}}
      />,
    );

    userEvent.click(
      screen.queryAllByLabelText(
        /schedule_page_button_delete_employee_userTwo/i,
      )[0],
    );

    expect(scheduleFullForTest.employees).toHaveLength(1);
    expect(scheduleFullForTest.employees[0].fullname).toBe('userOne');

    reset();
  });

  test('should select all days of the schedule and clear selection', () => {
    const match = {
      params: {
        id: scheduleFullForTest.id,
      },
    };

    render(
      <Schedule
        match={match}
        addEmployee={{deletedEmployee: [], addedEmployee: []}}
      />,
    );
    userEvent.click(screen.getByLabelText(/schedule_page_button_select_all/i));

    expect(
      screen.getByLabelText(
        `schedule_day_1_${scheduleFullForTest.employees[0].id}`,
      ),
    ).toHaveClass('schedule__table-td--selected');
    expect(
      screen.getByLabelText(
        `schedule_day_2_${scheduleFullForTest.employees[0].id}`,
      ),
    ).toHaveClass('schedule__table-td--selected');

    userEvent.click(
      screen.getByLabelText(/schedule_page_button_clear_selection/i),
    );

    expect(
      screen.getByLabelText(
        `schedule_day_1_${scheduleFullForTest.employees[0].id}`,
      ),
    ).not.toHaveClass('schedule__table-td--selected');
    expect(
      screen.getByLabelText(
        `schedule_day_2_${scheduleFullForTest.employees[0].id}`,
      ),
    ).not.toHaveClass('schedule__table-td--selected');
  });

  test('can be opened and closed modal window for editing employee', async () => {
    const match = {
      params: {
        id: scheduleFullForTest.id,
      },
    };

    render(
      <Schedule
        match={match}
        addEmployee={{deletedEmployee: [], addedEmployee: []}}
      />,
    );

    userEvent.click(
      screen.getAllByLabelText(
        `scheule_employee_edit_button_${scheduleFullForTest.employees[0].id}`,
      )[0],
    );
    expect(
      screen.getByLabelText(/schedule_modal_edit_employee_window/i),
    ).toHaveClass('display-block');
    userEvent.click(
      screen.getAllByLabelText(/schedule_modal_edit_employee_close_button/i)[0],
    );
    expect(
      screen.getByLabelText(/schedule_modal_edit_employee_window/i),
    ).toHaveClass('display-none');
  });

  test('can be opened and closed modal window for adding employee', async () => {
    const match = {
      params: {
        id: scheduleFullForTest.id,
      },
    };

    render(
      <Schedule
        match={match}
        addEmployee={{deletedEmployee: [], addedEmployee: []}}
      />,
    );

    userEvent.click(screen.getByLabelText(`schedule_page_button_add_employee`));
    expect(
      screen.getByLabelText(/schedule_modal_add_employee_window/i),
    ).toHaveClass('display-block');
    userEvent.click(
      screen.getByLabelText(/schedule_modal_add_employee_close_button/i),
    );
    expect(
      screen.getByLabelText(/schedule_modal_add_employee_window/i),
    ).toHaveClass('display-none');
  });

  test('can be opened and closed modal window for editing fields of days', async () => {
    const match = {
      params: {
        id: scheduleFullForTest.id,
      },
    };

    render(
      <Schedule
        match={match}
        addEmployee={{deletedEmployee: [], addedEmployee: []}}
      />,
    );
    userEvent.click(screen.getByLabelText(/schedule_page_button_select_all/i));
    userEvent.click(
      screen.getByLabelText(/schedule_page_button_edit_chosen_field/i),
    );
    expect(
      screen.getByLabelText(/schedule_modal_edit_chosen_field/i),
    ).toHaveClass('display-block');
    userEvent.click(screen.getByLabelText(/schedule_modal_edit_close_button/i));
    expect(
      screen.getByLabelText(/schedule_modal_edit_chosen_field/i),
    ).toHaveClass('display-none');
    //if we didn't choose any field
    userEvent.click(
      screen.getByLabelText(/schedule_page_button_edit_chosen_field/i),
    );
    expect(
      screen.getByLabelText(/schedule_modal_empty_edit_chosen_field/i),
    ).toHaveClass('display-block');
    userEvent.click(
      screen.getByLabelText(/schedule_modal_empty_edit_close_button/i),
    );
    expect(
      screen.queryByLabelText(/schedule_modal_edit_empty_chosen_field/i),
    ).toBeNull();
  });

  test('can be opened and closed modal window for delete the schedule', async () => {
    const match = {
      params: {
        id: scheduleFullForTest.id,
      },
    };

    render(
      <Schedule
        match={match}
        addEmployee={{deletedEmployee: [], addedEmployee: []}}
      />,
    );
    userEvent.click(
      screen.getByLabelText(/schedule_page_button_delete_schedule/i),
    );
    expect(
      screen.getByLabelText(/schedule_modal_delete_schedule/i),
    ).toHaveClass('display-block');
    userEvent.click(
      screen.getByLabelText(/schedule_modal_delete_close_button/i),
    );
    expect(
      screen.getByLabelText(/schedule_modal_delete_schedule/i),
    ).toHaveClass('display-none');
  });

  test('should download odt file', async () => {
    window.sessionStorage.setItem('email', adminOne.email);
    jest.useFakeTimers();

    const match = {
      params: {
        id: scheduleFullForTest.id,
      },
    };

    render(
      <Schedule
        match={match}
        addEmployee={{deletedEmployee: [], addedEmployee: []}}
      />,
    );

    expect(fileDownloaded.getRequest).toBeFalsy();
    expect(fileDownloaded.getFile).toBeFalsy();
    userEvent.click(
      screen.getByLabelText(/chedule_page_button_download_odt_file/i),
    );
    expect(fileDownloaded.getRequest).toBeTruthy();
    await waitForLoadingToFinish();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);
    reset();
  });
});
