/* Nutri Salvation — expansão da jornada do perfil.
 * Mantém o app.js e as experiências Nutri Lab existentes.
 * Carregar depois de app.js, como script clássico (sem type="module").
 */
(() => {
  'use strict';

  const form = document.querySelector('#profileForm');
  const result = document.querySelector('#result');
  if (!form || !result || typeof window.createGuide !== 'function') {
    console.warn('Nutri Upgrade: o formulário ou app.js não foi encontrado.');
    return;
  }

  const originalCreateGuide = window.createGuide;

  function element(tag, value = '', className = '') {
    const node = document.createElement(tag);
    node.textContent = String(value ?? '');
    if (className) node.className = className;
    return node;
  }

  function labelField(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  }

  function addProfileFields() {
    const routine = form.querySelector('fieldset[data-step="1"]');
    const care = form.querySelector('fieldset[data-step="2"]');
    if (!routine || !care || form.querySelector('[name="horasSono"]')) return;

    const routineFields = routine.querySelector('.fields.two');
    const training = form.elements.treino;
    if (routineFields && training) {
      routineFields.append(
        labelField('<label class="nutri-extra">Duração habitual do treino<select name="duracaoTreino"><option>Até 30 minutos</option><option>30 a 60 minutos</option><option>Mais de 60 minutos</option></select></label>'),
        labelField('<label class="nutri-extra">Em que período você treina?<select name="horarioTreino"><option>Manhã</option><option>Tarde</option><option>Noite</option><option>Horários variáveis</option></select></label>')
      );
    }

    routine.append(
      labelField('<label class="nutri-extra">Você costuma beber água todos os dias?<select name="bebeAgua"><option value="sim">Sim</option><option value="nao">Ainda não tenho esse hábito</option></select></label>'),
      labelField('<label class="nutri-extra">Quanto de água você bebe por dia? (mL)<input name="aguaMl" type="number" min="0" max="10000" step="50" inputmode="numeric" placeholder="Ex.: 1500 (1,5 litro)" required><span class="field-hint">Informe somente água, sem contar café, sucos ou alimentos.</span></label>'),
      labelField('<label class="nutri-extra">Quantas horas você dorme por dia?<input name="horasSono" type="number" min="0" max="24" step="0.5" inputmode="decimal" placeholder="Ex.: 7.5" required><span class="field-hint">Considere suas horas habituais de sono em 24 horas.</span></label>')
    );

    const trainingFields = routineFields?.querySelectorAll('.nutri-extra') ?? [];
    const syncTraining = () => {
      const trains = training.value !== 'Não treino atualmente';
      trainingFields.forEach((field) => {
        field.hidden = !trains;
        const control = field.querySelector('select');
        if (control) control.disabled = !trains;
      });
    };
    training?.addEventListener('change', syncTraining);
    syncTraining();

    const waterSelect = form.elements.bebeAgua;
    const waterInput = form.elements.aguaMl;
    waterSelect?.addEventListener('change', () => {
      if (waterSelect.value === 'nao') waterInput.value = '0';
      else if (waterInput.value === '0') waterInput.value = '';
    });

    const allergyLabel = care.querySelector('[name="alergia"]')?.closest('label');
    const allergyDetail = labelField('<label class="nutri-extra" id="allergyDetail" hidden>Qual alergia ou intolerância? <span class="required-star">*</span><textarea name="descricaoAlergia" maxlength="220" rows="3" placeholder="Ex.: lactose, leite, glúten, amendoim…"></textarea><span class="field-hint">Descreva o que já sabe; o site não verifica a segurança dos ingredientes.</span></label>');
    allergyLabel?.insertAdjacentElement('afterend', allergyDetail);
    const restrictionLabel = labelField('<label class="nutri-extra">Você segue alguma outra restrição alimentar?<select name="restricao"><option value="nao">Não</option><option value="sim">Sim</option></select></label>');
    const restrictionDetail = labelField('<label class="nutri-extra" id="restrictionDetail" hidden>Conte qual é a restrição <span class="required-star">*</span><textarea name="descricaoRestricao" maxlength="220" rows="3" placeholder="Ex.: evito um alimento específico, restrição orientada…"></textarea></label>');
    allergyDetail.insertAdjacentElement('afterend', restrictionLabel);
    restrictionLabel.insertAdjacentElement('afterend', restrictionDetail);

    function syncDetails(select, label) {
      const show = select.value === 'sim';
      label.hidden = !show;
      const textarea = label.querySelector('textarea');
      textarea.required = show;
      textarea.disabled = !show;
      if (!show) textarea.value = '';
    }
    form.elements.alergia.addEventListener('change', () => syncDetails(form.elements.alergia, allergyDetail));
    form.elements.restricao.addEventListener('change', () => syncDetails(form.elements.restricao, restrictionDetail));
    syncDetails(form.elements.alergia, allergyDetail);
    syncDetails(form.elements.restricao, restrictionDetail);
  }

  function getSleepRange(age) {
    if (age <= 2) return [11, 14];
    if (age <= 5) return [10, 13];
    if (age <= 12) return [9, 12];
    if (age <= 17) return [8, 10];
    if (age <= 64) return [7, 9];
    return [7, 8];
  }

  function sleepAdvice(profile) {
    const age = Number(profile.idade);
    const actual = Number(profile.horasSono);
    const [min, max] = getSleepRange(age);
    let comment = `Para sua faixa etária, a referência geral é de ${min} a ${max} horas de sono a cada 24 horas.`;
    if (Number.isFinite(actual)) {
      if (actual < min) comment += ' Você relatou dormir menos que essa faixa. Tente manter horários regulares e busque ajuda se o cansaço persistir.';
      else if (actual > max) comment += ' Você relatou mais horas; necessidades individuais variam. Se houver sonolência excessiva, converse com um profissional.';
      else comment += ' Suas horas relatadas estão dentro dessa faixa. A qualidade do sono também importa.';
    }
    return { actual, min, max, comment };
  }

  const cautiousWaterMoments = [
    ['Ao acordar', 'Observe sede e orientações individuais', 'Sem volume fixo'],
    ['Entre refeições', 'Faça pausas de hidratação adequadas à sua rotina', 'Sem volume fixo'],
    ['Durante atividades', 'Tenha água acessível e observe suas necessidades', 'Sem volume fixo'],
    ['Após atividades', 'Avalie perdas e siga a orientação profissional', 'Sem volume fixo']
  ];

  const waterTimes = [
    ['07:00', 'Ao acordar', '250 mL'],
    ['09:00', 'Pausa da manhã', '250 mL'],
    ['11:00', 'Antes ou junto da refeição', '250 mL'],
    ['13:00', 'Após o almoço, conforme conforto', '250 mL'],
    ['15:00', 'Pausa da tarde', '250 mL'],
    ['17:00', 'Fim da tarde', '250 mL'],
    ['19:00', 'Junto do jantar, conforme conforto', '250 mL'],
    ['21:00', 'Noite, se não atrapalhar o sono', '250 mL']
  ];

  function waterAdvice(profile) {
    const reported = Math.max(0, Number(profile.aguaMl) || 0);
    const trains = profile.treino !== 'Não treino atualmente';
    const caution = Number(profile.idade) < 18 || profile.condicao === 'sim';
    const schedule = caution ? cautiousWaterMoments : waterTimes;
    const trainingSchedule = trains && !caution ? [
      ['Antes do treino', 'Se houver sede, por volta de 200 mL nas horas anteriores (exemplo, sem obrigação).'],
      ['Durante o treino', profile.duracaoTreino === 'Mais de 60 minutos'
        ? 'Em treinos longos, faça pausas para pequenos goles (ex.: 100 a 200 mL quando necessário), ajustando ao suor e à sede, sem excesso.'
        : 'Em treinos curtos, beba conforme a sede; não é preciso seguir um cronômetro rígido.'],
      ['Após o treino', 'Se suou, reponha aos poucos (por exemplo, mais um copo de 200 a 250 mL) e continue de acordo com a sede e as perdas.']
    ] : [];
    const report = profile.bebeAgua === 'nao'
      ? 'Você informou que ainda não bebe água regularmente. Se não há contraindicação, experimente criar pequenas pausas para beber sem forçar.'
      : `Você relatou aproximadamente ${reported.toLocaleString('pt-BR')} mL de água por dia. Esse dado, sozinho, não permite concluir se sua hidratação é suficiente.`;
    const explanation = caution
      ? 'Os horários de hidratação podem ser organizados ao longo do dia, mas volumes individuais devem ser definidos com responsável/profissional, sobretudo em condições que exigem controle de líquidos.'
      : 'Exemplo opcional para adultos saudáveis: oito lembretes de 250 mL (2.000 mL de água). Não é meta individual nem obrigação: ajuste horários e volume à sede, ao clima, à alimentação e às necessidades pessoais. Alimentos e outras bebidas também fornecem água.';
    const training = trains
      ? `Você relatou treinar ${profile.treino.toLowerCase()}${profile.duracaoTreino ? `, por ${profile.duracaoTreino.toLowerCase()}` : ''} (${profile.horarioTreino || 'horário variável'}). Antes: inicie a atividade hidratado. Durante: faça pausas para pequenos goles, especialmente no calor ou com suor intenso. Depois: reponha gradualmente as perdas. Atividades longas podem exigir mais líquido e reposição de eletrólitos, mas evite beber além da sede e das perdas. Para quantidades esportivas específicas, procure orientação.`
      : 'Nos dias sem exercício, distribua a água conforme sua sede, refeições e rotina; não é necessário beber em horários rígidos.';
    return { reported, schedule, trainingSchedule, explanation, report, training };
  }

  const carefulMealIdeas = [
    ['Café da manhã', 'Combine alimentos que já são tolerados por você: uma fruta, uma base de cereal ou tubérculo e um acompanhamento seguro, conforme sua orientação individual.'],
    ['Almoço', 'Organize grupos de alimentos que você possa consumir: uma fonte de energia, uma opção proteica e vegetais permitidos, observando rótulos e preparo.'],
    ['Lanche', 'Reserve uma alternativa prática de alimentos seguros, respeitando a fome e suas necessidades específicas.'],
    ['Jantar', 'Reaproveite preparações seguras do dia e varie alimentos permitidos e modos de preparo, sem exclusões desnecessárias.']
  ];

  function createEnhancedGuide(profile) {
    const base = originalCreateGuide(profile);
    const care = Number(profile.idade) < 18 || profile.alergia === 'sim' || profile.restricao === 'sim' || profile.condicao === 'sim';
    return {
      ...base,
      needsCare: care,
      meals: care ? carefulMealIdeas : base.meals,
      sleep: sleepAdvice(profile),
      water: waterAdvice(profile)
    };
  }

  let currentGuide;
  let celebrationTimer;

  function section(parent, title, description) {
    const box = element('section', '', 'nutri-guide-section');
    box.append(element('h4', title));
    if (description) box.append(element('p', description));
    parent.append(box);
    return box;
  }

  function renderContents(parent, g) {
    const p = g.profile;
    parent.append(element('div', '✳', 'result-head'));
    parent.append(element('h3', `${p.nome.trim()}, seu guia está pronto!`));
    parent.append(element('p', g.needsCare
      ? 'Seu material está pronto com orientações de rotina, hidratação, descanso e ideias gerais para conversar com um nutricionista. Ingredientes e quantidades que exigem avaliação individual não são prescritos automaticamente.'
      : 'Ideias de alimentação e hábitos para você adaptar à sua vida real. Este conteúdo é educativo, sem cálculo de calorias ou porções individuais.'));

    if (p.alergia === 'sim' || p.restricao === 'sim') {
      const msg = [p.descricaoAlergia, p.descricaoRestricao].filter(Boolean).join(' / ');
      const restriction = section(parent, 'Seus cuidados com a alimentação', `Você informou: ${msg || 'restrição alimentar'}. Estas ideias NÃO garantem que um ingrediente seja seguro. Confira rótulos, possíveis contaminações cruzadas e orientações profissionais.`);
      restriction.classList.add('nutri-important');
    }
    const meals = section(parent, g.needsCare ? 'Ideias gerais de organização das refeições' : 'Seu dia de possibilidades', g.needsCare
      ? 'Sem prescrição de cardápio para condições que precisam de acompanhamento.' : g.goal);
    g.meals.forEach(([heading, description]) => {
      const block = element('div', '', 'meal');
      block.append(element('strong', heading), element('p', description));
      meals.append(block);
    });
    if (g.tips) section(parent, 'Uma estratégia para sua rotina', g.tips);

    const hydration = section(parent, 'Água: seu roteiro de hidratação', `${g.water.report} ${g.water.explanation}`);
    if (g.water.schedule.length) {
      const list = element('div', '', 'nutri-water-grid');
      g.water.schedule.forEach(([hour, moment, amount]) => {
        const item = element('div', '', 'nutri-water-item');
        item.append(element('strong', hour), element('span', moment), element('b', amount));
        list.append(item);
      });
      hydration.append(list);
    }
    if (g.water.trainingSchedule.length) {
      hydration.append(element('h5', 'Momentos extras nos dias de treino (exemplos, não uma meta fixa)', 'nutri-training-title'));
      g.water.trainingSchedule.forEach(([when, howMuch]) => {
        const item = element('div', '', 'nutri-training-row');
        item.append(element('strong', when), element('span', howMuch));
        hydration.append(item);
      });
    }
    hydration.append(element('p', g.water.training, 'nutri-tip'));

    const sleep = section(parent, 'Sono: cuide do seu descanso', `Você informou ${Number(p.horasSono).toLocaleString('pt-BR')} horas por dia. ${g.sleep.comment}`);
    sleep.append(element('p', 'Sono regular, ambiente tranquilo e redução de telas perto da hora de dormir podem ajudar. Dificuldades persistentes merecem avaliação.', 'nutri-tip'));

    if (g.needsCare) section(parent, 'Cuidado individual, sem deixar você sem resposta', 'Leve esse material a um nutricionista ou profissional de saúde. Se for menor de idade, envolva um responsável. Alergias, condições clínicas e restrições podem exigir um planejamento específico.');
    parent.append(element('p', 'Referências: Guia Alimentar para a População Brasileira (Ministério da Saúde), NIH/CDC para sono e NATA para hidratação no exercício. Os horários e volumes ilustrativos não são prescrição.', 'small source-note'));

    const buttons = element('div', '', 'result-actions');
    const download = element('button', 'Baixar meu PDF ↓', 'button');
    download.type = 'button';
    download.addEventListener('click', () => window.downloadPdf());
    const edit = element('button', '← Editar perfil', 'back');
    edit.type = 'button';
    edit.addEventListener('click', () => {
      clearTimeout(celebrationTimer);
      result.hidden = true;
      form.hidden = false;
      // step e showStep pertencem ao app.js (script clássico).
      step = 0;
      window.showStep();
    });
    buttons.append(download, edit);
    parent.append(buttons);
  }

  function renderEnhancedGuide() {
    const g = currentGuide;
    if (!g) return;
    clearTimeout(celebrationTimer);
    form.hidden = true;
    result.hidden = false;
    result.replaceChildren();
    document.querySelector('#stepLabel').textContent = 'SEU GUIA ESTÁ PRONTO';
    const show = element('div', '', 'nutri-celebration');
    show.setAttribute('role', 'status');
    const confetti = element('div', '', 'nutri-confetti');
    confetti.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 16; i++) confetti.append(element('span'));
    show.append(confetti, element('div', '♨', 'nutri-oven'), element('span', 'MISSÃO CONCLUÍDA · 03/03', 'nutri-overline'));
    show.append(element('h3', g.needsCare
      ? 'Parabéns! Seu guia alimentar acabou de sair do forno!'
      : 'Parabéns! Seu plano alimentar acabou de sair do forno!'));
    show.append(element('p', 'Preparamos suas ideias de alimentação, cuidados com a água e descanso.'));
    const continueButton = element('button', 'Ver meu guia agora ↗', 'button');
    continueButton.type = 'button';
    show.append(continueButton);
    const content = element('div', '', 'nutri-guide-content');
    content.hidden = true;
    renderContents(content, g);
    result.append(show, content);

    let revealed = false;
    const reveal = () => {
      if (revealed || !result.isConnected || result.hidden) return;
      revealed = true;
      clearTimeout(celebrationTimer);
      show.remove();
      content.hidden = false;
      content.classList.add('nutri-revealed');
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    continueButton.addEventListener('click', reveal);
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    celebrationTimer = setTimeout(reveal, reduceMotion ? 400 : 2500);
  }

  function pdfParagraph(lines, text) {
    lines.push(...window.wrap(String(text), 84), '');
  }

  function buildEnhancedPdf(g) {
    const p = g.profile;
    const lines = [];
    const para = (text) => pdfParagraph(lines, text);
    para(`MEU GUIA NUTRI SALVATION - ${p.nome.trim()}`);
    para(`Idade: ${p.idade} anos | Altura: ${p.altura} cm | Peso informado: ${p.peso} kg`);
    para(`Objetivo: ${p.objetivo} | Treinos: ${p.treino} | Preferencia: ${p.preferencia}`);
    para(`Dificuldade: ${p.dificuldade} | Dieta anterior: ${p.dieta}`);
    para(`Alergia ou intolerancia: ${p.alergia === 'sim' ? p.descricaoAlergia : 'Nao informada'}`);
    para(`Outra restricao alimentar: ${p.restricao === 'sim' ? p.descricaoRestricao : 'Nao informada'}`);
    para(`Condicao que exige dieta especifica: ${p.condicao === 'sim' ? 'Sim ou duvida' : 'Nao'}`);

    para('IDEIAS PARA SUAS REFEICOES');
    if (g.needsCare) para('Estas sugestoes tratam apenas da organizacao das refeicoes: NAO garantem seguranca de ingredientes, porcoes ou adequacao clinica. Confirme com nutricionista e verifique rotulos e contato cruzado.');
    else para('Ideias culinarias educativas para um dia. Ajuste horarios conforme sua rotina; porcoes nao sao calculadas.');
    g.meals.forEach(([label, description]) => { para(label.toUpperCase()); para(description); });
    if (g.tips) { para('DICA PARA SUA ROTINA'); para(g.tips); }
    if (!g.needsCare) { para('SEU OBJETIVO'); para(g.goal); }

    para('HIDRATACAO AO LONGO DO DIA');
    para(`Agua relatada: ${g.water.report}`);
    para(g.water.explanation);
    g.water.schedule.forEach(([hour, moment, amount]) => para(`${hour} | ${amount} | ${moment}`));
    g.water.trainingSchedule.forEach(([when, howMuch]) => para(`${when.toUpperCase()}: ${howMuch}`));
    para('EXERCICIO E AGUA');
    para(g.water.training);
    para('SONO E RECUPERACAO');
    para(`Sono relatado: ${Number(p.horasSono).toLocaleString('pt-BR')} horas/dia.`);
    para(g.sleep.comment);
    para('Procure horarios regulares para dormir e acordar, reduzindo distracoes antes do descanso.');
    if (g.needsCare) {
      para('ACOMPANHAMENTO INDIVIDUAL');
      para('Este perfil merece orientacao profissional, sem prescricao automatica de dieta. Leve este resumo ao nutricionista. Menores de idade devem envolver responsavel. Em doenca renal, cardiaca ou controle de liquidos, nao siga exemplos de volume sem orientacao.');
    }
    para('FONTES E LIMITES');
    para('Ministerio da Saude. Guia Alimentar para a Populacao Brasileira (2a ed.).');
    para('https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf/view');
    para('National Institutes of Health (NIH). How Much Sleep Is Enough? https://www.nhlbi.nih.gov/health/sleep/how-much-sleep');
    para('National Athletic Trainers Association (NATA). Fluid Replacement for the Physically Active. https://pmc.ncbi.nlm.nih.gov/articles/PMC5634236/');
    para('As sugestoes sao produzidas pelo Nutri Salvation, nao sao cardapios oficiais das fontes. Material educativo, nao substitui consulta medica ou nutricional. Sem diagnostico, metas caloricas ou garantia de resultados.');
    para('PRIVACIDADE: estes dados sao usados apenas nesta pagina e no arquivo PDF baixado no seu dispositivo. Compartilhe somente se desejar.');
    const pages = [];
    for (let i = 0; i < lines.length; i += 38) pages.push(lines.slice(i, i + 38));
    return window.pdfBytes(pages);
  }

  addProfileFields();
  window.createGuide = (profile) => {
    currentGuide = createEnhancedGuide(profile);
    return currentGuide;
  };
  window.renderGuide = renderEnhancedGuide;
  window.buildPdf = buildEnhancedPdf;
})();
