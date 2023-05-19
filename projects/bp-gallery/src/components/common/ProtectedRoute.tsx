import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';
import { FALLBACK_PATH } from './../routes';

interface ProtectedRouteProps {
  canUse: boolean;
  canUseLoading: boolean;
  redirectPath?: string;
  children: ReactNode | (() => ReactNode);
}

const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { canUse, canUseLoading, redirectPath = FALLBACK_PATH } = props;

  const { t } = useTranslation();

  if (!canUse) {
    // protect from unauthorized access (e. g. people manually entering the url)
    if (canUseLoading) {
      return <>{t('common.checkingAuth')}</>;
    } else {
      return <Redirect to={redirectPath} />;
    }
  } else {
    if (typeof props.children === 'function') {
      return <>{props.children()}</>;
    } else {
      return <>{props.children}</>;
    }
  }
};

export default ProtectedRoute;
