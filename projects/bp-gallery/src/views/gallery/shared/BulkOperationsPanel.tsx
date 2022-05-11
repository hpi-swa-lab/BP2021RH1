import { Button, Icon } from '@mui/material';
import React from 'react';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import './BulkOperationsPanel.scss';

export interface BulkOperation {
  icon: string;
  name: string;
  action: (selectedPictures: FlatPicture[]) => void;
}

const BulkOperationsPanel = ({
  operations,
  selectedPictures,
}: {
  operations: BulkOperation[];
  selectedPictures: FlatPicture[];
}) => {
  return (
    <div className='bulk-operations'>
      {operations.map((operation, index) => (
        <Button
          key={index}
          onClick={() => operation.action(selectedPictures)}
          className='operation'
          startIcon={<Icon>{operation.icon}</Icon>}
          variant='contained'
        >
          {operation.name}
        </Button>
      ))}
    </div>
  );
};

export default BulkOperationsPanel;
