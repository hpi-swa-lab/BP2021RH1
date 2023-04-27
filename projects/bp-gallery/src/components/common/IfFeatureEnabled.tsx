import { IfFeatureEnabled as _IfFeatureEnabled } from '@growthbook/growthbook-react';
import { PropsWithChildren } from 'react';
import { FeatureId } from '../../helpers/growthbook';

export const IfFeatureEnabled = ({
  children,
  feature,
}: PropsWithChildren<{ feature: FeatureId }>) => (
  <_IfFeatureEnabled feature={feature}>{children}</_IfFeatureEnabled>
);
