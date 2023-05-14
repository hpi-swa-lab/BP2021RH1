import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import { PropsWithChildren } from 'react';
import { FeatureId, growthbook } from '../../helpers/growthbook';

export const IfFlagEnabled = ({ children, feature }: PropsWithChildren<{ feature: FeatureId }>) => {
  if (growthbook) {
    return <IfFeatureEnabled feature={feature}>{children}</IfFeatureEnabled>;
  }
  return <>{children}</>;
};
