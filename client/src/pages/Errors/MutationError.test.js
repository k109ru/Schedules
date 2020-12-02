import React from 'react';
import {render} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import i18n from '../../test/i18nForTests';

import MutationError from './MutationError';

test('renders the homepage with mutation title and subtitle', () => {
  const {container} = render(
    <I18nextProvider i18n={i18n}>
      <MutationError />
    </I18nextProvider>,
  );
  const title = container.querySelector('h4');
  const subtitle = container.querySelector('h6');

  expect(title).toHaveTextContent('Mutation error title');
  expect(subtitle).toHaveTextContent('Error info');
});
