import React from 'react';
import {Router} from 'react-router-dom';
import {any} from 'prop-types';
import {createMemoryHistory} from 'history';
import {createStore} from 'redux';
import reducers from '../../reducers';
import {Provider} from 'react-redux';
import {render as rtlRender, screen} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import {create, reset} from '../../test/data/admins';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {build, fake} from '@jackfranklin/test-data-bot';
import {Admin} from './Admin';

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
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Router history={history}>{children}</Router>
        </I18nextProvider>
      </Provider>
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

const buildLoginForm = build({
  fields: {
    email: fake((f) => f.internet.email()),
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});

describe('Testing Admin page', () => {
  test('renders all elements of admin page', async () => {
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});
    window.sessionStorage.setItem('email', email);
    window.sessionStorage.setItem('name', username);
    window.sessionStorage.setItem('signedIn', true);
    render(<Admin />);
    expect(
      screen.queryByLabelText(/admin_page_welcom_message/i).textContent,
    ).toBe(` welcome ${username}`);

    expect(
      screen.queryByLabelText(/admin_page_email_message/i).textContent,
    ).toBe(` welcome email ${email}`);

    expect(
      screen.queryByLabelText(/admin_page_update_button/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(/admin_page_delete_button/i),
    ).toBeInTheDocument();
    reset();
  });

  test('can be opened and closed modal window for update password', async () => {
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});
    window.sessionStorage.setItem('email', email);
    window.sessionStorage.setItem('name', username);
    window.sessionStorage.setItem('signedIn', true);
    render(<Admin />);

    userEvent.click(screen.getByLabelText(/admin_page_update_button/i));
    expect(screen.queryByLabelText(/modal_update_admin_password/i)).toHaveClass(
      'display-block',
    );
    userEvent.click(
      screen.getByLabelText(/modal_close_button_update_admin_password/i),
    );
    expect(screen.queryByLabelText(/modal_update_admin_password/i)).toHaveClass(
      'display-none',
    );
    reset();
  });

  test('can be opened and closed modal window for delete admin account', async () => {
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});
    window.sessionStorage.setItem('email', email);
    window.sessionStorage.setItem('name', username);
    window.sessionStorage.setItem('signedIn', true);
    render(<Admin />);

    userEvent.click(screen.getByLabelText(/admin_page_delete_button/i));
    expect(screen.queryByLabelText(/modal_delete_admin/i)).toHaveClass(
      'display-block',
    );
    userEvent.click(screen.getByLabelText(/modal_close_button_delete_admin/i));
    expect(screen.queryByLabelText(/modal_delete_admin/i)).toHaveClass(
      'display-none',
    );
    reset();
  });
});
