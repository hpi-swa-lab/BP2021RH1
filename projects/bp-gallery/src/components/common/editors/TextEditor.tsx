import { sanitize } from 'isomorphic-dompurify';
import JoditEditor, { Jodit } from 'jodit-react';
import { useMemo } from 'react';
import defaultConfig from './helpers/jodit-config';
import { addPlugins } from './helpers/jodit-plugins';

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

  return (
    <JoditEditor
      value={value}
      config={config}
      onChange={newValue => onChange?.(sanitize(newValue))}
      onBlur={newValue => onBlur?.(sanitize(newValue))}
    />
  );
};

export default TextEditor;
