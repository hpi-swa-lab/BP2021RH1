import * as React from 'react';
import { IJodit } from 'jodit';

export interface IJoditEditorProps {
  value: string;
  config?: IJodit['options'];
  onChange: (newValue: string) => void;
  onBlur: (newValue: string) => void;
}

declare const JoditEditor: React.ComponentType<IJoditEditorProps>;
export default JoditEditor;
