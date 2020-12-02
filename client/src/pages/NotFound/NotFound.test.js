import React from 'react';
import {render} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import NotFound from './NotFound';

test('renders the NotFound page with a message "Page not found"', () => {
  const {container} = render(
    <I18nextProvider i18n={i18n}>
      <NotFound />
    </I18nextProvider>,
  );
  const appHeader = container.querySelector('h2');

  expect(appHeader).toHaveTextContent('Page not found');
});
