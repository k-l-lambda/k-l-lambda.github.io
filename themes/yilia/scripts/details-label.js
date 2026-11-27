// Markdown-it emits `<p>A: <details><summary>…</summary></p>`, but `<details>` is
// block-level, so the browser closes the <p> and the label ends up on its own line.
// Move such a label into <summary>, so the line reads "A: 标题 ▸" on one line.
// Idempotent: the output no longer starts with `<p>`, so a second pass is a no-op.
// `<p>` is assumed not to occur inside <pre>/<code>, which markdown-it escapes.
const labelBeforeDetails = /<p>([A-Za-z]{1,4}[:：])\s*<details/;
const labeledDetails = /<p>([A-Za-z]{1,4}[:：])\s*<details(\s[^>]*)?><summary(\s[^>]*)?>([\s\S]*?)<\/summary><\/p>/g;

hexo.extend.filter.register('after_post_render', data => {
  if (!labelBeforeDetails.test(data.content)) return;
  data.content = data.content.replace(labeledDetails,
    (match, label, detailsAttrs, summaryAttrs, title) =>
      `<details${detailsAttrs || ''}><summary${summaryAttrs || ''}>${label} ${title}</summary>`);
}, 20);
