import { Jodit } from 'jodit';

const forbiddenStartTags = ['b'];

const { cleanFromWord } = Jodit.modules.Helpers;

const removeLastBrs = (html: string) => {
  let end = html.substring(html.length - 4, html.length + 1);
  while (end === '<br>') {
    html = html.substring(0, html.length - 4);
    end = html.substring(html.length - 4, html.length + 1);
  }
  return html;
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
  return removeLastBrs(
    removeForbiddenStartTags(replaceParagraphs(cleanFromWord(html)), forbiddenStartTags)
  );
};

export { cleanFromWord, removeLastBrs, removeForbiddenStartTags, cleanupText, replaceParagraphs };
