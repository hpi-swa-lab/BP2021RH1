import { Add } from '@mui/icons-material';

const AddLocationEntry = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <div className='add-tag-container' onClick={onClick}>
      <Add className='add-tag-icon' />
      <div className='add-tag-text'>{text}</div>
    </div>
  );
};

export default AddLocationEntry;
