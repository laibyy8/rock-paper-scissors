/* =====================================================
   Rock Paper Scissors — app.js
   SVG hand illustrations are embedded directly so the
   game works by simply opening index.html in a browser
   (no server / image files required).
   ===================================================== */

// ── SVG hand illustrations ──────────────────────────

const SVG = {

  rock: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <!-- blue background -->
    <circle cx="50" cy="50" r="48" fill="#4a90d9"/>
    <!-- white hand outline / palm -->
    <rect x="28" y="52" width="44" height="28" rx="10" fill="#ffffff"/>
    <!-- index finger -->
    <rect x="31" y="30" width="13" height="28" rx="6.5" fill="#ffffff" stroke="#dce8f5" stroke-width="1.2"/>
    <!-- middle finger -->
    <rect x="44" y="26" width="13" height="32" rx="6.5" fill="#ffffff" stroke="#dce8f5" stroke-width="1.2"/>
    <!-- ring finger -->
    <rect x="57" y="30" width="13" height="28" rx="6.5" fill="#ffffff" stroke="#dce8f5" stroke-width="1.2"/>
    <!-- pinky -->
    <rect x="68" y="38" width="10" height="20" rx="5" fill="#ffffff" stroke="#dce8f5" stroke-width="1.2"/>
    <!-- thumb -->
    <rect x="18" y="44" width="13" height="20" rx="6.5" fill="#ffffff" stroke="#dce8f5" stroke-width="1.2"/>
    <!-- knuckle lines -->
    <line x1="37" y1="54" x2="37" y2="58" stroke="#c8ddf0" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="50" y1="54" x2="50" y2="58" stroke="#c8ddf0" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="63" y1="54" x2="63" y2="58" stroke="#c8ddf0" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  paper: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <!-- purple background -->
    <circle cx="50" cy="50" r="48" fill="#b47fd4"/>
    <!-- palm -->
    <rect x="27" y="58" width="46" height="26" rx="10" fill="#ffffff"/>
    <!-- pinky -->
    <rect x="22" y="30" width="11" height="34" rx="5.5" fill="#ffffff" stroke="#e8d5f5" stroke-width="1.2"/>
    <!-- ring finger -->
    <rect x="34" y="24" width="13" height="40" rx="6.5" fill="#ffffff" stroke="#e8d5f5" stroke-width="1.2"/>
    <!-- middle finger -->
    <rect x="48" y="22" width="13" height="42" rx="6.5" fill="#ffffff" stroke="#e8d5f5" stroke-width="1.2"/>
    <!-- index finger -->
    <rect x="62" y="26" width="13" height="38" rx="6.5" fill="#ffffff" stroke="#e8d5f5" stroke-width="1.2"/>
    <!-- thumb -->
    <rect x="71" y="48" width="11" height="20" rx="5.5" fill="#ffffff" stroke="#e8d5f5" stroke-width="1.2"/>
    <!-- knuckle lines -->
    <line x1="27" y1="60" x2="27" y2="65" stroke="#dbbfee" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="40" y1="60" x2="40" y2="65" stroke="#dbbfee" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="54" y1="60" x2="54" y2="65" stroke="#dbbfee" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="68" y1="60" x2="68" y2="65" stroke="#dbbfee" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  scissors: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <!-- violet background -->
    <circle cx="50" cy="50" r="48" fill="#7c5cbf"/>
    <!-- palm -->
    <rect x="27" y="58" width="46" height="26" rx="10" fill="#ffffff"/>
    <!-- index finger (raised) -->
    <rect x="34" y="22" width="13" height="42" rx="6.5" fill="#ffffff" stroke="#e0d4f5" stroke-width="1.2"/>
    <!-- middle finger (raised) -->
    <rect x="49" y="22" width="13" height="42" rx="6.5" fill="#ffffff" stroke="#e0d4f5" stroke-width="1.2"/>
    <!-- ring finger (folded, short) -->
    <rect x="62" y="46" width="11" height="18" rx="5.5" fill="#ffffff" stroke="#e0d4f5" stroke-width="1.2"/>
    <!-- pinky (folded) -->
    <rect x="22" y="46" width="11" height="18" rx="5.5" fill="#ffffff" stroke="#e0d4f5" stroke-width="1.2"/>
    <!-- thumb -->
    <rect x="70" y="52" width="11" height="16" rx="5.5" fill="#ffffff" stroke="#e0d4f5" stroke-width="1.2"/>
    <!-- gap between scissors fingers -->
    <rect x="46" y="42" width="6" height="8" rx="2" fill="#7c5cbf"/>
    <!-- knuckle lines -->
    <line x1="40" y1="60" x2="40" y2="65" stroke="#c8b8e8" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="55" y1="60" x2="55" y2="65" stroke="#c8b8e8" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`

};

// ── Game state ───────────────────────────────────────

let userScore = 0;
let compScore = 0;
let round     = 1;

const wins = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock'
};

// ── DOM references ────────────────────────────────────

const userScoreEl = document.getElementById('user-score');
const compScoreEl = document.getElementById('comp-score');
const msgEl       = document.getElementById('msg');
const userPickEl  = document.getElementById('user-pick');
const compPickEl  = document.getElementById('comp-pick');
const roundLabel  = document.getElementById('round-label');

// ── Inject SVGs into choice buttons ──────────────────

document.getElementById('btn-rock').innerHTML     = SVG.rock;
document.getElementById('btn-paper').innerHTML    = SVG.paper;
document.getElementById('btn-scissors').innerHTML = SVG.scissors;

// ── Helper functions ──────────────────────────────────

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function bumpScore(el) {
  el.classList.remove('bump');
  void el.offsetWidth;           // force reflow to restart animation
  el.classList.add('bump');
}

function setMsg(text, type) {
  msgEl.className = '';
  msgEl.textContent = text;
  void msgEl.offsetWidth;
  msgEl.classList.add(type, 'pop');
}

function showPick(el, choice, result) {
  el.innerHTML   = SVG[choice];
  el.style.opacity = '1';
  el.style.filter  = 'none';
  el.className   = 'battle-img';
  void el.offsetWidth;
  if (result === 'win')       el.classList.add('win-glow');
  else if (result === 'lose') el.classList.add('lose-glow');
  else                        el.classList.add('draw-glow');
}

// ── Main play function ────────────────────────────────

function play(userChoice) {

  // Button click animation
  const btn = document.querySelector(`[data-choice="${userChoice}"]`);
  btn.classList.remove('clicked');
  void btn.offsetWidth;
  btn.classList.add('clicked');

  // Show "thinking" state
  msgEl.className = '';
  msgEl.innerHTML = '<span class="thinking-dots"><span>•</span><span>•</span><span>•</span></span>';

  // Show user's pick immediately
  userPickEl.innerHTML     = SVG[userChoice];
  userPickEl.style.opacity = '1';
  userPickEl.style.filter  = 'none';
  userPickEl.className     = 'battle-img';

  // Hide CPU pick while "thinking"
  compPickEl.innerHTML     = '';
  compPickEl.style.opacity = '0.2';
  compPickEl.style.filter  = 'grayscale(1) brightness(1.1)';
  compPickEl.className     = 'battle-img';

  // Reveal CPU choice after delay
  setTimeout(() => {

    const options   = ['rock', 'paper', 'scissors'];
    const compChoice = options[Math.floor(Math.random() * 3)];

    if (userChoice === compChoice) {

      showPick(userPickEl, userChoice, 'draw');
      showPick(compPickEl, compChoice, 'draw');
      setMsg(`Draw! Both picked ${cap(userChoice)}.`, 'draw');

    } else if (wins[userChoice] === compChoice) {

      userScore++;
      userScoreEl.textContent = userScore;
      bumpScore(userScoreEl);
      showPick(userPickEl, userChoice, 'win');
      showPick(compPickEl, compChoice, 'lose');
      setMsg(`You win! ${cap(userChoice)} beats ${cap(compChoice)}.`, 'win');

    } else {

      compScore++;
      compScoreEl.textContent = compScore;
      bumpScore(compScoreEl);
      showPick(userPickEl, userChoice, 'lose');
      showPick(compPickEl, compChoice, 'win');
      setMsg(`You lose! ${cap(compChoice)} beats your ${cap(userChoice)}.`, 'lose');

    }

    round++;
    roundLabel.textContent = `Round ${round}`;

  }, 650);
}

// ── Reset ─────────────────────────────────────────────

function resetGame() {

  userScore = 0;
  compScore = 0;
  round     = 1;

  userScoreEl.textContent = '0';
  compScoreEl.textContent = '0';
  roundLabel.textContent  = 'Round 1';

  msgEl.className   = '';
  msgEl.textContent = 'Choose your move to start!';

  [userPickEl, compPickEl].forEach(el => {
    el.innerHTML     = '';
    el.style.opacity = '0.2';
    el.style.filter  = 'grayscale(1) brightness(1.1)';
    el.className     = 'battle-img';
  });
}

// ── Event listeners ───────────────────────────────────

document.querySelectorAll('.choice-btn').forEach(btn => {
  btn.addEventListener('click', () => play(btn.dataset.choice));
});
