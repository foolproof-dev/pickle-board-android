import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.foolproof.pickleboard',
  appName: 'pickle-board',
  webDir: 'build',
  android: {
    // Capacitor は WebView 内で https://localhost から配信します
    allowMixedContent: false,
    // WebView をステータスバーの下に配置（重なり防止）
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    AdMob: {
      // AdMob SDK の初期化はアプリ側 (src/ads.js) で行います
    },
    StatusBar: {
      // ステータスバーをオーバーレイにしない（WebView と重ならない）
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#1a1a1a',
    },
  },
};

export default config;
