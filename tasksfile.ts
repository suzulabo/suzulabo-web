import { readFileSync, writeFileSync } from 'fs';
import marked from 'marked';
import { cli, sh } from 'tasksfile';

const generate = () => {
  const md = readFileSync('index.md', 'utf8');
  const mdHtml = marked(md);
  const baseHtml = readFileSync('index.base.html', 'utf8');
  const outHtml = baseHtml.replace('@md@', mdHtml);

  writeFileSync('public/index.html', outHtml, 'utf8');

  sh('npx sass index.scss public/index.css --no-source-map');
};

cli({
  generate,
});
