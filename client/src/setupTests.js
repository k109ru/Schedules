import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import '@testing-library/jest-dom/extend-expect';

import {configure} from '@testing-library/react';
import {queryCache} from 'react-query';
// import {initReactI18next} from 'react-i18next';

import {server} from './test/server/test-server';
import * as adminsDB from './test/data/admins';

configure({defaultHidden: true});

// jest.mock('react-i18next', () => ({
//   useTranslation: () => ({t: (key) => key}),
//   Trans: ({children}) => children,
// }));

// enable API mocking in test runs using the same request handlers
// as for the client-side mocking.
beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// real times is a good default to start, individual tests can
// enable fake timers if they need.
beforeEach(() => jest.useRealTimers());

// general cleanup
afterEach(async () => {
  queryCache.clear();
  await Promise.all([adminsDB.reset()]);
});

Enzyme.configure({
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true,
});
