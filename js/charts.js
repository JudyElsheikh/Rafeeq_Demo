Rafeeq.renderCharts=(container,id)=>{
 const R=Rafeeq,rows=(R.evaluations[id]||[]),metrics=R.systems[id].metrics;
 const available=metrics.filter(k=>rows.some(r=>Number.isFinite(r.metrics?.[k])));
 if(!available.length){container.innerHTML='<div class="empty compact"><span class="empty-icon">▥</span><h3>Charts awaiting evaluation data</h3><p>Comparisons appear only when actual metric values are supplied.</p></div>';return;}
 container.innerHTML=`<label class="candidate-picker">Compare metric<select id="chart-metric">${available.map(m=>`<option>${R.esc(m)}</option>`).join('')}</select></label><div id="metric-bars"></div>`;
 const draw=()=>{let key=container.querySelector('select').value,valid=rows.filter(r=>Number.isFinite(r.metrics?.[key])),max=Math.max(...valid.map(r=>Math.abs(r.metrics[key])),1);container.querySelector('#metric-bars').innerHTML=valid.map(r=>`<div class="metric-row"><span>${R.esc(R.models[id].find(m=>m.id===r.modelId)?.name||r.modelId)}</span><div class="metric-track"><span style="width:${Math.abs(r.metrics[key])/max*100}%"></span></div><strong>${r.metrics[key]}</strong></div>`).join('')+'<p class="muted">Raw metric values. Lower is better for MAE, RMSE, CER and WER; higher is better for other listed metrics. Bar lengths use absolute magnitude.</p>'};container.querySelector('select').onchange=draw;draw();
};
