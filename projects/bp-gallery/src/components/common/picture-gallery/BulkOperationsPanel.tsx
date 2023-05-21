import { Button } from '@mui/material';
import { isFunction } from 'lodash';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import './BulkOperationsPanel.scss';

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
    <div className='bulk-operations'>
      {runnableOperations.map((operation, index) => (
        <Button
          key={index}
          onClick={() => operation.action(selectedPictures, onBulkEdit)}
          className='operation'
          startIcon={operation.icon}
          variant='contained'
        >
          {operation.name}
        </Button>
      ))}
    </div>
  );
};

export default BulkOperationsPanel;
