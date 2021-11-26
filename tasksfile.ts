import * as fs from 'fs/promises';
import { html_beautify } from 'js-beautify';
import { marked } from 'marked';
import { renderSync } from 'sass';
import { cli, sh } from 'tasksfile';

const fontURL =
  'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&family=Open+Sans:wght@300&display=auto';

const genHTML = async () => {
  const generate = async (name: string) => {
    const md = await fs.readFile(`${name}.md`, 'utf8');
    const mdHtml = marked(md);
    const baseHtml = await fs.readFile('index.base.html', 'utf8');
    const outHtml = baseHtml.replace('@md@', mdHtml);

    const html = html_beautify(outHtml, { indent_size: 2 });

    await fs.writeFile(`public/${name}.html`, html, 'utf8');
  };

  const names = ['index'];

  names.forEach(v => generate(v));

  {
    const copyFiles = ['timeline/index.html', 'timeline/css/style.css'];

    copyFiles.forEach(f => {
      fs.cp(f, `public/${f}`);
    });
  }
};

const genCSS = async () => {
  const scss = await fs.readFile('index.scss', 'utf8');
  const res = renderSync({ data: scss });

  const css = res.css
    .toString('utf8')
    .replace('http://fonts.googleapis.com/css?family=Open+Sans:300italic,300', fontURL);

  await fs.writeFile('public/index.css', css, 'utf8');
};

const generate = async () => {
  sh('mkdir -p public');
  await genHTML();
  await genCSS();
};

cli({
  generate,
  html: genHTML,
  css: genCSS,
});
