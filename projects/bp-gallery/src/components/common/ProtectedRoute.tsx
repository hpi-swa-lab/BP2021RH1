import { PropsWithChildren } from 'react';
import { Redirect } from 'react-router';
import { AuthRole, useAuth } from '../provider/AuthProvider';
import { FALLBACK_PATH } from './../routes';
import { useTranslation } from 'react-i18next';

interface ProtectedRouteProps {
  redirectPath?: string;
  minRole?: AuthRole;
}

const ProtectedRoute = ({
  redirectPath = FALLBACK_PATH,
  minRole = AuthRole.CURATOR,
  children,
}: PropsWithChildren<ProtectedRouteProps>) => {
  const { role, loading } = useAuth();
  const { t } = useTranslation();

  if (role < minRole) {
    // protect from unauthorized access (e. g. people manually entering the url)
    if (loading) {
      return <>{t('common.checkingAuth')}</>;
    } else {
      return <Redirect to={redirectPath} />;
    }
  } else {
    return <>{children}</>;
  }
};

export default ProtectedRoute;
