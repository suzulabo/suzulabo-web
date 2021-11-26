import { readFileSync, writeFileSync } from 'fs';
import { html_beautify } from 'js-beautify';
import { marked } from 'marked';
import { renderSync } from 'sass';
import { cli, sh } from 'tasksfile';

const fontURL =
  'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&family=Open+Sans:wght@300&display=auto';

const genHTML = () => {
  const md = readFileSync('index.md', 'utf8');
  const mdHtml = marked(md);
  const baseHtml = readFileSync('index.base.html', 'utf8');
  const outHtml = baseHtml.replace('@md@', mdHtml);

  const html = html_beautify(outHtml, { indent_size: 2 });

  writeFileSync('public/index.html', html, 'utf8');
};

const genCSS = () => {
  const scss = readFileSync('index.scss', 'utf8');
  const res = renderSync({ data: scss });

  const css = res.css
    .toString('utf8')
    .replace('http://fonts.googleapis.com/css?family=Open+Sans:300italic,300', fontURL);

  writeFileSync('public/index.css', css, 'utf8');
};

const generate = () => {
  sh('mkdir -p public');
  genHTML();
  genCSS();
};

cli({
  generate,
  html: genHTML,
  css: genCSS,
});
