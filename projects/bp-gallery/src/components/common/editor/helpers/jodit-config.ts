// import { Jodit } from 'jodit';
import i18n from '../../../../i18n';

type EnterMode = 'br';

const defaultJoditConfig = {
  preset: 'inline',
  enter: 'br' as EnterMode, //Not 'P' to avoid addition of <p> to descriptions
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  language: i18n.resolvedLanguage,
};

export default defaultJoditConfig;
