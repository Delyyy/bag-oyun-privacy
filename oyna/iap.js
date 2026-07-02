// Google Play satın alma entegrasyonu — cordova-plugin-purchase v13 (cdvpurchase)
// Yalnızca native ortamda çalışır.

const IAP_PRODUCTS = [
  { id: "stars_small",  reward: "stars", n: 50  },
  { id: "stars_medium", reward: "stars", n: 150 },
  { id: "stars_large",  reward: "stars", n: 500 },
  { id: "hints_small",  reward: "hints", n: 3   },
  { id: "hints_medium", reward: "hints", n: 10  },
  { id: "hints_large",  reward: "hints", n: 25  }
];

const _iapPriceMap = {};
let _iapInitialized = false;

function _iapAvailable() {
  return typeof CdvPurchase !== "undefined" && CdvPurchase.store;
}

async function iapInit() {
  if (_iapInitialized) return;
  if (!_iapAvailable()) return;
  _iapInitialized = true;

  const { store, ProductType, Platform } = CdvPurchase;

  const products = IAP_PRODUCTS.map(p => ({
    id: p.id,
    type: ProductType.CONSUMABLE,
    platform: Platform.GOOGLE_PLAY
  }));
  store.register(products);

  store.when()
    .productUpdated(p => {
      const offer = p.getOffer && p.getOffer();
      const phase = offer && offer.pricingPhases && offer.pricingPhases[0];
      if (phase && phase.price) {
        _iapPriceMap[p.id] = phase.price;
        _iapUpdateModalPrices();
      }
    })
    .approved(t => {
      try { t.verify(); } catch (e) { console.warn("[IAP] verify hata", e); }
    })
    .verified(r => {
      try {
        const txs = (r.sourceReceipt && r.sourceReceipt.transactions) || r.transactions || [];
        const ids = new Set();
        for (const t of txs) {
          for (const p of (t.products || [])) ids.add(p.id);
        }
        for (const id of ids) _iapGrant(id);
      } catch (e) {
        console.warn("[IAP] ödül verme hatası", e);
      }
      try { r.finish(); } catch (e) { console.warn("[IAP] finish hata", e); }
    });

  store.error(err => {
    console.warn("[IAP] hata:", err && err.code, err && err.message);
  });

  try {
    await store.initialize([Platform.GOOGLE_PLAY]);
  } catch (e) {
    console.warn("[IAP] initialize başarısız:", e);
  }
}

function _iapGrant(productId) {
  const item = IAP_PRODUCTS.find(p => p.id === productId);
  if (!item) return;
  if (typeof gaPurchase === "function") gaPurchase(productId);
  if (item.reward === "stars") {
    if (typeof addFreeStars === "function") addFreeStars(item.n);
    if (typeof showMessage === "function") showMessage(`+${item.n} ⭐ satın alındı 🎉`, "success");
    if (typeof soundWin === "function") soundWin();
    if (typeof hapticWin === "function") hapticWin();
    if (typeof closeBuyStars === "function") closeBuyStars();
  } else if (item.reward === "hints") {
    if (typeof setHints === "function" && typeof getHints === "function") {
      const max = typeof MAX_HINTS !== "undefined" ? MAX_HINTS : 99;
      setHints(Math.min(max, getHints() + item.n));
    }
    if (typeof updateHintButton === "function") updateHintButton();
    if (typeof showMessage === "function") showMessage(`+${item.n} 💡 satın alındı 🎉`, "success");
    if (typeof soundWin === "function") soundWin();
    if (typeof hapticWin === "function") hapticWin();
    if (typeof closeBuyHints === "function") closeBuyHints();
  }
}

function iapBuy(productId) {
  if (!_iapAvailable()) {
    if (typeof showMessage === "function") showMessage("Satın alma şu an kullanılamıyor.", "error");
    return;
  }
  const { store } = CdvPurchase;
  const product = store.get(productId);
  if (!product) {
    if (typeof showMessage === "function") showMessage("Ürün bulunamadı.", "error");
    return;
  }
  const offer = product.getOffer();
  if (!offer) {
    if (typeof showMessage === "function") showMessage("Bu paket şu an alınamıyor.", "error");
    return;
  }
  offer.order().then(err => {
    if (err && err.code !== CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
      console.warn("[IAP] sipariş hatası:", err.code, err.message);
      if (typeof showMessage === "function") showMessage("Satın alma başarısız.", "error");
    }
  });
}

function _iapUpdateModalPrices() {
  const elToProduct = {
    "pkg-small":       "stars_small",
    "pkg-medium":      "stars_medium",
    "pkg-large":       "stars_large",
    "hint-pkg-small":  "hints_small",
    "hint-pkg-medium": "hints_medium",
    "hint-pkg-large":  "hints_large"
  };
  for (const elId in elToProduct) {
    const price = _iapPriceMap[elToProduct[elId]];
    if (!price) continue;
    const el = document.getElementById(elId);
    if (!el) continue;
    const priceEl = el.querySelector(".pkg-price");
    if (priceEl) priceEl.textContent = price;
  }
}

// Cordova ortamında deviceready, Capacitor ortamında DOMContentLoaded ile başlat
document.addEventListener("deviceready", iapInit, false);
document.addEventListener("DOMContentLoaded", () => setTimeout(iapInit, 1500));
