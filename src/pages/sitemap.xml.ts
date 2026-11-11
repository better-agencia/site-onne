import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const SITE = 'https://onnebr.com';
const order = [
  '/', '/agricultura/', '/enterprise/', '/vigilancia-e-seguranca/',
  '/criadores-e-audiovisual/', '/mobilidade-eletrica/', '/acessorios/',
  '/seminovos/', '/treinamentos/', '/servicos/', '/sobre/', '/contato/',
  '/politica-de-privacidade/', '/termos-de-garantia/',
];

export const GET: APIRoute = async () => {
  const pages = await getCollection('pages');
  const entries = pages
    .filter((entry) => !entry.data.noindex && order.includes(entry.data.path))
    .sort((a, b) => order.indexOf(a.data.path) - order.indexOf(b.data.path));

  const urls = entries.map((entry) => {
    const priority = entry.data.sitemapPriority.toFixed(1);
    return `  <url><loc>${SITE}${entry.data.path}</loc><changefreq>monthly</changefreq><priority>${priority}</priority></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
