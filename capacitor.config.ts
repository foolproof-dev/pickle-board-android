import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.foolproof.pickleboard',
  appName: 'pickle-board',
  webDir: 'build',
  android: {
    // Capacitor は WebView 内で https://localhost から配信します
    allowMixedContent: false,
  },
  plugins: {
    AdMob: {
      // AdMob SDK の初期化はアプリ側 (src/ads.js) で行います
    },
  },
};

export default config;
