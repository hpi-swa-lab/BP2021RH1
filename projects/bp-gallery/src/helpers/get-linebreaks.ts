// Source: https://stackoverflow.com/questions/55604798/find-rendered-line-breaks-with-javascript
import { sanitize } from 'isomorphic-dompurify';

const getLineBreaks = (node?: Node) => {
  if (!node?.parentNode || node.nodeType !== 3) return [];
  const range = document.createRange();
  const lines = [];
  range.setStart(node, 0);
  let prevBottom = range.getBoundingClientRect().bottom;
  const str: string = node.textContent ?? '';
  let current = 1;
  let lastFound = 0;
  let bottom = 0;
  while (current <= str.length) {
    range.setStart(node, current);
    if (current < str.length - 1) range.setEnd(node, current + 1);
    bottom = range.getBoundingClientRect().bottom;
    if (bottom > prevBottom) {
      lines.push(str.substr(lastFound, current - lastFound));
      prevBottom = bottom;
      lastFound = current;
    }
    current++;
  }
  lines.push(str.substr(lastFound));

  return lines;
};

export const getIsLong = (element: HTMLElement | null, text: string, maxLines: number) => {
  if (!element) return false;

  const buffer = document.createElement('div');
  //necessary to get calculcated line count as close to real line count as possible
  const formattedText = sanitize(
    text.replaceAll('\n', ' ').replaceAll('<br>', '\n').replaceAll('&nbsp;', ' '),
    {
      ALLOWED_TAGS: [],
    }
  );
  buffer.className = element.className;
  buffer.innerText = formattedText;
  element.parentElement?.appendChild(buffer);
  let lines = 0;
  buffer.childNodes.forEach(node => {
    //check for empty line that would otherwise not be counted
    if (node.nodeName === 'BR' && node.previousSibling?.nodeName === 'BR') {
      lines = lines + 1;
      return;
    }
    lines = lines + getLineBreaks(node).length;
  });
  buffer.remove();
  return lines > maxLines;
};

export default getLineBreaks;
