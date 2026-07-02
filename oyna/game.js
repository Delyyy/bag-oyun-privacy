// Bağ — Connections mekaniği + seviye ilerleme
// Bağımlılık: puzzles.js (LEVELS, TIERS, getLevel, getTierInfo, TOTAL_LEVELS)

// === TEST MODU ===
// true: sınırsız hak, ileri/geri seviye butonları
// Yayına çıkarken false yap.
const TEST_MODE = false;

const STORAGE = {
  currentLevel: "bag.currentLevel",
  completed: "bag.completed",
  totalStars: "bag.totalStars",
  hints: "bag.hints",
  flawlessCount: "bag.flawlessCount",
  attemptedLevels: "bag.attemptedLevels",
  lastLoginDate: "bag.lastLoginDate",
  dailyLoginStreak: "bag.dailyLoginStreak",
  soundOff: "bag.soundOff",
  hapticOff: "bag.hapticOff"
};


// Sürümler arası taşınmayan (yeni sürümde sıfırlanan) kayıtlar:
const STORAGE_PROGRESS_KEYS = ["bag.currentLevel", "bag.completed", "bag.totalStars"];
// İpucu bakiyesi sürüm değiştiğinde KAYBOLMAZ (oyuncu hakkını korur)

const APP_VERSION = "bag-v35-settings";

// Test modunda bol, prodüksiyonda 3 ipucu ile başla
const STARTING_HINTS = TEST_MODE ? 99 : 3;
const MAX_HINTS = 99;
const AD_DURATION_SEC = 5;            // Reklam süresi (gerçek SDK'ya bağlanınca değişir)
let levelsSinceLastAd = 0;
const FLAWLESS_THRESHOLD = 10;        // Hatasız bitirilen bu kadar level = +1 ipucu
const RESTART_MISTAKES = 3;           // Bu kadar hata = bölüm yeniden başlar

// İlk production launch sürümünden itibaren (bu sayıdan itibaren oyuncu ilerlemesi korunur)
const LAUNCH_VERSION_NUM = 20;

function getVersionNum(v) {
  if (!v) return 0;
  const m = String(v).match(/v(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function migrateStorage() {
  const saved = localStorage.getItem("bag.appVersion");
  if (saved === APP_VERSION) return;  // Aynı sürüm, dokunma

  const savedNum = getVersionNum(saved);
  if (savedNum < LAUNCH_VERSION_NUM) {
    // Eski/test sürümünden veya temiz cihazdan geliyor → tüm bag.* anahtarlarını sil
    // (Cihazda test'ten kalma kirli state'i de temizler)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("bag.")) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
  // Aksi halde (launch sonrası bir sürümden launch sonrası başka bir sürüme):
  // Oyuncu ilerlemesi/ipucu/sayaçlar KORUNUR, sadece sürüm işareti güncellenir.
  localStorage.setItem("bag.appVersion", APP_VERSION);
}

// === İpucu bakiyesi ===
function getHints() {
  if (TEST_MODE) return 99;
  const saved = localStorage.getItem(STORAGE.hints);
  if (saved === null) {
    localStorage.setItem(STORAGE.hints, String(STARTING_HINTS));
    return STARTING_HINTS;
  }
  return parseInt(saved, 10) || 0;
}

function setHints(n) {
  if (TEST_MODE) return;
  const clamped = Math.max(0, Math.min(MAX_HINTS, n));
  localStorage.setItem(STORAGE.hints, String(clamped));
  updateHintButton();
}

function addHints(delta) {
  setHints(getHints() + delta);
}

function updateHintButton() {
  const btn = document.getElementById("hint-btn");
  if (!btn) return;
  const n = getHints();
  if (n > 0) {
    btn.innerHTML = `💡 İpucu <span class="hint-count">${n}</span>`;
    btn.classList.remove("ad-mode");
  } else {
    btn.innerHTML = `▶ İpucu Kazan`;
    btn.classList.add("ad-mode");
  }
}

// === Hatasız tur sayacı — Hint kazanma yolu ===
// Mantık: bir leveli hatasız (0 hata, 0 ipucu) bitirirsen +1.
// Ama her level için tek deneme şansı: hata yaptığın level bir daha sayılmaz.
function getFlawlessCount() {
  return parseInt(localStorage.getItem(STORAGE.flawlessCount) || "0", 10);
}

function setFlawlessCount(n) {
  localStorage.setItem(STORAGE.flawlessCount, String(Math.max(0, n)));
  renderFlawlessBar();
}

function getAttemptedLevels() {
  try { return JSON.parse(localStorage.getItem(STORAGE.attemptedLevels) || "[]"); }
  catch { return []; }
}

function isFirstAttempt(levelId) {
  return !getAttemptedLevels().includes(levelId);
}

function markAttempted(levelId) {
  const list = getAttemptedLevels();
  if (!list.includes(levelId)) {
    list.push(levelId);
    localStorage.setItem(STORAGE.attemptedLevels, JSON.stringify(list));
  }
}

function awardFlawlessIfEligible() {
  // Sadece ilk deneme + hata yok + ipucu kullanılmamış ise sayılır
  if (!state.won) return false;
  if (state.mistakes !== 0) return false;
  if (state.hintsUsed !== 0) return false;
  if (!isFirstAttempt(state.level.id)) return false;

  state.justEarnedFlawless = true;
  const next = getFlawlessCount() + 1;
  state.flawlessProgressAfter = next >= FLAWLESS_THRESHOLD ? FLAWLESS_THRESHOLD : next;
  if (next >= FLAWLESS_THRESHOLD) {
    setFlawlessCount(0);
    addHints(1);
    showFlawlessReward();
  } else {
    setFlawlessCount(next);
  }
  return true;
}

function renderFlawlessBar() {
  const fill = document.getElementById("streak-fill");
  const text = document.getElementById("streak-text");
  const pill = document.getElementById("streak-pill");
  if (!fill || !text || !pill) return;
  const cur = getFlawlessCount();
  const pct = Math.min(100, (cur / FLAWLESS_THRESHOLD) * 100);
  fill.style.width = pct + "%";
  text.textContent = `${cur}/${FLAWLESS_THRESHOLD}`;
  pill.classList.toggle("hot", cur >= FLAWLESS_THRESHOLD - 3);
}

function showFlawlessReward() {
  // Sadece pill üzerinde küçük burst animasyonu — büyük kutlama milestone modalında
  const pill = document.getElementById("streak-pill");
  if (pill) {
    pill.classList.add("burst");
    setTimeout(() => pill.classList.remove("burst"), 1200);
  }
}

// === MILESTONE MODAL (10 hatasız tamamlanınca) ===
function showMilestoneModal(stars) {
  const overlay = document.getElementById("milestone-overlay");
  if (!overlay) {
    // Fallback — modalı bulamadıysak doğrudan result modal'a geç
    showResult(stars);
    return;
  }
  overlay.classList.add("active");

  // Extra şenlik — daha çok confetti + win sesi
  triggerConfetti(160);
  setTimeout(() => triggerConfetti(80), 600);
  soundWin();
  hapticWin();

  // Devam Et butonu → milestone kapat, result modal aç
  const cont = document.getElementById("milestone-continue");
  if (cont) {
    cont.onclick = () => {
      soundClick();
      hapticTap();
      overlay.classList.remove("active");
      setTimeout(() => showResult(stars), 350);
    };
  }
}

const DIFF_ORDER = ["easy", "medium", "hard", "tricky"];
const DIFF_EMOJI = { easy: "🟡", medium: "🟢", hard: "🔵", tricky: "🟣" };

// Veride aynı seviyedeki kelime çakışmalarını önlemek için bazı kelimelere
// "_2", "_BAĞI" gibi sonek konuldu. Ekranda temiz görünmesi için strip et.
function displayWord(w) {
  return String(w)
    .replace(/_\d+$/, "")
    .replace(/_/g, " ");
}

function displayCategory(c) {
  return String(c)
    .replace(/\s*\(\d+\)\s*$/, "")  // "GİYSİ (2)" → "GİYSİ"
    .replace(/\s+\d+\s*$/, "");      // "GİYSİ 2" → "GİYSİ"
}

const WORD_REVEAL_COST = 10;

let state = {
  level: null,
  tierInfo: null,
  selected: [],
  solved: [],
  mistakes: 0,
  maxMistakes: 4,
  guessHistory: [],
  hintsUsed: 0,
  hintedCategories: new Set(),
  revealedWords: {},
  finished: false,
  won: false,
};


// === Başlat ===
function init() {
  migrateStorage();
  applyReducedMotion();
  let n = 1;
  if (!TEST_MODE) {
    n = parseInt(localStorage.getItem(STORAGE.currentLevel) || "1", 10);
    n = Math.min(Math.max(n, 1), TOTAL_LEVELS);
  }
  loadLevel(n);
  showHomeScreen();
}

// === Ana ekran (start/home screen) ===
function showHomeScreen() {
  const home = document.getElementById("home-screen");
  if (!home) return;
  home.classList.remove("exiting");
  home.classList.add("active");
  renderHomeStats();
  // Oyna butonunun yazısını güncelle (yeni mi devam mı)
  const playText = document.getElementById("home-play-text");
  if (playText) {
    const hasProgress = !!localStorage.getItem(STORAGE.currentLevel);
    const isFirstTime = !localStorage.getItem("bag.hasSeenIntro");
    playText.textContent = isFirstTime ? "▶ Başla" : (hasProgress ? "▶ Devam Et" : "▶ Oyna");
  }
}

function hideHomeScreen() {
  const home = document.getElementById("home-screen");
  if (!home) return;
  if (!home.classList.contains("active")) return;  // zaten gizli, dokunma
  home.classList.add("exiting");
  setTimeout(() => {
    home.classList.remove("active", "exiting");
  }, 500);
}

function onPlayClicked() {
  hideHomeScreen();
  soundClick();
  hapticTap();
  // İlk kez açıyorsa welcome modalı, sonrasında günlük bonus
  setTimeout(() => {
    maybeShowWelcome();
    setTimeout(checkDailyLogin, 800);
  }, 350);
}

function renderHomeStats() {
  const lvl = parseInt(localStorage.getItem(STORAGE.currentLevel) || "1", 10);
  const stars = parseInt(localStorage.getItem(STORAGE.totalStars) || "0", 10);
  const completed = JSON.parse(localStorage.getItem(STORAGE.completed) || "{}");
  const completedCount = Object.keys(completed).length;
  const lvlEl = document.getElementById("home-level");
  const starEl = document.getElementById("home-stars");
  const cmpEl  = document.getElementById("home-completed");
  if (lvlEl)  lvlEl.textContent = String(lvl);
  if (starEl) starEl.textContent = String(stars);
  if (cmpEl)  cmpEl.textContent = String(completedCount);
}

// === GÜNLÜK GİRİŞ BONUSU ===
function checkDailyLogin() {
  if (TEST_MODE) return;  // Test modunda günlük bonus kapalı
  // Hoş geldin modalı açıkken bekle
  const welcome = document.getElementById("welcome-overlay");
  if (welcome && welcome.classList.contains("active")) {
    setTimeout(checkDailyLogin, 1500);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);  // YYYY-MM-DD
  const last = localStorage.getItem(STORAGE.lastLoginDate);
  if (last === today) return;  // Bugünkü bonus zaten alındı

  // Streak hesapla
  let streak = parseInt(localStorage.getItem(STORAGE.dailyLoginStreak) || "0", 10);
  if (last) {
    const lastD = new Date(last + "T00:00:00");
    const todayD = new Date(today + "T00:00:00");
    const diffDays = Math.round((todayD - lastD) / 86400000);
    streak = (diffDays === 1) ? streak + 1 : 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(STORAGE.lastLoginDate, today);
  localStorage.setItem(STORAGE.dailyLoginStreak, String(streak));

  // 7'nin katlarında haftalık bonus, diğer günlerde +1
  const isWeekly = streak > 0 && streak % 7 === 0;
  const bonus = isWeekly ? 5 : 1;
  const message = isWeekly
    ? `${streak} gün üst üste! +${bonus} ipucu`
    : (streak > 1 ? `🔥 ${streak} gün · Günün hediyesi: +${bonus} ipucu`
                   : `Hoş geldin · Günün hediyesi: +${bonus} ipucu`);
  const icon = isWeekly ? "🎊" : (streak > 1 ? "🔥" : "🎁");

  addHints(bonus);
  showDailyBonusToast(icon, message, isWeekly);
}

function showDailyBonusToast(icon, message, big) {
  const toast = document.createElement("div");
  toast.className = "daily-toast" + (big ? " big" : "");
  toast.innerHTML = `<span class="daily-toast-icon">${icon}</span><span>${escapeHtml(message)}</span>`;
  document.body.appendChild(toast);
  // play in
  requestAnimationFrame(() => toast.classList.add("show"));
  // ses + haptic
  if (big) { soundWin(); hapticWin(); }
  else     { soundHint(); hapticTap(); }
  // çıkar
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, big ? 4500 : 3500);
}

// === CONFETTI (kazandığında düşen renkli parçacıklar) ===
function triggerConfetti(intensity = 80) {
  const colors = ["#FCD34D", "#34D399", "#60A5FA", "#C084FC", "#FB7185", "#FFFFFF"];
  const container = document.createElement("div");
  container.className = "confetti-container";
  document.body.appendChild(container);

  for (let i = 0; i < intensity; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = (Math.random() * 100) + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.6) + "s";
    piece.style.animationDuration = (2.2 + Math.random() * 2) + "s";
    piece.style.width = (5 + Math.random() * 7) + "px";
    piece.style.height = (9 + Math.random() * 9) + "px";
    piece.style.setProperty("--xshift", (Math.random() * 200 - 100) + "px");
    piece.style.setProperty("--rot", (Math.random() * 1080) + "deg");
    container.appendChild(piece);
  }
  setTimeout(() => container.remove(), 5500);
}

// === SES (Web Audio API ile, harici dosya yok) ===
let _audioCtx = null;
function ensureAudio() {
  if (_audioCtx) return _audioCtx;
  try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
  catch (e) { return null; }
  return _audioCtx;
}
function isSoundOn() { return localStorage.getItem(STORAGE.soundOff) !== "1"; }
function setSoundOn(on) { localStorage.setItem(STORAGE.soundOff, on ? "0" : "1"); }

function playTone(freq, duration, type = "sine", vol = 0.10, delay = 0) {
  if (!isSoundOn()) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  try {
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  } catch (e) {}
}
function soundClick()   { playTone(880, 0.04, "sine",   0.04); }
function soundCorrect() {
  playTone(523, 0.10, "sine", 0.13);
  playTone(659, 0.10, "sine", 0.13, 0.08);
  playTone(784, 0.16, "sine", 0.13, 0.16);
}
function soundWrong()   {
  playTone(220, 0.16, "square", 0.06);
  playTone(165, 0.20, "square", 0.06, 0.10);
}
function soundWin() {
  const notes = [523, 659, 784, 1047, 1318];
  notes.forEach((f, i) => playTone(f, 0.18, "sine", 0.13, i * 0.10));
}
function soundHint() {
  playTone(880, 0.10, "sine", 0.10);
  playTone(1175, 0.15, "sine", 0.10, 0.09);
}
function soundRestart() {
  playTone(196, 0.30, "sawtooth", 0.08);
  playTone(146, 0.30, "sawtooth", 0.08, 0.20);
  playTone(110, 0.50, "sawtooth", 0.06, 0.40);
}

// === HAPTIC (mobil titreşim) ===
function isHapticOn() { return localStorage.getItem(STORAGE.hapticOff) !== "1"; }
function setHapticOn(on) { localStorage.setItem(STORAGE.hapticOff, on ? "0" : "1"); }
function vibrate(pattern) {
  if (!isHapticOn()) return;
  if (navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (e) {}
  }
}
function hapticTap()     { vibrate(12); }
function hapticCorrect() { vibrate([18, 24, 35]); }
function hapticWrong()   { vibrate([60, 30, 60]); }
function hapticWin()     { vibrate([35, 25, 35, 25, 80]); }
function hapticRestart() { vibrate([100, 60, 100, 60, 200]); }

// === Hareket azalt ===
function isReducedMotion() { return localStorage.getItem("bag.reduceMotion") === "1"; }
function setReducedMotion(on) {
  localStorage.setItem("bag.reduceMotion", on ? "1" : "0");
  document.documentElement.classList.toggle("reduce-motion", on);
}
function applyReducedMotion() {
  if (isReducedMotion()) document.documentElement.classList.add("reduce-motion");
}

// === AYARLAR PANELİ ===
function openSettings() {
  const overlay = document.getElementById("settings-overlay");
  if (!overlay) return;
  // Toggle state'lerini güncel değerlere ayarla
  const ssound = document.getElementById("setting-sound");
  const shaptic = document.getElementById("setting-haptic");
  if (ssound)    ssound.checked    = isSoundOn();
  if (shaptic)   shaptic.checked   = isHapticOn();
  // Versiyon göster
  const versionEl = document.getElementById("settings-version-num");
  if (versionEl) versionEl.textContent = APP_VERSION;
  overlay.classList.add("active");
}

function closeSettings() {
  const overlay = document.getElementById("settings-overlay");
  if (overlay) overlay.classList.remove("active");
}

function resetAllProgress() {
  const ok = confirm("Tüm ilerleme silinecek:\n\n• Yıldız ve seviyeler\n• İpucu bakiyesi\n• Hatasız sayacı\n• Günlük giriş streak'i\n• Tüm ayarlar\n\nDevam etmek istiyor musun?");
  if (!ok) return;
  // Tüm bag.* anahtarlarını sil
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("bag.")) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
  // Sayfayı yenile — temiz başlangıç
  location.reload();
}

function maybeShowWelcome() {
  if (TEST_MODE) return;  // Test modunda welcome gösterme
  const seen = localStorage.getItem("bag.hasSeenIntro");
  if (seen) return;
  const overlay = document.getElementById("welcome-overlay");
  if (overlay) overlay.classList.add("active");
}

function closeWelcome() {
  const overlay = document.getElementById("welcome-overlay");
  if (overlay) overlay.classList.remove("active");
  localStorage.setItem("bag.hasSeenIntro", "1");
}

// === Nasıl oynanır modalı (footer linki) ===
function openHowto() {
  const overlay = document.getElementById("howto-overlay");
  if (!overlay) return;
  overlay.classList.add("active");
  const body = overlay.querySelector(".howto-body");
  if (body) body.scrollTop = 0;
}

function closeHowto() {
  const overlay = document.getElementById("howto-overlay");
  if (overlay) overlay.classList.remove("active");
}

// === İpucu mini-modalı (streak pill click) ===
function openHintInfo() {
  const overlay = document.getElementById("hint-info-overlay");
  if (overlay) overlay.classList.add("active");
}

function closeHintInfo() {
  const overlay = document.getElementById("hint-info-overlay");
  if (overlay) overlay.classList.remove("active");
}

function loadLevel(n) {
  const lvl = getLevel(n);
  if (!lvl) return;
  // Eğer ana ekran açıksa kapat (haritadan veya başka yerden level seçildiyse)
  hideHomeScreen();
  state.level = lvl;
  state.tierInfo = getTierInfo(lvl.tier);
  // Tüm levellarda hata limiti uniform: RESTART_MISTAKES
  state.maxMistakes = RESTART_MISTAKES;
  state.selected = [];
  state.solved = [];
  state.mistakes = 0;
  state.guessHistory = [];
  state.hintsUsed = 0;
  state.hintedCategories = new Set();
  state.revealedWords = {};
  state.finished = false;
  state.won = false;
  // Solved UI sıfırla
  _resetSolvedUI();
  state.justEarnedFlawless = false;
  state.flawlessProgressAfter = 0;
  if (typeof gaLevelStart === "function") gaLevelStart(n);
  document.getElementById("modal").classList.remove("active");
  const modalContent = document.getElementById("modal-content");
  if (modalContent) modalContent.classList.remove("won");
  render();
  updateHeaderProgress();
}

function getRemainingWords() {
  const solvedWords = new Set(state.solved.flatMap(g => g.words));
  return state.level.groups
    .flatMap(g => g.words)
    .filter(w => !solvedWords.has(w));
}

function shuffledRemaining() {
  const words = getRemainingWords();
  return seededShuffle(words, state.level.id);
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// === Render ===
function render() {
  renderTierBadge();
  renderTask();
  renderHints();
  renderSolved();
  renderGrid();
  renderControls();
  renderMistakes();
}

function renderTask() {
  const el = document.getElementById("level-task");
  if (!el || !state.level) return;
  const groupCount = state.level.groups.length;
  const totalWords = state.level.groups.reduce((acc, g) => acc + g.words.length, 0);
  el.textContent = `${totalWords} kelimeyi ${groupCount} gruba ayır.`;
}

function renderHints() {
  const container = document.getElementById("hints");
  if (!container) return;
  container.innerHTML = "";
  // Açılmış hintler ama henüz çözülmemiş kategorileri göster
  const solvedCats = new Set(state.solved.map(s => s.category));
  const visibleHints = [...state.hintedCategories].filter(c => !solvedCats.has(c));
  for (const cat of visibleHints) {
    const groupIndex = state.level.groups.findIndex(g => g.category === cat);
    if (groupIndex === -1) continue;
    const chip = document.createElement("div");
    chip.className = `hint-chip hint-g${groupIndex % 7}`;
    chip.innerHTML = `<span class="hint-icon">💡</span> ${escapeHtml(displayCategory(cat))}`;
    container.appendChild(chip);
  }
}

function renderTierBadge() {
  const badge = document.getElementById("tier-badge");
  if (!badge || !state.tierInfo) return;
  badge.textContent = state.tierInfo.name;
  badge.className = `tier-badge tier-${state.tierInfo.color}`;
}

function renderSolved() {
  const solvedList = state.solved;
  if (!solvedList || solvedList.length === 0) return;

  const latest = solvedList[solvedList.length - 1];
  const latestEl = document.getElementById("solved-latest");
  if (!latestEl) return;

  // Simgeyi hemen güncelle
  _updateFoundGroupsBtn();

  // Önceki barı kaldır
  const oldBar = latestEl.querySelector(".solved-latest-bar");
  if (oldBar) {
    oldBar.classList.add("leaving");
    setTimeout(() => oldBar.remove(), 200);
  }

  // Yeni bar
  const bar = document.createElement("div");
  bar.className = `solved-latest-bar ${latest.difficulty}`;
  bar.innerHTML = `
    <div class="cat">${escapeHtml(displayCategory(latest.category))}</div>
    <div class="words">${latest.words.map(w => escapeHtml(displayWord(w))).join(" · ")}</div>
  `;
  latestEl.appendChild(bar);
}

function _updateFoundGroupsBtn() {
  const wrap = document.getElementById("found-groups-wrap");
  if (!wrap) return;
  const found = state.solved.length;
  if (found > 0) {
    const total = state.level.groups.length;
    wrap.style.display = "block";
    const countEl = document.getElementById("fgb-count");
    if (countEl) countEl.textContent = `${found}/${total}`;
    const panel = document.getElementById("found-groups-panel");
    if (panel && panel.classList.contains("active")) _updateFoundGroupsPanel();
  } else {
    wrap.style.display = "none";
  }
}

function _updateFoundGroupsPanel() {
  const panel = document.getElementById("found-groups-panel");
  if (!panel) return;
  panel.innerHTML = "";
  const solvedList = state.solved;
  for (const g of solvedList) {
    const item = document.createElement("div");
    item.className = `found-panel-item ${g.difficulty}`;
    item.innerHTML = `
      <span class="fpi-cat">${escapeHtml(displayCategory(g.category))}</span>
      <span class="fpi-words">${g.words.map(w => escapeHtml(displayWord(w))).join(" · ")}</span>
    `;
    panel.appendChild(item);
  }
}

function _resetSolvedUI() {
  const latestEl = document.getElementById("solved-latest");
  if (latestEl) latestEl.innerHTML = "";
  const wrap = document.getElementById("found-groups-wrap");
  if (wrap) wrap.style.display = "none";
  const panel = document.getElementById("found-groups-panel");
  if (panel) { panel.innerHTML = ""; panel.classList.remove("active"); }
}

function makeTile(word, noAnim = false) {
  const tile = document.createElement("button");
  const groupIdx = state.revealedWords[word];
  const displayed = displayWord(word);
  const isLong = displayed.length > 8;
  tile.className = "tile"
    + (state.selected.includes(word) ? " selected" : "")
    + (groupIdx !== undefined ? ` revealed revealed-g${groupIdx % 7}` : "")
    + (isLong ? " long-word" : "")
    + (noAnim ? " no-anim" : "");
  tile.textContent = displayed;
  tile.dataset.word = word;
  tile.disabled = state.finished;
  tile.addEventListener("pointerdown", (e) => { e.preventDefault(); toggleSelect(word); });
  return tile;
}

// Tek kelimeler asla harf ortasından bölünmez; sığmazsa font küçülür.
// Çok kelimeli ifadeler boşluktan (kelime kelime) alt satıra kayar.
function fitTileText(tile) {
  const maxPx = 13.6;  // 0.85rem temel boyut
  const minPx = 8;
  let size = maxPx;
  tile.style.fontSize = size + "px";
  let guard = 0;
  while (guard++ < 30 &&
         (tile.scrollWidth > tile.clientWidth ||
          tile.scrollHeight > tile.clientHeight + 1)) {
    size -= 0.5;
    if (size <= minPx) { tile.style.fontSize = minPx + "px"; break; }
    tile.style.fontSize = size + "px";
  }
}

function renderGrid(noAnim = false) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  const words = shuffledRemaining();
  // Izgara her zaman tek ekrana sığsın: satır sayısı = kelime / 4
  const rows = Math.max(1, Math.ceil(words.length / 4));
  grid.style.setProperty("--grid-rows", rows);
  const frag = document.createDocumentFragment();
  for (const word of words) frag.appendChild(makeTile(word, noAnim));
  grid.appendChild(frag);
  // Her tile'ı sığacak şekilde ayarla — harf taşması olmasın
  const tiles = grid.querySelectorAll(".tile");
  for (const t of tiles) fitTileText(t);
}

function renderControls() {
  const submit = document.getElementById("submit");
  const deselect = document.getElementById("deselect");
  const shuffle = document.getElementById("shuffle");
  if (submit) submit.disabled = state.selected.length !== 4 || state.finished;
  if (deselect) deselect.disabled = state.selected.length === 0 || state.finished;
  if (shuffle) shuffle.disabled = state.finished;
}

function renderMistakes() {
  const container = document.getElementById("mistakes-dots");
  if (!container) return;
  container.innerHTML = "";
  if (TEST_MODE) {
    container.textContent = `∞ (test) · ${state.mistakes} hata · ${state.hintsUsed} ipucu`;
    container.style.color = "var(--text-mute)";
    container.style.fontSize = "0.85rem";
    return;
  }
  for (let i = 0; i < state.maxMistakes; i++) {
    const dot = document.createElement("div");
    dot.className = "mistake-dot" + (i < state.mistakes ? " lost" : "");
    container.appendChild(dot);
  }
}

function showMessage(text, type = "") {
  const msg = document.getElementById("message");
  if (!msg) return;
  msg.textContent = text;
  msg.className = "message " + type;
  if (text) {
    setTimeout(() => {
      if (msg.textContent === text) {
        msg.textContent = "";
        msg.className = "message";
      }
    }, 2200);
  }
}

// Hafif render — tile'ları yeniden çizmez, sadece seçim sınıfını günceller
function updateSelectionVisuals() {
  const tiles = document.querySelectorAll(".grid .tile");
  tiles.forEach(t => {
    const word = t.dataset.word || t.textContent;
    if (state.selected.includes(word)) t.classList.add("selected");
    else t.classList.remove("selected");
  });
}

function lightRender() {
  updateSelectionVisuals();
  renderControls();
}

// === Aksiyonlar ===
function toggleSelect(word) {
  if (state.finished) return;
  const idx = state.selected.indexOf(word);
  if (idx >= 0) state.selected.splice(idx, 1);
  else if (state.selected.length < 4) state.selected.push(word);
  soundClick();
  hapticTap();
  lightRender();
}

function deselectAll() {
  state.selected = [];
  lightRender();
}

function submit() {
  if (state.selected.length !== 4 || state.finished) return;

  const matches = state.level.groups.map(g => ({
    group: g,
    matchCount: state.selected.filter(w => g.words.includes(w)).length
  }));
  const best = matches.reduce((a, b) => b.matchCount > a.matchCount ? b : a);

  const guessRow = state.selected.map(w => {
    const g = state.level.groups.find(gr => gr.words.includes(w));
    return DIFF_EMOJI[g.difficulty];
  });
  state.guessHistory.push(guessRow);

  if (best.matchCount === 4) {
    state.solved.push({
      difficulty: best.group.difficulty,
      category: best.group.category,
      words: [...best.group.words]
    });
    state.selected = [];
    showMessage("Tam isabet! 🎯", "success");
    soundCorrect();
    hapticCorrect();
    if (state.solved.length === state.level.groups.length) {
      finish(true);
      return;
    }
    renderSolved();
    renderGrid(true);
    renderControls();
  } else if (best.matchCount === 3) {
    state.mistakes++;
    showMessage("Bir kayma var. (3/4)", "error");
    shakeTiles();
    soundWrong();
    hapticWrong();
    renderMistakes();
    if (!TEST_MODE && state.mistakes >= state.maxMistakes) {
      restartLevel();
      return;
    }
  } else {
    state.mistakes++;
    const remaining = state.maxMistakes - state.mistakes;
    showMessage(TEST_MODE ? "Yanlış." : "Yanlış. Hak: " + remaining, "error");
    shakeTiles();
    soundWrong();
    hapticWrong();
    renderMistakes();
    if (!TEST_MODE && state.mistakes >= state.maxMistakes) {
      restartLevel();
      return;
    }
  }
}

function shakeTiles() {
  const tiles = document.querySelectorAll(".tile.selected");
  tiles.forEach(t => {
    t.classList.remove("shake");
    void t.offsetWidth;
    t.classList.add("shake");
  });
}

// 3 hata = seamless restart (kayıp modalı YOK)
// Deneme "tüketilmiş" olur — flawless şansı gider.
function restartLevel() {
  state.finished = true;  // input kilitle
  markAttempted(state.level.id);  // flawless şansı yandı
  if (typeof gaLevelFail === "function") gaLevelFail(state.level.id);
  showMessage(`${RESTART_MISTAKES} hata! Yeniden başlıyor…`, "error");
  soundRestart();
  hapticRestart();
  // Tüm grid'e kırmızı flash + transition
  const grid = document.getElementById("grid");
  if (grid) grid.classList.add("restart-flash");
  setTimeout(() => {
    if (grid) grid.classList.remove("restart-flash");
    loadLevel(state.level.id);
  }, 1100);
}

function finish(won) {
  state.finished = true;
  state.won = won;
  if (typeof gaLevelComplete === "function") {
    won ? gaLevelComplete(state.level.id) : gaLevelFail(state.level.id);
  }
  if (!won) {
    const solvedCats = new Set(state.solved.map(s => s.category));
    for (const g of state.level.groups) {
      if (!solvedCats.has(g.category)) {
        state.solved.push({
          difficulty: g.difficulty,
          category: g.category,
          words: [...g.words]
        });
      }
    }
  }

  // Hatasız tur kontrolü (ilk deneme + 0 hata + 0 ipucu)
  awardFlawlessIfEligible();
  // Bu level artık denenmiş sayılır — tekrar oynanırsa flawless kredisi YOK
  markAttempted(state.level.id);

  const stars = won ? calculateStars(state.mistakes) : 0;
  if (won) saveProgress(stars);
  render();

  // Kazandıysa: confetti + zafer melodisi + titreşim
  if (won) {
    triggerConfetti(stars === 3 ? 110 : 70);
    soundWin();
    hapticWin();
  }

  // Milestone (10 hatasız) hit edildiyse büyük kutlama modalı önce, sonra result
  const isMilestone = state.justEarnedFlawless && state.flawlessProgressAfter === FLAWLESS_THRESHOLD;
  if (isMilestone) {
    setTimeout(() => showMilestoneModal(stars), 700);
  } else {
    setTimeout(() => showResult(stars), 600);
  }
}

function calculateStars(mistakes) {
  // Hint kullanımı da hata sayar
  const penalty = mistakes + state.hintsUsed;
  if (penalty === 0) return 3;
  if (penalty <= 2) return 2;
  return 1;
}

// === Hint sistemi ===
function showHint() {
  if (state.finished) return;
  const hints = getHints();
  if (hints === 0) {
    openAdModal();
    return;
  }
  if (applyHint()) {
    setHints(hints - 1);
    soundHint();
    hapticTap();
  }
}

function applyHint() {
  const solvedCats = new Set(state.solved.map(s => s.category));
  // Sıralama yok — rastgele bir kategori seç (her seferinde farklı olabilir)
  const candidates = state.level.groups
    .filter(g => !solvedCats.has(g.category) && !state.hintedCategories.has(g.category));
  if (candidates.length === 0) {
    showMessage("Açılacak ipucu kalmadı.", "");
    return false;
  }
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  state.hintedCategories.add(chosen.category);
  state.hintsUsed++;
  if (typeof gaDesign === "function") gaDesign("hint:used:" + _gaLevelName(state.level.id));
  showMessage(`💡 ${displayCategory(chosen.category)}`, "success");
  renderHints();
  renderMistakes();
  return true;
}

// === Reklam izleme akışı ===
function openAdModal() {
  const modal = document.getElementById("ad-modal");
  if (!modal) return;
  modal.classList.add("active");
  // Reset durumu
  document.getElementById("ad-offer").style.display = "block";
  document.getElementById("ad-watching").style.display = "none";
}

function closeAdModal() {
  document.getElementById("ad-modal").classList.remove("active");
}

let _adTimerId = null;

function isNative() {
  return typeof isNativeApp === "function" && isNativeApp();
}

function watchRewardedAd(onSuccess) {
  const tracked = () => {
    if (typeof gaDesign === "function") gaDesign("ad:rewarded:completed");
    onSuccess();
  };
  if (isNative()) {
    admobShowRewarded(
      tracked,
      () => { showMessage("Reklam yüklenemedi, tekrar dene.", "error"); }
    );
  } else {
    tracked();
  }
}

function startWatchAd() {
  if (isNative()) {
    closeAdModal();
    watchRewardedAd(() => { addHints(1); showMessage("+1 ipucu kazandın 🎉", "success"); });
    return;
  }

  // Tarayıcıda sahte countdown (test/geliştirme için)
  document.getElementById("ad-offer").style.display = "none";
  document.getElementById("ad-watching").style.display = "block";

  let remaining = AD_DURATION_SEC;
  const countdownEl = document.getElementById("ad-countdown");
  const skipBtn = document.getElementById("ad-skip-btn");
  if (countdownEl) countdownEl.textContent = String(remaining);
  if (skipBtn) skipBtn.disabled = true;

  if (_adTimerId) clearInterval(_adTimerId);
  _adTimerId = setInterval(() => {
    remaining--;
    if (countdownEl) countdownEl.textContent = String(remaining);
    if (remaining <= 0) {
      clearInterval(_adTimerId);
      _adTimerId = null;
      addHints(1);
      closeAdModal();
      showMessage("+1 ipucu kazandın 🎉", "success");
    }
  }, 1000);
}

function cancelAd() {
  if (_adTimerId) {
    clearInterval(_adTimerId);
    _adTimerId = null;
  }
  closeAdModal();
}

function saveProgress(stars) {
  // Not: +1 ipucu artık level kazanınca değil, 15 hatasız doğruda verilir.
  if (TEST_MODE) return;  // Test modunda kalıcı ilerleme kaydetme
  const completed = JSON.parse(localStorage.getItem(STORAGE.completed) || "{}");
  const prev = completed[state.level.id] || 0;
  if (stars > prev) {
    const delta = stars - prev; // sadece net kazanım — satın alınan yıldızları silmez
    completed[state.level.id] = stars;
    localStorage.setItem(STORAGE.completed, JSON.stringify(completed));
    const currentTotal = parseInt(localStorage.getItem(STORAGE.totalStars) || "0", 10);
    localStorage.setItem(STORAGE.totalStars, String(currentTotal + delta));
  }
  const nextLevel = state.level.id + 1;
  const currentMax = parseInt(localStorage.getItem(STORAGE.currentLevel) || "1", 10);
  if (nextLevel <= TOTAL_LEVELS && nextLevel > currentMax) {
    localStorage.setItem(STORAGE.currentLevel, String(nextLevel));
  }
}

function getTotalStars() {
  if (TEST_MODE) return 9999;
  return parseInt(localStorage.getItem(STORAGE.totalStars) || "0", 10);
}

function spendStars(n) {
  if (TEST_MODE) return;
  const next = Math.max(0, getTotalStars() - n);
  localStorage.setItem(STORAGE.totalStars, String(next));
  updateHeaderProgress();
}

function addFreeStars(n) {
  const next = Math.min(99999, getTotalStars() + n);
  localStorage.setItem(STORAGE.totalStars, String(next));
  updateHeaderProgress();
}

// === Kelime rengi açma ===
function revealSelectedWord() {
  if (state.finished) return;
  if (state.selected.length !== 1) {
    showMessage("Tek bir kelime seç, sonra aç.", "");
    return;
  }
  const word = state.selected[0];
  if (state.revealedWords[word]) {
    showMessage("Bu kelime zaten açıldı.", "");
    return;
  }
  if (getTotalStars() < WORD_REVEAL_COST) {
    openBuyStars();
    return;
  }
  const groupIndex = state.level.groups.findIndex(g => g.words.includes(word));
  if (groupIndex === -1) return;

  spendStars(WORD_REVEAL_COST);
  state.revealedWords[word] = groupIndex;
  state.hintsUsed++;
  if (typeof gaDesign === "function") gaDesign("reveal:used:" + _gaLevelName(state.level.id));
  soundHint();
  hapticTap();
  renderGrid();
  renderMistakes();
  showMessage(`⭐×${WORD_REVEAL_COST} harcandı — renk görünüyor!`, "success");
  updateRevealBtn();
}

function updateRevealBtn() {
  const btn = document.getElementById("reveal-btn");
  if (!btn) return;
  const stars = getTotalStars();
  btn.disabled = state.finished;
  btn.classList.toggle("no-stars", stars < WORD_REVEAL_COST);
}

// === Yıldız Satın Al modal ===
function openBuyStars() {
  const overlay = document.getElementById("buy-stars-overlay");
  if (overlay) overlay.classList.add("active");
}

function closeBuyStars() {
  const overlay = document.getElementById("buy-stars-overlay");
  if (overlay) overlay.classList.remove("active");
}

function handleStarPackage(pkg) {
  if (pkg === "ad") {
    closeBuyStars();
    watchRewardedAd(() => { addFreeStars(10); showMessage("+10 ⭐ kazandın 🎉", "success"); soundWin(); hapticWin(); });
    return;
  }
  // Google Play satın alma
  if (typeof iapBuy === "function") iapBuy("stars_" + pkg);
}

// === İpucu Satın Al modal ===
function openBuyHints() {
  const overlay = document.getElementById("buy-hints-overlay");
  if (overlay) overlay.classList.add("active");
}

function closeBuyHints() {
  const overlay = document.getElementById("buy-hints-overlay");
  if (overlay) overlay.classList.remove("active");
}

function handleHintPackage(pkg) {
  if (pkg === "ad") {
    closeBuyHints();
    watchRewardedAd(() => { addHints(1); showMessage("+1 ipucu kazandın 🎉", "success"); });
    return;
  }
  // Google Play satın alma
  if (typeof iapBuy === "function") iapBuy("hints_" + pkg);
}

function updateHeaderProgress() {
  const num = document.getElementById("level-num");
  const stars = document.getElementById("stars-count");
  if (num && state.level) num.textContent = String(state.level.id);
  if (stars) stars.textContent = getTotalStars();
  updateRevealBtn();
}

function showResult(stars) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  const title = document.getElementById("modal-title");
  const subtitle = document.getElementById("modal-subtitle");
  const grid = document.getElementById("share-grid");
  const starDisplay = document.getElementById("modal-stars");
  const nextBtn = document.getElementById("next-btn");

  // Performansa göre değişen başlık
  function pickTitle(s) {
    const perfect = ["Mükemmel!", "Tek seferde!", "Yıldız avcısı", "Hatasız!", "Tam isabet"];
    const good    = ["Helal sana", "İyi iş", "Bağladın", "Çok yakındın"];
    const okay    = ["Bittiği iyi", "Devam et", "Tamamladın"];
    const arr = s === 3 ? perfect : (s === 2 ? good : okay);
    return arr[Math.floor(Math.random() * arr.length)];
  }

  if (state.won) {
    title.textContent = pickTitle(stars);
    subtitle.textContent = `Seviye ${state.level.id} · ${state.tierInfo.name}`;
    modalContent.classList.add("won");

    if (starDisplay) {
      starDisplay.innerHTML = [0,1,2].map(i =>
        `<span class="star ${i < stars ? "earned" : "empty"}">${i < stars ? "★" : "☆"}</span>`
      ).join("");
      starDisplay.style.display = "flex";
    }

    // Hatasız tur rozeti (sadece flawless kazanıldıysa)
    const flawlessBadge = document.getElementById("flawless-badge");
    const badgeTitle = document.getElementById("badge-title");
    const badgeMeta = document.getElementById("badge-meta");
    if (flawlessBadge) {
      if (state.justEarnedFlawless) {
        flawlessBadge.style.display = "flex";
        const milestone = state.flawlessProgressAfter === FLAWLESS_THRESHOLD;
        if (milestone) {
          if (badgeTitle) badgeTitle.textContent = `${FLAWLESS_THRESHOLD} Hatasız!`;
          if (badgeMeta)  badgeMeta.textContent  = "🎉 +1 ipucu kazandın";
          flawlessBadge.classList.add("milestone");
        } else {
          if (badgeTitle) badgeTitle.textContent = "Hatasız Tur!";
          if (badgeMeta)  badgeMeta.textContent  = `${state.flawlessProgressAfter}/${FLAWLESS_THRESHOLD} ilerleme`;
          flawlessBadge.classList.remove("milestone");
        }
      } else {
        flawlessBadge.style.display = "none";
      }
    }

    // İstatistikler
    const sm = document.getElementById("stat-mistakes");
    const sh = document.getElementById("stat-hints");
    const ss = document.getElementById("stat-stars");
    if (sm) sm.textContent = String(state.mistakes);
    if (sh) sh.textContent = String(state.hintsUsed);
    if (ss) {
      // Yıldızı sayı yerine ★ ikonlarıyla göster
      ss.innerHTML = `<span class="stat-stars-on">${"★".repeat(stars)}</span><span class="stat-stars-off">${"☆".repeat(3 - stars)}</span>`;
    }

    if (nextBtn) {
      const isLast = state.level.id === TOTAL_LEVELS;
      nextBtn.textContent = isLast ? "🏆 Tüm seviyeleri bitirdin!" : "Sonraki seviye →";
      nextBtn.disabled = isLast;
    }
  } else {
    title.textContent = "Tekrar dene";
    subtitle.textContent = `Seviye ${state.level.id} · ${state.tierInfo.name}`;
    modalContent.classList.remove("won");
    if (starDisplay) starDisplay.style.display = "none";
    const flawlessBadge = document.getElementById("flawless-badge");
    if (flawlessBadge) flawlessBadge.style.display = "none";
    if (nextBtn) {
      nextBtn.textContent = "Tekrar dene";
      nextBtn.disabled = false;
    }
  }

  if (grid) grid.textContent = buildShareText(stars);
  document.getElementById("share-text-hidden").value = buildShareText(stars);

  modal.classList.add("active");
  updateHeaderProgress();
}

function buildShareText(stars) {
  const status = state.won
    ? "★".repeat(stars) + "☆".repeat(3 - stars)
    : "✗";
  let txt = `Bağ #${state.level.id} · ${state.tierInfo.name} · ${status}\n`;
  // Günlük streak'i de ekle (varsa)
  const dailyStreak = parseInt(localStorage.getItem(STORAGE.dailyLoginStreak) || "0", 10);
  if (dailyStreak > 1) {
    txt += `🔥 ${dailyStreak} gün üst üste\n`;
  }
  txt += state.guessHistory.map(row => row.join("")).join("\n");
  txt += `\nbag.com.tr`;
  return txt;
}

function copyShare() {
  const text = document.getElementById("share-text-hidden").value;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copy-btn");
    const orig = btn.textContent;
    btn.textContent = "Kopyalandı!";
    setTimeout(() => { btn.textContent = orig; }, 1500);
  }).catch(() => {
    const ta = document.getElementById("share-text-hidden");
    ta.select();
    document.execCommand("copy");
  });
}

function shareNative() {
  const text = document.getElementById("share-text-hidden").value;
  if (navigator.share) navigator.share({ title: "Bağ", text }).catch(() => {});
  else copyShare();
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
}

function goToNextLevel() {
  const nextNum = state.level.id + 1;
  // İlk 20 bölümde reklam yok; 20'den sonra her 3 bölümde bir
  if (isNative() && typeof admobShowInterstitial === "function" && state.level.id > 20) {
    levelsSinceLastAd++;
    if (levelsSinceLastAd >= 3) {
      levelsSinceLastAd = 0;
      if (typeof gaDesign === "function") gaDesign("ad:interstitial:shown");
      admobShowInterstitial();
    }
  }
  if (state.won && nextNum <= TOTAL_LEVELS) loadLevel(nextNum);
  else loadLevel(state.level.id);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

// === Level select (harita) ===
function openLevelSelect() {
  const overlay = document.getElementById("level-select");
  if (!overlay) return;
  renderLevelGrid();
  overlay.classList.add("active");
}

function closeLevelSelect() {
  const overlay = document.getElementById("level-select");
  if (overlay) overlay.classList.remove("active");
}

function renderLevelGrid() {
  const grid = document.getElementById("level-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const completed = JSON.parse(localStorage.getItem(STORAGE.completed) || "{}");
  const currentMax = parseInt(localStorage.getItem(STORAGE.currentLevel) || "1", 10);

  // Görünecek max seviye: mevcut + 2 önizleme. Gerisi gizem kartı.
  // Test modunda hepsi görünür.
  const PREVIEW_AHEAD = 2;
  const visibleMax = TEST_MODE
    ? TOTAL_LEVELS
    : Math.min(TOTAL_LEVELS, currentMax + PREVIEW_AHEAD);

  for (let i = 1; i <= visibleMax; i++) {
    const lvl = getLevel(i);
    const tier = getTierInfo(lvl.tier);
    const stars = completed[i] || 0;
    const unlocked = TEST_MODE || i <= currentMax;
    const isCurrent = state.level && state.level.id === i;

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = `lv-tile tier-${tier.color}`
      + (stars > 0 ? " completed" : "")
      + (isCurrent ? " current" : "")
      + (!unlocked ? " locked" : "");
    tile.disabled = !unlocked;

    let starsHTML = "";
    if (unlocked) {
      starsHTML = `<div class="lv-stars">${
        [0,1,2].map(j => `<span class="${j < stars ? "on" : "off"}">${j < stars ? "★" : "☆"}</span>`).join("")
      }</div>`;
    } else {
      starsHTML = `<div class="lv-stars locked">🔒</div>`;
    }

    tile.innerHTML = `
      <div class="lv-num">${i}</div>
      <div class="lv-tier">${tier.name}</div>
      ${starsHTML}
    `;

    if (unlocked) {
      tile.addEventListener("click", () => {
        loadLevel(i);
        closeLevelSelect();
      });
    }

    grid.appendChild(tile);
  }

  // Daha fazla seviye varsa sonunda gizem kartı
  if (!TEST_MODE && visibleMax < TOTAL_LEVELS) {
    const mystery = document.createElement("div");
    mystery.className = "lv-tile lv-mystery";
    mystery.innerHTML = `
      <div class="lv-num">?</div>
      <div class="lv-tier">DEVAM EDER...</div>
      <div class="lv-stars locked">🔒</div>
    `;
    grid.appendChild(mystery);
  }
}

// === Test modu ===
function setupTestModeUI() {
  if (!TEST_MODE) return;
  const header = document.querySelector("header");
  if (header && !document.getElementById("test-badge")) {
    const badge = document.createElement("div");
    badge.id = "test-badge";
    badge.textContent = "TEST";
    badge.style.cssText = "position:absolute;top:6px;left:50%;transform:translateX(-50%);font-family:'Geist Mono',monospace;font-size:0.65rem;letter-spacing:0.15em;padding:3px 10px;border-radius:999px;z-index:10";
    header.appendChild(badge);
  }
  const controls = document.querySelector(".controls");
  if (controls && !document.getElementById("prev-level-btn")) {
    const prev = document.createElement("button");
    prev.id = "prev-level-btn";
    prev.type = "button";
    prev.textContent = "← Seviye";
    prev.addEventListener("click", () => {
      if (state.level.id > 1) loadLevel(state.level.id - 1);
    });
    const reset = document.createElement("button");
    reset.id = "reset-btn";
    reset.type = "button";
    reset.textContent = "↻";
    reset.addEventListener("click", () => loadLevel(state.level.id));
    const next = document.createElement("button");
    next.id = "next-level-btn";
    next.type = "button";
    next.textContent = "Seviye →";
    next.addEventListener("click", () => {
      if (state.level.id < TOTAL_LEVELS) loadLevel(state.level.id + 1);
    });
    controls.appendChild(prev);
    controls.appendChild(reset);
    controls.appendChild(next);
  }
}

// === Bağlama ===
document.addEventListener("DOMContentLoaded", () => {
  init();
  setupTestModeUI();
  document.getElementById("submit").addEventListener("click", submit);
  document.getElementById("deselect").addEventListener("click", deselectAll);
  document.getElementById("shuffle").addEventListener("click", () => {
    const words = getRemainingWords().slice().sort(() => Math.random() - 0.5);
    const grid = document.getElementById("grid");
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (const word of words) frag.appendChild(makeTile(word, true)); // no-anim = true
    grid.appendChild(frag);
  });
  document.getElementById("copy-btn").addEventListener("click", copyShare);
  document.getElementById("share-btn").addEventListener("click", shareNative);
  document.getElementById("modal-close").addEventListener("click", closeModal);
  const nextBtn = document.getElementById("next-btn");
  if (nextBtn) nextBtn.addEventListener("click", goToNextLevel);

  // Hint butonu
  const hintBtn = document.getElementById("hint-btn");
  if (hintBtn) hintBtn.addEventListener("click", showHint);
  updateHintButton();
  renderFlawlessBar();

  // Kelime açma butonu
  const revealBtn = document.getElementById("reveal-btn");
  if (revealBtn) revealBtn.addEventListener("click", revealSelectedWord);
  updateRevealBtn();

  // Yıldız satın al butonları
  const buyStarsBtn = document.getElementById("buy-stars-btn");
  if (buyStarsBtn) buyStarsBtn.addEventListener("click", openBuyStars);
  const buyStarsClose = document.getElementById("buy-stars-close");
  if (buyStarsClose) buyStarsClose.addEventListener("click", closeBuyStars);
  const buyStarsOverlay = document.getElementById("buy-stars-overlay");
  if (buyStarsOverlay) buyStarsOverlay.addEventListener("click", (e) => {
    if (e.target === buyStarsOverlay) closeBuyStars();
  });
  ["pkg-ad","pkg-small","pkg-medium","pkg-large"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => handleStarPackage(id.replace("pkg-", "")));
  });

  // İpucu satın al butonları
  const buyHintsBtn = document.getElementById("buy-hints-btn");
  if (buyHintsBtn) buyHintsBtn.addEventListener("click", openBuyHints);
  const buyHintsClose = document.getElementById("buy-hints-close");
  if (buyHintsClose) buyHintsClose.addEventListener("click", closeBuyHints);
  const buyHintsOverlay = document.getElementById("buy-hints-overlay");
  if (buyHintsOverlay) buyHintsOverlay.addEventListener("click", (e) => {
    if (e.target === buyHintsOverlay) closeBuyHints();
  });
  ["hint-pkg-ad","hint-pkg-small","hint-pkg-medium","hint-pkg-large"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => handleHintPackage(id.replace("hint-pkg-", "")));
  });

  // Reklam modal butonları
  const watchBtn = document.getElementById("watch-ad-btn");
  if (watchBtn) watchBtn.addEventListener("click", startWatchAd);
  const cancelAdBtn = document.getElementById("ad-cancel-btn");
  if (cancelAdBtn) cancelAdBtn.addEventListener("click", cancelAd);

  // Hoş geldin modal butonları
  const welcomeStart = document.getElementById("welcome-start");
  if (welcomeStart) welcomeStart.addEventListener("click", closeWelcome);
  const welcomeOverlay = document.getElementById("welcome-overlay");
  if (welcomeOverlay) welcomeOverlay.addEventListener("click", (e) => {
    if (e.target === welcomeOverlay) closeWelcome();
  });

  // Nasıl oynanır — footer link → tam modal
  const howLink = document.getElementById("how-link");
  if (howLink) howLink.addEventListener("click", (e) => {
    e.preventDefault();
    openHowto();
  });
  const howtoClose = document.getElementById("howto-close");
  if (howtoClose) howtoClose.addEventListener("click", closeHowto);
  const howtoOverlay = document.getElementById("howto-overlay");
  if (howtoOverlay) howtoOverlay.addEventListener("click", (e) => {
    if (e.target === howtoOverlay) closeHowto();
  });

  // Streak pill (🎯) → sadece ipucu kazanma mini-modalı
  const streakPill = document.getElementById("streak-pill");
  if (streakPill) streakPill.addEventListener("click", openHintInfo);

  // Ana ekran butonları
  const playBtn = document.getElementById("home-play-btn");
  if (playBtn) playBtn.addEventListener("click", onPlayClicked);
  const homeHowto = document.getElementById("home-howto");
  if (homeHowto) homeHowto.addEventListener("click", (e) => {
    e.preventDefault();
    openHowto();
  });
  const homeMapLink = document.getElementById("home-map-link");
  if (homeMapLink) homeMapLink.addEventListener("click", (e) => {
    e.preventDefault();
    openLevelSelect();
  });

  // Header'daki logo (Bağ) → ana ekrana dön
  const brandHomeBtn = document.getElementById("brand-home-btn");
  if (brandHomeBtn) brandHomeBtn.addEventListener("click", () => {
    soundClick();
    hapticTap();
    showHomeScreen();
  });

  // Bulunan gruplar butonu
  const foundGroupsBtn = document.getElementById("found-groups-btn");
  if (foundGroupsBtn) foundGroupsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    soundClick();
    hapticTap();
    const panel = document.getElementById("found-groups-panel");
    if (panel) {
      panel.classList.toggle("active");
      if (panel.classList.contains("active")) _updateFoundGroupsPanel();
    }
  });

  // Panel dışına tıklayınca kapat (DOM referansları bir kere alınır)
  const fgPanel = document.getElementById("found-groups-panel");
  const fgWrap  = document.getElementById("found-groups-wrap");
  document.addEventListener("click", (e) => {
    if (fgPanel && fgPanel.classList.contains("active") &&
        fgWrap && !fgWrap.contains(e.target)) {
      fgPanel.classList.remove("active");
    }
  });

  // Ayarlar paneli — açma/kapama
  const homeSettings = document.getElementById("home-settings-link");
  if (homeSettings) homeSettings.addEventListener("click", (e) => { e.preventDefault(); openSettings(); });
  const footerSettings = document.getElementById("footer-settings-link");
  if (footerSettings) footerSettings.addEventListener("click", (e) => { e.preventDefault(); openSettings(); });
  const settingsClose = document.getElementById("settings-close");
  if (settingsClose) settingsClose.addEventListener("click", closeSettings);
  const settingsOverlay = document.getElementById("settings-overlay");
  if (settingsOverlay) settingsOverlay.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });

  // Ayarlar toggle'ları
  const ssound = document.getElementById("setting-sound");
  if (ssound) ssound.addEventListener("change", (e) => {
    setSoundOn(e.target.checked);
    if (e.target.checked) soundClick();  // anlık ses örneği
  });
  const shaptic = document.getElementById("setting-haptic");
  if (shaptic) shaptic.addEventListener("change", (e) => {
    setHapticOn(e.target.checked);
    if (e.target.checked) hapticTap();   // anlık titreşim örneği
  });
  // Sıfırla butonu
  const sreset = document.getElementById("settings-reset");
  if (sreset) sreset.addEventListener("click", resetAllProgress);
  const hintInfoClose = document.getElementById("hint-info-close");
  if (hintInfoClose) hintInfoClose.addEventListener("click", closeHintInfo);
  const hintInfoOverlay = document.getElementById("hint-info-overlay");
  if (hintInfoOverlay) hintInfoOverlay.addEventListener("click", (e) => {
    if (e.target === hintInfoOverlay) closeHintInfo();
  });

  // Level select butonu
  const mapBtn = document.getElementById("map-btn");
  if (mapBtn) mapBtn.addEventListener("click", openLevelSelect);
  const closeMapBtn = document.getElementById("level-select-close");
  if (closeMapBtn) closeMapBtn.addEventListener("click", closeLevelSelect);
  const overlay = document.getElementById("level-select");
  if (overlay) overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLevelSelect();
  });

});
