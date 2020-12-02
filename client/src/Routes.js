import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {object, any} from 'prop-types';

import HomePage from './pages/HomePage/HomePage';
import FormRegistration from './pages/Admins/FormRegistration';
import FormLogin from './pages/Admins/FormLogin';
import Admin from './pages/Admins/Admin';

import AddSchedule from './pages/Schedules/AddSchedule';

import Users from './pages/Users/Users';
import Schedule from './pages/Schedules/Schedule';
import Schedules from './pages/Schedules/Schedules';
import QueryError from './pages/Errors/QueryError';
import MutationError from './pages/Errors/MutationError';
import NotFound from './pages/NotFound/NotFound';

function PrivateRoute({component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        const allowedAccess = sessionStorage.getItem('signedIn');

        return allowedAccess === 'true' ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: props.location},
            }}
          />
        );
      }}
    />
  );
}

const Routers = () => {
  return (
    <Switch>
      <Route path="/" component={HomePage} exact />
      <Route path="/registration" component={FormRegistration} exact />
      <Route path="/login" component={FormLogin} exact />
      <PrivateRoute path="/admin" component={Admin} exact />
      <PrivateRoute path="/users" component={Users} exact />
      <PrivateRoute path="/schedules" component={Schedules} exact />
      <PrivateRoute path="/schedule/:id" component={Schedule} exact />
      <PrivateRoute path="/add-schedule" component={AddSchedule} exact />
      <Route path="/query-error" component={QueryError} exact />
      <Route path="/mutation-error" component={MutationError} exact />
      <Route component={NotFound} />
    </Switch>
  );
};

PrivateRoute.propTypes = {
  component: any,
  location: object,
};

export default Routers;
