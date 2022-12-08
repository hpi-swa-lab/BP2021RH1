import { IJodit } from 'jodit/types/types';
import i18n from '../../../../i18n';

type EnterMode = 'br';

const defaultJoditConfig = {
  preset: 'inline',
  enter: 'br' as EnterMode, //Not 'P' to avoid addition of <p> to descriptions
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  useNativeTooltip: true,
  language: i18n.resolvedLanguage,
  width: 'auto',
  disablePlugins: ['about', 'fullsize', 'classSpan'],
} as Partial<IJodit['options']>;

export default defaultJoditConfig;
