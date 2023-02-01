import React, { ReactChild, ReactChildren } from 'react';
import { Redirect } from 'react-router';
import { AuthRole, useAuth } from '../provider/AuthProvider';
import { FALLBACK_PATH } from './../routes';

interface ProtectedRouteProps {
  redirectPath?: string;
  minRole?: AuthRole;
  children: ReactChild | ReactChildren;
}

const ProtectedRoute = ({
  redirectPath = FALLBACK_PATH,
  minRole = AuthRole.CURATOR,
  children,
}: ProtectedRouteProps) => {
  const { role, loading } = useAuth();

  if (role < minRole) {
    // protect from unauthorized access (e. g. people manually entering the url)
    if (loading) {
      return <>Checking authorization...</>;
    } else {
      return <Redirect to={redirectPath} />;
    }
  } else {
    return <>{children}</>;
  }
};

export default ProtectedRoute;
