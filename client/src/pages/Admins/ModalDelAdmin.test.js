import React from 'react';
import {Router} from 'react-router-dom';
import {any} from 'prop-types';
import {createMemoryHistory} from 'history';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from '../../reducers';
import {deletedAdmin} from '../../actions';
import {render as rtlRender, screen} from '@testing-library/react';

import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import {create, reset} from '../../test/data/admins';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {build, fake} from '@jackfranklin/test-data-bot';

import {waitForLoadingToFinish} from '../../test/utils/test-utils';
import {ModalAdminDel} from './ModalDelAdmin';

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

describe('Testing modal delete admin account', () => {
  test('should show the Modal delete admin account with all elements', async () => {
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});
    window.sessionStorage.setItem('email', email);
    window.sessionStorage.setItem('name', username);
    window.sessionStorage.setItem('signedIn', true);
    render(<ModalAdminDel />);
    expect(
      screen.getByLabelText(/modal_close_button_delete_admin/i),
    ).toHaveTextContent('Close');

    expect(
      screen.getByLabelText(/modal_message_part_one_delete_admin/i),
    ).toHaveTextContent('Do you realy want to delete');
    expect(
      screen.getByLabelText(/modal_message_part_two_delete_admin/i),
    ).toHaveTextContent('your account');
    expect(
      screen.getByLabelText(/modal_email_delete_admin/i),
    ).toHaveTextContent(`${email}`);

    expect(
      screen.getByLabelText(/modal_warning_delete_admin/i),
    ).toHaveTextContent('All your data will be destroyed');

    expect(
      screen.getByLabelText(/modal_password_text_delete_admin/i),
    ).toHaveTextContent('accountPassord');
    expect(
      screen.getByLabelText(/modal_password_input_delete_admin/i),
    ).toBeTruthy();
    expect(
      screen.getByLabelText(/modal_button_yes_delete_admin/i),
    ).toHaveTextContent('Yes');
    expect(
      screen.getByLabelText(/modal_button_yes_delete_admin/i),
    ).toHaveAttribute('disabled');
    expect(
      screen.getByLabelText(/modal_button_no_delete_admin/i),
    ).toHaveTextContent('No');
    expect(
      screen.getByLabelText(/modal_button_no_delete_admin/i),
    ).not.toHaveAttribute('disabled');
    reset();
  });

  test('should delete admin account with correct credentials', async () => {
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});
    window.sessionStorage.setItem('email', email);
    window.sessionStorage.setItem('name', username);
    window.sessionStorage.setItem('signedIn', true);
    render(<ModalAdminDel deletedAdmin={deletedAdmin} />);

    userEvent.type(
      screen.getByLabelText(/modal_password_input_delete_admin/i),
      password,
    );
    expect(
      screen.getByLabelText(/modal_button_yes_delete_admin/i),
    ).not.toHaveAttribute('disabled');

    expect(window.sessionStorage.getItem('email')).toBe(email);
    userEvent.click(screen.getByLabelText(/modal_button_yes_delete_admin/i));
    await waitForLoadingToFinish();
    expect(window.sessionStorage.getItem('email')).toBe('null');
    expect(window.sessionStorage.getItem('name')).toBe('null');
    expect(window.sessionStorage.getItem('signedIn')).toBe('false');
    reset();
  });

  test('should be displayed a message email and password do not match', async () => {
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});
    window.sessionStorage.setItem('email', email);
    window.sessionStorage.setItem('name', username);
    window.sessionStorage.setItem('signedIn', true);
    render(<ModalAdminDel deletedAdmin={deletedAdmin} />);

    userEvent.type(
      screen.getByLabelText(/modal_password_input_delete_admin/i),
      'testWrongPassword',
    );

    userEvent.click(screen.getByLabelText(/modal_button_yes_delete_admin/i));
    await waitForLoadingToFinish();

    expect(
      screen.queryByLabelText(/modal_error_message_delete_admin/i),
    ).toHaveTextContent(
      `Email ${email} and password do not match, please retry`,
    );

    reset();
  });
});
