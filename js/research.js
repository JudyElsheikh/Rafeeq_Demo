// A shared presentation shell; each feature supplies its own sections and evidence.
Rafeeq.researchWorkspaces = {};
Rafeeq.renderResearch = (main, heading, id, number) => {
 const R=Rafeeq, e=R.esc, feature=R.feature(id), system=R.systems[id];
 const fields=rows=>`<dl class="research-fields">${rows.map(([key,value])=>`<div><dt>${e(key)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>`;
 const workspace=R.researchWorkspaces[id] || {
  description:'Feature definition and proposed AI system.',
  sections:[
   {id:'overview',label:'Feature Overview',html:`<p>${e(R.descriptions[id])}</p>${fields([['Expected input',system.input],['Expected output',system.output]])}`},
   {id:'system',label:'AI System',html:`<div class="system-tags">${system.types.map(type=>`<span>${e(type)}</span>`).join('')}</div><p>${e(system.note)}</p>${fields([['Data requirements',system.requirements],['Proposed metrics',system.metrics.join(', ')]])}`}
  ]
 };
 document.title=`${feature.name} | Rafeeq`;
 main.innerHTML=heading(`Phase 1 / Feature ${number}`,e(feature.name),workspace.description,'<a class="button" href="phase1.html">Back to Phase 1</a>')+
  (workspace.source?`<p class="research-source">${e(workspace.source)}</p>`:'')+
  (workspace.pipeline?`<section class="panel pipeline-panel"><div class="section-heading"><div><h2>Off-Task Detection During Homework Pipeline</h2>${workspace.pipeline.description?`<p>${e(workspace.pipeline.description)}</p>`:''}</div></div><div class="pipeline-scroll" ${workspace.pipeline.navigation?`role="tablist"`:'tabindex="0" role="region"'} aria-label="Off-task development pipeline"><ol class="pipeline-flow">${workspace.pipeline.steps.map((step,index)=>{const section=workspace.sections[index];return `<li class="pipeline-block"${workspace.pipeline.navigation?' role="presentation"':''}>${workspace.pipeline.navigation?`<button class="pipeline-tab" id="research-tab-${section.id}" role="tab" aria-controls="research-panel-${section.id}" aria-selected="${index===0}" tabindex="${index===0?0:-1}" data-research-tab="${section.id}">`:''}<span>${index+1}</span><strong>${e(step)}</strong>${workspace.pipeline.navigation?'</button>':''}</li>`;}).join('')}</ol></div></section>`:'')+
  (workspace.pipeline?.navigation?'':`<div class="research-tabs" role="tablist" aria-label="${e(feature.name)} sections">${workspace.sections.map((section,index)=>`<button id="research-tab-${section.id}" role="tab" aria-controls="research-panel-${section.id}" aria-selected="${index===0}" tabindex="${index===0?0:-1}" data-research-tab="${section.id}">${e(section.label)}</button>`).join('')}</div>`)+
  workspace.sections.map((section,index)=>`<section id="research-panel-${section.id}" class="panel research-panel" role="tabpanel" aria-labelledby="research-tab-${section.id}" tabindex="0"${index?' hidden':''}><h2>${e(section.label)}</h2>${section.html}</section>`).join('');
 const buttons=[...main.querySelectorAll('[data-research-tab]')];
 const aliases=workspace.pipeline?.navigation?{results:'comparison',decision:'comparison',data:'evaluation',calibration:'overview','fine-tuning':'next'}:{evaluation:'comparison',decision:'comparison'};
 const activate=(id,focus=false)=>{
  const target=buttons.find(button=>button.dataset.researchTab===(aliases[id]||id))||buttons[0];
  buttons.forEach(button=>{const selected=button===target;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;main.querySelector('#'+button.getAttribute('aria-controls')).hidden=!selected;});
  if(focus)target.focus();
 };
 buttons.forEach((button,index)=>{
  button.onclick=()=>{activate(button.dataset.researchTab);history.replaceState(null,'','#'+button.dataset.researchTab);};
  button.onkeydown=event=>{let next;if(event.key==='ArrowRight')next=(index+1)%buttons.length;if(event.key==='ArrowLeft')next=(index+buttons.length-1)%buttons.length;if(event.key==='Home')next=0;if(event.key==='End')next=buttons.length-1;if(next!==undefined){event.preventDefault();buttons[next].click();buttons[next].focus();}};
 });
 activate(location.hash.slice(1));
 window.addEventListener('hashchange',()=>activate(location.hash.slice(1)));
 const images=workspace.images||[];
 main.querySelectorAll('[data-evidence-image]').forEach(button=>button.onclick=()=>R.openGallery(images,Number(button.dataset.evidenceImage)));
};
