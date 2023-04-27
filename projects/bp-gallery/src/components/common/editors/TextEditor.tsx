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
      // return true in both of these for the following reason:
      // Jodit calls event.stopImmediatePropagation [1] which prevents other
      // event listeners on the same element from being called, when the
      // last non-undefined return value of a listener on the editor is false.
      // One of the internal blur listeners in Jodit [2] returns false.
      // Cypress adds an event listener on every element it blurs [3] to check whether
      // the blur worked. Because of the stopImmediatePropagation, this listener
      // is never called, causing cypress to believe that the blur event didn't
      // actually work. Thus, it fires a second blur event [4] which causes our blur
      // listener to eventually be called twice. The return true in the onChange
      // is probably not actually needed, but we include it for good measure.
      //
      // [1]: https://github.com/xdan/jodit/blob/d4f0637d765df90ad1f9dd7c63e23e5f3be8dc09/src/core/event-emitter/event-emitter.ts#L315
      // [2]: https://github.com/lucky-bruce/jodit-repo/blob/c2890636858978473fc976bc4bd2dbd20d3c9a93/src/jodit.ts#L1387
      // [3]: https://github.com/cypress-io/cypress/blob/6ee305ba411c646298018a965d249a418ac68671/packages/driver/src/cy/focused.ts#L82
      // [4]: https://github.com/cypress-io/cypress/blob/6ee305ba411c646298018a965d249a418ac68671/packages/driver/src/cy/focused.ts#L97
      onChange={newValue => {
        onChange?.(sanitize(newValue));
        return true;
      }}
      onBlur={newValue => {
        onBlur?.(sanitize(newValue));
        return true;
      }}
    />
  );
};

export default TextEditor;
