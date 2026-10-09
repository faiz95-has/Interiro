// Maison Élan — lightweight frontend interactions
(function(){
"use strict";
const $ = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];

/* Navbar transform + progress */
const nav = $('#navbar'), bar = $('#progressBar');
const onScroll = ()=>{
  const y = window.scrollY;
  nav.classList.toggle('solid', y>60);
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h>0? (y/h*100):0)+'%';
  // hero parallax (transform only, rAF-friendly)
  const bg = $('#heroBg');
  if(bg && y < innerHeight*1.2) bg.style.transform = `translateY(${y*0.22}px)`;
  // gentle horizontal move for .h-move
  $$('.h-move').forEach(el=>{
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, 1 - r.top/innerHeight));
    el.style.transform = `scale(1.12) translateX(${(p-0.5)*24}px)`;
  });
  // timeline progress
  const tl = $('#timeline'), tp = $('#tProgress');
  if(tl && tp){
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight*0.7 - r.top)/r.height));
    tp.style.height = (p*100)+'%';
  }
};
let tick=false;
addEventListener('scroll',()=>{ if(!tick){ requestAnimationFrame(()=>{onScroll();tick=false}); tick=true; } },{passive:true});
onScroll();

/* Mobile menu */
const ham=$('#hamburger'), mm=$('#mobileMenu');
ham.addEventListener('click',()=>{
  const open = mm.classList.toggle('open');
  ham.classList.toggle('open',open);
  ham.setAttribute('aria-expanded',open);
  document.body.style.overflow = open?'hidden':'';
});
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');ham.classList.remove('open');document.body.style.overflow='';}));

/* Reveal on scroll */
const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} }),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
$$('.reveal,.reveal-mask').forEach(el=>io.observe(el));

/* Counters + stat bars */
const cio = new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting) return; cio.unobserve(e.target);
  const el=e.target, end=+el.dataset.count||0, t0=performance.now(), dur=1400;
  (function step(t){ const p=Math.min(1,(t-t0)/dur), v=Math.round(end*(1-Math.pow(1-p,3))); el.textContent=v; if(p<1) requestAnimationFrame(step); })(t0);
  $$('.bar i').forEach(b=>b.style.width=b.dataset.w+'%');
}),{threshold:.5});
$$('[data-count]').forEach(el=>cio.observe(el));

/* Active nav link */
const secs = ['about','projects','services','process','testimonials','contact'].map(id=>document.getElementById(id));
const links = $$('.nav-link');
const nio = new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ links.forEach(l=>l.classList.toggle('active', l.getAttribute('href')==='#'+e.target.id)); }
}),{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>s&&nio.observe(s));

/* Magnetic buttons (lightweight) */
if(matchMedia('(pointer:fine)').matches){
  $$('.magnetic').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.18, y=(e.clientY-r.top-r.height/2)*.28;
      btn.style.transform=`translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave',()=>btn.style.transform='');
  });
  /* 3D tilt */
  $$('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const rx=((e.clientY-r.top)/r.height-.5)*-10, ry=((e.clientX-r.left)/r.width-.5)*12;
      card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

/* Projects data + grid + modal */
const PROJECTS=[
 {title:'The Ivory Villa',cat:'Residential · Villa',loc:'Alibaug',year:'2024',size:'4,200 sq ft',scope:'Turnkey · Architecture + Interiors',pal:'Ivory · Travertine · Smoked Oak',desc:'A weekend villa wrapped in limewash and light — double-height lounge, fluted kitchen island and a courtyard that pulls the breeze through every room.',imgs:['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1400&auto=format&fit=crop']},
 {title:'Limewash Lounge Penthouse',cat:'Residential · Penthouse',loc:'Worli, Mumbai',year:'2025',size:'2,800 sq ft',scope:'Full-home interiors',pal:'Oat · Bouclé · Brushed Brass',desc:'Skyline penthouse in warm minimalism — curved sofa island, library wall and a bar nook that glows like dusk, every evening.',imgs:['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1400&auto=format&fit=crop']},
 {title:'Atelier Northbeam Office',cat:'Commercial · Workplace',loc:'BKC, Mumbai',year:'2024',size:'6,500 sq ft',scope:'Design + Build · 10 weeks',pal:'Espresso · Oak · Champagne',desc:'A fund office that feels like a members club — acoustic pods, boardroom with cinematic lighting and a café-grade pantry.',imgs:['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop']},
 {title:'Oak & Stone Suite',cat:'Bedroom · Private',loc:'Pune',year:'2023',size:'650 sq ft',scope:'Bedroom + Bath + Wardrobe',pal:'Oak · Clay · Linen',desc:'A sleep sanctuary — upholstered bed wall, limewash finish, walk-in wardrobe in smoked glass and a spa-like travertine bath.',imgs:['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1400&auto=format&fit=crop']},
 {title:'Honed Quartzite Kitchen',cat:'Kitchen · Culinary',loc:'Goa',year:'2024',size:'420 sq ft',scope:'Kitchen + Utility',pal:'Stone · Fluted Oak · Brass',desc:'Engineered for serious Indian cooking — hidden pantry, chimney-integrated fluting, breakfast ledge in honed quartzite.',imgs:['https://images.unsplash.com/photo-1556912167-f556f1f39fdf?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1400&auto=format&fit=crop']},
 {title:'Courtyard Retail House',cat:'Commercial · Retail',loc:'Jaipur',year:'2025',size:'3,100 sq ft',scope:'Boutique retail',pal:'Terracotta · Lime · Cane',desc:'A fashion flagship around a sun court — arched niches, cane shutters and terracotta floors that keep the space cool and calm.',imgs:['https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1400&auto=format&fit=crop']}
];
const grid=$('#projectsGrid');
grid.innerHTML = PROJECTS.map((p,i)=>`
 <article class="proj-card reveal visible" data-i="${i}" tabindex="0" role="button" aria-label="Open ${p.title}">
   <div class="proj-media"><img loading="lazy" src="${p.imgs[0]}" alt="${p.title}">
     <div class="proj-overlay"><div><small>${p.cat}</small><h3>${p.title}</h3></div></div>
   </div>
   <div class="proj-body"><div><b>${p.loc} · ${p.year}</b><br>${p.size}</div><span class="view-btn">→</span></div>
 </article>`).join('');
$$('.proj-card',grid).forEach(c=>{ c.classList.add('visible'); });

const modal=$('#projectModal'), mImg=$('#mImg'), mTitle=$('#mTitle'), mCat=$('#mCat'), mMeta=$('#mMeta'), mDesc=$('#mDesc'), mSpecs=$('#mSpecs'), mCount=$('#mCount');
let cur=0, curImg=0;
function openProject(i){ cur=i; curImg=0; renderM(); modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function renderM(){ const p=PROJECTS[cur]; mImg.src=p.imgs[curImg]; mImg.alt=p.title; mTitle.textContent=p.title; mCat.textContent=p.cat; mMeta.textContent=`${p.loc} · ${p.year} · ${p.size}`; mDesc.textContent=p.desc; mCount.textContent=`${curImg+1} / ${p.imgs.length}`;
 mSpecs.innerHTML=`<div><strong>Scope</strong>${p.scope}</div><div><strong>Palette</strong>${p.pal}</div><div><strong>Location</strong>${p.loc}</div><div><strong>Year</strong>${p.year}</div>`; }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
grid.addEventListener('click',e=>{ const c=e.target.closest('.proj-card'); if(c) openProject(+c.dataset.i); });
grid.addEventListener('keydown',e=>{ if(e.key==='Enter'){ const c=e.target.closest('.proj-card'); if(c) openProject(+c.dataset.i);} });
$('#modalClose').addEventListener('click',closeModal);
$('#modalBackdrop').addEventListener('click',closeModal);
$('#mPrev').addEventListener('click',ev=>{ev.stopPropagation(); const n=PROJECTS[cur].imgs.length; curImg=(curImg-1+n)%n; renderM();});
$('#mNext').addEventListener('click',ev=>{ev.stopPropagation(); const n=PROJECTS[cur].imgs.length; curImg=(curImg+1)%n; renderM();});
$('#mCta').addEventListener('click',closeModal);
addEventListener('keydown',e=>{ if(e.key==='Escape'){closeModal(); closeSuccess(); closeBooking(); closeCall(); mm.classList.remove('open');} if(modal.classList.contains('open')){ if(e.key==='ArrowRight') $('#mNext').click(); if(e.key==='ArrowLeft') $('#mPrev').click(); }});

/* Horizontal gallery */
const h=$('#hScroll');
$('#hPrev').addEventListener('click',()=>h.scrollBy({left:-440,behavior:'smooth'}));
$('#hNext').addEventListener('click',()=>h.scrollBy({left:440,behavior:'smooth'}));
let down=false,sx=0,sl=0;
h.addEventListener('pointerdown',e=>{down=true;sx=e.clientX;sl=h.scrollLeft;});
addEventListener('pointerup',()=>down=false);
h.addEventListener('pointermove',e=>{ if(down) h.scrollLeft=sl-(e.clientX-sx); });

/* Before / After */
const baBefore=$('#baBefore'), baHandle=$('#baHandle'), baRange=$('#baRange');
function setBA(v){ v=Math.max(0,Math.min(100,v)); baBefore.style.width=v+'%'; baHandle.style.left=v+'%'; baRange.value=v; }
baRange.addEventListener('input',()=>setBA(+baRange.value));
// drag on container
let baDrag=false;
const baSlider=$('#baSlider');
baSlider.addEventListener('pointerdown',e=>{baDrag=true;baSlider.setPointerCapture(e.pointerId);moveBA(e);});
baSlider.addEventListener('pointermove',e=>{if(baDrag)moveBA(e);});
baSlider.addEventListener('pointerup',()=>baDrag=false);
function moveBA(e){ const r=baSlider.getBoundingClientRect(); setBA((e.clientX-r.left)/r.width*100); }
setBA(50);

/* Testimonials carousel (section removed — guard rakha hai) */
const track=$('#carTrack');
if(track){
const slides=$$('.car-slide',track), dotsBox=$('#carDots');
let ci=0, timer;
slides.forEach((_,i)=>{ const d=document.createElement('i'); if(i===0)d.classList.add('on'); d.addEventListener('click',()=>go(i,true)); dotsBox.appendChild(d); });
const dots=$$('i',dotsBox);
function go(i,manual){ ci=(i+slides.length)%slides.length; track.style.transform=`translateX(-${ci*100}%)`; dots.forEach((d,k)=>d.classList.toggle('on',k===ci)); if(manual) restart(); }
function restart(){ clearInterval(timer); timer=setInterval(()=>go(ci+1),5500); }
$('#carPrev').addEventListener('click',()=>go(ci-1,true));
$('#carNext').addEventListener('click',()=>go(ci+1,true));
restart();
// swipe
let tx=0; track.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
track.addEventListener('touchend',e=>{ const dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>40) go(ci+(dx<0?1:-1),true); },{passive:true});
}

/* FAQ */
$$('.acc-item').forEach(item=>{
  const head=$('.acc-head',item), body=$('.acc-body',item);
  head.addEventListener('click',()=>{
    const open=item.classList.contains('open');
    $$('.acc-item.open').forEach(o=>{o.classList.remove('open'); $('.acc-body',o).style.maxHeight=null;});
    if(!open){ item.classList.add('open'); body.style.maxHeight=body.scrollHeight+'px'; }
  });
});

/* Booking popup + WhatsApp send */
const WHATSAPP_NUMBER = '919820012345';
const bookingModal = $('#bookingModal'), bookingForm = $('#bookingForm');
function openBooking(){ if(!bookingModal) return; bookingModal.classList.add('open'); bookingModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; setTimeout(()=>{ const n=$('#bName'); if(n) n.focus(); },350); }
function closeBooking(){ if(!bookingModal) return; bookingModal.classList.remove('open'); bookingModal.setAttribute('aria-hidden','true'); if(!modal.classList.contains('open') && !success.classList.contains('open') && !(callModal && callModal.classList.contains('open'))) document.body.style.overflow=''; }
$$('[data-close-booking]').forEach(b=>b.addEventListener('click',closeBooking));

/* Call popup — phone number par click → same animation wala popup */
const callModal = $('#callModal');
function openCall(){ if(!callModal) return; closeBooking(); callModal.classList.add('open'); callModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeCall(){ if(!callModal) return; callModal.classList.remove('open'); callModal.setAttribute('aria-hidden','true'); if(!modal.classList.contains('open') && !bookingModal.classList.contains('open') && !success.classList.contains('open')) document.body.style.overflow=''; }
$$('[data-close-call]').forEach(b=>b.addEventListener('click',closeCall));
// contact section + footer ke phone links se call popup kholo (Call Now button direct dial karega)
$$('a[href^="tel:"]').forEach(a=>{
  if(a.closest('#callModal')) return; // popup ke andar wala Call Now direct dial ho
  a.addEventListener('click',e=>{ e.preventDefault(); openCall(); });
});
// Har "Book / Consultation" button se booking popup kholo
$$('a,button').forEach(el=>{
  const txt=(el.textContent||'').toLowerCase();
  if((txt.includes('book') && (txt.includes('consult')||txt.includes('book'))) || txt.includes('request consultation') || el.id==='mCta'){
    if(el.tagName==='A' && el.getAttribute('href')==='#contact'){
      el.addEventListener('click',e=>{ e.preventDefault(); e.stopImmediatePropagation(); closeModal(); openBooking(); }, true);
    }
  }
});
if(bookingForm){
  // aaj ki date se pehle select na ho
  const d=$('#bDate'); if(d){ d.min = new Date().toISOString().split('T')[0]; }
  bookingForm.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('#bName'), phone=$('#bPhone'), msg=$('#bMsg'), type=$('#bType'), date=$('#bDate');
    let ok=true;
    [name,phone,msg].forEach(f=>{ if(!f.value.trim()){ ok=false; f.style.borderColor='#c0392b'; setTimeout(()=>f.style.borderColor='',2200); } });
    if(!ok) return;
    const text = `Hi Maison Élan! I'd like to BOOK a consultation.%0A%0A*Name:* ${encodeURIComponent(name.value.trim())}%0A*Phone:* ${encodeURIComponent(phone.value.trim())}%0A*Project:* ${encodeURIComponent(type.value)}%0A*Preferred Date:* ${encodeURIComponent(date.value||'Flexible')}%0A*Details:* ${encodeURIComponent(msg.value.trim())}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url,'_blank');
    closeBooking();
    const note=$('#successNote'); if(note) note.textContent='WhatsApp opening with your booking details — just press send. We will confirm shortly!';
    success.classList.add('open'); success.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
    bookingForm.reset();
  });
}

/* Form + success popup (contact section — bhi WhatsApp par bhejo) */
const form=$('#consultForm'), success=$('#successModal');
function closeSuccess(){ success.classList.remove('open'); success.setAttribute('aria-hidden','true'); if(!modal.classList.contains('open') && !bookingModal.classList.contains('open') && !callModal.classList.contains('open')) document.body.style.overflow=''; }
if(form){
form.addEventListener('submit',e=>{
  e.preventDefault();
  const name=$('#fName'), phone=$('#fPhone'), msg=$('#fMsg');
  let ok=true;
  [name,phone,msg].forEach(f=>{
    if(!f.value.trim()){ ok=false; f.style.borderColor='#c0392b'; setTimeout(()=>f.style.borderColor='',2200); }
  });
  const email=$('#fEmail');
  if(email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){ ok=false; email.style.borderColor='#c0392b'; setTimeout(()=>email.style.borderColor='',2200); }
  if(!ok) return;
  const type=$('#fType');
  const text=`Hi Maison Élan! New consultation request from website.%0A%0A*Name:* ${encodeURIComponent(name.value.trim())}%0A*Phone:* ${encodeURIComponent(phone.value.trim())}%0A*Email:* ${encodeURIComponent(email.value||'-')}%0A*Project:* ${encodeURIComponent(type.value)}%0A*Details:* ${encodeURIComponent(msg.value.trim())}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,'_blank');
  const note=$('#successNote'); if(note) note.textContent='WhatsApp opening with your details — just press send!';
  success.classList.add('open'); success.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  form.reset();
});
}
$$('[data-close-success]').forEach(b=>b.addEventListener('click',closeSuccess));

/* Smooth page-transition feel for anchor CTAs */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1){ const t=document.querySelector(id); if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); } }
  });
});
})();
