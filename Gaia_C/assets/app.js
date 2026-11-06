'use strict';
// Header state
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>40),{passive:true});

// Flowing contour lines (hero)
(()=>{const c=document.getElementById('flow'),x=c.getContext('2d'),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
let w,h,t=0,m={x:.5,y:.5};
const fit=()=>{const d=devicePixelRatio||1;w=c.clientWidth;h=c.clientHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0)};
addEventListener('resize',fit);fit();
c.parentElement.addEventListener('pointermove',e=>{m.x=e.clientX/w;m.y=e.clientY/h});
const N=34;
function draw(){x.clearRect(0,0,w,h);
 for(let i=0;i<N;i++){const k=i/N;x.beginPath();
  for(let px=0;px<=w;px+=14){
   const nx=px/w,y=h*(.18+k*.75)+Math.sin(nx*3.2+t+k*5)*38+Math.sin(nx*7-t*1.3+k*9)*14+(m.y-.5)*40*Math.sin(nx*3+k*4)+Math.exp(-((nx-m.x)**2)*18)*(k-.5)*-30;
   px?x.lineTo(px,y):x.moveTo(px,y)}
  x.strokeStyle=i%7===0?'rgba(30,46,23,.35)':`rgba(107,127,69,${.10+k*.22})`;x.lineWidth=i%7===0?1.4:1;x.stroke()}
 t+=.006;if(!still)requestAnimationFrame(draw)}
draw()})();

// Tabs (catalog) with arrow-key support
document.querySelectorAll('.tabs:not(.sm)').forEach(g=>{
 const tabs=[...g.querySelectorAll('[role=tab]')];
 const pick=t=>{tabs.forEach(b=>{const on=b===t;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;document.getElementById(b.getAttribute('aria-controls')).hidden=!on});t.focus()};
 tabs.forEach((t,i)=>{t.onclick=()=>pick(t);t.onkeydown=e=>{if(e.key==='ArrowRight')pick(tabs[(i+1)%tabs.length]);if(e.key==='ArrowLeft')pick(tabs[(i-1+tabs.length)%tabs.length])}})});

// Dialogs
const $=id=>document.getElementById(id);
const dlg={login:$('login'),verify:$('verify'),apply:$('apply')};
document.addEventListener('click',e=>{
 const o=e.target.closest('[data-open]');
 if(o){const n=o.dataset.open;
  if(n==='apply'){$('atitle').textContent=o.dataset.path+' certification'}
  if(n==='verify'){o.dataset.fill?(verify(o.dataset.fill)):(location.hash='#registry',$('vid').focus());if(!o.dataset.fill)return}
  else dlg[n].showModal();return}
 if(e.target.closest('[data-close]'))e.target.closest('dialog').close();
 if(e.target.tagName==='DIALOG')e.target.close()});

// Login role tabs (preview only)
document.querySelectorAll('[data-lt]').forEach(b=>b.onclick=()=>{
 document.querySelectorAll('[data-lt]').forEach(x=>x.setAttribute('aria-selected',x===b));
 $('lrole').textContent=b.dataset.lt==='biz'?'business portal':'auditor portal'});
$('lform').onsubmit=e=>{e.preventDefault();$('lform').querySelector('.hint').textContent='Backend not connected yet. Login arrives in the next phase.'};

// Registry (mock data, replaced by API in backend phase)
const REG={
 'GC-SAL-0142':{n:'Aloe & Ash Salon',p:'Salon Certification',c:'Johannesburg',s:'Active',v:'30 Sep 2027',k:''},
 'GC-HOS-0031':{n:'Kloof Ridge Lodge',p:'Hospitality Certification',c:'Magaliesburg',s:'Under review',v:'Renewal due 14 Dec 2026',k:'warn'},
 'GC-PRD-0207':{n:'Root & Rain Shampoo Bar',p:'Product Certification',c:'Cape Town',s:'Expired',v:'Lapsed 01 Mar 2026',k:'bad'}};
function verify(id){id=id.trim().toUpperCase();const r=REG[id];
 $('vout').innerHTML=r?`<div class="res"><h2>${r.n}</h2><span class="badge ${r.k}">${r.s}</span><dl><dt>Certificate</dt><dd>${id}</dd><dt>Pathway</dt><dd>${r.p}</dd><dt>Location</dt><dd>${r.c}</dd><dt>Validity</dt><dd>${r.v}</dd><dt>Standards</dt><dd>Health, safety, sustainability</dd></dl></div>`
 :`<div class="res"><h2>No match found</h2><p class="muted">Check the ID printed under the QR code and try again.</p></div>`;
 dlg.verify.showModal()}
$('vform').onsubmit=e=>{e.preventDefault();verify($('vid').value)};
