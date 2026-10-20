// Preserve display TeX before Markdown's emphasis, escape and typography rules.
// MathJax performs the actual typesetting in the browser.
module.exports = function mathjaxBlocks(md) {
  md.block.ruler.before('fence', 'mathjax_display', (state, start, end, silent) => {
    const line = n => state.src.slice(state.bMarks[n] + state.tShift[n], state.eMarks[n]);
    if (state.sCount[start] - state.blkIndent >= 4 || line(start).trim() !== '$$') return false;
    let close = start + 1;
    while (close < end && line(close).trim() !== '$$') close++;
    if (close === end) return false;
    if (silent) return true;
    const token = state.push('mathjax_display', '', 0);
    token.block = true;
    token.content = state.getLines(start + 1, close, state.blkIndent, false);
    token.map = [start, close + 1];
    state.line = close + 1;
    return true;
  });
  md.renderer.rules.mathjax_display = (tokens, i) =>
    `<p>$$\n${md.utils.escapeHtml(tokens[i].content)}\n$$</p>\n`;
};
