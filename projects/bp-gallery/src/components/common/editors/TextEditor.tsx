import { useMemo } from 'react';
import JoditEditor, { Jodit } from 'jodit-react';
import { addPlugins } from './helpers/jodit-plugins';
import defaultConfig from './helpers/jodit-config';

export interface TextEditorProps {
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
const TextEditor = ({ value, extraOptions, onChange, onBlur }: TextEditorProps) => {
  const config = useMemo(() => ({ ...defaultConfig, ...extraOptions }), [extraOptions]);

  return <JoditEditor value={value} config={config} onChange={onChange} onBlur={onBlur} />;
};

export default TextEditor;