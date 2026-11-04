import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const failures = [];
const checks = [];

function check(condition, label, detail = '') {
  checks.push({ label, ok: Boolean(condition), detail });
  if (!condition) failures.push(detail ? `${label}: ${detail}` : label);
}

const config = JSON.parse(fs.readFileSync(path.join(root, 'skin-fecomercio', 'config.json'), 'utf8'));
const expectedVersion = '4.3.5-ca-palmas-alinhamentos-2026-11-04-r3';
check(config.version === expectedVersion, 'Versão da configuração', config.version);
check(config.homeIndex === 0, 'Cena inicial geral', String(config.homeIndex));
check(config.scenes.length === 187, 'Total de panoramas', String(config.scenes.length));
check(config.groups.length === 9, 'Total de categorias', String(config.groups.length));

const expectedOrder = ['geral', 'entrada', 'infantil', 'escola', 'esporte', 'cultura', 'alimentacao', 'saude', 'educacao-projetos'];
check(config.groups.map((group) => group.id).join('|') === expectedOrder.join('|'), 'Ordem Geral/Entrada e categorias', config.groups.map((group) => group.id).join(', '));
check(config.groups.every((group, index) => group.number === String(index + 1).padStart(2, '0')), 'Numeração sequencial das categorias');

const groupIds = new Set(config.groups.map((group) => group.id));
const sceneIndices = config.scenes.map((scene) => scene.index);
check(new Set(sceneIndices).size === 187 && Math.min(...sceneIndices) === 0 && Math.max(...sceneIndices) === 186, 'Cobertura única das cenas');
check(config.scenes.every((scene) => groupIds.has(scene.group)), 'Todas as cenas pertencem a uma categoria válida');
check(config.scenes.filter((scene) => scene.group === 'geral').map((scene) => scene.index).join(',') === '0,1,2,3', 'Vistas aéreas em Geral');

const sceneByIndex = new Map(config.scenes.map((scene) => [scene.index, scene]));
check(config.groups.every((group) => group.destinations.every((destination) => sceneByIndex.has(destination.index))), 'Todos os atalhos apontam para cenas existentes');

const names = config.scenes.map((scene) => scene.name).join('\n');
for (const obsolete of ['Ginásio', 'Projeto de Vida', 'Sala Multiuso 01', 'Sala Multiuso 02', 'Salas Projeto Especial', 'Sala de vídeo', 'Rampa de acesso', 'Secretária']) {
  check(!names.includes(obsolete), `Nomenclatura removida: ${obsolete}`);
}
for (const required of ['Quadra Poliesportiva', 'Vida Ativa', '6° ano', '7° ano', 'Sala Multiuso Escola', 'Sala administrativa', 'Núcleo de música 02 / Teclado', 'Núcleo de música 02 / Violão Guitarra', 'Núcleo de música 01 / Canto', 'Sala biblioteca infantil', 'Corredor', 'Secretaria']) {
  check(names.includes(required), `Nomenclatura aplicada: ${required}`);
}

const alimentacao = config.groups.find((group) => group.id === 'alimentacao');
check(alimentacao.short === 'Alimentação', 'Menu curto Alimentação', alimentacao.short);
check(alimentacao.title === 'Alimentação: Restaurante e Lanchonete', 'Título de alimentação', alimentacao.title);
check(alimentacao.destinations.map((destination) => destination.index).join(',') === '148,111', 'Ordem Restaurante/Lanchonete', alimentacao.destinations.map((destination) => destination.index).join(','));

check(config.brand.logo.endsWith('marca-sesc-colorida-20261030.png'), 'Marca colorida oficial');
check(config.brand.cornerLogo.endsWith('marca-sesc-branca-20261030.png'), 'Marca branca oficial');
for (const relativePath of [config.brand.logo, config.brand.cornerLogo]) {
  check(fs.existsSync(path.join(root, relativePath)), `Arquivo de marca existente: ${relativePath}`);
}

const expectedBundleHash = 'BC07192831B8A52EC22157B4FF410C085308C68AD33DA7D7614C86BB632D22DD';
const bundle = fs.readFileSync(path.join(root, 'skin-fecomercio', 'mg360-fecomercio-motion-skin.bundle.js'));
const bundleHash = crypto.createHash('sha256').update(bundle).digest('hex').toUpperCase();
check(bundleHash === expectedBundleHash, 'Skin complementar validada', bundleHash);

const unitCss = fs.readFileSync(path.join(root, 'skin-fecomercio', 'palmas.css'), 'utf8');
check(unitCss.includes('#mg360-ui .mg360-destination:before'), 'Alinhamento dos marcadores dos ambientes');
check(unitCss.includes('bottom:calc(110px + var(--mg-safe-bottom))'), 'Categorias separadas do dock no desktop');
check(unitCss.includes('bottom:calc(140px + var(--mg-safe-bottom))'), 'Categorias separadas do dock em telas menores');
check(unitCss.includes('#mg360-ui.mg360-mobile-viewport-fix .mg360-nuclei{display:flex'), 'Categorias visíveis na adaptação móvel');
check(unitCss.includes('@media(max-width:900px)'), 'Comportamento restrito ao mobile');
check(unitCss.includes('.mg360-panorama-moving .mg360-nuclei{opacity:0'), 'Barra oculta durante o movimento');

const unitJs = fs.readFileSync(path.join(root, 'skin-fecomercio', 'palmas.js'), 'utf8');
check(unitJs.includes("document.addEventListener('pointerdown', hideCategories, true)"), 'Início do gesto móvel detectado');
check(unitJs.includes("root.classList.remove('mg360-panorama-moving')"), 'Barra restaurada após o gesto');

for (const scriptFile of ['script_general.js', 'script_mobile.js']) {
  const script = fs.readFileSync(path.join(root, scriptFile), 'utf8');
  check(script.includes('"watermark":false'), `${scriptFile}: marca-d’água do 3DVista desativada`);
  check(script.includes('this.setPlayListSelectedIndex(this.mainPlayList, 179)'), `${scriptFile}: foyer acessa o teatro`);
  check(script.includes('this.setPlayListSelectedIndex(this.mainPlayList, 178)'), `${scriptFile}: porta esquerda acessa a bomboniere`);
  const rightDoor = '"click":"this.setPlayListSelectedIndex(this.mainPlayList, 82)","mapColor":"any","id":"HotspotPanoramaOverlayArea_0E0350FF_1232_A6A4_419B_AB12006C2BBC"';
  check(script.includes(rightDoor), `${scriptFile}: porta direita acessa a entrada principal`);
}

for (const indexFile of ['index.htm', 'index.html']) {
  const html = fs.readFileSync(path.join(root, indexFile), 'utf8');
  check(html.includes(expectedVersion), `${indexFile}: controle de versão`);
  check(html.includes('Centro de Atividades Sesc Palmas | Tour Virtual 360°'), `${indexFile}: título correto`);
  check(html.includes('socialThumbnail-revisao-20261104.png'), `${indexFile}: capa revisada`);
  check(!html.includes('socialThumbnail.jpg'), `${indexFile}: capa antiga removida dos metadados`);
}

const cover = fs.readFileSync(path.join(root, 'socialThumbnail-revisao-20261104.png'));
const width = cover.readUInt32BE(16);
const height = cover.readUInt32BE(20);
check(width === 1200 && height === 630, 'Dimensão da capa social', `${width}x${height}`);

const report = {
  unit: 'Centro de Atividades Sesc Palmas',
  version: config.version,
  checks: checks.length,
  passed: checks.filter((item) => item.ok).length,
  failed: failures.length,
  bundleHash,
  failures,
};

console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
