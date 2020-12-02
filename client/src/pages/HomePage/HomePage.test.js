import React from 'react';
import {render} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import HomePage from './HomePage';

test('renders the homepage with a welcome message', () => {
  const {container} = render(
    <I18nextProvider i18n={i18n}>
      <HomePage />
    </I18nextProvider>,
  );
  const appHeader = container.querySelector('h2');

  expect(appHeader).toHaveTextContent('Homepage');
});
