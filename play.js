(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Small illustrated ingredients, shared by the lab, plate and dessert mixer.
  const drawings = {
    rice: '<ellipse cx="40" cy="50" rx="29" ry="15" fill="#d8ddba"/><path d="M14 48 Q19 17 40 22 Q62 17 67 48" fill="#f3efd6"/><g stroke="#c4c7a4" stroke-width="3" stroke-linecap="round"><path d="m25 37 4 3m9-12 2 5m10 2 4 2m-17 7 4 3m15-3 3 3m-34 0 3 4"/></g>',
    beans: '<g fill="#a45c49" stroke="#67372c" stroke-width="2"><ellipse cx="26" cy="31" rx="12" ry="17" transform="rotate(-35 26 31)"/><ellipse cx="53" cy="32" rx="12" ry="17" transform="rotate(35 53 32)"/><ellipse cx="39" cy="55" rx="12" ry="17" transform="rotate(65 39 55)"/></g><g stroke="#de9471" stroke-width="3" fill="none"><path d="M23 24q8 4 6 12M55 24q-7 4-6 13M32 52q4 7 13 5"/></g>',
    broccoli: '<path d="m35 68 2-30h9l4 30z" fill="#a6cd65"/><path d="m40 48-17-15m20 13 17-16" stroke="#98bf5a" stroke-width="7"/><g fill="#4b974b" stroke="#75be55" stroke-width="2"><circle cx="22" cy="28" r="14"/><circle cx="41" cy="20" r="17"/><circle cx="59" cy="29" r="14"/><circle cx="39" cy="36" r="15"/></g>',
    carrot: '<path d="M48 23Q72 23 59 43L19 69Q11 71 16 61Z" fill="#f39242"/><path d="m46 27 12 10M36 40l10 8M27 52l8 7" stroke="#d26932" stroke-width="3"/><path d="m56 24 5-17m-2 18 14-10M53 22 48 9" stroke="#85b654" stroke-width="6" stroke-linecap="round"/>',
    tomato: '<circle cx="40" cy="44" r="28" fill="#eb6355"/><path d="m40 12 4 12 14-4-10 11 9 9-17-6-12 6 4-12-11-5 16 1z" fill="#78a54c"/><path d="M21 46q-2 12 10 17" fill="none" stroke="#ffb092" stroke-width="4" stroke-linecap="round"/>',
    egg: '<path d="M40 10C22 10 10 38 12 52c2 17 19 22 31 20 21-2 29-14 25-29C64 25 54 10 40 10" fill="#f7f0d4"/><circle cx="42" cy="47" r="17" fill="#efb747"/><path d="M33 42q4-9 12-7" stroke="#ffe59a" stroke-width="4" stroke-linecap="round" fill="none"/>',
    chicken: '<path d="m54 47 15 14-5 7-16-16" stroke="#e6d9bc" stroke-width="8" stroke-linecap="round"/><path d="M15 23C2 48 27 68 50 53 71 39 52 11 35 13 25 13 20 15 15 23" fill="#c8824e" stroke="#ecac6b" stroke-width="3"/><path d="m25 24 18 20m-25-9 16 18" stroke="#8c5738" stroke-width="3"/>',
    banana: '<path d="M14 16C6 62 52 81 69 27 56 53 29 56 21 21Z" fill="#edcd58" stroke="#bfa543" stroke-width="2"/><path d="M18 26q-2 35 30 30" fill="none" stroke="#fff09a" stroke-width="4"/><path d="m14 16 7 5" stroke="#806443" stroke-width="6"/>',
    strawberry: '<path d="M15 34C13 17 34 15 40 24 52 12 71 23 66 39 62 56 45 72 39 71 29 69 18 49 15 34" fill="#e55d67"/><path d="m40 25-18-9 12 1 5-12 6 14 14-4-12 12" fill="#6bab58"/><g fill="#ffe1a1"><ellipse cx="28" cy="36" rx="2" ry="3"/><ellipse cx="47" cy="38" rx="2" ry="3"/><ellipse cx="36" cy="50" rx="2" ry="3"/><ellipse cx="52" cy="50" rx="2" ry="3"/><ellipse cx="40" cy="61" rx="2" ry="3"/></g>',
    oats: '<ellipse cx="40" cy="47" rx="31" ry="23" fill="#9f7a49"/><g fill="#e8cc94" stroke="#c5a26a" stroke-width="1.5"><ellipse cx="23" cy="40" rx="10" ry="5" transform="rotate(30 23 40)"/><ellipse cx="45" cy="31" rx="11" ry="5"/><ellipse cx="55" cy="46" rx="11" ry="5" transform="rotate(-35 55 46)"/><ellipse cx="37" cy="48" rx="10" ry="5" transform="rotate(40 37 48)"/><ellipse cx="30" cy="59" rx="11" ry="5"/><ellipse cx="50" cy="61" rx="9" ry="4"/></g>',
    cacao: '<g fill="#654334" stroke="#bd8b5e" stroke-width="2"><rect x="16" y="15" width="48" height="52" rx="6" transform="rotate(-10 40 40)"/><path d="m36 16 8 49M16 34l47-8M20 51l46-8"/></g>',
    yogurt: '<path d="m16 27 7 42h35l7-42" fill="#dbe4d3"/><ellipse cx="40" cy="27" rx="25" ry="9" fill="#f7f4e9"/><path d="M28 26q7-16 14-6 8-4 11 7" fill="#fffdf0"/><path d="M23 43h35l-3 17H26z" fill="#92bc76"/><path d="m35 51 5 5 8-10" stroke="#f4f9e7" fill="none" stroke-width="3"/>'
  };
  const foods = [
    {id:'rice', name:'Arroz', group:'base'}, {id:'beans', name:'Feijão', group:'legume'},
    {id:'broccoli', name:'Brócolis', group:'vegetable'}, {id:'carrot', name:'Cenoura', group:'vegetable'},
    {id:'tomato', name:'Tomate', group:'vegetable'}, {id:'egg', name:'Ovo', group:'protein'},
    {id:'chicken', name:'Frango', group:'protein'}, {id:'banana', name:'Banana', group:'fruit'},
    {id:'strawberry', name:'Morango', group:'fruit'}, {id:'oats', name:'Aveia', group:'base'},
    {id:'cacao', name:'Chocolate', group:'sweet'}, {id:'yogurt', name:'Iogurte', group:'cream'}
  ];
  const icon = id => `<svg viewBox="0 0 80 80" aria-hidden="true" focusable="false">${drawings[id]}</svg>`;
  const missions = [
    {title:'Monte um almoço cheio de cor',description:'Combine uma base, uma leguminosa e dois vegetais diferentes.',requirements:[['base','Uma base',1],['legume','Uma leguminosa',1],['vegetable','Dois vegetais',2]],filter:'Todos'},
    {title:'Crie sua tigela de frutas',description:'Junte duas frutas diferentes, aveia e iogurte. Uma combinação para explorar.',requirements:[['fruit','Duas frutas',2],['oats','Aveia',1],['cream','Iogurte',1]],filter:'Todos'},
    {title:'Invente um momento doce',description:'Experimente banana, chocolate e morango. Prazer também entra na brincadeira.',requirements:[['banana','Banana',1],['cacao','Chocolate',1],['strawberry','Morango',1]],filter:'Doces & frutas'}
  ];
  let missionIndex = 0;
  let selected = [];
  let currentFilter = 'Todos';
  let sequence = 0;
  let completed = new Set();
  const filterNames = ['Todos','Salgados','Doces & frutas'];
  function foodMatches(food) { return currentFilter === 'Todos' || (currentFilter === 'Salgados' ? ['base','legume','vegetable','protein'].includes(food.group) : ['fruit','sweet','cream'].includes(food.group) || food.id === 'oats'); }
  function renderPantry() {
    $('#foodFilters').replaceChildren();
    filterNames.forEach(name => {
      const b = document.createElement('button'); b.type='button'; b.textContent=name; b.setAttribute('aria-pressed',name===currentFilter);
      b.onclick=()=>{currentFilter=name;renderPantry();}; $('#foodFilters').append(b);
    });
    $('#ingredientGrid').replaceChildren();
    foods.filter(foodMatches).forEach(food => {
      const b=document.createElement('button'); b.type='button'; b.className='ingredient'; b.draggable=true;
      b.setAttribute('aria-label',`Adicionar ${food.name}`); b.innerHTML=icon(food.id)+`<span>${food.name}</span><i>+</i>`;
      b.onclick=()=>addIngredient(food.id);
      b.addEventListener('dragstart',event=>{event.dataTransfer.setData('text/plain',food.id);event.dataTransfer.effectAllowed='copy';$('#dropZone').classList.add('drag-active');});
      b.addEventListener('dragend',()=>$('#dropZone').classList.remove('drag-active'));
      $('#ingredientGrid').append(b);
    });
  }
  function addIngredient(id) {
    if(!foods.some(food=>food.id===id)) return;
    if(selected.length>=12){$('#missionFeedback').textContent='O prato já tem 12 ingredientes. Remova um ou comece outra combinação.';return;}
    const item={id, key:++sequence};selected.push(item);drawPlate(item.key);updateMission();
  }
  function drawPlate(newKey) {
    $('#plateItems').replaceChildren();
    selected.forEach((item,index)=>{
      const angle=index*2.39996; const radius=index===0?0:Math.min(31,12+Math.sqrt(index)*5);
      const b=document.createElement('button'); b.type='button';b.className='placed-food'+(item.key===newKey?' falling':'');
      b.style.setProperty('--x',`${50+Math.cos(angle)*radius}%`);b.style.setProperty('--y',`${50+Math.sin(angle)*radius*.8}%`);b.style.setProperty('--turn',`${(index*37)%60-30}deg`);
      b.innerHTML=icon(item.id); b.setAttribute('aria-label',`Remover ${foods.find(f=>f.id===item.id).name} do prato`);
      b.onclick=()=>{selected=selected.filter(s=>s.key!==item.key);drawPlate();updateMission();};$('#plateItems').append(b);
    });
    $('#emptyPlate').hidden=selected.length>0;$('#ingredientCount').textContent=String(selected.length).padStart(2,'0');
    $('#selectedIngredients').textContent=selected.length?selected.map(item=>foods.find(f=>f.id===item.id).name).join(' · '):'Seu prato está livre para novas ideias.';
    $('#undoIngredient').disabled=!selected.length;$('#clearPlate').disabled=!selected.length;
  }
  function updateMission() {
    const m=missions[missionIndex];const distinct=[...new Set(selected.map(item=>item.id))].map(id=>foods.find(f=>f.id===id));
    let done=0;$('#missionChecks').replaceChildren();
    m.requirements.forEach(([category,label,needed])=>{
      const count=distinct.filter(food=>food.group===category||food.id===category).length;
      const ready=count>=needed;if(ready)done++;
      const chip=document.createElement('span');chip.className='requirement'+(ready?' met':'');chip.textContent=`${ready?'✓':'○'} ${label} ${Math.min(count,needed)}/${needed}`;$('#missionChecks').append(chip);
    });
    const success=done===m.requirements.length;
    $('#missionFeedback').textContent=success?'✦ Combinação completa! Missão cumprida.':selected.length?`${done} de ${m.requirements.length} etapas completas. Continue explorando.`:'Escolha seu primeiro ingrediente.';
    $('#advanceMission').hidden=!success;$('#advanceMission').textContent=missionIndex===2?'Jogar novamente ↗':'Próxima missão ↗';
    $('.lab-shell').classList.toggle('mission-complete',success);
    if(success&&!completed.has(missionIndex)){completed.add(missionIndex);celebrate();}
  }
  function celebrate() {
    if(reducedMotion.matches)return;
    for(let i=0;i<18;i++){const p=document.createElement('span');p.className='lab-particle';p.style.setProperty('--dx',`${Math.cos(i/18*Math.PI*2)*(90+i*5)}px`);p.style.setProperty('--dy',`${Math.sin(i/18*Math.PI*2)*130}px`);p.style.setProperty('--delay',`${i*12}ms`);$('#dropZone').append(p);p.addEventListener('animationend',()=>p.remove(),{once:true});}
  }
  function setMission(index) {
    missionIndex=(index+missions.length)%missions.length;selected=[];completed.delete(missionIndex);currentFilter=missions[missionIndex].filter;
    $('#missionIndex').textContent=`MISSÃO 0${missionIndex+1} / 03`;
    $('#missionTitle').textContent=missions[missionIndex].title;$('#missionDescription').textContent=missions[missionIndex].description;
    setVessel(missionIndex===1?'bowl':'plate');renderPantry();drawPlate();updateMission();
  }
  function setVessel(vessel) {$('#gamePlate').classList.toggle('bowl-mode',vessel==='bowl');document.querySelectorAll('[data-vessel]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.vessel===vessel));}
  document.querySelectorAll('[data-vessel]').forEach(b=>b.onclick=()=>setVessel(b.dataset.vessel));
  $('#previousMission').onclick=()=>setMission(missionIndex-1);$('#nextMission').onclick=()=>setMission(missionIndex+1);$('#advanceMission').onclick=()=>setMission(missionIndex+1);
  $('#undoIngredient').onclick=()=>{selected.pop();drawPlate();updateMission();};
  $('#clearPlate').onclick=()=>{selected=[];completed.delete(missionIndex);drawPlate();updateMission();};
  $('#dropZone').addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='copy';});
  $('#dropZone').addEventListener('drop',event=>{event.preventDefault();$('#dropZone').classList.remove('drag-active');addIngredient(event.dataTransfer.getData('text/plain'));});
  // Hero explorer: click/tap is the primary control; pointer movement adds depth.
  const scans=[['Abacate','Cremosidade e textura para variar suas combinações.'],['Folhas','Experimente cores, texturas e diferentes preparações.'],['Frutas','Um contraste de sabor também pode entrar em pratos salgados.']];
  scans.forEach(([name,info],i)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.setAttribute('aria-pressed',i===0);b.onclick=()=>{document.querySelectorAll('#scanChoices button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#scanInfo').textContent=info;};$('#scanChoices').append(b);});
  $('#scanInfo').textContent=scans[0][1];$('#scanPlate').setAttribute('aria-expanded','false');$('#scanPlate').setAttribute('aria-controls','scanPanel');
  $('#scanPlate').onclick=()=>{const open=$('#scanPanel').hidden;$('#scanPanel').hidden=!open;$('#scanPlate').setAttribute('aria-expanded',open);$('.orbit-stage').classList.toggle('scanning',open);};
  function closeScan(){$('#scanPanel').hidden=true;$('#scanPlate').setAttribute('aria-expanded','false');$('.orbit-stage').classList.remove('scanning');$('#scanPlate').focus();}
  $('#closeScan').onclick=closeScan;$('#scanPanel').addEventListener('keydown',e=>{if(e.key==='Escape')closeScan();});
  $('.orbit-stage').addEventListener('pointermove',event=>{if(event.pointerType==='touch'||reducedMotion.matches)return;const r=event.currentTarget.getBoundingClientRect();$('#scanPlate').style.setProperty('--tilt-x',`${(event.clientY-r.top-r.height/2)/25}deg`);$('#scanPlate').style.setProperty('--tilt-y',`${(event.clientX-r.left-r.width/2)/25}deg`);});
  $('.orbit-stage').addEventListener('pointerleave',()=>{$('#scanPlate').style.setProperty('--tilt-x','0deg');$('#scanPlate').style.setProperty('--tilt-y','0deg');});
  // Dessert mixer has its own recipe and reset, independent from the main game.
  let dessert=[];
  const dessertOptions=[['banana','Banana'],['cacao','Chocolate'],['strawberry','Morango']];
  function renderDessert(newId) {
    $('#sweetChoices').replaceChildren();$('#dessertItems').replaceChildren();
    dessertOptions.forEach(([id,name])=>{const b=document.createElement('button');b.type='button';b.innerHTML=icon(id)+`<span>${name}</span>`;b.setAttribute('aria-label',`Adicionar ${name} à sobremesa`);b.setAttribute('aria-pressed',dessert.includes(id));b.disabled=dessert.includes(id);b.onclick=()=>{dessert.push(id);renderDessert(id);};$('#sweetChoices').append(b);});
    dessert.forEach((id,i)=>{const el=document.createElement('span');el.className='dessert-piece'+(id===newId?' falling':'');el.style.setProperty('--x',`${32+i*18}%`);el.style.setProperty('--y',`${47+(i%2)*15}%`);el.style.setProperty('--turn',`${i*20-20}deg`);el.innerHTML=icon(id);$('#dessertItems').append(el);});
    $('#dessertHint').hidden=dessert.length>0;$('#dessertMessage').textContent=dessert.length===3?'✦ Pronto! Amasse a banana, adicione chocolate e finalize com morango.':dessert.length?`${dessert.length}/3 ingredientes. Continue a sua criação.`:'Toque em um ingrediente para começar.';
    $('.sweet-lab').classList.toggle('mixed',dessert.length===3);
  }
  $('#resetDessert').onclick=()=>{dessert=[];renderDessert();};
  setMission(0);renderDessert();
})();
