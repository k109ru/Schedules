import React from 'react';
import {any} from 'prop-types';
// import {Router} from 'react-router-dom';
// import {createMemoryHistory} from 'history';
// import {createStore} from 'redux';
// import {Provider} from 'react-redux';
import {render as rtlRender, screen} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import {create, reset} from '../../test/data/admins';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {build, fake} from '@jackfranklin/test-data-bot';
import {rest} from 'msw';

import {server} from '../../test/server/test-server';
import {waitForLoadingToFinish} from '../../test/utils/test-utils';
import {FormRegistration} from './FormRegistration';

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

describe('Testing Registration Form page', () => {
  test('should show the registration form with all elements', () => {
    const {getByLabelText, queryByLabelText} = render(<FormRegistration />);

    expect(getByLabelText(/registration_form_title/i)).toHaveTextContent(
      'registrationTitle',
    );
    expect(getByLabelText(/registration_form_name/i)).toHaveTextContent(
      'registrationName',
    );
    expect(getByLabelText(/registration_form_email/i)).toHaveTextContent(
      'registrationEmail',
    );
    expect(getByLabelText(/registration_form_password/i)).toHaveTextContent(
      'registrationPassword',
    );
    expect(
      getByLabelText(/registration_form_confirm_password/i),
    ).toHaveTextContent('registrationConfirmPassword');
    expect(getByLabelText(/registration_form_button/i)).toHaveTextContent(
      'registrationButton',
    );
    expect(getByLabelText(/registration_form_button/i)).toHaveAttribute(
      'disabled',
    );
    expect(queryByLabelText(/registration_form_button/i)).toBeDisabled();
  });

  test('should create a new account with correct credentials', async () => {
    render(<FormRegistration />);
    const {email, password, username} = buildLoginForm();

    userEvent.type(
      screen.getByLabelText(/registration_form_input_name/i),
      username,
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_email/i),
      email,
    );
    expect(screen.queryByLabelText(/registration_form_button/i)).toBeDisabled();
    userEvent.type(
      screen.getByLabelText(/registration_form_input_password/i),
      password.concat('@1'),
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_confirm_password/i),
      password.concat('@1'),
    );
    expect(
      screen.queryByLabelText(/registration_form_button/i),
    ).not.toBeDisabled();
    userEvent.click(screen.getByLabelText(/registration_form_button/i));

    await waitForLoadingToFinish();
    expect(window.sessionStorage.getItem('email')).toBe(email);
    expect(window.sessionStorage.getItem('name')).toBe(username);
    expect(window.sessionStorage.getItem('signedIn')).toBe('true');
    reset();
  });

  test('should not create a new account with existing email', async () => {
    render(<FormRegistration />);
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});

    userEvent.type(
      screen.getByLabelText(/registration_form_input_name/i),
      username,
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_email/i),
      email,
    );
    expect(screen.queryByLabelText(/registration_form_button/i)).toBeDisabled();
    userEvent.type(
      screen.getByLabelText(/registration_form_input_password/i),
      password.concat('@1'),
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_confirm_password/i),
      password.concat('@1'),
    );
    expect(
      screen.queryByLabelText(/registration_form_button/i),
    ).not.toBeDisabled();
    userEvent.click(screen.getByLabelText(/registration_form_button/i));

    await waitForLoadingToFinish();
    // screen.debug()
    expect(
      screen.queryByLabelText(/registration_form_exist_email/i),
    ).toHaveTextContent(`registrationEmail ${email} existEmail`);
  });

  test('button signup should stay disable if we do not type name or email (or email not correct)', () => {
    render(<FormRegistration />);

    expect(screen.queryByLabelText(/registration_form_button/i)).toBeDisabled();
    userEvent.type(
      screen.getByLabelText(/registration_form_input_name/i),
      'test',
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_email/i),
      '1@1',
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_password/i),
      'testPassword@1df22',
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_confirm_password/i),
      'testPassword@1df22',
    );
    expect(screen.queryByLabelText(/registration_form_button/i)).toBeDisabled();
  });

  test('should be displayed a message weak password', () => {
    render(<FormRegistration />);
    userEvent.type(
      screen.getByLabelText(/registration_form_input_name/i),
      'test',
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_email/i),
      '1@1.ru',
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_password/i),
      'weakPassword',
    );

    expect(screen.queryByLabelText(/registration_form_button/i)).toBeDisabled();
    expect(
      screen.queryByLabelText(/registration_form_weak_password/i),
    ).toHaveTextContent(`badPassword`);
  });

  test('should be displayed a message not equal password', () => {
    render(<FormRegistration />);
    userEvent.type(
      screen.getByLabelText(/registration_form_input_password/i),
      '123@AbcD123',
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_confirm_password/i),
      '456@AbcD789',
    );

    expect(screen.queryByLabelText(/registration_form_button/i)).toBeDisabled();
    expect(
      screen.queryByLabelText(/registration_form_not_equal_password/i),
    ).toHaveTextContent(`notEqualPassword`);
  });

  test('should not reseive a response from server', async () => {
    server.use(
      rest.post(
        `${process.env.REACT_APP_API_URL}/registration`,
        async (req, res) => {
          return res.networkError('Failed to connect');
        },
      ),
    );
    render(<FormRegistration />);
    const {email, password, username} = buildLoginForm();

    userEvent.type(
      screen.getByLabelText(/registration_form_input_name/i),
      username,
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_email/i),
      email,
    );
    expect(screen.queryByLabelText(/registration_form_button/i)).toBeDisabled();
    userEvent.type(
      screen.getByLabelText(/registration_form_input_password/i),
      password.concat('@1'),
    );
    userEvent.type(
      screen.getByLabelText(/registration_form_input_confirm_password/i),
      password.concat('@1'),
    );
    expect(
      screen.queryByLabelText(/registration_form_button/i),
    ).not.toBeDisabled();
    userEvent.click(screen.getByLabelText(/registration_form_button/i));

    await waitForLoadingToFinish();

    expect(
      screen.queryByLabelText(/modal_error_window_message/i).textContent,
    ).toBe('AbortError: Aborted');
    reset();
  });
});
