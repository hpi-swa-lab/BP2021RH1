import React from 'react';
import { TextField } from 'mui';

interface PictureSidebarProps {
  selectedPicture: any;
  onTitleChange: (title: string) => void;
  onTitleUpdate: (title: string) => void;
}

const PictureSidebar = ({ selectedPicture, onTitleChange, onTitleUpdate }: PictureSidebarProps) => {
  const descriptionTextField =
    selectedPicture && selectedPicture.descriptions.length > 0 ? (
      <TextField
        variant='filled'
        label='Description'
        id='description'
        disabled
        multiline
        value={selectedPicture.descriptions[0].text}
      />
    ) : null;

  return (
    <div className={selectedPicture ? 'infos open' : 'infos'}>
      {selectedPicture && (
        <div
          onPointerUp={evt => {
            evt.preventDefault();
            evt.stopPropagation();
          }}
        >
          <h3>Image Metadata</h3>
          <TextField
            variant='filled'
            label='Title'
            id='title'
            disabled
            value={selectedPicture.title.text}
            onChange={evt => onTitleChange(evt.target.value)}
            onKeyDown={evt =>
              evt.keyCode === 13 && onTitleUpdate((evt.target as any).value as string)
            }
          />
          {descriptionTextField}
        </div>
      )}
    </div>
  );
};

export default PictureSidebar;
