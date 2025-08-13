const $ = s => document.querySelector(s);
const stage = $('#stage');
const girl  = $('#girl');
const boy   = $('#boy');
const mallet= $('#mallet');
const bubble= $('#quoteBubble');
const btn   = $('#stressBtn');
const bonk  = $('#bonk');

const QUOTES = [
  "You’ve done harder things. This is light work. 💪",
  "Brains + grit = You. Coffee is just a sidekick.",
  "Tiny steps > big stress. One page at a time.",
  "Proud of you. Keep going. Future you is cheering.",
  "Mistakes are data. Adjust and roll. 📈",
  "You’re not behind. You’re building momentum.",
  "If it’s confusing, your brain is growing. Nice.",
  "Rest is strategy, not weakness.",
  "Focus 25 min. Dance 5. Repeat. 💃",
  "You’re the curve. The curve fears you.",
];

let busy = false;

const rand = (min, max) => Math.random() * (max - min) + min;

function randomBoySpot(){
  const pad = 50;
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const x = rand(pad, w - pad);
  const y = rand(h * 0.28, h * 0.62);
  boy.style.left = `${x}px`;
  boy.style.top  = `${y}px`;
}

function showQuote(){
  bubble.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  bubble.classList.remove('show'); void bubble.offsetWidth; bubble.classList.add('show');
}

function swingMalletTowardBoy(){
  const b = boy.getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  mallet.style.left = `${b.left - s.left - 10}px`;
  mallet.style.top  = `${b.top  - s.top  - 10}px`;
  mallet.classList.remove('swing'); void mallet.offsetWidth; mallet.classList.add('swing');
}

function confetti(){
  const colors = ["#ff7aa2","#ffd166","#8ad6ff","#b3ffb3","#cdb4ff"];
  for(let i=0;i<26;i++){
    const s = document.createElement('span');
    s.className = 'confetti';
    s.style.left = `${rand(0, stage.clientWidth)}px`;
    s.style.background = colors[i % colors.length];
    s.style.animationDuration = `${rand(1.2, 2.1)}s`;
    s.style.transform = `translateY(0) rotate(${rand(0, 360)}deg)`;
    stage.appendChild(s);
    setTimeout(()=> s.remove(), 2200);
  }
}

function vibrate(ms=30){
  if (navigator.vibrate) navigator.vibrate(ms);
}

async function stressbuster(){
  if (busy) return;
  busy = true;
  btn.disabled = true;

  randomBoySpot();
  boy.classList.remove('bonked');
  boy.classList.add('pop');

  await new Promise(r => setTimeout(r, 360));

  swingMalletTowardBoy();
  boy.classList.add('bonked');
  showQuote();
  confetti();
  vibrate();

  try{ bonk.currentTime = 0; await bonk.play(); }catch{}

  setTimeout(()=>{
    boy.classList.remove('pop','bonked');
    boy.style.opacity = 1;
    busy = false;
    btn.disabled = false;
  }, 900);
}

btn.addEventListener('click', stressbuster);
window.addEventListener('resize', ()=>{ /* responsive by CSS */ });
