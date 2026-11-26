(() => {
 'use strict';
 const R=Rafeeq, $=s=>document.querySelector(s);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 R.esc=esc;
 const icons={grid:'▦',features:'▤',phases:'◫',sun:'☼',home:'⌂',school:'▥',people:'♧',medical:'✚',layers:'▱',spark:'✧'};
 const page=document.body.dataset.page, params=new URLSearchParams(location.search);
 const badge=(key,detail='')=>`<span class="badge ${key}">${esc(R.categories[key])}${detail?` <span>· ${esc(detail)}</span>`:''}</span>`;
 const ucLink=uc=>`index.html#${uc.startsWith('UC')?uc.split('/')[0]:'use-cases'}`;
 const ucTags=reference=>{
   const cases=[...new Set([...reference.matchAll(/UC[1-5]/g)].map(m=>m[0]))];
   const label=reference.startsWith('Additional')?'Additional':reference.startsWith('Shared')||cases.length>1?'Shared':cases[0]||'Shared';
   return `<span class="uc-tags"><span class="uc-tag uc-${label.toLowerCase()}">${esc(label)}</span></span>`;
 };
 document.body.innerHTML=`<a class="skip" href="#main">Skip to content</a><div class="shell"><header class="topbar"><div class="brand">Rafeeq</div><span class="top-title">AI Development Showcase</span></header><main id="main" tabindex="-1"></main><footer>Rafeeq — ADHD Support Ecosystem <span>Research & development showcase</span></footer></div><dialog id="gallery" aria-label="Dataset and evidence image viewer"><div class="gallery-toolbar"><button class="button" data-gallery="prev" aria-label="Previous image">Previous</button><button class="button" data-gallery="out" aria-label="Zoom out">−</button><output id="zoom-label">100%</output><button class="button" data-gallery="in" aria-label="Zoom in">+</button><button class="button" data-gallery="next" aria-label="Next image">Next</button><button class="button" data-gallery="close" aria-label="Close image viewer">Close ✕</button></div><div class="image-viewport"><img id="gallery-image" alt=""></div><p id="gallery-caption"></p></dialog>`;
 const main=$('#main');
 function heading(eyebrow,title,description,actions=''){return `${page==='overview'?'':`<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span>${page==='feature'?`<a href="phase1.html">Phase 1</a><span aria-hidden="true">/</span><span aria-current="page">${esc(eyebrow.split('/').slice(1).join('/').trim())}</span>`:`<span aria-current="page">${esc(eyebrow)}</span>`}</nav>`}<div class="page-heading"><div>${page==='overview'?'':`<div class="eyebrow">${esc(eyebrow)}</div>`}<h1>${title}</h1>${description?`<p>${description}</p>`:''}</div>${actions}</div>`;}
 function featureDescription(f){return `<div class="feature-description"><p>${esc(R.descriptions[f.id]||'Description not supplied yet.')}</p>${R.standouts?.[f.id]?`<div class="feature-standout"><strong>Why it stands out</strong><p>${esc(R.standouts[f.id])}</p></div>`:''}</div>`;}
 function useCaseSections(){return R.useCases.slice(0,5).map(([id,name,,icon])=>{
   const rows=R.features.filter(f=>f.uc===id);
   return `<details class="use-case uc-${id.toLowerCase()}" id="${id}"><summary><span class="use-case-icon">${icons[icon]}</span><span><small>${id}</small><strong>${esc(name)}</strong></span><span class="count">${rows.length} features</span><span class="chevron">&#8964;</span></summary><div class="feature-rows">${rows.map(f=>`<details class="feature-row feature-disclosure"><summary><strong>${esc(f.name)}</strong><div class="feature-tags">${f.categories.map(k=>badge(k,f.categories.length===1?f.detail:'')).join('')}${f.categories.length>1?`<span class="component-note">${esc(f.detail)}</span>`:''}</div><span class="feature-toggle" aria-hidden="true">+</span></summary>${featureDescription(f)}</details>`).join('')}</div></details>`;
 }).join('');}
 function phaseCards(){const repeated=new Set(R.phases.find(p=>p.id===4).entries.map(e=>e[0]));return R.phases.map(p=>`<article class="panel home-phase phase-${p.id}${p.id===1?' available':''}"><div class="phase-card-heading"><span class="phase-number ${p.color}">0${p.id}</span><div><span class="eyebrow">PHASE ${p.id}</span><h3>${p.id===1?`<a class="phase-card-link" href="phase1.html">${esc(p.title)}</a>`:esc(p.title)}</h3></div><span class="phase-availability">${p.id===1?'Explore phase':'Coming later'}</span></div><p class="phase-description">${esc(p.description)}</p><div class="phase-list-caption"><span>${p.entries.length} implementation entries</span><span>Progress not recorded</span></div>${p.id===3?'<div class="ai-option-note"><span aria-hidden="true"></span><p>Dark green feature names can also be implemented with AI in Phase 4.</p></div>':''}<div class="phase-list-scroll" tabindex="0" role="region" aria-label="Phase ${p.id} feature list"><ul class="phase-entries">${p.entries.map(([id,name,uc,review])=>`<li><span${p.id===3&&repeated.has(id)?' class="ai-option-name"':''}>${esc(name)}${review?'<span class="review">Source-plan review · Core AI</span>':''}</span>${ucTags(uc)}</li>`).join('')}</ul></div></article>`).join('');}
 function capabilitySection(group){return `<div class="capability-name-list">${R.capabilityGroups[group].map(note=>{const f=R.feature(note.id);return `<details class="feature-disclosure capability-disclosure"><summary><strong>${esc(f.name)}</strong><span class="feature-toggle" aria-hidden="true">+</span></summary>${featureDescription(f)}</details>`}).join('')}</div>`;}
 function featureTabs(){return `<div class="feature-tabs" role="tablist" aria-label="Feature groups"><button type="button" id="tab-usecases" role="tab" aria-selected="true" aria-controls="panel-usecases" tabindex="0">By Use Case</button><button type="button" id="tab-shared" role="tab" aria-selected="false" aria-controls="panel-shared" tabindex="-1">Shared <span>${R.capabilityGroups.Shared.length}</span></button><button type="button" id="tab-additional" role="tab" aria-selected="false" aria-controls="panel-additional" tabindex="-1">Additional <span>${R.capabilityGroups.Additional.length}</span></button></div><div id="panel-usecases" role="tabpanel" aria-labelledby="tab-usecases">${useCaseSections()}</div><div id="panel-shared" role="tabpanel" aria-labelledby="tab-shared" hidden><h3 class="capability-heading">Shared Functional Capabilities</h3>${capabilitySection('Shared')}</div><div id="panel-additional" role="tabpanel" aria-labelledby="tab-additional" hidden><h3 class="capability-heading">Additional Features</h3>${capabilitySection('Additional')}</div>`;}
 function discover(){
 main.innerHTML=heading('Discover Rafeeq','Rafeeq. A connected ecosystem.<br><em>Supporting every step with ADHD.</em>','Connecting children, families, schools and psychiatrists through intelligent ADHD support.', '<a class="button" href="index.html">Back to home</a>')+`<div class="proposal-intro"><span class="pill">DISCOVER RAFEEQ</span><p>Rafeeq means “companion” in Arabic. Explore the idea, the everyday challenges and the support that connects the child’s day.</p><p class="proposal-source">From the Rafeeq project proposal · November 2026</p></div><nav class="proposal-nav" aria-label="Explore the proposal">${R.proposal.navigation}</nav><div class="proposal-content">${R.proposal.content}</div>`;
 document.getElementById('discover-features').innerHTML=featureTabs();
 const nav=main.querySelector('.proposal-nav'), bar=nav.querySelector('.proposal-nav-inner'), links=nav.querySelector('.topic-links'), more=nav.querySelector('.topic-more'), trigger=more.querySelector('summary'), menu=more.querySelector('.topic-menu'), topics=[...nav.querySelectorAll('[data-topic]')];
 const welcome=document.createElement('div');welcome.className='proposal-welcome';
 [...main.children].filter(element=>element!==nav&&!element.classList.contains('proposal-content')).forEach(element=>welcome.append(element));main.prepend(welcome);
 const topbar=document.querySelector('.topbar'), header=document.createElement('div');header.className='site-header';topbar.before(header);header.append(topbar,nav);
 topbar.querySelector('.brand').innerHTML='<a href="index.html" aria-label="Rafeeq home">Rafeeq</a>';
 topbar.querySelector('.top-title').insertAdjacentHTML('afterend','<a class="button primary header-home" href="index.html">Back to home</a>');
 const distributeTopics=()=>{
   topics.forEach(button=>links.append(button));more.hidden=false;
   const widths=topics.map(button=>button.getBoundingClientRect().width), available=bar.clientWidth;
   if(widths.reduce((sum,width)=>sum+width,0)+8*(topics.length-1)<=available){more.hidden=true;more.open=false;}
   else{let used=0,overflow=false;const limit=available-more.getBoundingClientRect().width-8;topics.forEach((button,index)=>{if(overflow||used+widths[index]>limit){overflow=true;menu.append(button);}else used+=widths[index]+8;});}
   more.classList.toggle('has-current',!!menu.querySelector('[aria-current]'));
   menu.style.right=Math.min(0,more.getBoundingClientRect().right-Math.min(380,window.innerWidth-36)-18)+'px';
 };
 const showTopic=()=>{
   const requested=location.hash.slice(1), id=/^proposal-(?:[1-9]|1[0-2])$/.test(requested)?requested:/^UC[1-5]$/.test(requested)?'proposal-7':'proposal-1';
   main.querySelectorAll('.proposal-section').forEach(section=>section.hidden=section.id!==id);
   welcome.hidden=id!=='proposal-1';
   topics.forEach(button=>{if(button.dataset.topic===id)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
   distributeTopics();
 };
 topics.forEach((button,index)=>{
   button.addEventListener('click',()=>{const fromMenu=menu.contains(button),hash='#'+button.dataset.topic;if(location.hash!==hash)history.pushState(null,'',hash);showTopic();more.open=false;if(fromMenu)trigger.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});});
   button.addEventListener('keydown',event=>{const group=[...(menu.contains(button)?menu:links).querySelectorAll('[data-topic]')],position=group.indexOf(button);let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(position+1)%group.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(position+group.length-1)%group.length;if(event.key==='Home')next=0;if(event.key==='End')next=group.length-1;if(next!==undefined){event.preventDefault();group[next].focus();}});
 });
 trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();more.open=true;(menu.querySelector('[aria-current]')||menu.querySelector('button'))?.focus();}});
 more.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();more.open=false;trigger.focus();}});
 document.addEventListener('click',event=>{if(!more.contains(event.target))more.open=false;});
 window.addEventListener('hashchange',showTopic);
 window.addEventListener('popstate',showTopic);
 showTopic();
 new ResizeObserver(distributeTopics).observe(bar);
 document.fonts.ready.then(distributeTopics);
 }
 function overview(){
 main.innerHTML=heading('Project overview','Rafeeq. A connected ecosystem.<br><em>Supporting every step with ADHD.</em>','Connecting children, families, schools and psychiatrists through intelligent ADHD support.')+` <section class="hero slide-section"><div class="hero-copy"><span class="pill">RAFEEQ / AI RESEARCH</span><h2>One Rafeeq.<br>One shared vision.</h2><p>Rafeeq brings everyday support together.<br>Connecting home, school and clinical care<br>to help every child with ADHD thrive.</p><div class="hero-actions"><a class="button primary" href="discover.html">Discover More About Rafeeq</a></div><div class="hero-note"><span>✧</span> One vision. Connected support for every child.</div></div><div class="ecosystem" aria-label="Rafeeq connects child, home, school, parent and psychiatrist"><div class="orbit orbit-outer"></div><div class="orbit orbit-inner"></div><div class="eco-center"><strong class="eco-wordmark">Rafeeq</strong><small>CONNECTED SUPPORT</small></div><div class="eco-node node-child">☼ <span>Child</span></div><div class="eco-node node-home">⌂ <span>Home</span></div><div class="eco-node node-school">▥ <span>School</span></div><div class="eco-node node-parent">♧ <span>Parent</span></div><div class="eco-node node-clinical">✚ <span>Psychiatrist</span></div><span class="orbit-dot dot-a"></span><span class="orbit-dot dot-b"></span></div></section>
 <section id="use-cases" class="home-section"><div class="section-heading"><div><span class="eyebrow">THE RAFEEQ ECOSYSTEM</span><h2>Features</h2></div><div class="legend" aria-label="AI classifications">${Object.keys(R.categories).map(k=>badge(k)).join('')}</div></div>${featureTabs()}</section>
 <section id="implementation-phases" class="home-section"><div class="section-heading"><div><span class="eyebrow">THE DEVELOPMENT PLAN</span><h2>Implementation phases</h2></div><span class="muted">Explore Phase 1 · More phases to follow</span></div><div class="home-phase-grid">${phaseCards()}</div></section>`;
 }
 const coreAssignments = [
  {id:'off-task',phase:1,number:1,people:['Judy','Kirollos']},
  {id:'focus-sleep',phase:1,number:2,people:['Maroska','Marwan']},
  {id:'overwhelm',phase:1,number:3,people:['Hamdy','Abdelrahman']},
  {id:'homework',phase:2,number:4,people:['Abdelrahman','Marwan','Maroska']},
  {id:'chores',phase:2,number:5,people:['Judy','Hamdy','Kirollos']},
  {id:'classroom',phase:2,number:6,people:[],disabled:true}
 ];
 function phase1(){main.innerHTML=heading('Phase 1','Core AI','The shared prototype pipeline, followed by the six research features.',`<a class="button" href="index.html#implementation-phases">Back to home</a>`)+`<section class="panel pipeline-panel"><div class="section-heading"><div><span class="eyebrow">THE COMMON PROTOTYPE PIPELINE</span><h2>From feature definition to model comparison</h2></div><span class="status">Progress not recorded</span></div><div class="pipeline-scroll" tabindex="0" role="region" aria-label="${R.pipeline.length}-step AI development pipeline"><ol class="pipeline-flow">${R.pipeline.map((step,i)=>`<li class="pipeline-block"><span>${i+1}</span><strong>${esc(step)}</strong></li>`).join('')}</ol></div></section><section class="home-section"><div class="section-heading"><div><span class="eyebrow">CORE AI FEATURES</span><h2>Choose a feature</h2></div></div><div class="feature-button-grid">${coreAssignments.map(({id,phase,number,people,disabled})=>{const f=R.feature(id);return `<${disabled?'div':'a'} class="feature-button uc-${f.uc.toLowerCase()}${disabled?' is-disabled':''}" ${disabled?'aria-disabled="true"':`href="${id}.html"`}><span class="feature-phase-tag delivery-phase-${phase}">Phase ${phase}</span><span class="feature-button-number">${number}</span><span class="feature-button-content"><strong>${esc(f.name)}${id==='chores'?' &mdash; Photo Verification':''}</strong><span class="feature-assignees" aria-label="Assigned people">${people.map(person=>`<span class="feature-assignee">${esc(person)}</span>`).join('')}</span>${disabled?'<span class="feature-pending">Pending mentor confirmation &middot; Unassigned</span>':''}</span>${ucTags(f.uc)}</${disabled?'div':'a'}>`;}).join('')}</div></section>`;}
 function value(v){return v==null||v===''?'Not supplied':esc(typeof v==='object'?JSON.stringify(v,null,2):v)}
 function modelInfo(model){return `<div class="model-fields">${[['Architecture / family',model.family],['Model type',model.type],['Strengths',model.strengths],['Limitations',model.limitations],['Why considered',model.rationale]].map(([k,v])=>`<div><span>${k}</span><p>${value(v)}</p></div>`).join('')}<div><span>Selection</span><p>${R.decisions[params.get('id')]?.modelId===model.id?'Explicitly selected':'Not selected'}</p></div></div>`}
 function feature(){
 const id=document.body.dataset.feature||params.get('id'), assignment=coreAssignments.find(entry=>entry.id===id), f=R.feature(id);
 if(!f||!R.systems[id]||assignment?.disabled){main.innerHTML=heading('Feature unavailable','Feature unavailable','Choose an available Core AI feature.', '<a href="phase1.html" class="button">Back to Phase 1</a>');return;}
 if(id==='overwhelm'){document.title=f.name+' | Rafeeq';R.renderOverwhelm(main,heading,assignment.number);return;}
 R.renderResearch(main,heading,id,assignment.number);
 }
 R.safeURL=v=>{if(!v)return false;try{return ['http:','https:'].includes(new URL(v,location.href).protocol)}catch{return false}};
 if(['features','phases','phase'].includes(page)){
   location.replace('index.html'+(page==='features'?'#use-cases':'#implementation-phases'));
 }else ( {overview,discover,phase1,feature}[page]||overview )();
 document.querySelectorAll('.section-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.section-nav a').forEach(x=>x.removeAttribute('aria-current'));a.setAttribute('aria-current','location')}));
 document.querySelectorAll('.home-phase.available').forEach(card=>card.addEventListener('click',e=>{
   if(e.target.closest('a')||window.getSelection()?.toString())return;
   location.href=card.querySelector('.phase-card-link').href;
 }));
 const featureTabButtons=[...document.querySelectorAll('.feature-tabs [role="tab"]')];
 const selectFeatureTab=button=>{featureTabButtons.forEach(tab=>{const selected=tab===button;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!selected;});};
 featureTabButtons.forEach((button,index)=>{button.addEventListener('click',()=>selectFeatureTab(button));button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%featureTabButtons.length;if(event.key==='ArrowLeft')next=(index+featureTabButtons.length-1)%featureTabButtons.length;if(event.key==='Home')next=0;if(event.key==='End')next=featureTabButtons.length-1;if(next!==undefined){event.preventDefault();selectFeatureTab(featureTabButtons[next]);featureTabButtons[next].focus();}});});
 R.initGallery();
 if(location.hash)requestAnimationFrame(()=>{const target=document.getElementById(location.hash.slice(1));if(target?.tagName==='DETAILS')target.open=true;target?.scrollIntoView()});
})();
