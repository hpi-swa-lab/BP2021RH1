import { useApolloClient } from '@apollo/client';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginMutation, useMeLazyQuery } from '../../graphql/APIConnector';
import { buildHttpLink } from '../../helpers/app-helpers';
import { useAnonymousId } from '../../hooks/anonymous-id.hook';
import { AlertContext, AlertType } from './AlertProvider';

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
  loading: boolean;
}

export const AuthContext = createContext<AuthFields>({
  role: AuthRole.PUBLIC,
  login: async () => {},
  logout: () => {},
  loading: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [role, setRole] = useState<AuthRole>(AuthRole.PUBLIC);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);

  const [authLoading, setAuthLoading] = useState(true);

  const { t } = useTranslation();

  const [getUserInfo, { data, loading, error, called }] = useMeLazyQuery({
    fetchPolicy: 'network-only',
  });
  const [loginMutation] = useLoginMutation();

  const apolloClient = useApolloClient();
  const openAlert = useContext(AlertContext);
  const anonymousId = useAnonymousId();

  // Fetch userInfo on mount
  useEffect(() => {
    if (called) return;

    const token = sessionStorage.getItem('jwt');
    apolloClient.setLink(buildHttpLink(token, openAlert, anonymousId));

    if (token) {
      getUserInfo();
    } else {
      // we won't call getUserInfo, because token won't change
      setAuthLoading(false);
    }
  }, [apolloClient, called, getUserInfo, openAlert, anonymousId]);

  // Save fetched userInfo in state
  useEffect(() => {
    if (!called || loading || error) return;

    setRole(asAuthRole(data?.me?.role?.name ?? ''));
    setUsername(data?.me?.username);
    setEmail(data?.me?.email ?? undefined);
    setAuthLoading(false);
  }, [data, loading, error, called]);

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
              apolloClient.setLink(buildHttpLink(token, openAlert, anonymousId));
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
    [loginMutation, apolloClient, getUserInfo, displaySuccess, t, openAlert, anonymousId]
  );

  const logout = useCallback(() => {
    apolloClient.setLink(buildHttpLink(null, openAlert, anonymousId));
    sessionStorage.removeItem('jwt');
    setRole(AuthRole.PUBLIC);
    setUsername(undefined);
    setEmail(undefined);
    displaySuccess(t('login.successful-logout'));
  }, [apolloClient, displaySuccess, t, openAlert, anonymousId]);

  return (
    <AuthContext.Provider value={{ role, username, email, login, logout, loading: authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
