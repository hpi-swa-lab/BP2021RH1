import { Redirect } from 'react-router-dom';
import { useAuth } from '../../../../hooks/context-hooks';
import { FALLBACK_PATH } from '../../../routes';
import { UserView } from './UserView';

export const MyAccountView = () => {
  const { userId } = useAuth();
  if (!userId) {
    return <Redirect to={FALLBACK_PATH} />;
  }
  return <UserView id={userId} />;
};
