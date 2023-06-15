import { IconButton } from '@mui/material';
import { FlatPicture } from '../../../types/additionalFlatTypes';

export interface BulkOperation {
  icon: JSX.Element;
  name: string;
  action: (selectedPictures: FlatPicture[], onBulkEdit: () => void) => void;
}

const BulkOperationsPanel = ({
  operations,
  selectedPictures,
  onBulkEdit,
}: {
  operations: BulkOperation[];
  selectedPictures: FlatPicture[];
  onBulkEdit: () => void;
}) => {
  return (
    <>
      {operations.map((operation, index) => (
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
