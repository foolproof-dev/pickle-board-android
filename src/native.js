/**
 * ネイティブ (Android) 向けの補助機能
 * - 画面を消灯させない（試合中にスリープしないように）
 * - ステータスバーをダークテーマに合わせる（overlay しない）
 * ブラウザ上では何もしません。
 */
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();

export async function setupNative() {
  if (!isNative) return;
  try {
    const { KeepAwake } = await import('@capacitor-community/keep-awake');
    await KeepAwake.keepAwake();
  } catch (e) {
    console.log('[native] keepAwake error', e);
  }
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // overlaysWebView: false → WebView をステータスバーの下に配置
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1a1a1a' });
  } catch (e) {
    console.log('[native] statusBar error', e);
  }
}

/**
 * 結果画面のキャプチャを端末に保存・共有する
 * @param {HTMLElement} element - キャプチャ対象の DOM 要素
 * @param {string} fileName - 保存ファイル名（拡張子なし）
 */
export async function saveAndShareImage(element, fileName) {
  if (!element) return;

  try {
    // html2canvas を動的インポート
    const { default: html2canvas } = await import('html2canvas');

    const canvas = await html2canvas(element, {
      backgroundColor: '#1a1a1a',
      scale: 2, // 高解像度
      useCORS: true,
    });

    const dataUrl = canvas.toDataURL('image/png');

    if (isNative) {
      // ネイティブ：Capacitor の Filesystem + Share API を使用
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');

      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      const fullFileName = `${fileName}.png`;

      const savedFile = await Filesystem.writeFile({
        path: fullFileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: 'pickle-board Result',
        text: 'Game Result',
        url: savedFile.uri,
        dialogTitle: 'Share game result',
      });
    } else {
      // ブラウザ：ダウンロードリンクで保存
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    }
  } catch (e) {
    console.log('[native] saveAndShareImage error', e);
  }
}
