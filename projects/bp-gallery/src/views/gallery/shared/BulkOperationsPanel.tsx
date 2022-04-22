import { Button, Icon } from '@mui/material';
import React from 'react';
import './BulkOperationsPanel.scss';

export interface BulkOperation {
  icon: string;
  name: string;
  action: () => void;
}

const BulkOperationsPanel = ({ operations }: { operations: BulkOperation[] }) => {
  return (
    <div className='bulk-operations'>
      {operations.map((operation, index) => (
        <Button
          key={index}
          onClick={() => operation.action()}
          className='operation'
          startIcon={<Icon>{operation.icon}</Icon>}
        >
          {operation.name}
        </Button>
      ))}
    </div>
  );
};

export default BulkOperationsPanel;
