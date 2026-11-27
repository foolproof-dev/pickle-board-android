/**
 * AdMob 広告モジュール
 *
 * - バナー広告      : 通常モードの画面下部に表示（得点盤モードでは非表示）
 * - インタースティシャル : 1ゲーム終了時（Winner 表示後）に全画面表示
 *
 * ネイティブ (Android) 上でのみ動作し、ブラウザ上では何もしません。
 *
 * ■ 本番公開前にやること
 *   1. AdMob コンソールでアプリと広告ユニット（バナー／インタースティシャル）を作成
 *   2. 下記 PROD_IDS を本番の広告ユニット ID に差し替え
 *   3. android/app/src/main/res/values/strings.xml の admob_app_id を本番アプリ ID に差し替え
 *   ※ 開発中は必ずテスト ID を使うこと（本番 ID でテスト表示を繰り返すとアカウント停止のリスクがあります）
 */
import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  BannerAdPosition,
  BannerAdSize,
  InterstitialAdPluginEvents,
} from '@capacitor-community/admob';

// Google 公式のテスト用広告ユニット ID（Android）
// https://developers.google.com/admob/android/test-ads
const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
};

// 本番用 ID（AdMob コンソールで発行後に差し替える）
const PROD_IDS = {
  banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
};

// 本番 ID が設定済み かつ production ビルドのときのみ本番広告を使う
const isProdIdsConfigured = !PROD_IDS.banner.includes('XXXX');
const USE_TEST_ADS = process.env.NODE_ENV !== 'production' || !isProdIdsConfigured;
const IDS = USE_TEST_ADS ? TEST_IDS : PROD_IDS;

// インタースティシャルの表示間隔（ミリ秒）。短時間に連続表示しないためのガード
const MIN_INTERSTITIAL_INTERVAL_MS = 60 * 1000;

const isNative = Capacitor.isNativePlatform();

let initialized = false;
let interstitialReady = false;
let lastInterstitialShownAt = 0;
let bannerVisible = false;

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
 * ゲーム終了時に呼び出す。読み込み済みなら全画面広告を表示する。
 * @returns {Promise<boolean>} 表示できたか
 */
export async function showInterstitialIfReady() {
  if (!isNative || !initialized) return false;
  const now = Date.now();
  if (now - lastInterstitialShownAt < MIN_INTERSTITIAL_INTERVAL_MS) {
    log('interstitial skipped (interval guard)');
    return false;
  }
  if (!interstitialReady) {
    log('interstitial not ready, preparing for next time');
    prepareInterstitial();
    return false;
  }
  try {
    await AdMob.showInterstitial();
    lastInterstitialShownAt = now;
    return true;
  } catch (e) {
    log('showInterstitial error', e);
    prepareInterstitial();
    return false;
  }
}

/** 画面下部にバナーを表示 */
export async function showBanner() {
  if (!isNative || !initialized || bannerVisible) return;
  try {
    await AdMob.showBanner({
      adId: IDS.banner,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: USE_TEST_ADS,
    });
    bannerVisible = true;
  } catch (e) {
    log('showBanner error', e);
  }
}

/** バナーを非表示（得点盤モードなど） */
export async function hideBanner() {
  if (!isNative || !initialized || !bannerVisible) return;
  try {
    await AdMob.hideBanner();
    bannerVisible = false;
  } catch (e) {
    log('hideBanner error', e);
  }
}

/** 非表示にしたバナーを再表示 */
export async function resumeBanner() {
  if (!isNative || !initialized) return;
  if (!bannerVisible) {
    // 一度も表示していない or removeBanner 済みなら showBanner
    return showBanner();
  }
  try {
    await AdMob.resumeBanner();
  } catch (e) {
    log('resumeBanner error', e);
  }
}

export const adsInfo = { isNative, useTestAds: USE_TEST_ADS };
