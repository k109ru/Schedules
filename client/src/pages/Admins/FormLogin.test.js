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

import {FormLogin} from './FormLogin';
import {server} from '../../test/server/test-server';
import {waitForLoadingToFinish} from '../../test/utils/test-utils';

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

//For route and redux
// function render(
//   ui,
//   {
//     initialState,
//     store = createStore(reducers, initialState),
//     route = '/',
//     history = createMemoryHistory({initialEntries: [route]}),
//     ...renderOptions
//   } = {},
// ) {
//   function Wrapper({children}) {
//     return <Provider store={store}>
//               <Router history={history}>{children}</Router>
//             </Provider>
//   }
//   return {
//     ...rtlRender(ui, {
//       wrapper: Wrapper,
//       ...renderOptions,
//     }),
//     store,
//     history,
//   }
// }

const buildLoginForm = build({
  fields: {
    email: fake((f) => f.internet.email()),
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});

describe('Testing Login Form page', () => {
  test('should show the login form with all elements', () => {
    const {getByLabelText, queryByLabelText} = render(<FormLogin />);

    expect(getByLabelText(/login_form_title/i)).toHaveTextContent('Login');
    expect(getByLabelText(/login_form_email/i)).toHaveTextContent('Email');
    expect(getByLabelText(/login_form_password/i)).toHaveTextContent(
      'Password',
    );
    expect(getByLabelText(/login_form_button/i)).toHaveTextContent('Login');
    expect(getByLabelText(/login_form_button/i)).toHaveAttribute('disabled');
    expect(queryByLabelText(/login_form_button/i)).toBeDisabled();
  });

  test('should login with correct credentials', async () => {
    render(<FormLogin />);
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});

    userEvent.type(screen.getByLabelText(/login_form_input_email/i), email);
    expect(screen.queryByLabelText(/login_form_button/i)).toBeDisabled();
    userEvent.type(
      screen.getByLabelText(/login_form_input_password/i),
      password,
    );
    expect(screen.queryByLabelText(/login_form_button/i)).not.toBeDisabled();
    userEvent.click(screen.getByLabelText(/login_form_button/i));
    await waitForLoadingToFinish();
    expect(window.sessionStorage.getItem('email')).toBe(email);
    expect(window.sessionStorage.getItem('name')).toBe(username);
    expect(window.sessionStorage.getItem('signedIn')).toBe('true');
    reset();
  });

  test('should not login with wrong password', async () => {
    render(<FormLogin />);
    const {email, password, username} = buildLoginForm();
    const wrongPassword = '123qwerty@';
    await create({email, password, username});

    userEvent.type(screen.getByLabelText(/login_form_input_email/i), email);
    expect(screen.queryByLabelText(/login_form_button/i)).toBeDisabled();
    userEvent.type(
      screen.getByLabelText(/login_form_input_password/i),
      wrongPassword,
    );
    expect(screen.queryByLabelText(/login_form_button/i)).not.toBeDisabled();
    userEvent.click(screen.getByLabelText(/login_form_button/i));
    await waitForLoadingToFinish();

    expect(screen.queryByLabelText(/wrong_password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/wrong_email/i)).not.toBeInTheDocument();

    expect(window.sessionStorage.getItem('email')).toBe('null');
    expect(window.sessionStorage.getItem('name')).toBe('null');
    expect(window.sessionStorage.getItem('signedIn')).toBe('false');
    reset();
  });

  test('should not login with wrong email (admin does not exist)', async () => {
    render(<FormLogin />);
    const {email, password, username} = buildLoginForm();
    const wrongEmail = '123qwerty@gmail.com';
    await create({email, password, username});

    userEvent.type(
      screen.getByLabelText(/login_form_input_email/i),
      wrongEmail,
    );
    expect(screen.queryByLabelText(/login_form_button/i)).toBeDisabled();
    userEvent.type(
      screen.getByLabelText(/login_form_input_password/i),
      password,
    );
    expect(screen.queryByLabelText(/login_form_button/i)).not.toBeDisabled();
    userEvent.click(screen.getByLabelText(/login_form_button/i));
    await waitForLoadingToFinish();

    expect(screen.queryByLabelText(/wrong_password/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/wrong_email/i)).toBeInTheDocument();

    expect(window.sessionStorage.getItem('email')).toBe('null');
    expect(window.sessionStorage.getItem('name')).toBe('null');
    expect(window.sessionStorage.getItem('signedIn')).toBe('false');
    reset();
  });

  test('should not reseive a response from server', async () => {
    server.use(
      rest.post(`${process.env.REACT_APP_API_URL}/login`, async (req, res) => {
        return res.networkError('Failed to connect');
      }),
    );
    render(<FormLogin />);
    const {email, password, username} = buildLoginForm();
    await create({email, password, username});

    userEvent.type(screen.getByLabelText(/login_form_input_email/i), email);
    expect(screen.queryByLabelText(/login_form_button/i)).toBeDisabled();
    userEvent.type(
      screen.getByLabelText(/login_form_input_password/i),
      password,
    );
    expect(screen.queryByLabelText(/login_form_button/i)).not.toBeDisabled();
    userEvent.click(screen.getByLabelText(/login_form_button/i));

    await waitForLoadingToFinish();

    expect(
      screen.queryByLabelText(/modal_error_window_message/i).textContent,
    ).toBe('AbortError: Aborted');
    reset();
  });
});
