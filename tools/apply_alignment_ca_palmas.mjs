import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const configPath = path.join(root, 'skin-fecomercio', 'config.json');
const version = '4.3.5-ca-palmas-alinhamentos-2026-11-04-r2';
const publicBase = 'https://mgtour360graus.github.io/centro-de-atividades-palmas';
const socialImage = 'socialThumbnail-revisao-20261104.png';

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const write = (relativePath, contents) => fs.writeFileSync(path.join(root, relativePath), contents, 'utf8');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (config.version === version && config.groups.length === 9) {
  console.log(`Alinhamentos já aplicados: ${version}`);
  process.exit(0);
}
if (config.scenes.length !== 187 || config.groups.length !== 8) {
  throw new Error(`Exportação inesperada: ${config.scenes.length} cenas e ${config.groups.length} grupos.`);
}

config.version = version;
config.homeIndex = 0;
config.brand.tourName = 'Centro de Atividades Sesc Palmas, Tocantins - TOUR 360°';
config.brand.unitName = 'Centro de Atividades Sesc Palmas';
config.brand.logo = 'skin-fecomercio/assets/marca-sesc-colorida-20261030.png';
config.brand.cornerLogo = 'skin-fecomercio/assets/marca-sesc-branca-20261030.png';
config.brand.tagline = '';
config.intro.description = 'Visite o Centro de Atividades Sesc Palmas. Escolha como navegar e explore os ambientes da unidade.';

const renames = [
  ['Ginásio', 'Quadra Poliesportiva'],
  ['Projeto de Vida', 'Vida Ativa'],
  ['Sala Multiuso 01', '6° ano'],
  ['Sala Multiuso 02', '7° ano'],
  ['Salas Projeto Especial', 'Sala Multiuso Escola'],
  ['Núcleo de Música — Teclado', 'Núcleo de música 02 / Teclado'],
  ['Núcleo de Música — teclado', 'Núcleo de música 02 / Teclado'],
  ['Núcleo de Música — Viola e violão', 'Núcleo de música 02 / Violão Guitarra'],
  ['Núcleo de Música — Coral', 'Núcleo de música 01 / Canto'],
  ['Núcleo de Música', 'Sala administrativa'],
  ['Sala de vídeo', 'Sala biblioteca infantil'],
  ['Rampa de acesso', 'Corredor'],
  ['Secretária', 'Secretaria'],
];

function renameScene(name) {
  for (const [before, after] of renames) {
    if (name === before) return after;
    if (name.startsWith(`${before} · `)) return `${after}${name.slice(before.length)}`;
  }
  return name;
}

for (const scene of config.scenes) {
  scene.name = renameScene(scene.name);
  if (scene.index >= 0 && scene.index <= 3) scene.group = 'geral';
  if (scene.group === 'outros') scene.group = 'educacao-projetos';
}

const groupById = new Map(config.groups.map((group) => [group.id, group]));
const entrada = groupById.get('entrada');
entrada.destinations = entrada.destinations.filter((destination) => destination.index !== 0);
entrada.short = 'Entrada';
entrada.title = 'Entrada e circulação';
entrada.eyebrow = 'Entrada e circulação';
entrada.description = 'Acesse a entrada principal, a Central de Relacionamento e os ambientes de circulação do Centro de Atividades Sesc Palmas.';

const esporte = groupById.get('esporte');
esporte.title = 'Esporte e atividade física';

const alimentacao = groupById.get('alimentacao');
alimentacao.short = 'Alimentação';
alimentacao.title = 'Alimentação: Restaurante e Lanchonete';
alimentacao.eyebrow = 'Alimentação';
alimentacao.description = 'Conheça o Restaurante e a Lanchonete do Centro de Atividades Sesc Palmas.';
alimentacao.destinations.sort((a, b) => {
  const rank = (destination) => destination.index === 148 ? 0 : destination.index === 111 ? 1 : 2;
  return rank(a) - rank(b);
});

const outros = groupById.get('outros');
outros.id = 'educacao-projetos';
outros.short = 'Educação';
outros.title = 'Vida Ativa e salas de aula';
outros.eyebrow = 'Educação e projetos';
outros.description = 'Explore Vida Ativa, 6° ano, 7° ano e a Sala Multiuso Escola.';

const geral = {
  id: 'geral',
  number: '01',
  short: 'Geral',
  title: 'Conheça a Unidade',
  eyebrow: 'Visão geral',
  description: 'Comece pela vista aérea e conheça a entrada do Centro de Atividades Sesc Palmas.',
  accent: '#004C99',
  surface: '#E8F3FF',
  destinations: [
    { label: 'Vista Aérea · 01', index: 0 },
    { label: 'Entrada principal', index: 82 },
  ],
};

config.groups = [geral, ...config.groups];
for (let index = 0; index < config.groups.length; index += 1) {
  config.groups[index].number = String(index + 1).padStart(2, '0');
}

const sceneNameByIndex = new Map(config.scenes.map((scene) => [scene.index, scene.name]));
for (const group of config.groups) {
  for (const destination of group.destinations) {
    if (destination.label === 'Entrada principal') continue;
    const sceneName = sceneNameByIndex.get(destination.index);
    if (!sceneName) throw new Error(`Destino sem cena: ${group.id}/${destination.index}`);
    destination.label = sceneName;
  }
}

fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

function replaceOnce(contents, before, after, label) {
  const matches = contents.split(before).length - 1;
  if (matches !== 1) throw new Error(`${label}: esperado 1, encontrado ${matches}.`);
  return contents.replace(before, after);
}

for (const scriptFile of ['script_general.js', 'script_mobile.js']) {
  let contents = read(scriptFile);
  contents = replaceOnce(
    contents,
    'this.setPlayListSelectedIndex(this.mainPlayList, 183)',
    'this.setPlayListSelectedIndex(this.mainPlayList, 82)',
    `${scriptFile}: saída direita do teatro`,
  );
  write(scriptFile, contents);
}

for (const indexFile of ['index.htm', 'index.html']) {
  let contents = read(indexFile);
  contents = contents.replace(/<title>[^<]*<\/title>/, '<title>Centro de Atividades Sesc Palmas | Tour Virtual 360°</title>');
  contents = contents.replaceAll('Tour Virtual 360 graus', 'Visita virtual 360° ao Centro de Atividades Sesc Palmas, Tocantins.');
  contents = contents.replace(/https:\/\/mgtour360graus\.github\.io\/centro-de-atividades-palmas\/socialThumbnail\.jpg(?:\?v=\d+)?/g, `${publicBase}/${socialImage}`);
  contents = contents.replaceAll('4.3.0-palmas-20261006-r2', version);
  write(indexFile, contents);
}

console.log(JSON.stringify({
  version: config.version,
  scenes: config.scenes.length,
  groups: config.groups.map(({ id, number, short, title }) => ({ id, number, short, title })),
  rightTheaterDoorTarget: 82,
}, null, 2));
