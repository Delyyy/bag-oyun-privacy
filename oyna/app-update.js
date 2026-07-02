// Oyun açılınca / öne gelince Play Store'da yeni sürüm var mı kontrol eder.
// Varsa "Güncelle" penceresi gösterir; tıklayınca Play Store açılır.
// Yalnızca Capacitor native ortamında ve Play Store'dan kurulu uygulamada çalışır.

let _updateChecked = false;

async function checkForAppUpdate() {
  if (!window.Capacitor || !window.Capacitor.Plugins.AppUpdate) return;
  const { AppUpdate } = window.Capacitor.Plugins;

  try {
    const info = await AppUpdate.getAppUpdateInfo();
    console.log("[Update] info:", JSON.stringify(info));
    // updateAvailability: 2 = UPDATE_AVAILABLE
    if (info.updateAvailability === 2) {
      showUpdateAvailablePrompt();
    }
  } catch (e) {
    console.warn("[Update] kontrol başarısız:", e);
  }
}

function showUpdateAvailablePrompt() {
  if (document.getElementById("update-prompt-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "update-prompt-overlay";
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(5,5,12,.85);" +
    "display:flex;align-items:center;justify-content:center;" +
    "z-index:99998;padding:24px;font-family:'Bricolage Grotesque','Geist',sans-serif";

  const card = document.createElement("div");
  card.style.cssText =
    "background:#1a1a2e;border:1px solid rgba(255,255,255,.12);" +
    "border-radius:16px;padding:28px 22px 20px;max-width:340px;width:100%;" +
    "text-align:center;color:#fff;box-shadow:0 12px 40px rgba(0,0,0,.6)";

  card.innerHTML =
    '<div style="font-size:44px;margin-bottom:6px">🎉</div>' +
    '<h2 style="font-weight:700;font-size:1.4rem;margin-bottom:8px">Yeni Sürüm Var!</h2>' +
    '<p style="color:#aaa;font-size:0.92rem;margin-bottom:20px;line-height:1.4">' +
      "Bağ'ın yeni sürümü hazır. Play Store'dan güncelle." +
    '</p>' +
    '<button id="update-now-btn" style="width:100%;background:linear-gradient(135deg,#FFFFFF 0%,#DDD8F0 100%);' +
      'color:#0a0a1a;border:none;padding:14px;border-radius:24px;font-weight:700;' +
      'font-size:1rem;cursor:pointer;margin-bottom:6px;letter-spacing:0.02em">Güncelle</button>' +
    '<button id="update-later-btn" style="width:100%;background:transparent;color:#888;' +
      'border:none;padding:10px;font-size:0.88rem;cursor:pointer">Daha Sonra</button>';

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  document.getElementById("update-now-btn").onclick = async () => {
    try {
      const { AppUpdate } = window.Capacitor.Plugins;
      await AppUpdate.openAppStore();
    } catch (e) {
      console.warn("[Update] Play Store açılamadı:", e);
    }
  };
  document.getElementById("update-later-btn").onclick = () => overlay.remove();
}

// Oyun yüklenince kontrol et
document.addEventListener("DOMContentLoaded", () => {
  checkForAppUpdate();
  _updateChecked = true;
});

// Oyun arka plandan öne gelince de yeniden kontrol et
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && _updateChecked) checkForAppUpdate();
});
