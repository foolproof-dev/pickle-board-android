#!/usr/bin/env node
/**
 * Cross-platform Gradle wrapper runner.
 * Windows では gradlew.bat、macOS/Linux では ./gradlew を android/ ディレクトリで実行する。
 * 使い方: node scripts/gradlew.js assembleDebug
 */
const { spawnSync } = require('child_process');
const path = require('path');

const androidDir = path.join(__dirname, '..', 'android');
const isWin = process.platform === 'win32';
const cmd = isWin ? 'gradlew.bat' : './gradlew';
const args = process.argv.slice(2);

const result = spawnSync(cmd, args, {
  cwd: androidDir,
  stdio: 'inherit',
  shell: isWin,
});

process.exit(result.status === null ? 1 : result.status);
