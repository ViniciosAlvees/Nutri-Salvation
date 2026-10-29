const form = document.querySelector('#profileForm');
const panels = [...document.querySelectorAll('fieldset')];
let step = 0;
let guide;
const source = 'https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf/view';
function showStep() {
  panels.forEach((panel, index) => { panel.hidden = index !== step; panel.disabled = index !== step; });
  document.querySelector('#stepLabel').textContent = ['SEU PERFIL', 'SUA ROTINA', 'SEU CUIDADO'][step];
  document.querySelector('#stepCount').textContent = `0${step + 1} / 03`;
  document.querySelector('#progress').style.width = `${(step + 1) / 3 * 100}%`;
  document.querySelector('#back').hidden = step === 0;
  document.querySelector('#timeHint').hidden = step !== 0;
  document.querySelector('#next').textContent = step === 2 ? 'Criar meu guia ↗' : 'Continuar →';
}
document.querySelector('#back').addEventListener('click', () => { step--; showStep(); });
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (step < 2) { step++; showStep(); panels[step].querySelector('input,select').focus(); return; }
  panels.forEach(panel => { panel.disabled = false; });
  const profile = Object.fromEntries(new FormData(form));
  panels.forEach((panel, index) => { panel.disabled = index !== step; });
  if (!profile.nome.trim()) { step = 0; showStep(); form.elements.nome.focus(); return; }
  guide = createGuide(profile);
  renderGuide();
});
function createGuide(p) {
  const needsCare = Number(p.idade) < 18 || p.alergia === 'sim' || p.condicao === 'sim';
  const vegan = p.preferencia === 'Vegana';
  const vegetarian = vegan || p.preferencia.startsWith('Vegetariana');
  const meals = needsCare ? [] : [
    ['Café da manhã', vegan ? 'Aveia com banana e bebida de soja sem açúcar. Alternativa: pão com pasta de grão-de-bico e uma fruta.' : 'Aveia com banana e iogurte natural. Alternativa: pão com ovos e uma fruta.'],
    ['Almoço', `Arroz, feijão, legumes e folhas variadas${vegetarian ? '. Varie o feijão com lentilha ou grão-de-bico.' : ', acompanhados de frango, peixe ou ovos.'}`],
    ['Lanche, se sentir fome', vegan ? 'Uma fruta e pasta de grão-de-bico com torradas. Ajuste ao seu apetite e à sua rotina.' : 'Uma fruta com iogurte natural. Outra ideia: pão com queijo e tomate.'],
    ['Jantar', vegan ? 'Batata ou arroz com lentilha e legumes refogados. Aproveite os ingredientes já preparados no almoço.' : 'Omelete com legumes, arroz ou batata e uma salada. Aproveite os ingredientes já preparados no almoço.'],
    ['Seu momento doce', p.doce === 'Chocolate' ? (vegan ? 'Banana aquecida com cacau e chocolate sem leite, se gostar. Confira os ingredientes do chocolate.' : 'Banana aquecida com cacau e um pouco do seu chocolate favorito.') : p.doce === 'Frutas e canela' ? 'Maçã ou banana assada com canela. Sirva morna e aproveite com calma.' : 'Bata banana congelada até ficar cremosa. Acrescente cacau ou morango, se gostar.']
  ];
  const tips = {
    'Falta de tempo para cozinhar': 'Reserve um momento para preparar arroz, feijão e legumes. Congele em recipientes adequados e monte combinações diferentes durante a semana.',
    'Vontade de comer doces': 'Planeje um momento prazeroso para o doce, sem compensar pulando refeições. Observe fome, satisfação e o contexto em que a vontade aparece.',
    'Manter horários e constância': 'Escolha uma refeição como ponto de partida e organize um horário possível. Um dia diferente não invalida sua rotina.',
    'Orçamento apertado': 'Priorize alimentos da estação, arroz, feijão e legumes locais. Planeje compras e aproveite ingredientes em mais de uma preparação.',
    'Poucas ideias de refeições': 'Combine um cereal ou tubérculo, uma leguminosa e vegetais. Alterne temperos e modos de preparo para variar sem complicar.'
  };
  const goal = p.objetivo === 'Ganhar massa muscular' ? 'Distribua fontes de proteína nas refeições e combine alimentação com treino orientado e descanso. Quantidades individuais devem ser avaliadas por nutricionista.' : p.objetivo === 'Reduzir peso com equilíbrio' ? 'Construa hábitos sustentáveis, com refeições regulares e atenção à fome e saciedade. Evite restrições extremas; este guia não define déficit calórico nem promete perda de peso.' : 'Priorize variedade, refeições feitas com atenção e hábitos que você consiga manter. Observe disposição e satisfação, além de números.';
  return { profile: p, needsCare, meals, tips: tips[p.dificuldade], goal };
}
function addText(parent, tag, text, className) {
  const el = document.createElement(tag); el.textContent = text;
  if (className) el.className = className;
  parent.append(el); return el;
}
function renderGuide() {
  const r = document.querySelector('#result'); r.replaceChildren(); r.hidden = false; form.hidden = true;
  document.querySelector('#stepLabel').textContent = 'SEU GUIA ESTÁ PRONTO';
  addText(r, 'div', '✳', 'result-head');
  addText(r, 'h3', `${guide.profile.nome.trim()}, seu próximo passo.`);
  addText(r, 'p', guide.needsCare ? 'Seu perfil merece cuidado individual. Preparamos um resumo para levar a um nutricionista, sem gerar um cardápio automático.' : 'Um dia de possibilidades, para adaptar à sua rotina. As sugestões não definem porções, calorias ou metas clínicas.');
  if (!guide.needsCare) {
    addText(r, 'p', guide.goal, 'small');
    guide.meals.forEach(([title, meal]) => { const row = addText(r, 'div', '', 'meal'); addText(row, 'strong', title); addText(row, 'p', meal); });
    addText(r, 'p', guide.tips, 'notice');
  } else {
    addText(r, 'p', 'Leve à consulta seus objetivos, histórico de saúde, medicamentos e detalhes das alergias ou intolerâncias. Não retire grupos alimentares por conta própria.', 'notice');
  }
  addText(r, 'p', 'Base editorial: Guia Alimentar para a População Brasileira, Ministério da Saúde. Sem busca automática na internet. Seu PDF inclui o resumo e a referência.', 'small source-note');
  const actions = addText(r, 'div', '', 'result-actions');
  const download = addText(actions, 'button', 'Baixar meu PDF ↓', 'button'); download.type = 'button'; download.addEventListener('click', downloadPdf);
  const edit = addText(actions, 'button', '← Editar perfil', 'back'); edit.type = 'button'; edit.addEventListener('click', () => { r.hidden = true; form.hidden = false; step = 0; showStep(); });
  r.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
// Small, dependency-free PDF writer. Text is encoded as Windows-1252 compatible Latin-1.
function pdfSafe(text) {
  return String(text).replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[’]/g, "'").replace(/[^\x20-\xFF]/g, '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}
function wrap(text, max = 84) {
  const lines = []; let line = '';
  for (const word of String(text).split(/\s+/)) {
    if (line.length + word.length + 1 > max) { if (line) lines.push(line); line = ''; }
    if (word.length > max) { if (line) lines.push(line); line = ''; for (let i = 0; i < word.length; i += max) lines.push(word.slice(i, i + max)); }
    else line += (line ? ' ' : '') + word;
  }
  if (line) lines.push(line); return lines;
}
function pdfBytes(pages) {
  const objects = ['', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'];
  const kids = [];
  pages.forEach((lines, index) => {
    const pageId = objects.length + 1; const contentId = pageId + 1; kids.push(`${pageId} 0 R`);
    let stream = '0.07 0.1 0.06 rg 0 742 595 100 re f\n0.72 0.97 0.35 rg BT /F1 22 Tf 42 795 Td (NUTRI SALVATION) Tj ET\n';
    stream += `0.85 0.9 0.82 rg BT /F1 10 Tf 42 770 Td (${pdfSafe('GUIA EDUCATIVO / ' + new Date().toLocaleDateString('pt-BR'))}) Tj ET\n`;
    let y = 715;
    lines.forEach(line => { stream += `0.13 0.17 0.11 rg BT /F1 11 Tf 42 ${y} Td (${pdfSafe(line)}) Tj ET\n`; y -= 17; });
    stream += `0.4 0.45 0.37 rg BT /F1 9 Tf 42 35 Td (Conteúdo educativo. Não substitui consulta nutricional. | ${index + 1}/${pages.length}) Tj ET\n`;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
  });
  objects[0] = '<< /Type /Catalog /Pages 2 0 R >>'; objects[1] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((obj, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`; });
  const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Uint8Array.from(pdf, char => char.charCodeAt(0) & 255);
}
function buildPdf(g) {
  const p = g.profile;
  const lines = [];
  const para = text => { lines.push(...wrap(text), ''); };
  para(`SEU PERFIL - ${p.nome.trim()}`);
  para(`Idade: ${p.idade} anos | Altura: ${p.altura} cm | Peso informado: ${p.peso} kg`);
  para(`Objetivo: ${p.objetivo}. Treinos: ${p.treino}. Dieta anterior: ${p.dieta}.`);
  para(`Preferência: ${p.preferencia}. Dificuldade: ${p.dificuldade}.`);
  para(`Alergia/intolerância: ${p.alergia === 'sim' ? 'Sim' : 'Não'}. Condição específica: ${p.condicao === 'sim' ? 'Sim ou dúvida' : 'Não'}.`);
  if (g.needsCare) {
    para('ACOMPANHAMENTO INDIVIDUAL');
    para('Pelo seu perfil, este guia não inclui cardápio automático. Procure um nutricionista para avaliar suas necessidades. Menores de idade devem envolver um responsável.');
    para('Leve à consulta: histórico de saúde, medicamentos, rotina, preferências e informações detalhadas de alergias ou intolerâncias. Não retire grupos alimentares sem orientação.');
  } else {
    para('SEU OBJETIVO, COM EQUILÍBRIO'); para(g.goal);
    para('UM DIA DE POSSIBILIDADES - adapte horários à sua rotina e respeite sua fome. Estas são ideias culinárias, sem prescrição de porções ou calorias.');
    g.meals.forEach(([title, meal]) => { para(title.toUpperCase()); para(meal); });
    para('UMA ESTRATÉGIA PARA SUA ROTINA'); para(g.tips);
    if (p.dieta === 'Sim, mas foi difícil manter') para('Comece por uma mudança pequena e possível. Evite a lógica de tudo ou nada; retome a rotina sem compensações após dias diferentes.');
    if (p.treino !== 'Não treino atualmente') para('Para o treino: organize refeições de acordo com seus horários e conforto. Procure orientação individual para porções e necessidades esportivas; não há recomendação automática de suplementos.');
    para('TROCAS PARA VARIAR'); para('Arroz por batata, mandioca ou milho. Feijão por lentilha ou grão-de-bico. Alterne legumes e frutas da estação. As trocas são culinárias, não equivalências nutricionais calculadas.');
    if (p.preferencia === 'Vegana') para('Na alimentação vegana, vitamina B12 e outros nutrientes precisam de atenção profissional. Este guia não avalia adequação nutricional nem indica suplementação.');
    para('LISTA DE COMPRAS INICIAL'); para(`Arroz ou batata; feijão ou lentilha; aveia; banana e outras frutas; folhas; legumes; cacau${p.preferencia === 'Vegana' ? '; grão-de-bico; bebida de soja' : '; ovos; iogurte natural'}. Confira os ingredientes de cada preparação antes de comprar.`);
    para('O doce é uma possibilidade, não uma obrigação. Ajuste escolhas ao seu gosto. Não compense sobremesas pulando refeições.');
  }
  para('FONTES E LIMITES'); para('Base editorial: Ministério da Saúde. Guia Alimentar para a População Brasileira, 2ª edição. Referência consultada na criação do site, em 29/10/2026.'); para(source);
  para('As combinações culinárias são sugestões do Nutri Salvation, não cardápios oficiais do Ministério. Não há busca automática na internet, diagnóstico, cálculo de calorias ou garantia de resultado.');
  para('PRIVACIDADE: os dados não são enviados a servidor. Este PDF contém informações pessoais; mantenha-o em local seguro e compartilhe apenas se desejar.');
  const pages = []; for (let i = 0; i < lines.length; i += 38) pages.push(lines.slice(i, i + 38));
  return pdfBytes(pages);
}
function downloadPdf() {
  const blob = new Blob([buildPdf(guide)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = 'nutri-salvation-meu-guia.pdf'; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
showStep();
