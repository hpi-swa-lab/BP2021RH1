import React from 'react';
import JoditEditor, { Jodit } from 'jodit-react';
import { addPlugins } from './helpers/jodit-plugins';
import defaultJoditConfig from './helpers/jodit-config';

export interface EditorProps {
  value: string;
  /** Additional configuration options for the editor. See {@link https://xdsoft.net/jodit/docs/classes/config.Config.html} */
  extraOptions?: Partial<Jodit['options']>;
  onChange?: (newValue: string) => void;
  onBlur?: (newValue: string) => void;
}

addPlugins();

/**
 * Wrapper for JoditEditor with additional plugins and default configuration
 */
const Editor = ({ value, extraOptions, onChange, onBlur }: EditorProps) => {
  return (
    <JoditEditor
      value={value}
      config={{ ...defaultJoditConfig, ...extraOptions }}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default Editor;
