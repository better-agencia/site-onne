// Gera as seções de aplicação da página /enterprise/ (layout "capa fullwidth + modelos").
// Fonte única de verdade das aplicações e modelos: este arquivo.
// Execute com: node scripts/gen-enterprise-apps.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mdPath = path.join(root, 'src/content/pages/enterprise.md');

// modelos: [arquivo, nome, tag, dim]
const MODELS = {
  'matrice-4e': ['matrice-4e.webp', 'DJI Matrice 4E', 'Novo', 544],
  'mavic-3e': ['mavic-3e.webp', 'Mavic 3 Enterprise', 'Novo', 870],
  'mavic-3m': ['mavic-3m.webp', 'DJI Mavic 3M', 'Novo', 870],
  'matrice-350': ['matrice-350-rtk.webp', 'Matrice 350 RTK', 'Novo', 534],
  'matrice-400': ['matrice-400.webp', 'DJI Matrice 400', 'Novo', 870],
  'matrice-5t': ['matrice-5t.webp', 'DJI Matrice 5T', 'Novo · 2026', 870],
  'matrice-4t': ['matrice-4t.webp', 'DJI Matrice 4T', 'Novo', 544],
  'matrice-4td': ['matrice-4td.webp', 'DJI Matrice 4TD', 'Dock', 870],
  'matrice-5td': ['matrice-5t.webp', 'DJI Matrice 5TD', 'Dock', 870],
  'dock-2': ['dock-2.webp', 'DJI Dock 2', 'Estação', 870],
  'dock-3': ['dock-3.webp', 'DJI Dock 3', 'Estação', 870],
  'dock-4': ['dock-4.webp', 'DJI Dock 4', 'Estação', 870],
};

// 4 aplicações Enterprise. Segurança e Criadores têm páginas próprias e não se repetem aqui.
const APPS = [
  {
    id: 'mapeamento', title: 'Mapeamento e engenharia',
    img: 'app-mapeamento.webp', alt: 'Drone de mapeamento sobre relevo e campos verdes',
    lead: 'Plantas, ortomosaicos, MDS/MDT e nuvens de pontos com precisão centimétrica.',
    text: 'O entregável define a plataforma: RTK integrado para levantamento, câmera de alta resolução para fotogrametria e carga útil maior quando o projeto exige múltiplos sensores. A ONNE dimensiona sensor, fluxo de processamento e equipe junto com o projeto.',
    perfil: 'Levantamentos de alta precisão, topografia e engenharia',
    models: [
      ['matrice-4e', 'Mapeamento e engenharia de alta precisão', 'RTK integrado, câmera de alta resolução e captura inteligente para ortomosaicos e modelos 3D.', 'Consultar configuração'],
      ['mavic-3m', 'Multiespectral para lavoura e solo', 'Sensor RGB + multiespectral com luz solar calibrada para índices de vegetação e mapas de vigor por talhão.', 'Consultar configuração'],
      ['matrice-400', 'Múltiplos sensores em um só voo', 'Plataforma de grande capacidade para payloads especializados, LiDAR e longas jornadas de coleta.', 'Consultar configuração'],
    ],
  },
  {
    id: 'inspecao-termica', title: 'Inspeção térmica e zoom óptico',
    img: 'app-inspecao.webp', alt: 'Torres de transmissão vistas de cima em área de mata',
    lead: 'Termografia radiométrica e zoom de longo alcance para detalhes em altura, sem expor a equipe.',
    text: 'Pontos quentes em painéis, isoladores danificados e pinos em linhas de transmissão aparecem a dezenas de metros de distância. O Matrice 5T soma imagem térmica 1K, zoom óptico de 11×, LiDAR, radar mmWave e IP55 para operar em ambientes adversos.',
    perfil: 'Ativos críticos, subestações, linhas e plantas industriais',
    models: [
      ['matrice-5t', 'Térmica 1K, visão noturna e processamento a bordo', 'Imagem térmica 1280×1024, zoom óptico de 11× (176× híbrido), LiDAR rotativo, radar mmWave, IP55 e até 59 min de voo. Lançamento DJI 2026.', 'Falar sobre Matrice 5T'],
      ['matrice-4t', 'Termografia consolidada para inspeção', 'Câmera térmica radiométrica, zoom e Smart Track para leitura de anomalias e detalhes em estruturas elevadas.', 'Consultar configuração'],
      ['matrice-4td', 'Versão para estação autônoma', 'Matrice 4TD projetado para operar com DJI Dock em missões programadas e rondas contínuas de inspeção.', 'Consultar configuração'],
      ['matrice-5td', 'Nova geração para Dock 4', 'Aeronave da família Matrice 5 para a Dock 4, com térmica, zoom, detecção automática e operação 24/7.', 'Consultar configuração'],
    ],
  },
  {
    id: 'energia', title: 'Energia e indústria',
    img: 'app-energia.webp', alt: 'Painéis solares ao entardecer em usina fotovoltaica',
    lead: 'Painéis solares, subestações, parques eólicos e plantas com múltiplos sensores.',
    text: 'Usinas e parques exigem longas jornadas, cargas úteis combinadas e resistência a vento, poeira e temperatura. A escolha recai sobre plataformas de maior porte e payloads intercambiáveis.',
    perfil: 'Carga útil pesada, multi-sensor e operação contínua',
    models: [
      ['matrice-350', 'Plataforma pesada para campo', 'Autonomia, resistência e compatibilidade com múltiplos payloads Zenmuse para inspeções complexas.', 'Consultar configuração'],
      ['matrice-400', 'Máxima capacidade da linha Enterprise', 'Maior carga útil, autonomia estendida e suporte a sensores especializados em um único voo.', 'Consultar configuração'],
      ['matrice-5t', 'Visão térmica para usinas', 'Térmica 1K e zoom para detectar pontos quentes em painéis e isoladores sem parar a operação.', 'Falar sobre Matrice 5T'],
    ],
  },
  {
    id: 'autonomas', title: 'Operações autônomas para verificações',
    img: 'app-dock.webp', alt: 'Drone DJI decolando de uma estação autônoma DJI Dock para missão remota',
    lead: 'Missões programadas, decolagem remota e troca automática de bateria.',
    text: 'Com a DJI Dock, o drone sai sozinho quando um alerta é emitido. A Dock 4 troca a bateria em 25 segundos e opera de −40 °C a 50 °C, reduzindo o intervalo entre verificações de minutos para segundos.',
    perfil: 'Plantas industriais, mineração, perímetros e rotinas recorrentes',
    models: [
      ['dock-2', 'Estação compacta para rotinas programadas', 'Compatível com Matrice 3D/3TD, para missões automáticas em áreas de menor extensão.', 'Dimensionar Dock 2'],
      ['dock-3', 'Operação remota em grandes perímetros', 'Trabalha com Matrice 4D/4TD e suporta implantação em veículos para cobertura móvel.', 'Dimensionar Dock 3'],
      ['dock-4', 'Disponibilidade contínua com Matrice 5TD', 'Troca automática de bateria em 25 s, até 59 min por voo, detecção automática de 17 tipos de objetos e O4 Ground Station.', 'Dimensionar Dock 4'],
    ],
  },
];

const START = '<!-- APPS_START -->';
const END = '<!-- APPS_END -->';
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function modelCard(app, [key, subtitle, desc, cta]) {
  const [img, name, tag, dim] = MODELS[key];
  const flag = tag === 'Novo · 2026';
  return [
    '      <article class="app-model reveal">',
    `        <div class="app-model__media"><img src="/assets/img/modelos/${img}" alt="${esc(name)}" loading="lazy" width="${dim}" height="${dim}"></div>`,
    '        <div class="app-model__body">',
    flag ? '          <span class="flag tag tag--new">Novo · 2026</span>' : null,
    `          <h4>${esc(name)}</h4>`,
    `          <p class="app-model__sub">${esc(subtitle)}</p>`,
    `          <p class="app-model__desc">${esc(desc)}</p>`,
    `          <div class="app-model__foot"><span class="app-model__tag">${esc(app.title)}</span><a class="text-link" href="#contato-enterprise" data-interest="enterprise">${esc(cta)}</a></div>`,
    '        </div>',
    '      </article>',
  ].filter((l) => l !== null).join('\n');
}

const lines = [];
APPS.forEach((a, i) => {
  // S2 (#engenharia) é cinza; então a primeira aplicação (S3) é branca.
  // Alterna estritamente para nunca haver duas faixas iguais seguidas.
  const band = i % 2 === 0 ? 'band' : 'band band--light';
  lines.push(`  <section class="${band}" id="app-${a.id}">`);
  lines.push('    <div class="wrap">');
  lines.push('      <figure class="app-cover reveal">');
  lines.push(`        <img src="/assets/img/enterprise/${a.img}" alt="${esc(a.alt)}" width="1200" height="675"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>`);
  lines.push(`        <figcaption><span>${esc(a.lead)}</span><h2>${esc(a.title)}</h2></figcaption>`);
  lines.push('      </figure>');
  lines.push('      <div class="app-intro reveal">');
  lines.push(`        <p>${esc(a.text)}</p>`);
  lines.push(`        <p class="app-intro__perfil"><strong>Perfil de projeto:</strong> ${esc(a.perfil)}</p>`);
  lines.push('      </div>');
  lines.push(`      <h3 class="app-models__title reveal">Modelos indicados para ${esc(a.title.toLowerCase())}</h3>`);
  lines.push('      <div class="app-models">');
  a.models.forEach((m) => lines.push(modelCard(a, m)));
  lines.push('      </div>');
  const note = i === APPS.length - 1
    ? 'Fotos de aplicação divulgadas pela DJI Enterprise. Dados oficiais do DJI Matrice 5T (lançamento 2026): imagem térmica 1K, zoom óptico de 11× e 176× híbrido, LiDAR, radar mmWave, IP55, visão noturna 4K e até 59 min de voo. Especificações, compatibilidade de sensores e disponibilidade são confirmadas pela ONNE no orçamento.'
    : 'Foto de aplicação divulgada pela DJI Enterprise. Especificações, compatibilidade de sensores e disponibilidade são confirmadas pela ONNE no projeto.';
  lines.push(`      <p class="table-note">${esc(note)}</p>`);
  lines.push('    </div>');
  lines.push('  </section>');
});

const body = '\n' + lines.join('\n') + '\n';
let md = fs.readFileSync(mdPath, 'utf8');
const a = md.indexOf(START);
const b = md.indexOf(END, a + START.length);
if (a < 0 || b < 0) throw new Error('Marcadores APPS_START / APPS_END não encontrados em enterprise.md');
md = md.slice(0, a + START.length) + body + md.slice(b);
fs.writeFileSync(mdPath, md);
console.log('gen-enterprise-apps: 4 seções de aplicação (capa fullwidth + modelos) geradas.');
