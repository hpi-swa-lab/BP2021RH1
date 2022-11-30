import { Jodit } from 'jodit';

const forbiddenStartTags = ['b'];

const { cleanFromWord } = Jodit.modules.Helpers;

const removeLastBr = (html: string) => {
  const end = html.substring(html.length - 4, html.length + 1);
  return end === '<br>' ? html.substring(0, html.length - 4) : html;
};

const replaceParagraphs = (html: string) => {
  return html
    .replaceAll('<p>', '')
    .replaceAll('</p>', '<br>')
    .replaceAll('<span>', '')
    .replaceAll('</span>', '');
};

const removeForbiddenStartTags = (html: string, tags: string[]) => {
  let str = html;
  tags.forEach(tag => {
    const startTag = `<${tag}>`;
    const endTag = `</${tag}>`;
    if (str.startsWith(startTag) && str.endsWith(endTag)) {
      str = str.substring(startTag.length, str.length - endTag.length);
      return;
    }
  });
  return str;
};

const cleanupText = (html: string): string => {
  return removeForbiddenStartTags(
    removeLastBr(replaceParagraphs(cleanFromWord(html))),
    forbiddenStartTags
  );
};

export { cleanFromWord, removeLastBr, removeForbiddenStartTags, cleanupText, replaceParagraphs };
