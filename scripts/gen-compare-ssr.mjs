// Gera o HTML estático (SSR) do comparativo Agras e o llms-full.txt.
// Fonte única de verdade: public/assets/js/agras-compare.js.
// Executado antes do check/build para que o HTML nunca fique defasado dos dados.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsPath = path.join(root, 'public/assets/js/agras-compare.js');
const mdPath = path.join(root, 'src/content/pages/agricultura.md');
const llmsFullPath = path.join(root, 'public/llms-full.txt');
const src = fs.readFileSync(jsPath, 'utf8');

// Extrai um literal (objeto ou array) pelo nome da constante, com contagem de chaves.
function extract(name) {
  const marker = `const ${name} = `;
  const i = src.indexOf(marker);
  if (i < 0) throw new Error(`Constante ${name} não encontrada em agras-compare.js`);
  const start = i + marker.length;
  const open = src[start];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let j = start;
  for (; j < src.length; j++) {
    if (src[j] === open) depth++;
    else if (src[j] === close) {
      depth--;
      if (depth === 0) { j++; break; }
    }
  }
  return new Function(`return ${src.slice(start, j)};`)();
}

const MODELS = extract('MODELS');
const METRICS = extract('METRICS');
const ROWS = extract('ROWS');

const ORDER = ['t25p', 't55', 't70p', 't100', 't20p', 't25', 't30', 't40', 't50'];
const DEFAULT = ['t55', 't100'];
const esc = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

function compareRow(rowKey, selected) {
  const metric = METRICS[rowKey];
  if (!metric) return { best: [], worse: [] };
  const entries = selected
    .map((id, index) => ({ index, value: MODELS[id].metrics?.[rowKey] }))
    .filter((entry) => Number.isFinite(entry.value));
  if (entries.length < 2) return { best: [], worse: [] };
  const values = entries.map((entry) => entry.value);
  const best = metric.better === 'lower' ? Math.min(...values) : Math.max(...values);
  if (values.every((value) => value === best)) return { best: [], worse: [] };
  return {
    best: entries.filter((entry) => entry.value === best).map((entry) => entry.index),
    worse: entries.filter((entry) => entry.value !== best).map((entry) => entry.index),
  };
}

function winsLabel(count) {
  return count === 1 ? '1 destaque' : `${count} destaques`;
}

function buildDefault(selected) {
  const wins = Object.fromEntries(selected.map((id) => [id, 0]));
  const rowData = ROWS.map((row) => {
    if (row.group) return row;
    const values = selected.map((id) => MODELS[id].rows[row.key] || '—');
    const same = values.every((value) => value === values[0]);
    const { best, worse } = compareRow(row.key, selected);
    best.forEach((index) => { wins[selected[index]] += 1; });
    return { ...row, values, same, best, worse };
  });

  const head = `<tr><th scope="col" class="compare-table__feature">Característica</th>${selected.map((id) => {
    const model = MODELS[id];
    const count = wins[id];
    return `<th scope="col" class="compare-table__model" title="${esc(model.name)}"><span class="compare-table__name">${esc(model.short)}</span><span class="compare-table__status">${esc(model.status)}</span><span class="compare-table__wins${count ? '' : ' is-zero'}">${winsLabel(count)}</span></th>`;
  }).join('')}</tr>`;

  const body = rowData.map((row) => {
    if (row.group) {
      return `<tr class="compare-table__group" data-group><th scope="colgroup" colspan="${selected.length + 1}">${esc(row.group)}</th></tr>`;
    }
    const cells = row.values.map((value, index) => {
      if (row.best.includes(index)) {
        const arrow = METRICS[row.key].better === 'lower' ? '↓' : '↑';
        return `<td class="compare-cell--best" title="Melhor valor neste critério"><span class="compare-best-mark" aria-hidden="true">${arrow}</span><span class="sr-only">Melhor valor: </span>${esc(value)}</td>`;
      }
      if (row.worse.includes(index)) {
        return `<td class="compare-cell--worse"><span class="sr-only">Abaixo do melhor valor: </span>${esc(value)}</td>`;
      }
      return `<td>${esc(value)}</td>`;
    }).join('');
    return `<tr data-row data-same="${row.same}"><th scope="row">${esc(row.label)}</th>${cells}</tr>`;
  }).join('');

  return { head, body };
}

function buildFullTable() {
  const head = `<tr><th scope="col">Característica</th>${ORDER.map((id) => `<th scope="col">${esc(MODELS[id].short)}<span class="compare-table__status">${esc(MODELS[id].status)}</span></th>`).join('')}</tr>`;
  const rows = ROWS.map((row) => {
    if (row.group) {
      return `<tr class="is-group"><th scope="colgroup" colspan="${ORDER.length + 1}">${esc(row.group)}</th></tr>`;
    }
    return `<tr><th scope="row">${esc(row.label)}</th>${ORDER.map((id) => `<td>${esc(MODELS[id].rows[row.key] || '—')}</td>`).join('')}</tr>`;
  }).join('');
  return `<div class="compare-scroll" tabindex="0" aria-label="Ficha técnica completa dos drones Agras"><table class="compare-all-table"><caption class="sr-only">Ficha técnica dos 9 modelos DJI Agras</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
}

function buildLlmsFull() {
  const lines = [
    '# ONNE — Ficha técnica completa da linha DJI Agras',
    '',
    '> Dados publicados pela DJI nas páginas de especificações de cada modelo. Valores de vazão, faixa efetiva e capacidade variam conforme bicos, bateria e configuração. A ONNE confirma a ficha final no orçamento.',
    '',
    'Modelos: ' + ORDER.map((id) => MODELS[id].name).join('; ') + '.',
    '',
  ];
  for (const id of ORDER) {
    const model = MODELS[id];
    lines.push(`## ${model.name} (${model.status})`, '');
    for (const row of ROWS) {
      if (row.group) { lines.push(`### ${row.group}`, ''); continue; }
      lines.push(`- ${row.label}: ${model.rows[row.key] || '—'}`);
    }
    lines.push('');
  }
  lines.push(
    '## Contato ONNE',
    '',
    '- Site: https://onnebr.com',
    '- E-mail: contato@onnebr.com',
    '- WhatsApp: https://wa.me/5516997554669?text=Ol%C3%A1%2C%20vim%20do%20site',
    '- Instagram: https://www.instagram.com/somos.onne/',
    '- Endereço: Av. João Orlando Ruggiero, 45 — Jardim Embaré, São Carlos — SP, CEP 13563-840',
    '- Mapa: https://maps.app.goo.gl/BH5ne6KMrkJcbhfJ7',
    '',
    'Conteúdo em português do Brasil. Versão resumida: https://onnebr.com/llms.txt',
    '',
  );
  return lines.join('\n');
}

const { head, body } = buildDefault(DEFAULT);
const fullTable = buildFullTable();

const details = [
  '<details class="compare-all">',
  '  <summary>Ver ficha técnica completa dos 9 modelos Agras</summary>',
  '  <p class="compare-all__note">Tabela estática com todos os modelos e critérios publicados pela DJI. Funciona sem JavaScript e serve como referência para leitura e indexação.</p>',
  `  ${fullTable}`,
  '</details>',
].join('\n');

const md = fs.readFileSync(mdPath, 'utf8');
const replaceBlock = (text, start, end, content) => {
  const a = text.indexOf(start);
  const b = text.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Marcadores ${start} / ${end} não encontrados`);
  return text.slice(0, a + start.length) + content + text.slice(b);
};

let next = md;
next = replaceBlock(next, '<!-- SSR_HEAD_START -->', '<!-- SSR_HEAD_END -->', head);
next = replaceBlock(next, '<!-- SSR_BODY_START -->', '<!-- SSR_BODY_END -->', body);
next = replaceBlock(next, '<!-- SSR_ALL_START -->', '<!-- SSR_ALL_END -->', '\n' + details + '\n');

if (next !== md) fs.writeFileSync(mdPath, next);
fs.writeFileSync(llmsFullPath, buildLlmsFull());
console.log('gen-compare-ssr: HTML estático e llms-full.txt atualizados.');
