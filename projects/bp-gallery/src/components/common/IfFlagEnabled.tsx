import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import { PropsWithChildren } from 'react';
import { FeatureId } from '../../helpers/growthbook';

const growthbookApiHost = import.meta.env.VITE_REACT_APP_GROWTHBOOK_APIHOST;
const growthbookClientKey = import.meta.env.VITE_REACT_APP_GROWTHBOOK_CLIENTKEY;

export const IfFlagEnabled = ({ children, feature }: PropsWithChildren<{ feature: FeatureId }>) => {
  if (growthbookApiHost && growthbookClientKey) {
    return <IfFeatureEnabled feature={feature}>{children}</IfFeatureEnabled>;
  }
  return <>{children}</>;
};
