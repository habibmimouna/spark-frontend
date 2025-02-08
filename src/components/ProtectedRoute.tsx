import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import AuthService from '../services/auth.service';

interface ProtectedRouteProps extends Omit<RouteProps, 'component'> {
  component: React.ComponentType<any>;
  userType: 'doctor' | 'patient';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  userType,
  ...rest
}) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUserType = localStorage.getItem('userType');
  const user = AuthService.getCurrentUser();

  return (
    <Route
      {...rest}
      render={props => {

        if (!isAuthenticated) {

          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        }


        if (userType !== currentUserType) {

          return (
            <Redirect
              to={{
                pathname: `/${currentUserType}/dashboard`,
                state: { from: props.location }
              }}
            />
          );
        }


        if (!user) {

          AuthService.logout();
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;