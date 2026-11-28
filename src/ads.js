/**
 * AdMob 広告モジュール
 *
 * - インタースティシャル : 結果画面で「Next Game」を押した時に全画面表示
 *
 * ネイティブ (Android) 上でのみ動作し、ブラウザ上では何もしません。
 *
 * ■ 本番公開前にやること
 *   1. AdMob コンソールでアプリと広告ユニット（インタースティシャル）を作成
 *   2. 下記 PROD_IDS を本番の広告ユニット ID に差し替え
 *   3. android/app/src/main/res/values/strings.xml の admob_app_id を本番アプリ ID に差し替え
 *   ※ 開発中は必ずテスト ID を使うこと（本番 ID でテスト表示を繰り返すとアカウント停止のリスクがあります）
 */
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  InterstitialAdPluginEvents,
} from '@capacitor-community/admob';

// Google 公式のテスト用広告ユニット ID（Android）
// https://developers.google.com/admob/android/test-ads
const TEST_IDS = {
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
};

// 本番用 ID（AdMob コンソールで発行後に差し替える）
const PROD_IDS = {
  interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
};

// 本番 ID が設定済み かつ production ビルドのときのみ本番広告を使う
const isProdIdsConfigured = !PROD_IDS.interstitial.includes('XXXX');
const USE_TEST_ADS = process.env.NODE_ENV !== 'production' || !isProdIdsConfigured;
const IDS = USE_TEST_ADS ? TEST_IDS : PROD_IDS;

// インタースティシャルの表示間隔（ミリ秒）。短時間に連続表示しないためのガード
const MIN_INTERSTITIAL_INTERVAL_MS = 60 * 1000;

const isNative = Capacitor.isNativePlatform();

let initialized = false;
let interstitialReady = false;
let lastInterstitialShownAt = 0;

const log = (...args) => console.log('[ads]', ...args);

/** AdMob SDK を初期化し、最初のインタースティシャルを事前読み込みする */
export async function initAds() {
  if (!isNative || initialized) return;
  try {
    await AdMob.initialize({
      initializeForTesting: USE_TEST_ADS,
    });
    initialized = true;
    log('initialized', USE_TEST_ADS ? '(TEST ADS)' : '(PRODUCTION ADS)');

    AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
      interstitialReady = true;
      log('interstitial loaded');
    });
    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (err) => {
      interstitialReady = false;
      log('interstitial failed to load', err);
    });
    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      interstitialReady = false;
      // 閉じられたら次回に備えて再読み込み
      prepareInterstitial();
    });
    AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (err) => {
      interstitialReady = false;
      log('interstitial failed to show', err);
      prepareInterstitial();
    });

    await prepareInterstitial();
  } catch (e) {
    log('initialize error', e);
  }
}

/** インタースティシャルを事前読み込み */
export async function prepareInterstitial() {
  if (!isNative || !initialized) return;
  try {
    await AdMob.prepareInterstitial({
      adId: IDS.interstitial,
      isTesting: USE_TEST_ADS,
    });
  } catch (e) {
    interstitialReady = false;
    log('prepareInterstitial error', e);
  }
}

/**
 * インタースティシャル広告を表示する。
 * 表示→閉じるまで待ち、完了後に resolve する Promise を返す。
 * @returns {Promise<boolean>} 表示できたか
 */
export function showInterstitialAndWait() {
  if (!isNative || !initialized) return Promise.resolve(false);
  const now = Date.now();
  if (now - lastInterstitialShownAt < MIN_INTERSTITIAL_INTERVAL_MS) {
    log('interstitial skipped (interval guard)');
    return Promise.resolve(false);
  }
  if (!interstitialReady) {
    log('interstitial not ready, preparing for next time');
    prepareInterstitial();
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    // 広告が閉じられた or 表示失敗で resolve する一回限りのリスナー
    const onDone = () => {
      resolve(true);
    };
    const onFail = () => {
      resolve(false);
    };

    // Dismissed / FailedToShow は initAds で常時リスナーがあるが、
    // ここでは Promise 解決用に一時リスナーを追加
    const dismissHandle = AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      dismissHandle.remove();
      failHandle.remove();
      onDone();
    });
    const failHandle = AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
      dismissHandle.remove();
      failHandle.remove();
      onFail();
    });

    AdMob.showInterstitial()
      .then(() => {
        lastInterstitialShownAt = Date.now();
      })
      .catch((e) => {
        log('showInterstitial error', e);
        dismissHandle.remove();
        failHandle.remove();
        prepareInterstitial();
        resolve(false);
      });
  });
}

export const adsInfo = { isNative, useTestAds: USE_TEST_ADS };
