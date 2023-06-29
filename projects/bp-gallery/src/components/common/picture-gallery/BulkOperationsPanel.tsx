import { IconButton } from '@mui/material';
import { ExternalCanRun } from '../../../hooks/bulk-operations.hook';
import { FlatPicture } from '../../../types/additionalFlatTypes';

export interface BulkOperation {
  icon: JSX.Element;
  name: string;
  action: (selectedPictures: FlatPicture[], onBulkEdit: () => void) => void;
  canRun: boolean | ExternalCanRun;
}

const BulkOperationsPanel = ({
  operations,
  selectedPictures,
  onBulkEdit,
  canBulkEdit,
  canCreateSequence,
}: {
  operations: BulkOperation[];
  selectedPictures: FlatPicture[];
  onBulkEdit: () => void;
  canBulkEdit: boolean;
  canCreateSequence: boolean;
}) => {
  const runnableOperations = operations.filter(operation => {
    switch (operation.canRun) {
      case ExternalCanRun.canBulkEdit:
        return canBulkEdit;
      case ExternalCanRun.canCreateSequence:
        return canCreateSequence;
      default:
        return operation.canRun satisfies boolean;
    }
  });
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
