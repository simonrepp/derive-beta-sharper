const line = (gutter, content, ...classes) => {
  let result = '';

  result += `<div class="adventure-report-line ${classes.join(' ')}">`;
  result +=   `<div class="adventure-report-gutter">${gutter.padStart(10)}</div>`;
  result +=   `<div class="adventure-report-content">${content}</div>`;
  result += '</div>';

  return result;
};

module.exports = (context, emphasized = [], marked = []) => {
  const contentHeader = context.messages.reporting.contentHeader;
  const gutterHeader = context.messages.reporting.gutterHeader;
  const omission = line('...', '...');

  let snippet = '<pre class="adventure-report">';

  snippet += line(gutterHeader, contentHeader);

  let inOmission = false;

  for(let instruction of context.instructions) {
    const emphasize = emphasized.includes(instruction);
    const mark = marked.includes(instruction);
    let show = false;

    for(let shownInstruction of [...emphasized, ...marked]) {
      if(instruction.lineNumber >= shownInstruction.lineNumber - 2 &&
         instruction.lineNumber <= shownInstruction.lineNumber + 2) {
        show = true;
        break;
      }
    }

    if(show) {
      const classes = [];

      if(emphasize) { classes.push('adventure-report-line-emphasized'); }
      if(mark) { classes.push('adventure-report-line-marked'); }

      snippet += line(
        instruction.lineNumber.toString(),
        instruction.line,
        ...classes
      );

      inOmission = false;
    } else if(!inOmission) {
      snippet += omission;
      inOmission = true;
    }
  }

  snippet += '</pre>';

  return snippet;
};
