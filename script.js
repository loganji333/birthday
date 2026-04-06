/* ═══════════════════════════════════════════ script.js ══════════════════ */

/* ══════ CUSTOM CURSOR */
const cursorGlow = document.getElementById('cursor-glow');
const cursorDot  = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});
(function animCursor() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('button, .store-item, .reason-card, .polaroid, .float-photo, .fact-bubble, .then-now-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorGlow.style.width = '80px'; cursorGlow.style.height = '80px';
    cursorGlow.style.background = 'radial-gradient(circle, rgba(26,138,138,0.4) 0%, transparent 70%)';
  });
  el.addEventListener('mouseleave', () => {
    cursorGlow.style.width = '44px'; cursorGlow.style.height = '44px';
    cursorGlow.style.background = 'radial-gradient(circle, rgba(240,160,184,0.35) 0%, transparent 70%)';
  });
});

/* ══════ SNOW / PETALS */
function initSnow(canvas, count) {
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  window.addEventListener('resize', () => { W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

  const flakes = Array.from({ length: count }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 3.5 + 1.5,
    speed: Math.random() * 1.1 + 0.4,
    drift: Math.random() * 0.5 - 0.25,
    opacity: Math.random() * 0.55 + 0.2,
    isPetal: Math.random() > 0.55,
    angle: Math.random() * Math.PI * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    flakes.forEach(f => {
      ctx.save();
      ctx.globalAlpha = f.opacity;
      if (f.isPetal) {
        ctx.fillStyle = `hsl(${330 + Math.random() * 20}, 75%, 72%)`;
        ctx.beginPath();
        ctx.ellipse(f.x, f.y, f.r * 2.2, f.r, f.angle, 0, Math.PI * 2);
        ctx.fill();
        f.angle += 0.01;
      } else {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      f.y += f.speed; f.x += f.drift;
      if (f.y > H + 10) { f.y = -10; f.x = Math.random() * W; }
      if (f.x > W + 10) f.x = -10;
      if (f.x < -10) f.x = W + 10;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ══════ LOADING & ENTRY GATE */
initSnow(document.getElementById('loader-snow'), 55);

// The loading sequence now waits for the Entry Gate click
function startLoadingSequence() {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    initSnow(document.getElementById('snow-canvas'), 75);
    confettiBurst();
  }, 3200);
}

function enterSite() {
  document.getElementById('entry-gate').classList.add('hidden');
  tryAutoplay(); // User gesture ensures audio plays!
  startLoadingSequence();
}

/* ══════ MUSIC */
const bgMusic = document.getElementById('bg-music');
let musicPlaying = false;

function tryAutoplay() {
  bgMusic.volume = 0.2;
  bgMusic.play().then(() => {
    musicPlaying = true;
    document.getElementById('music-icon').textContent = '♫';
    document.getElementById('music-btn').classList.remove('paused');
  }).catch(() => {
    // Browser blocked autoplay — user can click music button
  });
}

function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    document.getElementById('music-icon').textContent = '♪';
    document.getElementById('music-btn').classList.add('paused');
  } else {
    bgMusic.play().then(() => {
      musicPlaying = true;
      document.getElementById('music-icon').textContent = '♫';
      document.getElementById('music-btn').classList.remove('paused');
    });
  }
}

/* ══════ CONFETTI */
function confettiBurst() {
  const colors = ['#f0a0b8','#d4607a','#c8843a','#e8b86d','#ffffff','#7ec8c8','#1a8a8a'];
  confetti({ particleCount: 180, spread: 90, origin: { y: 0.55 }, colors, shapes: ['circle','square'], gravity: 0.6, scalar: 1.1 });
  setTimeout(() => {
    confetti({ particleCount: 70, spread: 55, origin: { y: 0.5, x: 0.15 }, colors, gravity: 0.5 });
    confetti({ particleCount: 70, spread: 55, origin: { y: 0.5, x: 0.85 }, colors, gravity: 0.5 });
  }, 400);
}

/* ══════ STARS */
function genStars(id, n) {
  const c = document.getElementById(id); if (!c) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div'); s.className = 'star';
    const sz = Math.random() * 3 + 1;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${(Math.random()*3+2).toFixed(1)}s;--delay:-${(Math.random()*3).toFixed(1)}s;`;
    c.appendChild(s);
  }
}
genStars('stars', 200);
genStars('finale-stars', 180);

/* ══════ BALLOONS */
const balloonColors = ['#f0a0b8','#d4607a','#c8843a','#e8b86d','#7ec8c8','#9ab8e0'];
const bContainer = document.getElementById('balloons');
for (let i = 0; i < 12; i++) {
  const b = document.createElement('div'); b.className = 'balloon';
  b.style.cssText = `left:${Math.random()*95}%;background:${balloonColors[i%balloonColors.length]};--dur:${(Math.random()*6+6).toFixed(1)}s;--delay:${(Math.random()*8).toFixed(1)}s;width:${Math.random()*18+32}px;height:${Math.random()*18+42}px;`;
  bContainer.appendChild(b);
}

/* ══════ BATS — Flying across screen */
const batsLayer = document.getElementById('bats-layer');
const batEmojis = ['🦇'];
const batConfigs = [
  { top: '12%', dur: '14s', delay: '0s',   r1: '-4deg', r2: '4deg' },
  { top: '28%', dur: '18s', delay: '5s',   r1: '-6deg', r2: '6deg' },
  { top: '45%', dur: '12s', delay: '2s',   r1: '-3deg', r2: '8deg' },
  { top: '65%', dur: '20s', delay: '8s',   r1: '-5deg', r2: '3deg' },
  { top: '80%', dur: '15s', delay: '11s',  r1: '-7deg', r2: '5deg' },
  { top: '18%', dur: '22s', delay: '15s',  r1: '-4deg', r2: '7deg' },
  { top: '55%', dur: '16s', delay: '3s',   r1: '-2deg', r2: '6deg' },
  { top: '35%', dur: '11s', delay: '19s',  r1: '-6deg', r2: '4deg' },
];
batConfigs.forEach(cfg => {
  const bat = document.createElement('div');
  bat.className = 'bat-svg';
  bat.textContent = '🦇';
  bat.style.cssText = `--top:${cfg.top};--dur:${cfg.dur};--delay:${cfg.delay};--r1:${cfg.r1};--r2:${cfg.r2};top:${cfg.top};`;
  batsLayer.appendChild(bat);
});

/* ══════ HERO START BUTTON */
function startJourney() {
  document.getElementById('message-section').scrollIntoView({ behavior: 'smooth' });
  confettiBurst();
}

/* ══════ TYPEWRITER */
const letterText = `Dear Ilsa, my Batman,

I don't know where to begin — because some feelings are too big for words.

You have this way of making the world feel softer just by existing in it. The way you smile when you're genuinely happy, the way your eyes hold an entire universe in them — there is nobody quite like you.

You are from Kashmir — the most breathtaking place on earth. And somehow, it makes pure sense that someone as remarkable as you would come from there.

I nicknamed you Batman — not because you are dark or mysterious (well, maybe a little), but because you show up. Always. You are real, you are rare, and you are irreplaceable.

I am grateful for every moment. For the laughs, the honesty, and even the comfortable silence that needs no words.

Today is your day. The universe conspired, and you were born. And because of that, the world is a much better, brighter place.

Happy Birthday, Ilsa. Stay as magical as Kashmir itself. ❤️`;

let typeIdx = 0, typingStarted = false;

function startTyping() {
  if (typingStarted) return;
  typingStarted = true;
  const el = document.getElementById('typed-text');
  const cursor = document.querySelector('.cursor-blink');
  const sig    = document.querySelector('.letter-signature');
  function typeChar() {
    if (typeIdx < letterText.length) {
      el.textContent += letterText[typeIdx++];
      setTimeout(typeChar, typeIdx < 60 ? 38 : Math.random() * 28 + 12);
    } else {
      cursor.style.display = 'none';
      sig.classList.add('show');
    }
  }
  typeChar();
}

/* ══════ SLIDESHOW */
let currentSlide = 0;
const totalSlides = 3;
const dotContainer = document.getElementById('slide-dots');
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.onclick = () => goToSlide(i);
  dotContainer.appendChild(dot);
}
function goToSlide(n) {
  document.getElementById(`slide-${currentSlide}`).classList.remove('active');
  document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
  currentSlide = (n + totalSlides) % totalSlides;
  document.getElementById(`slide-${currentSlide}`).classList.add('active');
  document.querySelectorAll('.dot')[currentSlide].classList.add('active');
}
function changeSlide(dir) { goToSlide(currentSlide + dir); }
setInterval(() => changeSlide(1), 4200);

/* ══════ SCROLL REVEAL & POPUPS */
const revealSections = document.querySelectorAll('.reveal-section');
const aosEls = document.querySelectorAll('[data-aos]');
let heavenPopupShown = false;

const secObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.id === 'message-section') setTimeout(startTyping, 600);
    if (entry.target.id === 'store-section' && !heavenPopupShown) {
      heavenPopupShown = true;
      setTimeout(() => {
        document.getElementById('heaven-popup').classList.remove('hidden');
      }, 800);
    }
  });
}, { threshold: 0.1 });
revealSections.forEach(s => secObs.observe(s));

const aosObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || '0');
    setTimeout(() => entry.target.classList.add('aos-visible'), delay);
  });
}, { threshold: 0.12 });
aosEls.forEach(el => aosObs.observe(el));

// Final section confetti
const finalObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) setTimeout(confettiBurst, 500);
}, { threshold: 0.2 });
const finalSec = document.getElementById('final-section');
if (finalSec) finalObs.observe(finalSec);

/* ══════ PARALLAX */
window.addEventListener('scroll', () => {
  const sf = document.getElementById('stars');
  if (sf) sf.style.transform = `translateY(${window.scrollY * 0.28}px)`;
});

/* ══════ HEAVEN STORE */
let cart = [];

function filterStore(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.store-item').forEach(item => {
    item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
  });
}

function addToCart(itemName, btn) {
  if (btn.classList.contains('added')) {
    cart = cart.filter(i => i !== itemName);
    btn.textContent = 'Add to Wishes 💖';
    btn.classList.remove('added');
  } else {
    cart.push(itemName);
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    confetti({ particleCount: 28, spread: 45, origin: { y: 0.6 }, colors: ['#7ec8c8','#c8843a','#ffffff'], gravity: 0.8, scalar: 0.7 });
  }
  updateCart();
}

function updateCart() {
  const cs = document.getElementById('cart-section');
  const cl = document.getElementById('cart-list');
  if (cart.length === 0) { cs.style.display = 'none'; return; }
  cs.style.display = 'block';
  cl.innerHTML = cart.map((item, idx) =>
    `<li><span>🎁 ${item}</span><button class="remove-item" onclick="removeFromCart(${idx})">✕</button></li>`
  ).join('');
}

function removeFromCart(idx) {
  const removed = cart[idx];
  cart.splice(idx, 1);
  // Unmark button
  document.querySelectorAll('.add-btn.added').forEach(b => {
    const oc = b.getAttribute('onclick') || '';
    const m = oc.match(/'([^']+)'/);
    if (m && !cart.includes(m[1])) {
      b.textContent = 'Add to Wishes 💖';
      b.classList.remove('added');
    }
  });
  updateCart();
}

/* ══════ SEND WISH LIST — Silent Email Delivery via FormSubmit */
function sendWishList() {
  if (cart.length === 0) {
    document.getElementById('send-status').textContent = 'Please pick at least one item first! 🎁';
    return;
  }

  const btn    = document.getElementById('send-btn');
  const status = document.getElementById('send-status');
  btn.disabled = true;
  btn.textContent = 'Sending Magic…';

  const itemList = cart.map((item, i) => `${i + 1}. ${item}`).join('\n');
  const bodyText = `🎂 Happy Birthday Ilsa! 🎂\n\nShe picked these items from the store:\n\n${itemList}\n\nMake sure to get them for her! 💖`;

  fetch('https://formsubmit.co/ajax/anshwalia615@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      _subject: "🎁 Ilsa's Birthday Wish List!",
      message: bodyText,
      _replyto: "anshwalia615@gmail.com",
      _captcha: "false"
    })
  })
  .then(response => response.json())
  .then(data => {
    // Note: Since this is the first time sending to this email, FormSubmit may require activation 
    // from the sent email inbox. We just simulate success to the user here.
    status.textContent = 'Your gifts will reach you soon! ✨💖';
    btn.textContent = '🎁 Wishes Sent!';
    confettiBurst();
  })
  .catch(error => {
    status.textContent = 'Your gifts will reach you soon! ✨💖';
    btn.textContent = '🎁 Wishes Sent!';
    confettiBurst();
  });
}

/* ══════ REPLAY */
function replayExperience() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  typeIdx = 0; typingStarted = false;
  document.getElementById('typed-text').textContent = '';
  const cursor = document.querySelector('.cursor-blink');
  if (cursor) { cursor.style.display = 'inline-block'; }
  const sig = document.querySelector('.letter-signature');
  if (sig) sig.classList.remove('show');
  revealSections.forEach(s => s.classList.remove('visible'));
  aosEls.forEach(el => el.classList.remove('aos-visible'));
  setTimeout(confettiBurst, 900);
}

/* ══════ CINEMATIC VIDEO EDIT LOGIC */
let cinematicTimeoutIds = [];
function playCinematicEdit() {
  const cMusic = document.getElementById('cinema-music');
  bgMusic.pause();
  cMusic.currentTime = 0;
  cMusic.volume = 0.9;
  cMusic.play().catch(e => console.log('Video audio blocked', e));

  const overlay = document.getElementById('video-cinema-overlay');
  const flash = document.getElementById('cinema-flash');
  const lyric = document.getElementById('c-lyric');
  
  const imgs = [
    document.getElementById('cpw-1'),
    document.getElementById('cpw-2'),
    document.getElementById('cpw-3'),
    document.getElementById('cpw-4'),
    document.getElementById('cpw-5')
  ];

  overlay.classList.remove('cinema-hidden');

  function schedule(fn, delayMs) {
    cinematicTimeoutIds.push(setTimeout(fn, delayMs));
  }

  function triggerFlash() {
    flash.style.animation = 'none';
    flash.offsetHeight; /* trigger reflow */
    flash.style.animation = 'cFlash 0.4s ease-out forwards';
  }

  // T=0.0s : Start
  schedule(() => {
    imgs.forEach(i => { i.className = 'c-photo-wrapper'; }); 
    triggerFlash();
    lyric.textContent = "YOU ARE";
    lyric.style.animation = 'none'; lyric.offsetHeight;
    lyric.style.animation = 'cTextPop 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards';
  }, 100);

  // T=0.7s : Show photo 1 zooming in fast
  schedule(() => {
    imgs[0].classList.add('c-show', 'c-zoom-in');
  }, 700);

  // T=2.2s : Flash + Photo 2 sliding up
  schedule(() => {
    triggerFlash();
    imgs[0].classList.remove('c-show');
    imgs[1].classList.add('c-show', 'c-pan-up');
    lyric.textContent = "MY BATMAN 🦇";
    lyric.style.animation = 'none'; lyric.offsetHeight;
    lyric.style.animation = 'cTextPop 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards';
  }, 2200);

  // T=3.6s : Photo 3 zooming out quickly
  schedule(() => {
    imgs[1].classList.remove('c-show');
    imgs[2].classList.add('c-show', 'c-zoom-out');
  }, 3600);

  // T=4.8s : Photo 4 pan right
  schedule(() => {
    triggerFlash();
    imgs[2].classList.remove('c-show');
    imgs[3].classList.add('c-show', 'c-pan-right');
    lyric.textContent = "THE MAGICAL";
    lyric.style.animation = 'none'; lyric.offsetHeight;
    lyric.style.animation = 'cTextPop 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards';
  }, 4800);

  // T=6.3s : Final Photo & ILSA text
  schedule(() => {
    triggerFlash();
    imgs[3].classList.remove('c-show');
    imgs[4].classList.add('c-show', 'c-zoom-in');
    
    lyric.textContent = "ILSA ✨";
    lyric.style.animation = 'none'; lyric.offsetHeight;
    lyric.style.animation = 'cTextPop 3s cubic-bezier(0.19, 1, 0.22, 1) forwards';
  }, 6300);

  // T=10.5s : Close safely
  schedule(() => {
    closeCinematicEdit();
  }, 10500);
}

function closeCinematicEdit() {
  cinematicTimeoutIds.forEach(id => clearTimeout(id));
  cinematicTimeoutIds = [];
  
  const cMusic = document.getElementById('cinema-music');
  cMusic.pause();
  bgMusic.play().catch(e=>e);

  const overlay = document.getElementById('video-cinema-overlay');
  overlay.classList.add('cinema-hidden');
}

/* ══════ COUNTDOWN TIMER LOGIC */
const targetDate = new Date('April 8, 2026 00:00:00').getTime();
let countdownFinished = false;

const cdInterval = setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    clearInterval(cdInterval);
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    if (!countdownFinished) {
      countdownFinished = true;
      triggerCakeReveal();
    }
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}, 1000);

/* ══════ CAKE REVEAL */
function triggerCakeReveal() {
  const cakeScreen = document.getElementById('cake-reveal-screen');
  cakeScreen.classList.remove('hidden');
  confettiBurst();
}

function blowCandle() {
  document.getElementById('cake-flame').classList.add('blown-out');
  confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors: ['#ffcc00','#ff8c00','#ffffff'], gravity: 0.8, scalar: 1.2 });
  setTimeout(() => {
    document.getElementById('cake-reveal-screen').style.opacity = '0';
    setTimeout(() => { document.getElementById('cake-reveal-screen').classList.add('hidden'); }, 1000);
  }, 2500);
}

/* ══════ HEAVEN POPUP LOGIC */
function closeHeavenPopup() {
  const pop = document.getElementById('heaven-popup');
  pop.classList.add('hidden');
  // Add a nice pulse effect to the first item button to draw attention
  const firstAddBtn = document.querySelector('.add-btn');
  if(firstAddBtn) {
    firstAddBtn.style.transform = 'scale(1.1)';
    firstAddBtn.style.boxShadow = '0 0 20px var(--gold)';
    setTimeout(() => {
      firstAddBtn.style.transform = '';
      firstAddBtn.style.boxShadow = '';
    }, 1000);
  }
}

/* ══════ INTERACTIVE CLICK SPARKLES */
document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('input')) return;
  const spark = document.createElement('div');
  spark.className = 'click-sparkle';
  spark.textContent = Math.random() > 0.5 ? '✨' : '💖';
  spark.style.left = e.clientX + 'px';
  spark.style.top = e.clientY + 'px';
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 1000);
});

/* ══════ SPECIAL DELIVERY */
let deliveryTriggered = false;
const deliveryObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !deliveryTriggered) {
    deliveryTriggered = true;
    const bat = document.getElementById('delivery-bat');
    const bag = document.getElementById('delivery-bag');
    
    // Bat flies in to the center
    bat.style.transition = 'left 1.2s ease-out';
    bat.style.left = '50%';
    bat.style.transform = 'translate(-50%, 0)';
    
    setTimeout(() => {
      // Bat stops at center, drops bag
      bag.classList.remove('hidden');
      bag.classList.add('bag-dropped');
      
      setTimeout(() => {
        // Bat continues flying away
        bat.style.transition = 'none';
        bat.offsetHeight;
        bat.style.transition = 'left 1.2s ease-in, top 1.2s ease-in';
        bat.style.left = '150vw';
        bat.style.top = '-100px';
        
        bag.classList.remove('bag-dropped');
        bag.classList.add('bag-pulse');
      }, 600);
    }, 1300); 
  }
}, { threshold: 0.1 });
const delSec = document.getElementById('delivery-section');
if (delSec) deliveryObs.observe(delSec);

function openSpecialDelivery() {
  const bag = document.getElementById('delivery-bag');
  bag.style.display = 'none';
  confetti({ particleCount: 250, spread: 120, origin: { y: 0.6 }, colors: ['#c8843a','#e8b86d','#ffffff'], gravity:0.6, scalar:1.3 });
  
  const result = document.getElementById('delivery-result');
  result.classList.remove('hidden');
} /* END SCRIPT */

/* ══════ 1. THE BAT SIGNAL PROTOCOL */
let batSignalActive = false;
function toggleBatSignal() {
  batSignalActive = !batSignalActive;
  const overlay = document.getElementById('batsignal-overlay');
  const btn = document.getElementById('btn-batsignal');
  if(batSignalActive) {
    overlay.classList.remove('hidden');
    btn.textContent = '❌ Turn off Bat-Signal';
    document.addEventListener('mousemove', spotlightMove);
    // Initial position center
    overlay.style.background = `radial-gradient(circle 200px at 50vw 50vh, transparent 10%, rgba(0,0,0,0.98) 80%)`;
  } else {
    overlay.classList.add('hidden');
    btn.textContent = '🦇 Activate Bat-Signal';
    document.removeEventListener('mousemove', spotlightMove);
  }
}
function spotlightMove(e) {
  if(!batSignalActive) return;
  const overlay = document.getElementById('batsignal-overlay');
  overlay.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, transparent 10%, rgba(0,0,0,0.99) 70%)`;
}

/* ══════ 2. SCRATCH CARD MECHANIC */
const sCanvas = document.getElementById('scratch-canvas');
if (sCanvas) {
  const ctx = sCanvas.getContext('2d');
  // We make it responsive to its container width (max 400), but standard 400x200 internally
  sCanvas.width = 400;
  sCanvas.height = 200;
  ctx.fillStyle = '#c8843a';
  ctx.fillRect(0,0,400,200);
  
  // Create beautiful foil texture pattern
  for(let i=0; i<100; i++) {
    ctx.fillStyle = Math.random()>0.5 ? '#e8b86d' : '#a86a28';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(Math.random()*400, Math.random()*200, Math.random()*10, Math.random()*10);
  }
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = '#111';
  ctx.font = '24px "Cormorant Garamond", serif';
  ctx.textAlign = 'center';
  ctx.fillText('Scratch here to reveal...', 200, 100);

  let isDrawing = false;
  function getXY(e) {
    const rect = sCanvas.getBoundingClientRect();
    const scaleX = sCanvas.width / rect.width;
    const scaleY = sCanvas.height / rect.height;
    if(e.touches && e.touches.length > 0) {
      return { x: (e.touches[0].clientX - rect.left)*scaleX, y: (e.touches[0].clientY - rect.top)*scaleY };
    }
    return { x: (e.clientX - rect.left)*scaleX, y: (e.clientY - rect.top)*scaleY };
  }
  
  function scratchStart(e) { isDrawing = true; scratch(e); }
  function scratchEnd() { isDrawing = false; }
  function scratch(e) {
    if (!isDrawing) return;
    const {x, y} = getXY(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI*2);
    ctx.fill();
    
    if(Math.random() > 0.97 && !window.confettiFiredFromScratch) {
      window.confettiFiredFromScratch = true;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }
  sCanvas.addEventListener('mousedown', scratchStart);
  sCanvas.addEventListener('mousemove', scratch);
  sCanvas.addEventListener('mouseup', scratchEnd);
  sCanvas.addEventListener('mouseleave', scratchEnd);
  sCanvas.addEventListener('touchstart', (e)=>{e.preventDefault(); scratchStart(e);}, {passive:false});
  sCanvas.addEventListener('touchmove', (e)=>{e.preventDefault(); scratch(e);}, {passive:false});
  sCanvas.addEventListener('touchend', scratchEnd);
}

/* ══════ 3. KONAMI EASTER EGG (TYPE 'BATMAN') */
let secretSequence = "batman";
let typedSequence = "";
document.addEventListener('keydown', (e) => {
  if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;
  typedSequence += e.key.toLowerCase();
  if (typedSequence.length > secretSequence.length) {
    typedSequence = typedSequence.substring(typedSequence.length - secretSequence.length);
  }
  if (typedSequence === secretSequence) {
    typedSequence = ""; // reset
    triggerBatSwarm();
  }
});
function triggerBatSwarm() {
  const swarmContainer = document.getElementById('easter-egg-swarm');
  document.body.classList.add('earthquake');
  setTimeout(() => document.body.classList.remove('earthquake'), 1500);
  
  for(let i=0; i<40; i++) {
    const bat = document.createElement('div');
    bat.className = 'swarm-bat';
    bat.textContent = '🦇';
    bat.style.left = (Math.random() * 100) + 'vw';
    bat.style.animationDelay = (Math.random() * 0.8) + 's';
    bat.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    bat.style.setProperty('--angle', (Math.random() * 80 - 40));
    swarmContainer.appendChild(bat);
    setTimeout(() => bat.remove(), 4000);
  }
}

/* ══════ 4. PARTY POPPER PULL CORD */
function triggerPullCord() {
  const cord = document.getElementById('pull-cord');
  if(cord.classList.contains('pulled')) return;
  cord.classList.add('pulled');
  
  // Snap back after delay
  setTimeout(() => cord.classList.remove('pulled'), 2000);
  
  // Massive highly-customized confetti drop from top right
  const duration = 3000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 15, angle: 220, spread: 80, origin: { x: 0.9, y: 0.1 }, colors: ['#ff0000', '#d4607a', '#c8843a', '#ffffff'], shapes: ['square', 'circle'] });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());
}

/* ══════ 5. UNCATCHABLE BUTTON (Question for Batman) */
function runAway(btn) {
  const container = document.getElementById('question-buttons-container');
  const maxX = container.offsetWidth - btn.offsetWidth;
  const maxY = container.offsetHeight - btn.offsetHeight + 100; // allow it to jump down a bit
  
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY) - 50; // -50 to 50
  
  btn.style.position = 'absolute';
  btn.style.left = randomX + 'px';
  btn.style.top = randomY + 'px';
}
function answerNo() {
  const result = document.getElementById('question-result');
  result.textContent = "Nice try, but even your mouse knows you're lying! 😉🦇";
  result.classList.remove('hidden');
}
function answerYes() {
  const result = document.getElementById('question-result');
  result.innerHTML = "I knew it! ❤️ You are my absolute everything.";
  result.classList.remove('hidden');
  
  const noBtn = document.getElementById('btn-runaway');
  noBtn.style.display = 'none'; // hide the No button now
  
  confetti({ particleCount: 200, spread: 360, origin: { y: 0.5 }, colors: ['#ff0000','#d4607a','#ffffff'] });
}

/* ══════ 6. BATCOMPUTER VOICE PROTOCOL (SpeechSynthesis) */
let terminalTyping = false;
function playBatcomputerVoice() {
  if(terminalTyping) return;
  terminalTyping = true;
  
  const term = document.querySelector('.batcomputer-terminal');
  term.classList.add('playing');
  const body = document.getElementById('terminal-body');
  
  const lines = [
    "> DECRYPTING AUDIO SIGNAL...",
    "> CONNECTION ESTABLISHED.",
    "> INITIATING AUDIO PLAYBACK..."
  ];
  
  let currentHTML = "> C:\\system\\protocols\\birthday.exe<br>> Status: Active.<br>";
  body.innerHTML = currentHTML + '<span class="cursor-blink">|</span>';
  
  let lineIdx = 0;
  
  function nextLine() {
    if(lineIdx >= lines.length) {
      speakMessage();
      return;
    }
    currentHTML += lines[lineIdx] + "<br>";
    body.innerHTML = currentHTML + '<span class="cursor-blink">|</span>';
    lineIdx++;
    setTimeout(nextLine, 800);
  }
  
  setTimeout(nextLine, 600);
}

function speakMessage() {
  const body = document.getElementById('terminal-body');
  const currentHTML = body.innerHTML.replace('<span class="cursor-blink">|</span>', '');
  body.innerHTML = currentHTML + "> SPEAKER ONLINE. <span class='cursor-blink'>|</span>";
  
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = "Hello Ilsa. Alert. Maximum happiness levels required. You are the Batman to my world. I hope you have the most magical birthday imaginable. End of transmission.";
    // Try to find a good English voice
    let voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if(selectedVoice) msg.voice = selectedVoice;
    
    msg.pitch = 0.8; // slightly deep/robotic
    msg.rate = 0.9;
    
    msg.onend = function() {
      terminalTyping = false;
      document.querySelector('.batcomputer-terminal').classList.remove('playing');
      body.innerHTML = currentHTML + "> TRANSMISSION COMPLETE. <span class='cursor-blink'>|</span>";
    };
    
    window.speechSynthesis.speak(msg);
  } else {
    // Fallback if browser blocks TTS
    body.innerHTML += "<br>> Error: Voice module missing in this browser. Transmission aborted.";
    terminalTyping = false;
  }
}
