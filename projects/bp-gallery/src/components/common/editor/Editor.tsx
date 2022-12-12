import React from 'react';
import JoditEditor, { Jodit } from 'jodit-react';
import { addPlugins } from './helpers/jodit-plugins';

export interface EditorProps {
  value: string;
  config?: Partial<Jodit['options']>;
  onChange: (newValue: string) => void;
  onBlur: (newValue: string) => void;
}

addPlugins();

const Editor = ({ value, config, onChange, onBlur }: EditorProps) => {
  return <JoditEditor value={value} config={config} onChange={onChange} onBlur={onBlur} />;
};

export default Editor;
