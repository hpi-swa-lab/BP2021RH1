// Source: https://stackoverflow.com/questions/55604798/find-rendered-line-breaks-with-javascript
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
  const buffer = document.createElement('div');
  //the getLineBreaks method doesn't work with \n and writing text manually in the editor generates <br> tags instead of \n, so this only becomes a problem with copy-pasted text
  const formattedText = text.replaceAll('\n', '');
  buffer.className = 'collection-description open';
  buffer.innerText = formattedText;
  element?.appendChild(buffer);
  const split = getLineBreaks(buffer.childNodes[0]);
  buffer.remove();
  return split.length > maxLines;
};

export default getLineBreaks;
