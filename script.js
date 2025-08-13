// ---------- DOM ----------
const $ = s => document.querySelector(s);
const stage  = $('#stage');
const girl   = $('#girl');
const boy    = $('#boy');
const mallet = $('#mallet');
const bubble = $('#quoteBubble');
const btn    = $('#stressBtn');
const bonk   = $('#bonk');

// ---------- DATA ----------
const QUOTES = [
  "You’ve done harder things. This is light work. 💪",
  "Brains + grit = you. Coffee is just a sidekick.",
  "Tiny steps > big stress. One page at a time.",
  "Proud of you. Keep going. Future you is cheering.",
  "Mistakes are data. Adjust and roll. 📈",
  "You’re not behind. You’re building momentum.",
  "If it’s confusing, your brain is growing. Nice.",
  "Rest is strategy, not weakness.",
  "Focus 25 min. Dance 5. Repeat. 💃",
  "You’re the curve. The curve fears you."
];

let busy = false;

// ---------- UTILS ----------
const rand = (min, max) => Math.random() * (max - min) + min;

// Boy pops at a random spot (upper-middle band)
function randomBoySpot(){
  const pad = 50;
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const x = rand(pad, w - pad);
  const y = rand(h * 0.28, h * 0.62);
  boy.style.left = `${x}px`;
  boy.style.top  = `${y}px`;
}

// Quote bubble
function showQuote(){
  bubble.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  bubble.classList.remove('show'); 
  // reflow to replay animation
  void bubble.offsetWidth; 
  bubble.classList.add('show');
}

// Confetti
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

// Haptics
function vibrate(ms=30){
  if (navigator.vibrate) navigator.vibrate(ms);
}

// ---------- GIRL MOVEMENT ----------
function placeGirlNearBoy() {
  // Move girl so her “hand” ends ~90px from boy center
  const s  = stage.getBoundingClientRect();
  const b  = boy.getBoundingClientRect();
  const g0 = girl.getBoundingClientRect(); // current, includes transforms

  const boyCX = (b.left - s.left) + b.width / 2;
  const boyCY = (b.top  - s.top ) + b.height / 2;

  // Approx. right hand anchor on your artwork (tweak factors if needed)
  const handX0 = (g0.left - s.left) + g0.width * 0.75;
  const handY0 = (g0.top  - s.top ) + g0.height * 0.30;

  const vx = boyCX - handX0;
  const vy = boyCY - handY0;
  const dist = Math.hypot(vx, vy) || 1;

  const desiredGap = 90; // keep small gap before the hit
  const move = Math.max(0, dist - desiredGap);
  const ux = vx / dist, uy = vy / dist;

  const dx = ux * move;
  const dy = uy * move;

  const angle = Math.atan2(vy, vx) * 180 / Math.PI;
  girl.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.max(-8, Math.min(8, angle/18))}deg)`;

  // Wait for CSS transition (~280ms)
  return new Promise(resolve => setTimeout(resolve, 300));
}

function resetGirlPose(){
  girl.style.transform = '';
}

// ---------- HAMMER SWING (travels from her hand → boy center) ----------
function swingMalletTowardBoy(){
  const b = boy.getBoundingClientRect();
  const g = girl.getBoundingClientRect();
  const s = stage.getBoundingClientRect();

  const boyCX = (b.left - s.left) + b.width / 2;
  const boyCY = (b.top  - s.top ) + b.height / 2;

  // Recompute hand with girl’s translated pose
  const handX = (g.left - s.left) + g.width * 0.75;
  const handY = (g.top  - s.top ) + g.height * 0.30;

  const angle = Math.atan2(boyCY - handY, boyCX - handX) * 180 / Math.PI;

  // If your hammer art isn’t 64px square, change this
  const hammerHalf = 32;

  // Web Animations API: translate + rotate along path
  const keyframes = [
    { transform: `translate(${handX}px, ${handY}px) rotate(${angle - 60}deg)`, opacity: 1 },
    { transform: `translate(${boyCX - hammerHalf}px, ${boyCY - hammerHalf}px) rotate(${angle + 10}deg)`, opacity: 1 },
    { transform: `translate(${boyCX - hammerHalf}px, ${boyCY - hammerHalf}px) rotate(${angle}deg)`, opacity: 0 }
  ];
  mallet.animate(keyframes, { duration: 360, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'both' });
}

// ---------- MAIN ORCHESTRATION ----------
async function stressbuster(){
  if (busy) return;
  busy = true;
  btn.disabled = true;

  // 1) Pop boy somewhere new
  randomBoySpot();
  boy.classList.remove('bonked');
  boy.classList.add('pop');
  await new Promise(r => setTimeout(r, 360));

  // 2) Move girl near boy, then swing
  await placeGirlNearBoy();
  swingMalletTowardBoy();

  // 3) FX
  boy.classList.add('bonked');
  showQuote();
  confetti();
  vibrate();
  try{ bonk.currentTime = 0; await bonk.play(); }catch{}

  // 4) Cleanup
  setTimeout(()=>{
    boy.classList.remove('pop','bonked');
    resetGirlPose();
    busy = false;
    btn.disabled = false;
  }, 900);
}

// ---------- HOOKS ----------
btn.addEventListener('click', stressbuster);
window.addEventListener('resize', ()=>{/* layout is CSS-driven */});
