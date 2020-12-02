import React from 'react';
import {render} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import QueryError from './QueryError';

test('renders the homepage with mutation title and subtitle', () => {
  const {container} = render(
    <I18nextProvider i18n={i18n}>
      <QueryError />
    </I18nextProvider>,
  );
  const title = container.querySelector('h4');
  const subtitle = container.querySelector('h6');

  expect(title).toHaveTextContent('Query error title');
  expect(subtitle).toHaveTextContent('Error info');
});
