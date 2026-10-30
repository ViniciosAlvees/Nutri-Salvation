/* Executar na raiz do repositório: node scripts/aplicar-atualizacao.mjs */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const indexPath = resolve(root, 'index.html');
const js = resolve(root, 'nutri-upgrade.js');
const css = resolve(root, 'nutri-upgrade.css');

for (const file of [indexPath, js, css]) {
  if (!existsSync(file)) throw new Error(`Arquivo necessário não encontrado: ${file}`);
}
let html = readFileSync(indexPath, 'utf8');
if (!html.includes('<link rel="stylesheet" href="nutri-upgrade.css">')) {
  const anchor = '<link rel="stylesheet" href="play.css">';
  if (!html.includes(anchor)) throw new Error('Não encontrei o link de play.css no index.html. Nenhum arquivo foi alterado.');
  html = html.replace(anchor, `${anchor}<link rel="stylesheet" href="nutri-upgrade.css">`);
}
if (!html.includes('<script src="nutri-upgrade.js"></script>')) {
  const anchor = '<script src="app.js"></script>';
  if (!html.includes(anchor)) throw new Error('Não encontrei o script app.js no index.html. Nenhum arquivo foi alterado.');
  html = html.replace(anchor, `${anchor}<script src="nutri-upgrade.js"></script>`);
}
const faqText = 'Seu resumo, sugestões para um dia, trocas de alimentos, uma opção doce, estratégias para sua dificuldade e a fonte consultada.';
const newFaqText = 'Seu resumo, ideias de refeições, cuidados com restrições, orientações de hidratação com momentos ilustrativos, sono e referências consultadas.';
html = html.replace(faqText, newFaqText);
writeFileSync(indexPath, html);
console.log('Nutri-Salvation atualizado: scripts e CSS vinculados; index.html preservado.');
