import {screen, waitForElementToBeRemoved} from '@testing-library/react';

const waitForLoadingToFinish = () =>
  waitForElementToBeRemoved(
    () => [
      ...screen.queryAllByLabelText(/loading/i),
      // ...screen.queryAllByTextId(/loading/i),
    ],
    {timeout: 4000},
  );

// export * from '@testing-library/react'
export {waitForLoadingToFinish};
