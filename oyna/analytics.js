// GameAnalytics entegrasyonu — level funnel, ipucu/reklam/satın alma olayları
// Panel: tool.gameanalytics.com

(function (w, d, a) {
  w[a] = w[a] || function () { (w[a].q = w[a].q || []).push(arguments); };
  var s = d.createElement("script");
  s.async = 1;
  s.src = "https://download.gameanalytics.com/js/GameAnalytics-4.4.6.min.js";
  var t = d.getElementsByTagName("script")[0];
  t.parentNode.insertBefore(s, t);
})(window, document, "GameAnalytics");

GameAnalytics("configureBuild", "android 1.2.7");
GameAnalytics("initialize", "9dc12beb9271e0679f14edea5f362846", "2f9c8bb0dde0645f661dc3026c0a7b2ee5bee7fe");

// --- Yardımcılar (game.js / iap.js bunları çağırır) ---

function _gaLevelName(id) {
  return "level_" + String(id).padStart(3, "0");
}

function gaLevelStart(id) {
  try { GameAnalytics("addProgressionEvent", "Start", _gaLevelName(id)); } catch (e) {}
}

function gaLevelComplete(id) {
  try { GameAnalytics("addProgressionEvent", "Complete", _gaLevelName(id)); } catch (e) {}
}

function gaLevelFail(id) {
  try { GameAnalytics("addProgressionEvent", "Fail", _gaLevelName(id)); } catch (e) {}
}

function gaDesign(eventId) {
  try { GameAnalytics("addDesignEvent", eventId); } catch (e) {}
}

// Satın alma — TRY, kuruş cinsinden (kullanıcının ödediği liste fiyatı)
const _GA_PRICES = {
  stars_small: 1499, stars_medium: 3499, stars_large: 7999,
  hints_small: 999,  hints_medium: 2499, hints_large: 4999
};

function gaPurchase(productId) {
  try {
    const cents = _GA_PRICES[productId] || 0;
    const type = productId.indexOf("stars") === 0 ? "stars" : "hints";
    GameAnalytics("addBusinessEvent", "TRY", cents, type, productId, "shop");
  } catch (e) {}
}
