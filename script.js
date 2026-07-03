const birthdayMonth = 6; // July, because JavaScript starts months at 0.
const birthdayDay = 19;

const daysEl = document.querySelector('#days');
const hoursEl = document.querySelector('#hours');
const minutesEl = document.querySelector('#minutes');
const secondsEl = document.querySelector('#seconds');
const noteEl = document.querySelector('#countdown-note');
const partyButton = document.querySelector('#party-button');
const finaleButton = document.querySelector('#finale-button');
const letterPopButton = document.querySelector('#letter-pop');
const letterEnvelope = document.querySelector('.letter-envelope');
const wishScreen = document.querySelector('#wish-screen');
const doodleField = document.querySelector('#doodle-field');
const cursorLight = document.querySelector('#cursor-light');
const sky = document.querySelector('#sky');
const ctx = sky.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let stars = [];
let meteors = [];
let doodleTimer;

function nextBirthdayDate() {
  const now = new Date();
  let target = new Date(now.getFullYear(), birthdayMonth, birthdayDay, 0, 0, 0);
  const birthdayEnds = new Date(now.getFullYear(), birthdayMonth, birthdayDay, 23, 59, 59);

  if (now > birthdayEnds) {
    target = new Date(now.getFullYear() + 1, birthdayMonth, birthdayDay, 0, 0, 0);
  }

  return target;
}

function updateCountdown() {
  const now = new Date();
  const isBirthday = now.getMonth() === birthdayMonth && now.getDate() === birthdayDay;

  if (isBirthday) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    noteEl.textContent = "It's Aya's birthday today. Happy July 19!";
    document.title = 'Happy Birthday Aya 🍀✨';
    return;
  }

  const diff = Math.max(nextBirthdayDate() - now, 0);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000) % 24;
  const minutes = Math.floor(diff / 60_000) % 60;
  const seconds = Math.floor(diff / 1_000) % 60;

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
  noteEl.textContent = 'Counting down to July 19.';
}

function resizeSky() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  sky.width = Math.floor(window.innerWidth * ratio);
  sky.height = Math.floor(window.innerHeight * ratio);
  sky.style.width = `${window.innerWidth}px`;
  sky.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const starCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 9000));
  stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4,
    alpha: Math.random() * 0.5 + 0.22,
    speed: Math.random() * 0.18 + 0.03,
    phase: Math.random() * Math.PI * 2,
  }));
}

function addMeteor(amount = 1) {
  for (let i = 0; i < amount; i += 1) {
    meteors.push({
      x: Math.random() * window.innerWidth * 0.85,
      y: Math.random() * window.innerHeight * 0.4,
      length: 80 + Math.random() * 150,
      life: 1,
      speed: 8 + Math.random() * 8,
    });
  }
}

function drawSky() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const star of stars) {
    star.y += star.speed;
    star.phase += 0.025;
    if (star.y > window.innerHeight + 5) {
      star.y = -5;
      star.x = Math.random() * window.innerWidth;
    }

    const alpha = Math.max(0.1, star.alpha + Math.sin(star.phase) * 0.16);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(39, 91, 48, ${alpha})`;
    ctx.fill();
  }

  meteors.forEach((meteor, index) => {
    ctx.beginPath();
    ctx.moveTo(meteor.x, meteor.y);
    ctx.lineTo(meteor.x - meteor.length, meteor.y + meteor.length * 0.42);
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(215, 168, 63, ${meteor.life})`;
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(255, 228, 159, 0.95)';
    ctx.stroke();
    ctx.shadowBlur = 0;

    meteor.x += meteor.speed;
    meteor.y -= meteor.speed * 0.42;
    meteor.life -= 0.018;

    if (meteor.life <= 0) meteors.splice(index, 1);
  });

  if (!reduceMotion) requestAnimationFrame(drawSky);
}

function buildDoodleField() {
  if (!doodleField) return;

  doodleField.innerHTML = '';
  const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight);
  const pageWidth = window.innerWidth;
  const doodleCount = Math.min(75, Math.max(36, Math.floor(pageHeight / 150)));
  const files = Array.from({ length: 31 }, (_, i) => `assets/doodle-${String(i + 1).padStart(2, '0')}.png`);

  doodleField.style.height = `${pageHeight}px`;

  for (let i = 0; i < doodleCount; i += 1) {
    const image = document.createElement('img');
    const size = 42 + Math.random() * (pageWidth < 700 ? 74 : 150);
    image.className = 'floating-doodle';
    image.src = files[Math.floor(Math.random() * files.length)];
    image.alt = '';
    image.loading = 'lazy';
    image.style.width = `${size}px`;
    image.style.left = `${Math.random() * 96}%`;
    image.style.top = `${50 + Math.random() * Math.max(1, pageHeight - 100)}px`;
    image.style.setProperty('--rot', `${-28 + Math.random() * 56}deg`);
    image.style.setProperty('--scale', `${0.82 + Math.random() * 0.44}`);
    image.style.setProperty('--opacity', `${0.16 + Math.random() * 0.28}`);
    image.style.setProperty('--speed', `${7 + Math.random() * 8}s`);
    image.style.animationDelay = `${Math.random() * -8}s`;
    doodleField.appendChild(image);
  }
}

function scheduleDoodles() {
  window.clearTimeout(doodleTimer);
  doodleTimer = window.setTimeout(buildDoodleField, 180);
}

function confetti(amount = 110) {
  const colors = ['#ffffff', '#d9ffc9', '#fff2bb', '#ffd7ef', '#ded6f4', '#9ee989', '#d7a83f'];
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--fall-time', `${2.7 + Math.random() * 2.2}s`);
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 5600);
  }
}

function burst(x = window.innerWidth / 2, y = window.innerHeight / 2, amount = 44) {
  for (let i = 0; i < amount; i += 1) {
    const spark = document.createElement('span');
    const angle = (Math.PI * 2 * i) / amount;
    const distance = 70 + Math.random() * 180;
    spark.className = 'burst';
    spark.style.setProperty('--x0', `${x}px`);
    spark.style.setProperty('--y0', `${y}px`);
    spark.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
    document.body.appendChild(spark);
    window.setTimeout(() => spark.remove(), 1300);
  }
}

function emojiRain(emoji, amount = 50) {
  for (let i = 0; i < amount; i += 1) {
    const drop = document.createElement('span');
    drop.className = 'rain-piece';
    drop.textContent = emoji;
    drop.style.setProperty('--left', `${Math.random() * 100}vw`);
    drop.style.setProperty('--size', `${20 + Math.random() * 30}px`);
    drop.style.setProperty('--duration', `${2.6 + Math.random() * 2.3}s`);
    drop.style.animationDelay = `${Math.random() * 0.65}s`;
    document.body.appendChild(drop);
    window.setTimeout(() => drop.remove(), 5600);
  }
}

function party(event) {
  const x = event?.clientX || window.innerWidth / 2;
  const y = event?.clientY || window.innerHeight / 2;
  confetti(160);
  burst(x, y, 58);
  emojiRain('🍀', 26);
  addMeteor(5);
}

function handleEffect(effect) {
  if (effect === 'clovers') emojiRain('🍀', 70);
  if (effect === 'cats') emojiRain('🐱', 44);
  if (effect === 'stars') burst(window.innerWidth / 2, window.innerHeight / 2, 72);
  if (effect === 'gym') {
    emojiRain('💪', 38);
    confetti(90);
  }
  addMeteor(2);
}

function setupInteractions() {
  partyButton?.addEventListener('click', party);
  finaleButton?.addEventListener('click', (event) => {
    party(event);
    emojiRain('✨', 44);
    emojiRain('🐱', 28);
  });

  letterPopButton?.addEventListener('click', (event) => {
    letterEnvelope?.classList.add('sparkle');
    burst(event.clientX, event.clientY, 52);
    confetti(70);
    window.setTimeout(() => letterEnvelope?.classList.remove('sparkle'), 1000);
  });

  document.querySelectorAll('.wish-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      wishScreen.textContent = button.dataset.wish;
      wishScreen.classList.remove('flash');
      void wishScreen.offsetWidth;
      wishScreen.classList.add('flash');
      burst(event.clientX, event.clientY, 34);
      confetti(34);
    });
  });

  document.querySelectorAll('[data-effect]').forEach((button) => {
    button.addEventListener('click', () => handleEffect(button.dataset.effect));
  });

  window.addEventListener('mousemove', (event) => {
    if (!cursorLight || window.innerWidth < 700) return;
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
  });
}

resizeSky();
buildDoodleField();
updateCountdown();
setupInteractions();

if (!reduceMotion) {
  drawSky();
  window.setInterval(() => addMeteor(1), 3800);
}

window.setInterval(updateCountdown, 1000);
window.addEventListener('resize', () => {
  resizeSky();
  scheduleDoodles();
});
window.addEventListener('load', scheduleDoodles);
