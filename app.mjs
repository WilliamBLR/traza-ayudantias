import { exercises, sources, makeTrace } from './traces.mjs';

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const py = v => typeof v === 'string' ? '"' + v + '"' : String(v);
const kindNames = {start:'INICIO',input:'ENTRADA',assign:'ASIGNACIÓN',condition:'CONDICIÓN',loop:'CICLO WHILE',output:'SALIDA'};
let exercise, trace, step = 0, timer = null, tableOpen = false, downloadUrl = null;
const savedInputs = new Map();

function syncThemeButton() {
  const dark=document.documentElement.dataset.theme==='dark';
  $('#theme-toggle').setAttribute('aria-label',dark?'Cambiar a modo claro':'Cambiar a modo oscuro');
  $('#theme-toggle .theme-label').textContent=dark?'Modo claro':'Modo oscuro';
  $('#theme-toggle .theme-symbol').textContent=dark?'☀':'☾';
  $('meta[name="theme-color"]').content=dark?'#080b11':'#ffffff';
}
$('#theme-toggle').addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('traza-theme',theme)}catch{}
  syncThemeButton();
});
syncThemeButton();

function nav() {
  $('#exercise-nav').innerHTML = ['2025-2','2026-1'].map(term => `<div class="nav-term">PRUEBA ${term}</div>${exercises.filter(e => e.term === term).map(e => `<a href="#${e.id}" class="exercise-link ${exercise?.id === e.id ? 'active' : ''}" ${exercise?.id === e.id ? 'aria-current="page"' : ''}><span class="nav-number">${e.n}</span><span>${e.title}</span></a>`).join('')}`).join('');
}

function highlight(text) {
  if (text.trim().startsWith('#')) return `<span class="comment">${esc(text)}</span>`;
  const pattern = /("[^"\n]*"|'[^'\n]*'|\b(?:for|in|if|and|while|else|elif)\b|\b(?:input|int|print|range|len)\b|\b\d+\b)/g;
  let result = '', last = 0;
  for (const m of text.matchAll(pattern)) {
    result += esc(text.slice(last,m.index));
    const token = m[0];
    const cls = /^['"]/.test(token) ? 'str' : /^\d/.test(token) ? 'num' : /^(input|int|print|range|len)$/.test(token) ? 'builtin' : 'kw';
    result += `<span class="${cls}">${esc(token)}</span>`;
    last = m.index + token.length;
  }
  return result + esc(text.slice(last));
}

function renderCode() {
  const comments = $('#show-comments').checked;
  const lines = sources[exercise.id].split('\n');
  $('#source-code').innerHTML = lines.map((line, i) => {
    const comment = line.trim().startsWith('#');
    if (comment && !comments) return '';
    if (!line.trim()) {
      if (!comments) return '';
      return `<div class="code-line blank-line"><span class="line-number"></span><span> </span></div>`;
    }
    return `<div class="code-line ${comment ? 'comment-line' : ''}" data-line="${i+1}"><span class="line-number">${i+1}</span><span class="line-code">${highlight(line)}</span></div>`;
  }).join('');
  if (trace) paintCode();
}

function selectExercise() {
  pause();
  const id = location.hash.slice(1);
  exercise = exercises.find(e => e.id === id) || exercises[0];
  nav();
  $('#sidebar').classList.remove('open');
  $('#breadcrumb').textContent = `Prueba ${exercise.term}`;
  $('#exercise-title').textContent = exercise.title;
  $('#exercise-count').textContent = `EJ. ${exercise.n}`;
  $('#exercise-topic').textContent = exercise.topic;
  document.title = exercise.title + ' · Traza';
  trace = null;
  const raw = savedInputs.get(exercise.id) || exercise.samples[0];
  $('#input-fields').innerHTML = exercise.fields.map(f => `<label>${f.label}<input name="${f.name}" id="input-${f.name}" type="text" ${f.numeric ? 'inputmode="numeric"' : ''} maxlength="${f.max}" autocomplete="off" spellcheck="false" value="${esc(raw[f.name])}" aria-describedby="input-hint form-error"></label>`).join('');
  $('#input-hint').textContent = exercise.hint;
  $('#sample-select').innerHTML = '<option value="">Selecciona un ejemplo…</option>' + exercise.samples.map((s,i) => `<option value="${i}">${s.name}</option>`).join('');
  if (!savedInputs.has(exercise.id)) $('#sample-select').value = '0';
  $('#code-filename').textContent = exercise.filename;
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  downloadUrl = URL.createObjectURL(new Blob([sources[exercise.id] + '\n'], {type:'text/x-python;charset=utf-8'}));
  $('#download-code').href = downloadUrl;
  $('#download-code').download = $('#code-filename').textContent;
  $('#visual-title').textContent = exercise.visualTitle;
  $('#visual-context').textContent = exercise.visualContext;
  renderCode();
  generate();
}

function rawInputs() {
  return Object.fromEntries(new FormData($('#input-form')));
}

function generate() {
  pause();
  const raw = rawInputs();
  try {
    const nextTrace = makeTrace(exercise.id,raw);
    trace = nextTrace;
    savedInputs.set(exercise.id,raw);
    step = 0;
    $('#form-error').hidden = true;
    $('#form-error').textContent = '';
    $('#input-form').querySelectorAll('input').forEach(i => i.removeAttribute('aria-invalid'));
    $('#timeline').max = trace.events.length-1;
    if (tableOpen) renderTable();
    render();
    return true;
  } catch (error) {
    $('#form-error').textContent = error.message;
    $('#form-error').hidden = false;
    $('#input-form').querySelectorAll('input').forEach(i => i.setAttribute('aria-invalid','true'));
    return false;
  }
}

function paintCode() {
  document.querySelectorAll('.code-line.active').forEach(n => { n.classList.remove('active'); n.removeAttribute('aria-current'); });
  const event = trace.events[step];
  const active = $(`.code-line[data-line="${event.line}"]`);
  if (active) {
    active.classList.add('active');
    active.setAttribute('aria-current','step');
    const scroll = $('#code-scroll');
    const target = active.getBoundingClientRect(), parent = scroll.getBoundingClientRect();
    if (target.top < parent.top+10 || target.bottom > parent.bottom-10) scroll.scrollTop += target.top-parent.top-parent.height/2;
  }
  $('#line-label').textContent = event.line ? `Línea ${event.line} ejecutada` : 'La línea activa aparecerá al avanzar';
}

function render() {
  if (!trace) return;
  const event = trace.events[step];
  paintCode();
  renderVisual(event);
  renderMemory(event);
  $('#step-type').textContent = kindNames[event.kind];
  $('#step-title').textContent = event.title;
  $('#step-detail').textContent = event.detail;
  $('#step-formula').textContent = event.formula;
  $('#step-formula').hidden = !event.formula;
  $('#condition-result').innerHTML = event.result === null ? '' : `<span class="boolean ${event.result ? '' : 'false'}">${event.result ? 'True' : 'False'}</span>`;
  $('#step-current').textContent = String(step).padStart(2,'0');
  $('#step-total').textContent = `/ ${trace.events.length-1} pasos`;
  $('#timeline').value = step;
  $('#timeline').setAttribute('aria-valuetext',`Paso ${step} de ${trace.events.length-1}: ${event.title}`);
  const atEnd = step === trace.events.length-1;
  $('#prev').disabled = step === 0;
  $('#restart').disabled = step === 0;
  $('#next').disabled = atEnd;
  $('#finish').disabled = atEnd;
  $('#progress-label').textContent = atEnd ? 'Traza completada ✓' : step === 0 ? 'Listo para comenzar' : `${Math.round(100*step/(trace.events.length-1))}% del recorrido`;
  $('#console-output').innerHTML = event.console.length ? event.console.map((line,i) => `<span class="${event.kind === 'output' && i === event.console.length-1 ? 'console-result' : 'console-prompt'}">${esc(line)}</span>`).join('\n') : '<span class="console-placeholder">La consola aparecerá al ejecutar el programa…</span>';
  const consoleEl = $('#console-output');
  consoleEl.scrollTop = consoleEl.scrollHeight;
  if (tableOpen) {
    document.querySelectorAll('#trace-table tr.current').forEach(row => row.classList.remove('current'));
    $(`#trace-table tr[data-step="${step}"]`)?.classList.add('current');
  }
}

function renderMemory(event) {
  $('#variables').innerHTML = exercise.vars.map(name => {
    const exists = Object.hasOwn(event.state,name), value = event.state[name];
    const wide = ['recinto','ataques','jardin','resultado'].includes(name);
    const changed = event.changed.includes(name);
    let display = '—';
    if (exists) {
      display = wide ? '&quot;' + [...value].map((c,i) => i === event.focus ? `<span class="char-focus">${c}</span>` : c).join('') + '&quot;' : esc(value);
    }
    const before = changed ? Object.hasOwn(event.before,name) ? `antes ${esc(py(event.before[name]))}` : 'variable creada' : exists ? (wide ? 'str' : 'int') : 'sin asignar';
    return `<div class="variable ${wide ? 'wide' : ''} ${changed ? 'changed' : ''}"><div class="var-name">${name}</div><div class="var-value ${exists ? '' : 'undefined'}">${display}</div><div class="var-before">${before}</div></div>`;
  }).join('');
}

function renderVisual(event) {
  if (exercise.id === 'plantas') { renderPlants(event); return; }
  if (exercise.id === 'collatz') { renderCollatz(event); return; }
  if (exercise.id === 'gallinas') {
    const { recinto, ataques } = trace.input;
    const cols = '72px ' + `repeat(${recinto.length},34px)`;
    const indexes = [...recinto].map((_,i) => `<div class="garden-index ${i === event.focus ? 'focus' : ''}">${i === event.focus ? '↓ ' : ''}${i}</div>`).join('');
    const cells = (str, row) => [...str].map((char,i) => {
      const focus = event.focus === i, checked = event.checked.includes(i);
      let status = checked ? recinto[i] === 'G' ? ataques[i] === 'X' ? 'safe' : 'hit' : 'empty checked' : '';
      const label = row === 'recinto' ? char === 'G' ? 'Gallina' : 'Vacío' : char === 'C' ? 'Ataque de coyote' : 'Sin ataque';
      return `<div class="garden-cell ${focus ? 'focus' : ''} ${char === 'G' ? 'bird' : char === 'C' ? 'attack' : 'empty'} ${status}" title="Posición ${i}: ${label}"><span>${char}</span></div>`;
    }).join('');
    $('#visualization').innerHTML = `<div class="garden-scroll"><div class="garden-grid" style="grid-template-columns:${cols}"><div class="garden-label">índice i</div>${indexes}<div class="garden-label">recinto</div>${cells(recinto,'recinto')}<div class="garden-label">ataques</div>${cells(ataques,'ataques')}</div></div><div class="garden-legend"><span><i class="legend-square safe"></i> Gallina ilesa</span><span><i class="legend-square hit"></i> Atacada</span><span><i class="legend-square focus"></i> Índice actual</span></div><div class="visual-status"><span>${event.state.i === undefined ? 'El índice aún no se ha asignado' : `i = ${event.state.i}${event.state.i === recinto.length ? ' · fin del string' : ''}`}</span><strong>${event.checked.length} / ${recinto.length} revisadas</strong></div>`;
    const focusCell = $('#visualization .garden-cell.focus');
    if (focusCell) {
      const container = $('#visualization .garden-scroll');
      container.scrollLeft = Math.max(0,focusCell.offsetLeft-container.offsetLeft-container.clientWidth/2);
    }
  } else {
    const { dias } = trace.input;
    let run = 0;
    const currentCode = sources.racha.split('\n')[event.line-1]?.trim();
    const processedLine = ['racha_actual = racha_actual + 1','if racha_actual > mejor_racha:','mejor_racha = racha_actual'].includes(currentCode) || (currentCode === 'racha_actual = 0' && event.line > 6);
    const maxRun = Math.max(1,...dias.map(n => n === -1 ? 0 : n === 0 ? (run=0) : ++run));
    run = 0;
    const bars = dias.map((n,i) => {
      if (n !== -1) run = n === 0 ? 0 : run+1;
      const read = i <= event.focus, processed = i < event.focus || (i === event.focus && processedLine);
      return `<div class="day-column ${i === event.focus ? 'focus' : ''}"><span class="day-exp">${read ? n === -1 ? 'fin' : n+' exp' : '· · ·'}</span>${n === -1 ? `<div class="sentinel" style="opacity:${read ? 1 : .4}">-1</div>` : `<div class="day-bar ${n === 0 ? 'break' : ''} ${!read ? 'unread' : !processed ? 'waiting' : ''}" style="height:${Math.max(7,run/maxRun*72)}px">${processed ? n === 0 ? '×' : run : ''}</div>`}<span class="day-label">${n === -1 ? 'centinela' : 'D'+(i+1)}</span></div>`;
    }).join('');
    $('#visualization').innerHTML = `<div class="chart-scroll"><div class="streak-chart">${bars}</div></div><div class="garden-legend"><span><i class="legend-square safe"></i> Altura = días de racha</span><span><i class="legend-square hit"></i> 0 exp: reinicio</span><span>-1 no es un día</span></div><div class="visual-status"><span>${event.focus < 0 ? 'Esperando la primera entrada' : dias[event.focus] === -1 ? 'Centinela leído · no suma días' : `Día ${event.focus+1} · ${dias[event.focus]} puntos de experiencia`}</span><strong>Récord: ${event.state.mejor_racha ?? '—'} días</strong></div>`;
    const col = $('#visualization .day-column.focus');
    if (col) {
      const container = $('#visualization .chart-scroll');
      container.scrollLeft = Math.max(0,col.offsetLeft-container.offsetLeft-container.clientWidth/2);
    }
  }
}

function renderPlants(event) {
  const {jardin,semana}=trace.input, output=event.state.resultado??'';
  const periods={T:1,C:2,D:4};
  const indexes=[...jardin].map((_,i)=>`<div class="garden-index ${i===event.focus?'focus':''}">${i===event.focus?'↓ ':''}${i}</div>`).join('');
  const plants=[...jardin].map((c,i)=>`<div class="garden-cell ${i===event.focus?'focus':''}" title="${{T:'Tropical',C:'Común',D:'Desértica'}[c]}">${c}</div>`).join('');
  const periodCells=[...jardin].map(c=>`<div class="period-cell">${periods[c]}</div>`).join('');
  const results=[...jardin].map((_,i)=>`<div class="garden-cell ${i===event.focus?'focus':''} ${output[i]==='R'?'safe':output[i]==='X'?'hit':''}">${output[i]??'·'}</div>`).join('');
  $('#visualization').innerHTML=`<div class="garden-scroll"><div class="garden-grid" style="grid-template-columns:76px repeat(${jardin.length},34px)"><div class="garden-label">índice i</div>${indexes}<div class="garden-label">jardin</div>${plants}<div class="garden-label">período</div>${periodCells}<div class="garden-label">resultado</div>${results}</div></div><div class="garden-legend"><span><i class="legend-square safe"></i> R: se riega</span><span><i class="legend-square hit"></i> X: no se riega</span><span>·: aún sin agregar</span></div><div class="visual-status"><span>Semana ${semana}${event.state.i===jardin.length?' · fin del jardín':''}</span><strong>${output.length} / ${jardin.length} procesadas</strong></div>`;
  const cell=$('#visualization .garden-cell.focus'),scroll=$('#visualization .garden-scroll');
  if(cell) scroll.scrollLeft=Math.max(0,cell.offsetLeft-scroll.offsetLeft-scroll.clientWidth/2);
}

function renderCollatz(event) {
  const values=event.visual.sequence;
  if(!values.length) { $('#visualization').innerHTML='<div class="chart-placeholder">La secuencia aparecerá al leer el número inicial.</div>'; return; }
  const high=Math.max(...values),width=Math.max(320,values.length*24),height=110;
  const points=values.map((n,i)=>`${12+i*(width-24)/Math.max(1,values.length-1)},${height-12-n/high*(height-25)}`).join(' ');
  const endX=values.length===1?12:width-12,endY=height-12-values.at(-1)/high*(height-25);
  $('#visualization').innerHTML=`<div class="collatz-chart-scroll"><svg class="collatz-chart" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Secuencia calculada: ${values.join(', ')}"><line x1="0" y1="${height-10}" x2="${width}" y2="${height-10}" class="chart-axis"/><polyline points="${points}" class="sequence-line"/><circle cx="${endX}" cy="${endY}" r="4" class="sequence-dot"/></svg></div><div class="sequence-values">${values.map((n,i)=>`<span class="sequence-value ${i===values.length-1?'current':''} ${n===event.state.maximo?'peak':''}" title="Valor ${i}: ${n}">${n}</span>${i<values.length-1?'<span class="sequence-arrow">→</span>':''}`).join('')}</div><div class="visual-status"><span>Altura = valor del número</span><strong>${values.length-1} transformaciones</strong></div>`;
  const chart=$('#visualization .collatz-chart-scroll'),list=$('#visualization .sequence-values');
  chart.scrollLeft=chart.scrollWidth;
  list.scrollLeft=list.scrollWidth;
}

function goto(n, manual = true) {
  if (!trace) return;
  if (manual) pause();
  step = Math.min(trace.events.length-1,Math.max(0,n));
  render();
}
function pause() {
  if (timer) clearInterval(timer);
  timer = null;
  $('#play').innerHTML = '<span aria-hidden="true">▶</span>';
  $('#play').setAttribute('aria-label','Reproducir traza');
}
function play() {
  if (!trace) return;
  if (timer) { pause(); return; }
  if (step === trace.events.length-1) goto(0);
  $('#play').innerHTML = '<span aria-hidden="true">Ⅱ</span>';
  $('#play').setAttribute('aria-label','Pausar traza');
  timer = setInterval(() => {
    goto(step+1,false);
    if (step === trace.events.length-1) pause();
  },Number($('#speed').value));
}

function renderTable() {
  if (!trace) return;
  $('#trace-table').innerHTML = `<thead><tr><th>Paso</th><th>Línea</th><th>Acción</th>${exercise.vars.map(v => `<th>${v}</th>`).join('')}<th>Condición</th></tr></thead><tbody>${trace.events.map((e,i) => `<tr data-step="${i}" tabindex="0" aria-label="Ir al paso ${i}" class="${i === step ? 'current' : ''}"><td>${i}</td><td>${e.line || '—'}</td><td>${kindNames[e.kind]}</td>${exercise.vars.map(v => `<td class="${e.changed.includes(v) ? 'table-changed' : ''}">${Object.hasOwn(e.state,v) ? esc(py(e.state[v])) : '—'}</td>`).join('')}<td>${e.result === null ? '—' : e.result ? 'True' : 'False'}</td></tr>`).join('')}</tbody>`;
}

function showDialog(content, eyebrow) {
  pause();
  $('#dialog-content').innerHTML = content;
  $('#dialog-eyebrow').textContent = eyebrow;
  $('#info-dialog').showModal();
}

$('#input-form').addEventListener('submit',event => { event.preventDefault(); generate(); });
$('#sample-select').addEventListener('change',event => {
  if (event.target.value === '') return;
  const sample = exercise.samples[Number(event.target.value)];
  Object.keys(sample).filter(k => k !== 'name').forEach(k => { $(`#input-${k}`).value = sample[k]; });
  generate();
});
$('#input-form').addEventListener('input',() => { $('#sample-select').value = ''; });
$('#show-comments').addEventListener('change',renderCode);
$('#next').addEventListener('click',() => goto(step+1));
$('#prev').addEventListener('click',() => goto(step-1));
$('#restart').addEventListener('click',() => goto(0));
$('#finish').addEventListener('click',() => goto(trace.events.length-1));
$('#play').addEventListener('click',play);
$('#speed').addEventListener('change',() => { if (timer) { pause(); play(); } });
$('#timeline').addEventListener('input',event => goto(Number(event.target.value)));
$('#show-table').addEventListener('click',() => {
  tableOpen = !tableOpen;
  $('#trace-table-section').hidden = !tableOpen;
  $('#show-table').setAttribute('aria-expanded',String(tableOpen));
  if (tableOpen) { renderTable(); $('#trace-table-section').scrollIntoView({behavior:'smooth',block:'nearest'}); }
});
$('#trace-table').addEventListener('click',event => { const row = event.target.closest('[data-step]'); if (row) goto(Number(row.dataset.step)); });
$('#trace-table').addEventListener('keydown',event => {
  if (!['Enter',' '].includes(event.key)) return;
  const row = event.target.closest('[data-step]');
  if (row) { event.preventDefault(); event.stopPropagation(); goto(Number(row.dataset.step)); }
});
$('#export-csv').addEventListener('click',() => {
  const rows = [['Paso','Línea','Acción',...exercise.vars,'Condición','Explicación'],...trace.events.map((e,i) => [i,e.line || '',kindNames[e.kind],...exercise.vars.map(v => Object.hasOwn(e.state,v) ? py(e.state[v]) : ''),e.result === null ? '' : e.result ? 'True' : 'False',e.detail])];
  const csv = '\uFEFF' + rows.map(row => row.map(v => '"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a = document.createElement('a'); a.href=url; a.download=`traza-${exercise.id}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
});
$('#statement').addEventListener('click',() => showDialog(`<h2>${exercise.title}</h2><p>${exercise.statement}</p><h3>Objetivo</h3><p>${exercise.goal}</p>`,'PRUEBA '+exercise.term+' · EJERCICIO '+exercise.n));
$('#help').addEventListener('click',() => showDialog('<h2>Traza paso a paso</h2><p>Configura las entradas y genera una traza. El resaltado señala la línea que acaba de ejecutarse. La memoria muestra sus valores después de ese paso; un borde de acento identifica los cambios.</p><h3>Atajos</h3><div class="help-row"><span>Avanzar / retroceder</span><span><kbd>←</kbd> <kbd>→</kbd></span></div><div class="help-row"><span>Reproducir / pausar</span><kbd>Espacio</kbd></div><div class="help-row"><span>Inicio / resultado</span><span><kbd>Home</kbd> <kbd>End</kbd></span></div><p class="dialog-note">Cuatro programas con while: ejercicios 1 y 2 de cada prueba. Puedes cambiar sus entradas, descargar el código Python y exportar la tabla de estados.</p>','AYUDA'));
$('#close-dialog').addEventListener('click',() => $('#info-dialog').close());
$('#info-dialog').addEventListener('click',event => { if (event.target === $('#info-dialog')) { const r = event.target.getBoundingClientRect(); if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) event.target.close(); } });
$('#classroom').addEventListener('click',() => {
  const active = document.body.classList.toggle('classroom');
  $('#classroom').setAttribute('aria-pressed',String(active));
  $('#classroom').querySelector('span:last-child').textContent = active ? 'Salir de modo ayudantía' : 'Modo ayudantía';
  requestAnimationFrame(() => { if(trace) paintCode(); });
});
$('#menu').addEventListener('click',() => $('#sidebar').classList.toggle('open'));
document.addEventListener('click',event => { if (!event.target.closest('.sidebar') && !event.target.closest('#menu')) $('#sidebar').classList.remove('open'); });
document.addEventListener('keydown',event => {
  if (!trace || $('#info-dialog').open || event.ctrlKey || event.altKey || event.metaKey || event.target.closest('input,select,textarea,[contenteditable],tr[tabindex]')) return;
  if (event.key === ' ' && event.target.closest('button,a')) return;
  const actions = {ArrowRight:() => goto(step+1),ArrowLeft:() => goto(step-1),Home:() => goto(0),End:() => goto(trace.events.length-1),' ':play};
  if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
});
document.addEventListener('visibilitychange',() => { if(document.hidden) pause(); });
window.addEventListener('hashchange',selectExercise);
selectExercise();
