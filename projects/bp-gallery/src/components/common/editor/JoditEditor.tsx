import React, { useEffect, useRef, useState } from 'react';
import { Jodit } from 'jodit';
import { IJodit } from 'jodit/types/types';
import { addPlugins } from './helpers/jodit-plugins';

export interface JoditReactProps {
  /** Config option from Jodit */
  config?: Partial<IJodit['options']>;
  /** Jodit default value */
  value: string;
  /** Callback to update the state */
  onChange: (content: string) => void;
  onBlur: (content: string) => void;
}

addPlugins();

const JoditReact = ({ config, value, onChange, onBlur }: JoditReactProps) => {
  const textArea = useRef<HTMLTextAreaElement | null>(null);
  const [jodit, setJodit] = useState<IJodit>();

  useEffect(() => {
    if (textArea.current) {
      const joditInst = Jodit.make(textArea.current, config);
      joditInst.workplace.tabIndex = -1;

      // adding event handlers
      joditInst.events.on('blur', () => onBlur(joditInst.value));
      joditInst.events.on('change', value => onChange(value));
      joditInst.events.unmute();
      setJodit(joditInst);
    }
    return () => {
      if (jodit) {
        jodit.events.mute();
      }
    };
  }, [config, onChange, onBlur, jodit]);

  useEffect(() => {
    if (jodit && jodit.value !== value) {
      jodit.value = value;
    }
  }, [jodit, value]);

  return (
    <div className={'jodit-react-container'}>
      <textarea ref={textArea} />
    </div>
  );
};

export default JoditReact;
