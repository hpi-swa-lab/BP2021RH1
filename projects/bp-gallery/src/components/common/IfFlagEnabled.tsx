import { IfFeatureEnabled } from '@growthbook/growthbook-react';
import { PropsWithChildren } from 'react';
import { FeatureId } from '../../helpers/growthbook';

export const IfFlagEnabled = ({ children, feature }: PropsWithChildren<{ feature: FeatureId }>) => (
  <IfFeatureEnabled feature={feature}>{children}</IfFeatureEnabled>
);
