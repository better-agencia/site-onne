import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const pagesDir = fileURLToPath(new URL('src/content/pages/', root));
const schemasDir = fileURLToPath(new URL('src/data/schemas/', root));

const files = (await readdir(pagesDir)).filter((file) => file.endsWith('.md'));
const errors = [];
const paths = new Map();

for (const file of files) {
  const raw = await readFile(join(pagesDir, file), 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    errors.push(`${file}: frontmatter não encontrado (o arquivo precisa começar e terminar o bloco com ---).`);
    continue;
  }
  const [, frontmatter, body] = match;
  const pathMatch = frontmatter.match(/^path:\s*(.+)$/m);
  if (!pathMatch) {
    errors.push(`${file}: campo "path" ausente no frontmatter.`);
  } else {
    const path = pathMatch[1].trim();
    if (paths.has(path)) errors.push(`${file}: path duplicado "${path}" (também em ${paths.get(path)}).`);
    paths.set(path, file);
  }
  const bodyLines = body.replace(/\r?\n$/, '').split(/\r?\n/);
  const blankLines = bodyLines.map((line, i) => [line, i + 1]).filter(([line]) => line.trim() === '');
  if (blankLines.length) {
    errors.push(
      `${file}: ${blankLines.length} linha(s) em branco no corpo (linhas ${blankLines.map(([, n]) => n).join(', ')}). ` +
      'Remova as linhas em branco: o Markdown transforma HTML indentado em bloco de código.',
    );
  }
  const schemaFile = file.replace(/\.md$/, '.json');
  try {
    await access(join(schemasDir, schemaFile));
  } catch {
    errors.push(`${file}: falta src/data/schemas/${schemaFile}.`);
  }
}

if (errors.length) {
  console.error(`\nConteúdo com ${errors.length} problema(s):\n`);
  for (const error of errors) console.error(`- ${error}`);
  console.error('');
  process.exit(1);
}

console.log(`Conteúdo OK: ${files.length} páginas, sem linhas em branco no corpo e com JSON-LD correspondente.`);
