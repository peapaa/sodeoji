import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function ProtectedAdmin({ user, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (user.displayName == 'admin') {
          return React.cloneElement(children, { user });
        }
        else {
          return (
            <Redirect
              to={{
                pathname: ROUTES.DASHBOARD,
                state: { from: location }
              }}
            />
          );
        }
      }}
    />
  );
}

ProtectedAdmin.propTypes = {
  user: PropTypes.object,
  children: PropTypes.object.isRequired
};
