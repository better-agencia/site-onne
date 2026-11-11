// Atualiza schemas de produtos: Segurança (remove Mavic 3T, add 4TD/5TD)
// Enterprise (Mavic 3 Enterprise -> Mavic 3M, add 4TD/5TD)
import fs from 'node:fs';
const root = 'src/data/schemas';
const base = 'https://onnebr.com';

function product(name, desc, img, url, category) {
  return {
    '@type': 'ListItem',
    position: 0,
    item: {
      '@type': 'Product',
      name,
      brand: { '@type': 'Brand', name: 'DJI' },
      category,
      url: base + url,
      image: base + '/assets/img/modelos/' + img,
      description: desc,
    },
  };
}
function save(p, j) {
  const il = j['@graph'].find((x) => String(x['@type']).includes('ItemList'));
  il.itemListElement.forEach((e, i) => { e.position = i + 1; });
  il.numberOfItems = il.itemListElement.length;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  console.log(p, '->', il.numberOfItems, 'itens:', il.itemListElement.map((e) => e.item.name).join(', '));
}

// ---- SEGURANCA ----
{
  const p = root + '/vigilancia-e-seguranca.json';
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const il = j['@graph'].find((x) => String(x['@type']).includes('ItemList'));
  il.itemListElement = il.itemListElement.filter((e) => !/Mavic 3 Enterprise/i.test(e.item.name));
  const url = '/vigilancia-e-seguranca/';
  const cat = 'Vigilância e Segurança';
  il.itemListElement.push(product(
    'DJI Matrice 4TD',
    'Versão para estação autônoma com câmera térmica e zoom, indicada para rondas programadas e resposta a incidentes.',
    'matrice-4td.webp', url, cat));
  il.itemListElement.push(product(
    'DJI Matrice 5TD',
    'Nova geração para a DJI Dock 4, com imagem térmica 1K, zoom, detecção automática e operação contínua 24/7.',
    'matrice-5t.webp', url, cat));
  save(p, j);
}

// ---- ENTERPRISE ----
{
  const p = root + '/enterprise.json';
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const il = j['@graph'].find((x) => String(x['@type']).includes('ItemList'));
  il.itemListElement.forEach((e) => {
    if (/Mavic 3 Enterprise/i.test(e.item.name) && !/3M/i.test(e.item.name)) {
      e.item.name = 'DJI Mavic 3M';
      e.item.description = 'Drone DJI multiespectral para agricultura de precisão, índices de vegetação e mapas de vigor.';
      e.item.image = base + '/assets/img/modelos/mavic-3m.webp';
    }
  });
  const url = '/enterprise/#app-inspecao-termica';
  const cat = 'DJI Enterprise';
  // remove duplicatas por nome (mantém a primeira ocorrência)
  const seen = new Set();
  il.itemListElement = il.itemListElement.filter((e) => {
    if (seen.has(e.item.name)) return false;
    seen.add(e.item.name);
    return true;
  });
  const has = (n) => il.itemListElement.some((e) => e.item.name === n);
  if (!has('DJI Matrice 4TD')) il.itemListElement.push(product(
    'DJI Matrice 4TD',
    'Versão para estação autônoma, indicada para missões programadas de inspeção com DJI Dock.',
    'matrice-4td.webp', url, cat));
  if (!has('DJI Matrice 5TD')) il.itemListElement.push(product(
    'DJI Matrice 5TD',
    'Aeronave da família Matrice 5 para a DJI Dock 4, com térmica, zoom e operação 24/7.',
    'matrice-5t.webp', url, cat));
  save(p, j);
}
