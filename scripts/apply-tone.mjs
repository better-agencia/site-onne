// Aplica as diretrizes de linguagem da Plataforma de Marca ONNE ao conteúdo.
// Não altera produtos, seções, tabelas do comparativo, atributos HTML, URLs ou valores de código.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'src/content/pages');
const comp = path.join(root, 'src/components');
const files = [
  ...fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => path.join(dir, f)),
  ...fs.readdirSync(comp).filter(f => f.endsWith('.astro')).map(f => path.join(comp, f)),
  path.join(root, 'public/llms.txt'),
];

// Substituições exatas de termos.
const TERMS = [
  // Laboratório -> Oficina de manutenção
  ['Laboratório próprio', 'Oficina de manutenção própria'],
  ['laboratório próprio', 'oficina de manutenção própria'],
  ['Laboratório em São Carlos', 'Oficina em São Carlos'],
  ['no laboratório', 'na oficina'],
  ['no nosso laboratório', 'na nossa oficina'],
  ['pelo laboratório da ONNE', 'pela oficina da ONNE'],
  ['pelo laboratório', 'pela oficina'],
  ['do laboratório', 'da oficina'],
  ['O que o laboratório faz', 'O que a oficina faz'],
  ['Centro de Treinamento ONNE — São Carlos', 'Centro de Treinamento ONNE, São Carlos'],
  ['a sala de treinamento e o laboratório', 'a sala de treinamento e a oficina'],
  ['Laboratório e suporte próprio', 'Oficina e suporte próprios'],
  ['Laboratório próprio e SLA publicado', 'Oficina própria e prazos combinados'],
  ['laboratório próprio, assistência', 'oficina própria, assistência'],
  ['Laboratório', 'Oficina de manutenção'],
  ['laboratório', 'oficina de manutenção'],

  // SLA publicado -> prazos combinados / atendimento com prazo
  ['SLA publicada', 'prazo combinado'],
  ['SLA publicado', 'prazos combinados'],
  ['Suporte e Pós-venda com SLA', 'Suporte e pós-venda com prazo combinado'],
  ['Prazos e SLA', 'Prazos de atendimento'],
  ['Nosso SLA de atendimento é público', 'Os prazos de atendimento são combinados com você'],
  ['SLA de atendimento ONNE', 'Prazos de atendimento ONNE'],
  ['com SLA | ONNE', 'com prazos combinados | ONNE'],
  ['Suporte de pós-venda com SLA publicado', 'Suporte de pós-venda com prazos combinados'],
  ['Peças originais e SLA publicado', 'Peças originais e prazos combinados'],
  ['suporte com SLA', 'suporte com prazos combinados'],

  // IA -> termo descritivo (sem aspecto de "IA" como buzzword)
  ['IA no local', 'processamento a bordo'],
  ['IA com detecção de 17 tipos de objetos', 'detecção automática de 17 tipos de objetos'],
  ['inteligência artificial', 'processamento a bordo'],
  ['Inteligência Artificial', 'Processamento a bordo'],

  // Travessões em frases -> pontuação natural (endereços e produtos tratados à parte)
  [' — você', '. Você'],
  [' — porque', ', porque'],
  [' — e o', ', e o'],
  [' — todos', ', todos'],
  [' — folga', ', folga'],
  [' — imagem', ', imagem'],
  [' — imagens', ', imagens'],
  [' — do', ', do'],
  [' — a ONNE', ', a ONNE'],
  [' — se for', ', se for'],
  [' — valores', ', valores'],
  [' — configuração', ', configuração'],
  [' — baterias', ': baterias'],
  [' — gente', ', gente'],
  [' — detalhes', ': detalhes'],
  [' — disponibilidade', '. Disponibilidade'],
];

// Títulos e subtítulos longos -> versões mais curtas e na voz da ONNE.
const TITLES = [
  ['Tecnologia aplicada à produtividade no campo: da escolha do Agras à estrutura completa de pulverização.', 'Drones no campo, com a estrutura certa.'],
  ['Drones, câmeras e estabilizadores para quem transforma ideias em imagem.', 'Equipamentos para criar e filmar.'],
  ['Precisão para operações técnicas, inspeções industriais e grandes produções.', 'Tecnologia aérea para o trabalho técnico.'],
  ['O equipamento é só parte da operação. A ONNE entrega a estrutura completa.', 'O drone é só o começo.'],
  ['Mobilidade elétrica na prática: motocicletas com eficiência comprovada na ponta do lápis.', 'Motos elétricas, na prática.'],
  ['Drones seminovos revisados, com horas de voo abertas e laudo técnico individual.', 'Seminovos revisados, com laudo.'],
  ['Laboratório próprio, peças originais e prazos de atendimento publicados.', 'Oficina própria, peças originais e prazo combinado.'],
  ['Não basta ter o drone. É preciso saber operar com segurança, método e resultado.', 'Aprender a voar com segurança.'],
  ['Inteligência aérea para vigilância patrimonial, condomínios e segurança pública.', 'Drones para vigilância e segurança.'],
  ['Precisa do resultado sem gerir frota própria? Contrate a Operação ONNE.', 'Prefere contratar a operação?'],
  ['Fale com a ONNE — gente de verdade, sem central genérica.', 'Fale com a ONNE.'],
  ['Energia e voo — baterias, controles e proteção.', 'Baterias, controles e proteção.'],
];

let changed = 0;
for (const p of files) {
  let s = fs.readFileSync(p, 'utf8');
  const o = s;
  for (const [a, b] of TITLES) s = s.split(a).join(b);
  for (const [a, b] of TERMS) s = s.split(a).join(b);
  // remove travessão solitário restante em texto corrido, exceto endereços e nomes de produto
  s = s.replace(/ — /g, (m, offset, str) => {
    const before = str.slice(Math.max(0, offset - 40), offset);
    const after = str.slice(offset + 3, offset + 45);
    if (/São Carlos|Jardim Embaré|CEP|XMixer 150B|XGEN 10|Design|Drone ao/.test(before + after)) return m;
    return ', ';
  });
  if (s !== o) { fs.writeFileSync(p, s); changed++; }
}
console.log(`linguagem: ${changed} arquivos atualizados.`);
