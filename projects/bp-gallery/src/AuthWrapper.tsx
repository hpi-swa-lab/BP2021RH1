import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLoginMutation, useMeLazyQuery } from './graphql/APIConnector';
import { httpLink } from './App';
import { useApolloClient } from '@apollo/client';
import { AlertContext, AlertType } from './views/shared/AlertWrapper';
import { useTranslation } from 'react-i18next';

export enum AuthRole {
  PUBLIC,
  AUTHENTICATED,
  MODERATOR,
  CURATOR,
}

const asAuthRole = (roleName: string) => {
  switch (roleName) {
    case 'Curator':
      return AuthRole.CURATOR;
    case 'Moderator':
      return AuthRole.MODERATOR;
    case 'Authenticated':
      return AuthRole.AUTHENTICATED;
    default:
      return AuthRole.PUBLIC;
  }
};

export interface AuthFields {
  role: AuthRole;
  username?: string;
  email?: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthFields>({
  role: AuthRole.PUBLIC,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthWrapper = ({ children }: { children: any }) => {
  const [role, setRole] = useState<AuthRole>(AuthRole.PUBLIC);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);

  const { t } = useTranslation();

  const [getUserInfo, { data, loading, error, called }] = useMeLazyQuery({
    fetchPolicy: 'network-only',
  });
  const [loginMutation] = useLoginMutation({ errorPolicy: 'all' });

  const apolloClient = useApolloClient();

  // Fetch userInfo on mount
  useEffect(() => {
    if (called) return;
    const token = sessionStorage.getItem('jwt');
    if (token) {
      apolloClient.setLink(httpLink(token));
      getUserInfo();
    }
  }, [apolloClient, called, getUserInfo]);

  // Save fetched userInfo in state
  useEffect(() => {
    if (loading || error) return;

    setRole(asAuthRole(data?.me?.role?.name ?? ''));
    setUsername(data?.me?.username);
    setEmail(data?.me?.email ?? undefined);
  }, [data, loading, error]);

  const openAlert = useContext(AlertContext);

  const displaySuccess = useCallback(
    (message: string) => {
      openAlert({ alertType: AlertType.SUCCESS, message });
    },
    [openAlert]
  );

  const login = useCallback(
    (username: string, password: string) => {
      return new Promise<void>((resolve, reject) => {
        loginMutation({ variables: { username, password } }).then(({ data, errors }) => {
          if (errors) {
            reject(errors.map(error => error.message).join('\n'));
          } else {
            const token = data?.login.jwt;
            if (token) {
              sessionStorage.setItem('jwt', token);
              apolloClient.setLink(httpLink(token));
              getUserInfo();
              displaySuccess(t('login.successful-login'));
              resolve();
            } else {
              reject('The Login-Mutation did not return a token');
            }
          }
        });
      });
    },
    [loginMutation, apolloClient, getUserInfo, displaySuccess, t]
  );

  const logout = useCallback(() => {
    apolloClient.setLink(httpLink(null));
    sessionStorage.removeItem('jwt');
    setRole(AuthRole.PUBLIC);
    setUsername(undefined);
    setEmail(undefined);
    displaySuccess(t('login.successful-logout'));
  }, [apolloClient, displaySuccess, t]);

  return (
    <AuthContext.Provider value={{ role, username, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthWrapper;
