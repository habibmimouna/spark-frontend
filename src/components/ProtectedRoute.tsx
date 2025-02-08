// src/components/ProtectedRoute.tsx
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
        // Check if user is authenticated
        if (!isAuthenticated) {
          // Redirect to login with return url
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        }

        // Check if user has the correct type
        if (userType !== currentUserType) {
          // Redirect to appropriate dashboard
          return (
            <Redirect
              to={{
                pathname: `/${currentUserType}/dashboard`,
                state: { from: props.location }
              }}
            />
          );
        }

        // Check if user data exists
        if (!user) {
          // Force logout if user data is missing
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

        // Render protected component
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;