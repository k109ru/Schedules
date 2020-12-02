import React from 'react';
import {Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {render as rtlRender} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from '../test/i18nForTests';

import PropTypes from 'prop-types';

import {Header} from './Header';
import reducers from '../reducers';

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
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Router history={history}>{children}</Router>
        </I18nextProvider>
      </Provider>
    );
  }

  Wrapper.propTypes = {
    children: PropTypes.node,
  };

  return {
    ...rtlRender(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
    store,
    history,
  };
}

describe('Testing Header componet', () => {
  test('can render header with all correct elements without account and logout', () => {
    const {getByLabelText, getByTestId, queryByLabelText} = render(<Header />);
    expect(getByTestId('logo-element')).toHaveAttribute('src', 'calendar.svg');

    expect(getByLabelText(/rus/i)).toHaveTextContent('rus');
    expect(getByLabelText(/eng/i)).toHaveTextContent('eng');
    expect(getByLabelText(/main_page_signin/i)).toHaveTextContent('SignIn');
    expect(getByLabelText(/main_page_signup/i)).toHaveTextContent('SignUp');

    expect(queryByLabelText(/main_page_users/i)).toBeNull();
    expect(queryByLabelText(/main_page_schedules/i)).toBeNull();
    expect(queryByLabelText(/main_page_account/i)).toBeNull();
    expect(queryByLabelText(/main_page_logout/i)).toBeNull();
  });

  test('should change menu, add items Users, Schedules, My account, Logout', () => {
    sessionStorage.setItem('signedIn', true);

    const {getByLabelText, getByTestId, queryByLabelText} = render(<Header />);

    expect(getByTestId('logo-element')).toHaveAttribute('src', 'calendar.svg');
    expect(queryByLabelText(/main_page_signin/i)).toBeNull();
    expect(queryByLabelText(/main_page_signup/i)).toBeNull();

    expect(getByLabelText(/main_page_users/i)).toHaveTextContent('users');
    expect(getByLabelText(/main_page_schedules/i)).toHaveTextContent(
      'schedules',
    );
    expect(getByLabelText(/main_page_account/i)).toHaveTextContent('account');
    expect(getByLabelText(/main_page_logout/i)).toHaveTextContent('logout');
  });
});
