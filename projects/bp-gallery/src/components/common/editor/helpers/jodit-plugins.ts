import { Jodit } from 'jodit';
import { cleanupText } from './format-texts';

const preparePaste = (jodit: Jodit) => {
  jodit.e.on('paste', (event: ClipboardEvent) => {
    const data = event.clipboardData?.getData('text/html') as string;
    jodit.e.stopPropagation('paste');
    jodit.s.insertHTML(cleanupText(data));
    return false;
  });
};

export const addPlugins = () => {
  Jodit.plugins.add('preparePaste', preparePaste);
};
