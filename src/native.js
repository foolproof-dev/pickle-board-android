/**
 * ネイティブ (Android) 向けの補助機能
 * - 画面を消灯させない（試合中にスリープしないように）
 * - ステータスバーをダークテーマに合わせる
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
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1a1a1a' });
  } catch (e) {
    console.log('[native] statusBar error', e);
  }
}
