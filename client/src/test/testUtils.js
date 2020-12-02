import checkPropTypes from 'check-prop-types';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';

import rootReducer from '../reducers';
// import { middlewares } from '../src/configureStore';

const middlewares = [ReduxThunk];
export const createStoreWithMiddleware = applyMiddleware(...middlewares)(
  createStore,
);

/**
 * Create a testing store with imported reducers, middleware, and initial state.
 *  globals: rootReducer, middlewares.
 * @param {object} initialState - Initial state for store.
 * @function storeFactory
 * @returns {Store} - Redux store.
 */

export const storeFactory = (initialState) => {
  // console.log('init', initialState)
  const createStoreWithMiddleware = applyMiddleware(...middlewares)(
    createStore,
  );
  return createStoreWithMiddleware(rootReducer, initialState);
};

/**
 * Return node(s) with the given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper.
 * @param {string} val - Value of data-test attribute for search.
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

export const checkProps = (component, conformingProps) => {
  const propError = checkPropTypes(
    component.propTypes,
    conformingProps,
    'prop',
    component.name,
  );
  expect(propError).toBeUndefined();
};
