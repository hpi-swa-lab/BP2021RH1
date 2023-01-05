import { Jodit } from 'jodit-react';
import i18n from '../../../../i18n';

type EnterMode = 'br' | 'div' | 'p';

/** Default configuration options for the editor. See {@link https://xdsoft.net/jodit/docs/classes/config.Config.html} */
const defaultConfig = {
  preset: 'inline',
  enter: 'br' as EnterMode, //Not 'P' to avoid addition of <p> to descriptions
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  useNativeTooltip: true,
  language: i18n.resolvedLanguage,
  disablePlugins: ['about', 'fullsize', 'classSpan', 'addNewLine'],
} as Partial<Jodit['options']>;

export default defaultConfig;
