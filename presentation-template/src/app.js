(function () {
  'use strict';
  // Capture the unmodified document so downloads contain source, never editor state.
  const licenseComment = [...document.childNodes].filter(node=>node.nodeType===8).map(node=>'<!--'+node.data+'-->').join('\n');
  const sourceTemplate = '<!doctype html>\n' + licenseComment + '\n' + document.documentElement.outerHTML;
  const $ = id => document.getElementById(id);
  const clone = value => JSON.parse(JSON.stringify(value));
  const {validate, layouts} = FoldModel;
  const {escape, canvas, slide} = FoldRender;
  const original = validate(JSON.parse($('deck-data').textContent));
  let deck = clone(original), current = 0, reading = false, editing = false, dirty = false;
  let past = [], future = [], dragId = null, observer, toastTimer, restoreCandidate = null;
  const sourceString = JSON.stringify(original);
  let fingerprint = 2166136261;
  for (const c of sourceString) fingerprint = Math.imul(fingerprint ^ c.charCodeAt(0), 16777619);
  const storageKey = `fold:v1:${original.id}:${(fingerprint >>> 0).toString(16)}`;
  const designNames = {editorial:'Editorial / Swiss geometry',blueprint:'Blueprint / technical SVG',system:'System / animated feedback',isometric:'Isometric / dimensional scene',cinematic:'Cinematic / game-studio atmosphere',data:'Data / precise comparison',type:'Typography / expressive close'};
  const swatches = {editorial:['#f4f0e7','#d6492b'],blueprint:['#e8f1ff','#165dd9'],system:['#0a201a','#c4f46d'],isometric:['#faf3e8','#bd422a'],cinematic:['#152530','#f8b85b'],data:['#eae9df','#b93c26'],type:['#443464','#ddf5a1']};
  function notify(message) { $('toast').textContent=message; $('toast').hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toast').hidden=true,5500); }
  function safeHash() { try {return decodeURIComponent(location.hash.slice(1));} catch {return '';} }
  function setHash() { try {history.replaceState(null,'',`#${deck.slides[current].id}`);} catch { /* Sandboxed embeds may deny history; navigation still works. */ } }
  function persist() {
    try {localStorage.setItem(storageKey,JSON.stringify(deck));$('save-status').textContent='Draft saved in this browser. Download to keep or share.';}
    catch {$('save-status').textContent='Browser storage unavailable. Download now to keep your changes.';}
  }
  function updateButtons() {
    $('position').textContent=`${String(current+1).padStart(2,'0')} / ${String(deck.slides.length).padStart(2,'0')}`;
    $('previous').disabled=current===0; $('next').disabled=current===deck.slides.length-1;
    $('undo').disabled=!past.length; $('redo').disabled=!future.length;
    $('add-slide').disabled=deck.slides.length>=80;
  }
  function renderDeck() {
    if(observer)observer.disconnect();
    $('deck').innerHTML=deck.slides.map((s,i)=>slide(s,i,deck.slides.length)).join('');
    document.title=deck.title;
    document.querySelectorAll('#deck > .slide').forEach((el,i)=>el.hidden=!reading&&i!==current);
    if(reading){
      observer=new IntersectionObserver(entries=>{
        const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(visible){const index=deck.slides.findIndex(s=>s.id===visible.target.parentElement.id);if(index>=0){current=index;setHash();updateButtons();}}
      },{rootMargin:'-62px 0px -50% 0px',threshold:[0,.2,.5]});
      document.querySelectorAll('.slide-front').forEach(el=>observer.observe(el));
    }
    updateButtons();
  }
  function renderEditor() {
    const s=deck.slides[current];
    $('slide-list').innerHTML=deck.slides.map((item,i)=>{
      const colors=swatches[item.layout];
      return `<li class="slide-row ${i===current?'selected':''}" draggable="true" data-id="${item.id}"><span class="drag-handle" aria-hidden="true">⠿</span><button class="slide-select" data-select="${item.id}" ${i===current?'aria-current="true"':''}><span class="mini-swatch" style="--swatch:${colors[0]};--swatch-ink:${colors[1]}" aria-hidden="true">${item.layout==='type'?'↗':item.layout==='data'?'▥':'◒'}</span><span class="row-text"><strong>${escape(item.title.replace(/\n/g,' '))}</strong><small>${String(i+1).padStart(2,'0')} · ${escape(item.id)}</small></span></button><span class="row-moves"><button data-move="-1" data-id="${item.id}" aria-label="Move ${escape(item.id)} earlier" ${i===0?'disabled':''}>↑</button><button data-move="1" data-id="${item.id}" aria-label="Move ${escape(item.id)} later" ${i===deck.slides.length-1?'disabled':''}>↓</button></span></li>`;
    }).join('');
    const form=$('slide-form');
    $('slide-id').textContent=s.id;
    for(const name of ['layout','eyebrow','title','body','accent','label','notes'])form.elements[name].value=s[name];
    $('item-fields').innerHTML=s.items.map((item,i)=>`<fieldset class="item-fieldset"><legend>ITEM ${i+1}</legend><label>Label<input data-item="${i}" data-key="label" maxlength="35" value="${escape(item.label)}"></label><label>Description<input data-item="${i}" data-key="text" maxlength="80" value="${escape(item.text)}"></label>${s.layout==='data'?`<label>Score (0–100)<input type="number" min="0" max="100" step="any" data-item="${i}" data-key="value" value="${item.value}"></label>`:''}</fieldset>`).join('');
    $('detail-fields').innerHTML=s.details.map((item,i)=>`<fieldset class="detail-fieldset"><legend>DETAIL ${i+1}</legend><label>Heading<input data-detail="${i}" data-key="title" maxlength="160" value="${escape(item.title)}"></label><label>Body<textarea data-detail="${i}" data-key="body" maxlength="8000" rows="4">${escape(item.body)}</textarea></label><button type="button" class="remove-detail" data-remove-detail="${i}">Remove this detail</button></fieldset>`).join('');
    $('add-detail').disabled=s.details.length>=12;
    dirty=false;document.body.classList.remove('form-dirty');updateButtons();
  }
  function change(next,selectedId=deck.slides[current].id) {
    validate(next);
    if(JSON.stringify(next)===JSON.stringify(deck))return;
    past.push(clone(deck));if(past.length>40)past.shift();future=[];
    deck=clone(next);current=Math.max(0,deck.slides.findIndex(s=>s.id===selectedId));
    persist();renderDeck();renderEditor();setHash();
  }
  function collectForm() {
    const next=clone(deck),s=next.slides[current],form=$('slide-form');
    for(const name of ['layout','eyebrow','title','body','accent','label','notes'])s[name]=form.elements[name].value;
    form.querySelectorAll('[data-item]').forEach(el=>s.items[Number(el.dataset.item)][el.dataset.key]=el.dataset.key==='value'?Number(el.value):el.value);
    form.querySelectorAll('[data-detail]').forEach(el=>s.details[Number(el.dataset.detail)][el.dataset.key]=el.value);
    const count=['blueprint','system'].includes(s.layout)?4:3;
    while(s.items.length<count)s.items.push({label:'Next step',text:'Describe this stage'});
    s.items=s.items.slice(0,count);
    if(s.layout==='data')s.items=s.items.map((item,i)=>({...item,value:item.value??[38,76,90][i]}));
    return next;
  }
  function applyForm() {
    if(!dirty)return true;
    try {change(collectForm());dirty=false;document.body.classList.remove('form-dirty');return true;}
    catch(error){notify(error.message);return false;}
  }
  function go(index) {
    if(!applyForm())return;
    current=Math.max(0,Math.min(deck.slides.length-1,index));
    if(!reading)document.querySelectorAll('#deck > .slide').forEach((el,i)=>el.hidden=i!==current);
    if(editing)renderEditor();setHash();updateButtons();
    $(deck.slides[current].id).scrollIntoView({behavior:'instant',block:'start'});
    if(!reading)window.scrollTo({top:0,behavior:'instant'});
  }
  function setReading(value) {
    if(!applyForm())return;
    reading=value;document.body.classList.toggle('reading',reading);$('read-mode').setAttribute('aria-pressed',String(reading));$('read-mode').textContent=reading?'Slides':'Read';
    renderDeck();go(current);
  }
  function setEditing(value) {
    if(!applyForm())return;
    if(value&&reading)setReading(false);
    editing=value;document.body.classList.toggle('editing',editing);$('editor').hidden=!editing;$('edit-mode').setAttribute('aria-pressed',String(editing));
    if(editing)renderEditor();
  }
  function reorder(id,targetId,after=false) {
    if(!applyForm()||id===targetId)return;
    const next=clone(deck),from=next.slides.findIndex(s=>s.id===id);
    if(from<0||!next.slides.some(s=>s.id===targetId))return;
    const [moved]=next.slides.splice(from,1),to=next.slides.findIndex(s=>s.id===targetId)+(after?1:0);
    next.slides.splice(to,0,moved);change(next,id);notify(`Moved ${id} ${after?'after':'before'} ${targetId}.`);
  }
  function timeTravel(direction) {
    if(!applyForm())return;
    const from=direction==='undo'?past:future,to=direction==='undo'?future:past;
    if(!from.length)return;
    const selected=deck.slides[current].id;to.push(clone(deck));deck=from.pop();current=Math.max(0,deck.slides.findIndex(s=>s.id===selected));
    persist();renderDeck();renderEditor();setHash();notify(direction==='undo'?'Change undone.':'Change restored.');
  }
  function download(content,type,name) {
    const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function exportHTML() {
    if(!applyForm())return;
    const json=JSON.stringify(deck,null,2).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
    const html=sourceTemplate.replace(/(<script type="application\/json" id="deck-data">)[\s\S]*?(<\/script>)/,(_all,start,end)=>start+json+end);
    download(html,'text/html',`${deck.id}.html`);notify('HTML download started. Open it to present or continue editing.');
  }
  $('layout').innerHTML=layouts.map(l=>`<option value="${l}">${designNames[l]}</option>`).join('');
  $('slide-form').addEventListener('input',()=>{dirty=true;document.body.classList.add('form-dirty');$('save-status').textContent='Changes pending. Apply to preview and save your local draft.';});
  $('slide-form').addEventListener('submit',event=>{event.preventDefault();if(applyForm())notify('Changes applied. Download to keep or share.');});
  $('add-detail').onclick=()=>{if(!applyForm())return;const next=clone(deck);if(next.slides[current].details.length>=12)return;next.slides[current].details.push({title:'A little more context',body:'Add the evidence, explanation, or reference here.'});change(next);};
  $('detail-fields').onclick=event=>{const button=event.target.closest('[data-remove-detail]');if(!button||!applyForm())return;const next=clone(deck);next.slides[current].details.splice(Number(button.dataset.removeDetail),1);change(next);};
  $('slide-list').onclick=event=>{
    const select=event.target.closest('[data-select]'),move=event.target.closest('[data-move]');
    if(select)go(deck.slides.findIndex(s=>s.id===select.dataset.select));
    if(move){const from=deck.slides.findIndex(s=>s.id===move.dataset.id),delta=Number(move.dataset.move),target=deck.slides[from+delta];if(target){reorder(move.dataset.id,target.id,delta>0);document.querySelector(`[data-move="${delta}"][data-id="${move.dataset.id}"]`)?.focus();}}
  };
  $('slide-list').addEventListener('dragstart',event=>{const row=event.target.closest('.slide-row');if(!row)return;dragId=row.dataset.id;event.dataTransfer.setData('text/plain',dragId);event.dataTransfer.effectAllowed='move';row.classList.add('dragging');});
  $('slide-list').addEventListener('dragover',event=>{if(!dragId)return;const row=event.target.closest('.slide-row');if(row){event.preventDefault();event.dataTransfer.dropEffect='move';document.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));row.classList.add('drag-over');}});
  $('slide-list').addEventListener('drop',event=>{event.preventDefault();const row=event.target.closest('.slide-row');if(row&&dragId){const after=event.clientY>row.getBoundingClientRect().top+row.getBoundingClientRect().height/2;reorder(dragId,row.dataset.id,after);}dragId=null;document.querySelectorAll('.drag-over,.dragging').forEach(el=>el.classList.remove('drag-over','dragging'));});
  $('slide-list').addEventListener('dragend',()=>{dragId=null;document.querySelectorAll('.drag-over,.dragging').forEach(el=>el.classList.remove('drag-over','dragging'));});
  $('add-slide').onclick=()=>{if(!applyForm()||deck.slides.length>=80)return;const next=clone(deck),copy=clone(next.slides[current]);let count=2;const base=copy.id.slice(0,52);while(next.slides.some(s=>s.id===`${base}-copy-${count}`))count++;copy.id=`${base}-copy-${count}`;next.slides.splice(current+1,0,copy);change(next,copy.id);notify('Slide duplicated. It has a new stable ID.');};
  $('undo').onclick=()=>timeTravel('undo');$('redo').onclick=()=>timeTravel('redo');
  $('download-html').onclick=exportHTML;
  $('download-json').onclick=()=>{if(applyForm()){download(JSON.stringify(deck,null,2)+'\n','application/json',`${deck.id}.json`);notify('JSON download started. This is your editable deck source.');}};
  $('import-json').onclick=()=>{if(applyForm())$('json-file').click();};
  $('json-file').onchange=async event=>{
    const file=event.target.files[0];if(!file)return;
    try{if(file.size>2_000_000)throw new Error('This file is too large. Use a JSON deck smaller than 2 MB.');const next=validate(JSON.parse(await file.text()));change(next,next.slides[0].id);go(0);notify('Deck opened. Your previous deck is available through Undo.');}
    catch(error){notify(`Could not open this deck: ${error.message}`);}
    finally{event.target.value='';}
  };
  $('read-mode').onclick=()=>setReading(!reading);$('edit-mode').onclick=()=>setEditing(!editing);$('close-editor').onclick=()=>setEditing(false);
  $('previous').onclick=()=>go(current-1);$('next').onclick=()=>go(current+1);
  document.querySelector('.wordmark').onclick=event=>{event.preventDefault();go(0);};
  $('deck').onclick=event=>{const button=event.target.closest('[data-details]');if(button)$(`details-${button.dataset.details}`).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});};
  $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').textContent=paused?'Resume motion':'Pause motion';$('motion').setAttribute('aria-pressed',String(paused));};
  $('fullscreen').onclick=async()=>{
    if(!applyForm())return;
    try{if(document.fullscreenElement)await document.exitFullscreen();else{setEditing(false);setReading(false);await document.documentElement.requestFullscreen();}}
    catch{notify('Fullscreen is unavailable here. Use your browser’s fullscreen command.');}
  };
  document.addEventListener('fullscreenchange',()=>{$('fullscreen').innerHTML=document.fullscreenElement?'Exit fullscreen':'Present <span aria-hidden="true">↗</span>';});
  $('overview-open').onclick=()=>{
    if(!applyForm())return;
    $('overview-grid').innerHTML=deck.slides.map((s,i)=>`<button class="overview-card ${i===current?'current':''}" data-overview="${s.id}" aria-label="Go to slide ${i+1}: ${escape(s.title.replace(/\n/g,' '))}">${canvas({...s,id:'preview-'+s.id},i,deck.slides.length)}<span>${String(i+1).padStart(2,'0')} · ${escape(s.title.split('\n')[0])}</span><small>${escape(s.id)}</small></button>`).join('');
    $('overview').showModal();
  };
  $('overview-grid').onclick=event=>{const button=event.target.closest('[data-overview]');if(button){$('overview').close();go(deck.slides.findIndex(s=>s.id===button.dataset.overview));}};
  document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>$(button.dataset.close).close());
  $('print-open').onclick=()=>{if(applyForm())$('print-dialog').showModal();};
  $('print-now').onclick=()=>{document.body.classList.toggle('print-details',document.querySelector('[name="print-content"]:checked').value==='details');$('print-dialog').close();window.print();};
  $('restore-draft').onclick=()=>{if(restoreCandidate){change(restoreCandidate);go(0);notify('Saved browser draft restored.');}$('draft-banner').hidden=true;};
  $('dismiss-draft').onclick=()=>{$('draft-banner').hidden=true;try{localStorage.removeItem(storageKey);}catch{};};
  document.addEventListener('keydown',event=>{
    if(event.target.closest('input,textarea,select,[contenteditable]')||document.querySelector('dialog[open]'))return;
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'&&editing){event.preventDefault();timeTravel(event.shiftKey?'redo':'undo');return;}
    if(event.ctrlKey||event.metaKey||event.altKey)return;
    if(event.key==='ArrowRight'||event.key==='PageDown'){event.preventDefault();go(current+1);}
    else if(event.key==='ArrowLeft'||event.key==='PageUp'){event.preventDefault();go(current-1);}
    else if(event.key==='Home'){event.preventDefault();go(0);}
    else if(event.key==='End'){event.preventDefault();go(deck.slides.length-1);}
    else if(event.key.toLowerCase()==='f')$('fullscreen').click();
    else if(event.key.toLowerCase()==='i')$('overview-open').click();
    else if(event.key.toLowerCase()==='s')setReading(!reading);
    else if(event.key==='Escape'&&editing)setEditing(false);
  });
  window.addEventListener('hashchange',()=>{const index=deck.slides.findIndex(s=>s.id===safeHash());if(index>=0)go(index);});
  window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
  try{const saved=localStorage.getItem(storageKey);if(saved&&saved!==sourceString){restoreCandidate=validate(JSON.parse(saved));$('draft-banner').hidden=false;}}catch{/* Corrupt or unavailable local storage must not prevent opening the file. */}
  current=Math.max(0,deck.slides.findIndex(s=>s.id===safeHash()));
  renderDeck();renderEditor();setHash();
})();
