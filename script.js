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

  // centers relative to the stage
  const boyCX  = (b.left - s.left) + b.width / 2;
  const boyCY  = (b.top  - s.top ) + b.height / 2;

  // approximate her right-hand spot (tweak 0.75 / 0.30 as needed for your PNG)
  const handX  = (g.left - s.left) + g.width * 0.75;
  const handY  = (g.top  - s.top ) + g.height * 0.30;

  // aim angle in degrees
  const angle = Math.atan2(boyCY - handY, boyCX - handX) * 180 / Math.PI;

  // lean her slightly toward the target
  girl.style.transform = `rotate(${Math.max(-8, Math.min(8, (angle-0)/18))}deg)`;
  setTimeout(()=>{ girl.style.transform = ''; }, 420);

  // animate hammer translation + rotation using Web Animations API
  const keyframes = [
    { transform: `translate(${handX}px, ${handY}px) rotate(${angle - 60}deg)`, opacity: 1 },
    { transform: `translate(${boyCX - 32}px, ${boyCY - 32}px) rotate(${angle + 10}deg)`, opacity: 1 }, // 64px hammer, center on boy
    { transform: `translate(${boyCX - 32}px, ${boyCY - 32}px) rotate(${angle}deg)`, opacity: 0 }
  ];
  mallet.animate(keyframes, { duration: 360, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'both' });
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
