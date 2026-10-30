import { readFileSync, mkdtempSync, writeFileSync, existsSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const source = readFileSync(new URL('../nutri-upgrade.js', import.meta.url), 'utf8');
const begin = source.indexOf('  function getSleepRange(');
const end = source.indexOf('\n  let currentGuide;', begin);
const code = source.slice(begin, end);
const baseGuide = p => ({profile: p, meals: [['Almoço', 'Arroz e feijão']], needsCare: p.alergia === 'sim', tips: 'Orientação', goal:'Equilíbrio'});
const getFunctions = new Function('originalCreateGuide', code + '; return {getSleepRange,sleepAdvice,waterAdvice,createEnhancedGuide};');
const {getSleepRange, sleepAdvice, waterAdvice, createEnhancedGuide} = getFunctions(baseGuide);
assert.deepEqual(getSleepRange(12), [9,12]);
assert.deepEqual(getSleepRange(17), [8,10]);
assert.deepEqual(getSleepRange(20), [7,9]);
assert.deepEqual(getSleepRange(70), [7,8]);
const base = {nome:'Teste',idade:'28',alergia:'nao',restricao:'nao',condicao:'nao', aguaMl:'1500', bebeAgua:'sim', horasSono:'6',treino:'Não treino atualmente'};
assert.match(sleepAdvice(base).comment, /menos que essa faixa/);
const healthy = createEnhancedGuide(base);
assert.equal(healthy.needsCare, false);
assert.equal(healthy.water.schedule.length, 8);
assert.equal(healthy.water.trainingSchedule.length, 0);
const athlete = createEnhancedGuide({...base, treino:'3 a 4 vezes por semana', duracaoTreino:'Mais de 60 minutos', horarioTreino:'Manhã'});
assert.equal(athlete.water.trainingSchedule.length, 3);
assert.match(athlete.water.trainingSchedule[1][1], /100 a 200 mL/);
const allergy = createEnhancedGuide({...base, alergia:'sim',descricaoAlergia:'amendoim'});
assert.equal(allergy.needsCare, true);
assert.equal(allergy.meals.length, 4);
assert.doesNotMatch(allergy.meals.map(x => x[1]).join(' '), /amendoim|leite|ovos|castanhas/);
const minor = createEnhancedGuide({...base,idade:'16'});
assert.equal(minor.water.schedule.length, 4);
assert.equal(minor.water.schedule[0][2], 'Sem volume fixo');
assert.equal(minor.sleep.min, 8);
const clinical = createEnhancedGuide({...base,condicao:'sim'});
assert.equal(clinical.water.schedule.length, 4);
assert.equal(clinical.water.trainingSchedule.length, 0);
const pdfBegin = source.indexOf('  function pdfParagraph(');
const pdfEnd = source.indexOf('\n  addProfileFields();', pdfBegin);
const pdfCode = source.slice(pdfBegin,pdfEnd);
const makePdf = new Function('window', pdfCode + '; return buildEnhancedPdf;')({
  wrap: (text,max=84) => { const lines=[]; let line=''; for(const word of String(text).split(/\s+/)){ if(line.length + word.length + 1 > max){ if(line) lines.push(line); line=''; } if(word.length>max){ if(line) lines.push(line); line=''; for(let i=0;i<word.length;i+=max) lines.push(word.slice(i,i+max)); } else line += (line ? ' ' : '') + word; } if(line) lines.push(line); return lines; },
  pdfBytes: pages => pages
});
const output = makePdf(athlete).flat().join(' ');
assert.match(output, /HIDRATACAO/);
assert.match(output, /SONO/);
assert.match(output, /100 a 200 mL/);

// Verifica que o instalador funciona duas vezes sem duplicar imports.
const work = mkdtempSync(join(tmpdir(),'nutri-check-'));
writeFileSync(join(work,'index.html'),'<html><head><link rel="stylesheet" href="play.css"></head><body><script src="app.js"></script><script src="play.js"></script></body></html>');
for (const filename of ['nutri-upgrade.js','nutri-upgrade.css']) cpSync(new URL('../'+filename,import.meta.url), join(work,filename));
const script = new URL('../scripts/aplicar-atualizacao.mjs', import.meta.url).pathname;
for (let n=0;n<2;n++) {
 const run = spawnSync(process.execPath,[script], {cwd:work,encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
}
const index = readFileSync(join(work,'index.html'),'utf8');
assert.equal(index.match(/nutri-upgrade\.js/g).length,1);
assert.equal(index.match(/nutri-upgrade\.css/g).length,1);
assert.ok(index.includes('play.js'));
console.log('PASSOU: 17 verificações de lógica, PDF e instalador idempotente.');
