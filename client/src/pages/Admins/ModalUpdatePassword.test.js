import React from 'react';
import {any} from 'prop-types';
// import {Router} from 'react-router-dom';
// import {createMemoryHistory} from 'history';
// import {createStore} from 'redux';
// import {Provider} from 'react-redux';
// import reducers from '../../reducers';
// import {deletedAdmin, authorization} from '../../actions';
import {render as rtlRender, screen} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import {create, reset, authenticate} from '../../test/data/admins';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {build, fake} from '@jackfranklin/test-data-bot';

import {waitForLoadingToFinish} from '../../test/utils/test-utils';
import ModalUpdatePassword from './ModalUpdatePassword';

//for I18next
function render(ui, {...renderOptions} = {}) {
  function Wrapper({children}) {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  }

  Wrapper.propTypes = {children: any};

  return {
    ...rtlRender(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  };
}

const buildLoginForm = build({
  fields: {
    email: fake((f) => f.internet.email()),
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});

describe('Testing modal update admin password', () => {
  test('should show the Modal update password for admin', async () => {
    render(<ModalUpdatePassword />);

    expect(
      screen.getByLabelText(/modal_close_button_update_admin_password/i),
    ).toHaveTextContent('Close');

    expect(
      screen.getByLabelText(/modal_password_update_admin/i),
    ).toHaveTextContent('accountPassord');
    expect(
      screen.getByLabelText(/modal_input_password_update_admin/i),
    ).toBeTruthy();

    expect(
      screen.getByLabelText(/modal_new_password_update_admin/i),
    ).toHaveTextContent('accountNewPassword');
    expect(
      screen.getByLabelText(/modal_input_new_password_update_admin/i),
    ).toBeTruthy();

    expect(
      screen.getByLabelText(/modal_confirm_password_update_admin/i),
    ).toHaveTextContent('accountConfirmPassword');
    expect(
      screen.getByLabelText(/modal_input_confirm_password_update_admin/i),
    ).toBeTruthy();

    expect(
      screen.getByLabelText(/modal_button_update_admin/i),
    ).toHaveTextContent('Update password');
  });

  test('should update admin password with correct credentials', async () => {
    const {email, password, username} = buildLoginForm();
    const newpassword = password.concat('123456');
    await create({email, password, username});

    let admin = await authenticate({email, password});

    render(<ModalUpdatePassword email={email} />);

    userEvent.type(
      screen.getByLabelText(/modal_input_password_update_admin/i),
      password,
    );
    userEvent.type(
      screen.getByLabelText(/modal_input_new_password_update_admin/i),
      newpassword,
    );
    userEvent.type(
      screen.getByLabelText(/modal_input_confirm_password_update_admin/i),
      newpassword,
    );

    userEvent.click(screen.getByLabelText(/modal_button_update_admin/i));
    await waitForLoadingToFinish();

    expect(await authenticate({email, password})).toHaveProperty(
      'wrongPassword',
      true,
    );
    expect(await authenticate({email, password: newpassword})).toBeTruthy();

    let updatedAdmin = await authenticate({email, password: newpassword});
    expect(updatedAdmin.passwordHash).not.toBe(admin.passwordHash);

    reset();
  });

  test('should be displayed a message email and password do not match', async () => {
    const {email, password, username} = buildLoginForm();
    const newpassword = password.concat('123456');
    await create({email, password, username});
    // window.sessionStorage.setItem('email', email);
    // window.sessionStorage.setItem('name', username);
    // window.sessionStorage.setItem('signedIn', true);

    render(<ModalUpdatePassword email={email} />);

    userEvent.type(
      screen.getByLabelText(/modal_input_password_update_admin/i),
      'testWrongPassword',
    );
    userEvent.type(
      screen.getByLabelText(/modal_input_new_password_update_admin/i),
      newpassword,
    );
    userEvent.type(
      screen.getByLabelText(/modal_input_confirm_password_update_admin/i),
      newpassword,
    );

    userEvent.click(screen.getByLabelText(/modal_button_update_admin/i));
    await waitForLoadingToFinish();

    expect(
      screen.queryByLabelText(/modal_message_wrong_email_update_admin/i),
    ).toHaveTextContent(`Email ${email} wrongPassword`);
    reset();
  });

  test('should be displayed a message new password does not equal confirm password', async () => {
    const {email, password, username} = buildLoginForm();
    const newpassword = password.concat('123456');
    await create({email, password, username});
    window.sessionStorage.setItem('email', email);
    window.sessionStorage.setItem('name', username);
    window.sessionStorage.setItem('signedIn', true);

    render(<ModalUpdatePassword email={email} />);

    userEvent.type(
      screen.getByLabelText(/modal_input_password_update_admin/i),
      password,
    );
    userEvent.type(
      screen.getByLabelText(/modal_input_new_password_update_admin/i),
      newpassword,
    );
    userEvent.type(
      screen.getByLabelText(/modal_input_confirm_password_update_admin/i),
      'testWrongConfirmPassword',
    );

    expect(screen.getByLabelText(/modal_button_update_admin/i)).toHaveAttribute(
      'disabled',
    );

    expect(screen.getByLabelText(/modal_button_update_admin/i)).toBeDisabled();

    expect(
      screen.queryByLabelText(
        /modal_message_wrong_confirm_password_update_admin/i,
      ),
    ).toHaveTextContent(`notEqualPassword`);
  });
});
