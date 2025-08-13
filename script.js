const $ = s => document.querySelector(s);
const stage = $('#stage');
const girl  = $('#girl');
const boy   = $('#boy');
const mallet= $('#mallet');
const bubble= $('#quoteBubble');
const btn   = $('#stressBtn');
const bonk  = $('#bonk');

const QUOTES = [
  "lababy you're BDE is too strong to give up 💪",
  "Imagine depending on a boy eww",
  "think about all the $$ you're gonna make",
  "it's not that deep, you'll make itt",
  "it's okay, duck it we ball 📈",
  "people dumber than you are gonna do this panel",
  "you got this lbb",
  "think about decemberr",
  "ive run out of motivational quotes 💃",
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
  const g = girl.getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  const m = mallet.getBoundingClientRect();

  // Start position: near girl's right hand
  const startX = (g.left - s.left) + g.width * 0.75 - m.width / 2;
  const startY = (g.top - s.top) + g.height * 0.3 - m.height / 2;

  mallet.style.left = `${startX}px`;
  mallet.style.top  = `${startY}px`;

  // Trigger animation
  mallet.classList.remove('swing');
  void mallet.offsetWidth;
  mallet.classList.add('swing');
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
