import { Jodit } from 'jodit-react';
import { cleanupText } from './format-texts';

const preparePaste = (jodit: Jodit) => {
  jodit.e.on('paste', (event: ClipboardEvent) => {
    const html = event.clipboardData?.getData('text/html') as string;
    // necessary since pasting out of e.g. address bar would return an empty string otherwise
    const text = event.clipboardData?.getData('text') as string;
    jodit.e.stopPropagation('paste');
    jodit.s.insertHTML(html ? cleanupText(html) : text);
    return false;
  });
};

export const addPlugins = () => {
  Jodit.plugins.add('preparePaste', preparePaste);
};
