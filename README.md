# Site ONNE — Astro

Fonte editável do site da ONNE. O build gera um site 100% estático, pronto para subir em qualquer hospedagem (Hostinger, cPanel, Netlify, Vercel, Cloudflare Pages etc.).

- Produção: `https://onnebr.com`
- Contato: `contato@onnebr.com`
- Node necessário: 22.23.4 ou superior (testado com Node 24)

## Como rodar

Na pasta `website`:

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:4321`). O preview atualiza sozinho quando você salva um arquivo.

Para gerar o site final:

```bash
npm run build
```

O resultado fica em `dist/`. Para conferir o build antes de publicar:

```bash
npm run preview
```

Outros comandos:

```bash
npm run check   # valida o conteúdo antes do build
```

## Modo desenvolvimento (referências para edição)

Com `npm run dev`, o site abre com o **modo dev** ativo. Ele não vai para o build de produção.

- Cada bloco da página recebe um selo verde: `S1`, `S2`, `S3`...
- Cada imagem recebe um selo rosa: `IMG1`, `IMG2`...
- O painel no canto inferior esquerdo lista as seções e imagens da página.
- Passe o mouse sobre um texto ou imagem para ver a referência.
- **Clique em um texto ou imagem** para copiar a referência completa.
- Use **Ctrl + Shift + D** para ligar/desligar o modo dev.
- O botão **Copiar mapa da página** copia a lista de seções e imagens.

Exemplo de referência copiada:

```text
Página: /agricultura/
Seção: 4 — Drones Agras para cada tamanho de operação (#agras)
Elemento: h2.sec-title
Texto: "Drones Agras para cada tamanho de operação"
Seletor: section#agras > div.wrap > div.sec-head > h2
```

Com isso, você pode pedir alterações assim:

```text
Na página /agricultura/, seção 4 (#agras), troque o título para "...".
Na página /agricultura/, imagem 12, troque por /assets/img/modelos/novo.webp.
Na página /contato/, seção 5 (#formulario), ajuste o texto do botão.
```

O arquivo `CONTENT-MAP.md` tem o mapa completo de todas as páginas, seções e imagens. O painel do modo dev mostra o mapa ao vivo, então ele é a fonte mais atual.

Para testar o site sem o modo dev, clique em **Sair do modo dev** ou pressione **Ctrl + Shift + D**. A preferência fica salva no navegador.

## Estrutura

```text
website/
├─ src/
│  ├─ content/pages/       ← conteúdo das páginas (é aqui que você edita)
│  ├─ data/schemas/        ← JSON-LD (SEO) de cada página
│  ├─ components/          ← header, footer, CTA, intro do drone e modo dev
│  ├─ layouts/BaseLayout.astro
│  └─ pages/               ← rotas, 404 e sitemap
├─ public/
│  ├─ assets/              ← CSS, JS, imagens e fontes
│  ├─ robots.txt
│  └─ llms.txt
├─ scripts/                ← validação e pós-build
├─ CONTENT-MAP.md          ← mapa de seções e imagens para pedir alterações
└─ dist/                   ← site gerado (não editar)
```

## Onde editar cada página

Cada página é um arquivo em `src/content/pages/`:

| Arquivo | URL |
| --- | --- |
| `home.md` | `/` |
| `agricultura.md` | `/agricultura/` |
| `enterprise.md` | `/enterprise/` |
| `vigilancia-e-seguranca.md` | `/vigilancia-e-seguranca/` |
| `criadores-e-audiovisual.md` | `/criadores-e-audiovisual/` |
| `mobilidade-eletrica.md` | `/mobilidade-eletrica/` |
| `acessorios.md` | `/acessorios/` |
| `seminovos.md` | `/seminovos/` |
| `treinamentos.md` | `/treinamentos/` |
| `servicos.md` | `/servicos/` |
| `sobre.md` | `/sobre/` |
| `contato.md` | `/contato/` |
| `obrigado.md` | `/obrigado/` |
| `politica-de-privacidade.md` | `/politica-de-privacidade/` |
| `termos-de-garantia.md` | `/termos-de-garantia/` |
| `404.md` | `/404/` |

Cada arquivo tem duas partes:

1. **Frontmatter** — dados entre as linhas `---` no topo (título, descrição, URL, imagem de compartilhamento etc.).
2. **Corpo** — o HTML da página, logo abaixo do segundo `---`.

## Frontmatter

Exemplo:

```yaml
---
title: Drones Agrícolas DJI Agras, SPAD e XMixer | ONNE Agricultura
description: Drones de pulverização DJI Agras T25P, T55, T70P e T100...
path: /agricultura/
menuName: Agricultura
breadcrumbLabel: Agricultura
bodyClass: page page--agro
vertical: agricultura
ogImage: og-agricultura.jpg
ogType: website
noindex: false
breadcrumbs: true
intro: false
sitemapPriority: 0.8
---
```

| Campo | Para que serve |
| --- | --- |
| `title` | Título da aba e do resultado no Google. |
| `description` | Descrição no Google e nas redes sociais. |
| `path` | URL da página. Não repita o mesmo path em dois arquivos. |
| `menuName` | Nome usado no menu e no breadcrumb quando não há `breadcrumbLabel`. |
| `breadcrumbLabel` | Texto curto do breadcrumb. Opcional. |
| `bodyClass` | Classes do `<body>`. Não altere sem necessidade. |
| `vertical` | Área usada pelo formulário e pelo CTA flutuante. |
| `ogImage` | Imagem de compartilhamento em `/assets/img/`. |
| `ogType` | `website` para páginas normais. |
| `noindex` | `true` para não aparecer no Google (ex.: 404 e obrigado). |
| `breadcrumbs` | `true` para mostrar a trilha “Início > Página”. |
| `intro` | `true` somente na home, para exibir a intro do drone. |
| `sitemapPriority` | Prioridade no `sitemap.xml` (0.0 a 1.0). |

## Editando o corpo

O corpo é HTML. O jeito mais seguro é editar apenas o texto entre as tags.

**Título e parágrafo:**

```html
<h1>Fale com o especialista da sua área.</h1>
<p class="lead">Conte o que você precisa fazer.</p>
```

**Link:**

```html
<a href="/contato/">Fale com um especialista</a>
```

**Imagem:**

```html
<img src="/assets/img/minha-imagem.webp" alt="Descrição da imagem" loading="lazy" width="1200" height="800">
```

**Botão de formulário:** não altere `data-interest`, `name`, `type` nem `required` sem combinar com quem mantém o CRM. O envio depende desses atributos.

### Atenção: não deixe linhas em branco no corpo

O corpo é Markdown contendo um bloco HTML. Uma linha em branco no meio do HTML pode fazer o Markdown transformar as linhas indentadas em bloco de código e quebrar a página.

- Não adicione linhas vazias entre as tags.
- Mantenha a indentação existente.
- Rode `npm run check` antes de publicar. Ele avisa se houver linha em branco ou JSON-LD faltando.

## Imagens

Coloque os arquivos em `public/assets/img/` (ou subpastas, como `public/assets/img/modelos/`) e referencie com caminho iniciando em `/assets/...`.

Recomendações:

- Prefira WebP.
- Use `loading="lazy"` em imagens abaixo da primeira dobra.
- Sempre preencha `alt` com uma descrição real.
- Informe `width` e `height` para evitar salto de layout.
- Não renomeie imagens que já estão em uso sem atualizar todas as referências.

## SEO e JSON-LD

O JSON-LD de cada página fica em `src/data/schemas/<mesmo-nome>.json` e é injetado automaticamente pelo layout.

Atualize o JSON-LD quando mudar:

- perguntas e respostas do FAQ;
- produtos, modelos e preços estruturados;
- endereço, e-mail ou coordenadas;
- nome e descrição da empresa.

O `sitemap.xml` é gerado automaticamente a partir das páginas com `noindex: false`. A ordem e a prioridade ficam em `src/pages/sitemap.xml.ts`.

## Formulários e CRM

O comportamento está em `public/assets/js/main.js`.

- O endpoint atual é um Google Apps Script.
- O formulário envia área de interesse, página de origem, título da página e UTMs.
- Depois do envio, o usuário é levado para `/obrigado/`.
- O Apps Script pode encaminhar os dados para o CRM via webhook/API ou por Make/Zapier/n8n.

Chaves de API devem ficar no Apps Script (ou em um backend), nunca no JavaScript público.

Para trocar o destino, altere `CONFIG.endpoint` em `public/assets/js/main.js`.

## Intro do drone

A intro da home usa o DJI Agras T55:

- markup: `src/components/Intro.astro`
- animação e estilos: `public/assets/css/style.css` (classes `drone-intro*`)
- comportamento: `public/assets/js/main.js` (primeiro bloco)
- imagem: `public/assets/img/modelos/agras-t55-intro.webp`

A intro aparece uma vez por sessão, tem botão “Pular”, fecha com `Esc` e respeita `prefers-reduced-motion`.

## Publicação

1. Rode `npm run build`.
2. Envie **o conteúdo de `dist/`** para a raiz do site na hospedagem.
3. Confirme que `index.html`, `404.html`, `sitemap.xml`, `robots.txt`, `llms.txt` e a pasta `assets/` foram para o lugar certo.
4. Abra `https://onnebr.com` e teste menu, formulário e a intro da home.

O build também cria `dist/404/index.html` automaticamente para hospedagens que esperam uma pasta de erro.

> A pasta `../Site` é a versão estática antiga, mantida como referência. Depois que a publicação a partir de `website/dist` estiver confirmada, ela pode ser arquivada ou removida.

## Checklist antes de publicar

```bash
npm run check
npm run build
npm run preview
```

No preview, confira:

- menu desktop e mobile;
- formulário de contato e redirecionamento para `/obrigado/`;
- intro da home (desktop e celular);
- páginas de política, garantia e 404;
- links internos e imagens;
- `sitemap.xml` e `robots.txt`.
