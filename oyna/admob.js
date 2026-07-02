// AdMob entegrasyonu — Capacitor native'de çalışır, tarayıcıda devre dışı

const ADMOB_TEST_MODE = false;

// Gerçek ID'ler
const ADMOB_BANNER_ID_REAL       = "ca-app-pub-3265942468334559/7805367237";
const ADMOB_REWARDED_ID_REAL     = "ca-app-pub-3265942468334559/4388261163";
const ADMOB_INTERSTITIAL_ID_REAL = "ca-app-pub-3265942468334559/8603884525";

// Test ID'leri (Google'ın resmi test reklamları)
const ADMOB_BANNER_ID_TEST       = "ca-app-pub-3940256099942544/6300978111";
const ADMOB_REWARDED_ID_TEST     = "ca-app-pub-3940256099942544/5224354917";
const ADMOB_INTERSTITIAL_ID_TEST = "ca-app-pub-3940256099942544/1033173712";

const ADMOB_BANNER_ID       = ADMOB_TEST_MODE ? ADMOB_BANNER_ID_TEST       : ADMOB_BANNER_ID_REAL;
const ADMOB_REWARDED_ID     = ADMOB_TEST_MODE ? ADMOB_REWARDED_ID_TEST     : ADMOB_REWARDED_ID_REAL;
const ADMOB_INTERSTITIAL_ID = ADMOB_TEST_MODE ? ADMOB_INTERSTITIAL_ID_TEST : ADMOB_INTERSTITIAL_ID_REAL;

let admobReady = false;
let rewardedAdLoaded = false;
let interstitialAdLoaded = false;

async function admobInit() {
  if (!window.Capacitor || !window.Capacitor.Plugins.AdMob) return;
  const { AdMob } = window.Capacitor.Plugins;

  await AdMob.initialize({
    requestTrackingAuthorization: false,
    initializeForTesting: ADMOB_TEST_MODE,
  });

  admobReady = true;
  admobShowBanner();
  admobLoadRewarded();
  admobLoadInterstitial();
}

async function admobShowBanner() {
  if (!admobReady) return;
  const { AdMob } = window.Capacitor.Plugins;
  await AdMob.showBanner({
    adId: ADMOB_BANNER_ID,
    adSize: "BANNER",
    position: "BOTTOM_CENTER",
    margin: 0,
  });
}

async function admobLoadRewarded() {
  if (!admobReady || ADMOB_REWARDED_ID === "REWARDED_AD_UNIT_ID") return;
  const { AdMob } = window.Capacitor.Plugins;
  try {
    await AdMob.prepareRewardVideoAd({ adId: ADMOB_REWARDED_ID });
    rewardedAdLoaded = true;
  } catch (e) {
    rewardedAdLoaded = false;
  }
}

async function admobLoadInterstitial() {
  if (!admobReady) return;
  const { AdMob } = window.Capacitor.Plugins;
  try {
    await AdMob.prepareInterstitial({ adId: ADMOB_INTERSTITIAL_ID });
    interstitialAdLoaded = true;
  } catch (e) {
    interstitialAdLoaded = false;
  }
}

// Level geçişinde göster — game.js'den çağrılır
async function admobShowInterstitial() {
  if (!admobReady || !interstitialAdLoaded) return;
  const { AdMob } = window.Capacitor.Plugins;
  try {
    await AdMob.showInterstitial();
  } catch (e) {
    console.warn("[AdMob] Interstitial gösterilemedi:", e);
  } finally {
    interstitialAdLoaded = false;
    admobLoadInterstitial();
  }
}

// Rewarded reklam göster — ipucu kazanma akışı için game.js'den çağrılır
async function admobShowRewarded(onRewarded, onFail) {
  if (!admobReady || !rewardedAdLoaded) {
    onFail && onFail();
    return;
  }
  const { AdMob } = window.Capacitor.Plugins;

  const rewardListener = await AdMob.addListener("onRewardedVideoAdReward", () => {
    rewardListener.remove();
    rewardedAdLoaded = false;
    admobLoadRewarded(); // bir sonraki için yükle
    onRewarded && onRewarded();
  });

  try {
    await AdMob.showRewardVideoAd();
  } catch (e) {
    rewardListener.remove();
    onFail && onFail();
  }
}

// Native ortamda mı çalışıyoruz?
function isNativeApp() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

document.addEventListener("DOMContentLoaded", admobInit);
