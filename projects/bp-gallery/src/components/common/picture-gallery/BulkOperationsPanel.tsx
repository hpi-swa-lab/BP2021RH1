import { IconButton } from '@mui/material';
import { isFunction } from 'lodash';
import { FlatPicture } from '../../../types/additionalFlatTypes';

export interface BulkOperation {
  icon: JSX.Element;
  name: string;
  action: (selectedPictures: FlatPicture[], onBulkEdit: () => void) => void;
  canRun: boolean | ((canBulkEdit: boolean) => boolean);
}

const BulkOperationsPanel = ({
  operations,
  selectedPictures,
  onBulkEdit,
  canBulkEdit,
}: {
  operations: BulkOperation[];
  selectedPictures: FlatPicture[];
  onBulkEdit: () => void;
  canBulkEdit: boolean;
}) => {
  const runnableOperations = operations.filter(operation =>
    isFunction(operation.canRun) ? operation.canRun(canBulkEdit) : operation.canRun
  );
  if (runnableOperations.length === 0) {
    return null;
  }
  return (
    <>
      {runnableOperations.map((operation, index) => (
        <IconButton
          key={index}
          onClick={() => operation.action(selectedPictures, onBulkEdit)}
          color='primary'
          title={operation.name}
        >
          {operation.icon}
        </IconButton>
      ))}
    </>
  );
};

export default BulkOperationsPanel;
