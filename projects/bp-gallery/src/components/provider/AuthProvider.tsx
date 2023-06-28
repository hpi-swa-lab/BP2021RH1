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
import {
  useLoginMutation,
  useMeLazyQuery,
  useResetPasswordMutation,
} from '../../graphql/APIConnector';
import { buildHttpLink } from '../../helpers/app-helpers';
import { useAnonymousId } from '../../hooks/anonymous-id.hook';
import { AlertContext, AlertType } from './AlertProvider';

export interface AuthFields {
  userId?: string;
  username?: string;
  email?: string;
  loggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (token: string, password: string, passwordConfirmation: string) => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthFields>({
  loggedIn: false,
  login: async () => {},
  logout: () => {},
  resetPassword: async () => {},
  loading: false,
});

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);

  const [authLoading, setAuthLoading] = useState(true);

  const { t } = useTranslation();

  const [getUserInfo, { data, loading, error, called }] = useMeLazyQuery({
    fetchPolicy: 'network-only',
  });
  const [loginMutation] = useLoginMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();

  const apolloClient = useApolloClient();
  const openAlert = useContext(AlertContext);
  const anonymousId = useAnonymousId();

  // Fetch userInfo on mount
  useEffect(() => {
    if (called) return;

    const token = sessionStorage.getItem('jwt');
    apolloClient.setLink(buildHttpLink(token, { openAlert, t }, anonymousId));

    if (token) {
      getUserInfo();
    } else {
      // we won't call getUserInfo, because token won't change
      setAuthLoading(false);
    }
  }, [apolloClient, called, getUserInfo, openAlert, t, anonymousId]);

  // Save fetched userInfo in state
  useEffect(() => {
    if (!called || loading || error) return;

    setUserId(data?.me?.id);
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

  const afterLogin = useCallback(
    (errors?: readonly Error[], token?: string | null) => {
      return new Promise<void>((resolve, reject) => {
        if (errors) {
          reject(errors.map(error => error.message).join('\n'));
        } else {
          if (token) {
            sessionStorage.setItem('jwt', token);
            apolloClient.setLink(buildHttpLink(token, { openAlert, t }, anonymousId));
            getUserInfo();
            displaySuccess(t('login.successful-login'));
            resolve();
          } else {
            reject('The Login-Mutation did not return a token');
          }
        }
      });
    },
    [apolloClient, getUserInfo, displaySuccess, t, openAlert, anonymousId]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const { errors, data } = await loginMutation({ variables: { username, password } });
      const token = data?.login.jwt;
      await afterLogin(errors, token);
    },
    [loginMutation, afterLogin]
  );

  const resetPassword = useCallback(
    async (token: string, password: string, passwordConfirmation: string) => {
      const { errors, data } = await resetPasswordMutation({
        variables: {
          token,
          password,
          passwordConfirmation,
        },
      });
      const jwtToken = data?.resetPassword?.jwt;
      await afterLogin(errors, jwtToken);
    },
    [resetPasswordMutation, afterLogin]
  );

  const logout = useCallback(() => {
    apolloClient.setLink(buildHttpLink(null, { openAlert, t }, anonymousId));
    sessionStorage.removeItem('jwt');
    setUserId(undefined);
    setUsername(undefined);
    setEmail(undefined);
    displaySuccess(t('login.successful-logout'));
  }, [apolloClient, displaySuccess, t, openAlert, anonymousId]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        username,
        email,
        loggedIn: username !== undefined,
        login,
        logout,
        resetPassword,
        loading: authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
