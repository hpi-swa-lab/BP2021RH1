// Source: https://stackoverflow.com/questions/55604798/find-rendered-line-breaks-with-javascript
const getLineBreaks = (node?: Node) => {
  if (!node || !node.parentNode || node.nodeType !== 3) return [];
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

export default getLineBreaks;
