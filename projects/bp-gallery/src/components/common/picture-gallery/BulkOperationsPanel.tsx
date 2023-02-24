import { Button } from '@mui/material';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import './BulkOperationsPanel.scss';

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
    <div className='bulk-operations'>
      {operations.map((operation, index) => (
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
