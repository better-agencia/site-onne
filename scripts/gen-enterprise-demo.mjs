// Gera a página de demonstração /demo-enterprise/ com as 3 versões de layout.
// As 4 aplicações e os modelos vêm de scripts/enterprise-apps.mjs (exportados).
// Execute com: node scripts/gen-enterprise-demo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, 'src/content/pages/demo-enterprise.md');

const MODELS = {
  'matrice-4e': ['matrice-4e.webp', 'DJI Matrice 4E', 544],
  'mavic-3e': ['mavic-3e.webp', 'Mavic 3 Enterprise', 870],
  'matrice-400': ['matrice-400.webp', 'DJI Matrice 400', 870],
  'matrice-5t': ['matrice-5t.webp', 'DJI Matrice 5T', 870],
  'matrice-4t': ['matrice-4t.webp', 'DJI Matrice 4T', 544],
  'dock-2': ['dock-2.webp', 'DJI Dock 2', 870],
  'dock-3': ['dock-3.webp', 'DJI Dock 3', 870],
  'dock-4': ['dock-4.webp', 'DJI Dock 4', 870],
  'matrice-350': ['matrice-350-rtk.webp', 'Matrice 350 RTK', 534],
};

// 4 aplicações apenas (sem Segurança e sem Criadores — já têm página própria)
const APPS = [
  {
    id: 'mapeamento', title: 'Mapeamento e engenharia',
    img: 'app-mapeamento.webp', alt: 'Drone de mapeamento sobre relevo e campos verdes',
    lead: 'Plantas, ortomosaicos, MDS/MDT e nuvens de pontos com precisão centimétrica.',
    text: 'O entregável define a plataforma: RTK integrado para levantamento, câmera de alta resolução para fotogrametria e carga útil maior quando o projeto exige múltiplos sensores. A ONNE dimensiona sensor, fluxo de processamento e equipe junto com o projeto.',
    perfil: 'Levantamentos de alta precisão, topografia e engenharia',
    models: [
      ['matrice-4e', 'Mapeamento e engenharia de alta precisão', 'RTK integrado, câmera de alta resolução e captura inteligente para ortomosaicos e modelos 3D.', 'Consultar configuração'],
      ['mavic-3e', 'Portabilidade para equipes móveis', 'Compacto, com RTK e câmera de zoom para vistorias recorrentes e levantamentos rápidos em campo.', 'Consultar configuração'],
      ['matrice-400', 'Múltiplos sensores em um só voo', 'Plataforma de grande capacidade para payloads especializados, LiDAR e longas jornadas de coleta.', 'Consultar configuração'],
    ],
  },
  {
    id: 'inspecao', title: 'Inspeção térmica e zoom óptico',
    img: 'app-inspecao.webp', alt: 'Torres de transmissão vistas de cima em área de mata',
    lead: 'Termografia radiométrica e zoom de longo alcance para detalhes em altura, sem expor a equipe.',
    text: 'Pontos quentes em painéis, isoladores danificados e pinos em linhas de transmissão aparecem a dezenas de metros de distância. O Matrice 5T soma imagem térmica 1K, zoom óptico de 11×, LiDAR, radar mmWave e IP55.',
    perfil: 'Ativos críticos, subestações, linhas e plantas industriais',
    models: [
      ['matrice-5t', 'Térmica 1K, visão noturna e processamento a bordo', 'Imagem térmica 1280×1024, zoom óptico de 11× (176× híbrido), LiDAR rotativo, radar mmWave, IP55 e até 59 min de voo.', 'Falar sobre Matrice 5T'],
      ['matrice-4t', 'Termografia consolidada para inspeção', 'Câmera térmica radiométrica, zoom e Smart Track para leitura de anomalias e detalhes em estruturas elevadas.', 'Consultar configuração'],
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
      ['dock-4', 'Disponibilidade contínua com Matrice 5TD', 'Troca automática de bateria em 25 s, até 59 min por voo, detecção automática de 17 tipos de objetos.', 'Dimensionar Dock 4'],
    ],
  },
];

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const CTA = '#contato-enterprise';

function modelCard([key, subtitle, desc, cta], compact = false) {
  const [img, name, dim] = MODELS[key];
  const isNew = key === 'matrice-5t';
  return [
    '            <article class="dm-model' + (compact ? ' dm-model--compact' : '') + '">',
    `              <div class="dm-model__media"><img src="/assets/img/modelos/${img}" alt="${esc(name)}" loading="lazy" width="${dim}" height="${dim}"></div>`,
    '              <div class="dm-model__body">',
    isNew ? '                <span class="flag tag tag--new">Novo · 2026</span>' : null,
    `                <h4>${esc(name)}</h4>`,
    `                <p class="dm-model__sub">${esc(subtitle)}</p>`,
    compact ? null : `                <p class="dm-model__desc">${esc(desc)}</p>`,
    `                <div class="dm-model__foot"><a class="text-link" href="${CTA}" data-interest="enterprise">${esc(cta)}</a></div>`,
    '              </div>',
    '            </article>',
  ].filter((l) => l !== null).join('\n');
}

// ---------- Versão A: foto à esquerda, modelos à direita (alternando lados) ----------
const versionA = APPS.map((a, i) => {
  const reverse = i % 2 === 1 ? ' dm-a__row--reverse' : '';
  return [
    '    <section class="dm-a__row' + reverse + '" id="a-' + a.id + '">',
    '      <figure class="dm-a__media">',
    `        <img src="/assets/img/enterprise/${a.img}" alt="${esc(a.alt)}" loading="lazy" width="1200" height="675">`,
    '        <figcaption><strong>' + esc(a.title) + '</strong><span>' + esc(a.lead) + '</span></figcaption>',
    '      </figure>',
    '      <div class="dm-a__content">',
    `        <h3>${esc(a.title)}</h3>`,
    `        <p class="dm-a__lead">${esc(a.lead)}</p>`,
    `        <p class="dm-a__text">${esc(a.text)}</p>`,
    `        <p class="dm-a__perfil"><strong>Perfil de projeto:</strong> ${esc(a.perfil)}</p>`,
    `        <h4 class="dm-a__models-title">Modelos indicados</h4>`,
    '        <div class="dm-a__models">',
    ...a.models.map((m) => modelCard(m, true)),
    '        </div>',
    '      </div>',
    '    </section>',
  ].join('\n');
}).join('\n');

// ---------- Versão B: capa fullwidth + modelos abaixo ----------
const versionB = APPS.map((a) => {
  return [
    '    <section class="dm-b__section" id="b-' + a.id + '">',
    '      <figure class="dm-b__cover">',
    `        <img src="/assets/img/enterprise/${a.img}" alt="${esc(a.alt)}" loading="lazy" width="1200" height="675">`,
    `        <figcaption><span>${esc(a.lead)}</span><h3>${esc(a.title)}</h3></figcaption>`,
    '      </figure>',
    '      <div class="dm-b__intro">',
    `        <p>${esc(a.text)}</p>`,
    `        <p class="dm-b__perfil"><strong>Perfil de projeto:</strong> ${esc(a.perfil)}</p>`,
    '      </div>',
    `      <h4 class="dm-b__models-title">Modelos indicados para ${esc(a.title.toLowerCase())}</h4>`,
    '      <div class="dm-b__models">',
    ...a.models.map((m) => modelCard(m)),
    '      </div>',
    '    </section>',
  ].join('\n');
}).join('\n');

// ---------- Versão C: só grade de modelos por seção (sem fotos de capa) ----------
const versionC = APPS.map((a) => {
  return [
    '    <section class="dm-c__section" id="c-' + a.id + '">',
    `      <h3>${esc(a.title)}</h3>`,
    `      <p class="dm-c__text">${esc(a.text)}</p>`,
    `      <p class="dm-c__perfil"><strong>Perfil de projeto:</strong> ${esc(a.perfil)}</p>`,
    '      <div class="dm-c__models">',
    ...a.models.map((m) => modelCard(m)),
    '      </div>',
    '    </section>',
  ].join('\n');
}).join('\n');

const front = `---
title: 'Demo · Layouts Enterprise | ONNE'
description: Página interna de demonstração das três propostas de layout para as aplicações Enterprise.
path: /demo-enterprise/
menuName: Demo Enterprise
bodyClass: page page--demo
vertical: enterprise
ogImage: og-enterprise.jpg
ogType: website
noindex: true
breadcrumbs: false
intro: false
sitemapPriority: 0.1
breadcrumbLabel: Demo Enterprise
---
<section class="demo-hero">
  <div class="wrap">
    <h1>Enterprise · 3 propostas de layout</h1>
    <p class="lead">Página de demonstração, fora do sitemap e com <code>noindex</code>. Cada versão mostra as mesmas 4 aplicações: Mapeamento e engenharia, Inspeção térmica, Energia e indústria, e Operações autônomas. Segurança e Criadores ficam em suas páginas próprias.</p>
    <div class="demo-jump">
      <a class="btn primary" href="#versao-a">Versão A · Foto + modelos</a>
      <a class="btn outline" href="#versao-b">Versão B · Capa fullwidth</a>
      <a class="btn outline" href="#versao-c">Versão C · Só modelos</a>
    </div>
  </div>
</section>
<nav class="anchor-nav" aria-label="Versões">
  <div class="wrap">
    <span class="label">Versões</span>
    <a href="#versao-a">A · Foto + modelos</a>
    <a href="#versao-b">B · Capa fullwidth</a>
    <a href="#versao-c">C · Só modelos</a>
  </div>
</nav>
<section class="band band--light" id="versao-a">
  <div class="wrap">
    <div class="demo-version-head">
      <span class="demo-version-tag">VERSÃO A</span>
      <h2>Foto à esquerda, modelos à direita</h2>
      <p>Cada aplicação é uma linha: capa com foto e legenda de um lado, texto de contexto e cards compactos de modelos do outro. O lado da foto alterna entre seções para dar ritmo. É o formato mais próximo do que já existe em <code>#engenharia</code> e <code>#inspecao</code>.</p>
    </div>
${versionA}
  </div>
</section>
<section class="band" id="versao-b">
  <div class="wrap">
    <div class="demo-version-head">
      <span class="demo-version-tag">VERSÃO B</span>
      <h2>Capa fullwidth + modelos abaixo</h2>
      <p>Cada aplicação abre com uma faixa de foto larga e texto sobreposto; logo abaixo vem o contexto e uma grade de cards completos. Mais editorial, porém deixa a página bem mais longa.</p>
    </div>
${versionB}
  </div>
</section>
<section class="band band--light" id="versao-c">
  <div class="wrap">
    <div class="demo-version-head">
      <span class="demo-version-tag">VERSÃO C</span>
      <h2>Só grade de modelos por seção</h2>
      <p>Sem fotos de capa: título, texto curto, perfil do projeto e grade de cards com foto e CTA. A opção mais compacta e direta.</p>
    </div>
${versionC}
  </div>
</section>
<section class="band demo-cta">
  <div class="wrap">
    <h2>Gostou de alguma?</h2>
    <p>Diga qual versão aplicar em <code>/enterprise/</code> que eu substituo o seletor de abas por ela. Enquanto isso, a página Enterprise continua com o layout atual.</p>
    <div class="actions"><a class="btn primary" href="/enterprise/">Voltar para Enterprise</a></div>
  </div>
</section>
`;

fs.writeFileSync(outPath, front);
console.log('gen-enterprise-demo: /demo-enterprise/ gerada.');
