# 🏓 pickle-board — Android 版

ピックルボール（ダブルス）用スコアボードアプリ **pickle-board** の Android アプリ版です。
Web 版（[foolproof-dev/MyTools](https://github.com/foolproof-dev/MyTools) の `pickleball-scoreboard`）を **Capacitor** でネイティブアプリ化し、**Google AdMob** による広告収益化を組み込んでいます。

| 項目 | 内容 |
|---|---|
| アプリ ID（パッケージ名） | `dev.foolproof.pickleboard` |
| 技術スタック | React 19 (CRA) + Capacitor 8 + AdMob (`@capacitor-community/admob`) |
| 対応 OS | Android 7.0 (API 24) 以上 |
| 広告 | ゲーム終了時インタースティシャル ＋ 通常モード下部バナー |

---

## 📱 機能

- 公式ダブルスルール対応のスコアリング（11点先取・2点差、サーバー #1/#2、サイドアウト、開始時の特別ルール）
- Undo / Reset / New Game、チーム名編集
- スコア読み上げ（英語 "eight three two" 形式）
- ルール解説モーダル（日本語）
- **通常モード** と **得点盤モード**（横画面・大型スコア表示）
- **Android 向け追加機能**
  - 試合中に画面が消灯しない（Keep Awake）
  - ステータスバーをダークテーマに統一
  - ブラウザのオフライン対策としてフォントを同梱

## 💰 広告の仕様

| タイミング | 種類 | 備考 |
|---|---|---|
| 1 ゲーム終了（Winner 表示の約 1.2 秒後） | インタースティシャル（全画面） | 連続表示を防ぐため **60 秒の間隔ガード**あり。閉じると次の広告を事前読み込み |
| 通常モード表示中 | アダプティブバナー（画面下部） | 得点盤モードでは自動的に非表示 |

実装は `src/ads.js` に集約されています。ブラウザで動かしている間は広告処理は何もしません（ネイティブのみ）。

> ⚠️ **現在はすべて Google 公式のテスト用 ID** が設定されています。本番公開前に必ず差し替えてください（後述）。

---

## 📁 ディレクトリ構成

```
pickle-board-android/
├── src/
│   ├── App.js            # スコアボード本体（広告・ネイティブ機能の呼び出しを含む）
│   ├── ads.js            # AdMob 広告モジュール（ID 設定・表示制御）
│   ├── native.js         # Keep Awake / StatusBar
│   ├── RulesModal.js     # ルール解説モーダル
│   └── fonts/            # 同梱フォント (Anton / Poppins, OFL)
├── public/               # アイコン・manifest・ルール画像
├── android/              # Capacitor が生成した Android Studio プロジェクト
│   └── app/src/main/
│       ├── AndroidManifest.xml      # AdMob App ID の meta-data
│       └── res/values/strings.xml   # admob_app_id
├── docs/privacy-policy.md  # プライバシーポリシー（Play / AdMob で必須）
├── capacitor.config.ts
└── package.json
```

---

## 🛠️ 開発環境のセットアップ

### 必要なもの

- Node.js 18 以上
- **JDK 21**（Capacitor 8 の要件）
- **Android Studio**（Android SDK Platform 36 / Build-Tools 36 を含む）
- 実機または Android エミュレータ

### 手順

```bash
git clone https://github.com/foolproof-dev/pickle-board-android.git
cd pickle-board-android
npm install

# Web 版をブラウザで動作確認（広告は表示されません）
npm start

# Web をビルド → Android プロジェクトへ同期 → Android Studio を開く
npm run android:open
```

Android Studio が開いたら **▶ Run** でエミュレータ／実機にインストールされます。
テスト広告（"Test Ad" と表示される）がゲーム終了時と画面下部に出れば成功です。

### npm スクリプト一覧

| コマンド | 内容 |
|---|---|
| `npm start` | Web 版の開発サーバー |
| `npm test` | テスト実行 |
| `npm run build` | Web 版の本番ビルド（`build/`） |
| `npm run android:sync` | build → `npx cap sync android` |
| `npm run android:open` | sync → Android Studio を開く |
| `npm run android:run` | sync → 接続中の端末で実行 |
| `npm run android:debug-apk` | sync → デバッグ APK 生成（`android/app/build/outputs/apk/debug/`） |
| `npm run android:release-aab` | sync → リリース AAB 生成（署名設定が必要） |

すべてのスクリプトは **Windows / macOS / Linux 共通**で動作します（Gradle は `scripts/gradlew.js` が OS に応じて `gradlew.bat` / `./gradlew` を呼び分けます）。ビルド設定の環境変数は `.env` に記載しています。

> **Web 側のコードを変更したら、必ず `npm run android:sync` を実行**してから Android をビルドしてください。

---

## 🚀 公開までのロードマップ

### 1. AdMob アカウントの準備（あなたの作業）

1. [AdMob](https://admob.google.com/) に Google アカウントで登録
2. 「アプリ」→「アプリを追加」→ プラットフォーム Android、「ストアに公開済みか」は **いいえ** で登録
3. **アプリ ID**（`ca-app-pub-XXXX~XXXX` 形式、`~` を含む）を控える
4. 「広告ユニット」で以下を 2 つ作成し、**広告ユニット ID**（`ca-app-pub-XXXX/XXXX` 形式、`/` を含む）を控える
   - バナー
   - インタースティシャル
5. 「お支払い」から受取口座を設定（残高 $100 以上で支払い）

### 2. 本番 ID の差し替え

| ファイル | 差し替え箇所 |
|---|---|
| `android/app/src/main/res/values/strings.xml` | `admob_app_id` → アプリ ID（`~` 入り） |
| `src/ads.js` | `PROD_IDS.banner` / `PROD_IDS.interstitial` → 広告ユニット ID（`/` 入り） |

`PROD_IDS` に本番 ID が入り、かつ `npm run build`（production）でビルドされたときのみ本番広告が使われます。
`npm start` の開発モードでは常にテスト広告です。

> ⚠️ 本番 ID のまま自分の端末で何度もタップ・表示を繰り返すと、無効なトラフィックとして **AdMob アカウントが停止**される恐れがあります。動作確認はテスト ID、または AdMob の「テストデバイス」登録で行ってください。

### 3. 署名鍵（keystore）の作成

```bash
keytool -genkey -v -keystore pickle-board-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias pickle-board
```

- `pickle-board-release.jks` と各パスワードは **絶対に紛失・公開しない**（紛失するとアプリの更新ができなくなります）
- `.gitignore` で `*.jks` / `keystore.properties` は除外済みです

`android/keystore.properties` を作成:

```properties
storeFile=/absolute/path/to/pickle-board-release.jks
storePassword=********
keyAlias=pickle-board
keyPassword=********
```

`android/app/build.gradle` の `android { }` 内に署名設定を追加:

```groovy
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ...既存の設定...
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 4. リリース AAB のビルド

```bash
npm run android:release-aab
# → android/app/build/outputs/bundle/release/app-release.aab
```

バージョンを上げるときは `android/app/build.gradle` の `versionCode`（整数、毎回 +1）と `versionName` を更新します。

### 5. プライバシーポリシーの公開

`docs/privacy-policy.md` を公開 URL にする必要があります（Play Console・AdMob の両方で要求されます）。
最も簡単なのは GitHub Pages:

1. GitHub リポジトリ → Settings → Pages → Source を `main` / `/docs` に設定
2. `https://foolproof-dev.github.io/pickle-board-android/privacy-policy` で公開されます

### 6. Google Play Console への登録

1. [Google Play Console](https://play.google.com/console/) にデベロッパー登録（**$25、初回のみ**、本人確認あり）
2. 「アプリを作成」→ アプリ名 `pickle-board`、無料、アプリ
3. **ストアの掲載情報**：説明文、アイコン 512×512（`picture/512×512.png`）、フィーチャーグラフィック 1024×500、スクリーンショット（スマホ 2 枚以上）
4. **アプリのコンテンツ**：プライバシーポリシー URL、広告 **「はい、広告を含む」**、データセーフティ（AdMob による広告 ID・おおよその位置情報の収集を申告）、コンテンツレーティング、対象年齢
5. **テスト**：個人アカウントの場合、本番公開前に **20 人以上のテスターで 14 日間のクローズドテスト**が必須です
6. 製品版リリースを作成 → AAB をアップロード → 審査へ

### 7. 公開後

- AdMob 側のアプリ設定で「ストアに公開済み」として Play ストアのリンクを紐付け
- app-ads.txt の設定（AdMob の案内に従う。収益の最適化に有効）

---

## 🔧 トラブルシューティング

| 症状 | 対処 |
|---|---|
| `invalid source release: 21` | JDK 21 を使用してください（`JAVA_HOME` の確認） |
| `'GENERATE_SOURCEMAP' は、内部コマンドまたは外部コマンド…` (Windows) | 旧バージョンの `package.json` です。`git pull` して最新にしてください（環境変数は `.env` に移動済み） |
| `npx cap open android` で Android Studio が開かない | 環境変数 `CAPACITOR_ANDROID_STUDIO_PATH` に Android Studio の実行ファイル（例: `C:\\Program Files\\Android\\Android Studio\\bin\\studio64.exe`）を設定するか、Android Studio から `android/` フォルダを直接開いてください |
| Gradle daemon が落ちる（メモリ不足） | `android/gradle.properties` の `org.gradle.jvmargs=-Xmx1536m` を環境に合わせて調整 |
| 広告が表示されない | ネイティブ (Android) でのみ動作します。Logcat で `[ads]` を検索してエラー確認。インタースティシャルは読み込み完了前のゲーム終了ではスキップされ、次回表示されます |
| Web を変更したのにアプリに反映されない | `npm run android:sync` を実行してからビルド |
| ルール画像が表示されない | `package.json` の `"homepage": "."` が残っているか確認 |

---

## 📝 ライセンス・クレジット

- フォント: [Anton](https://fonts.google.com/specimen/Anton), [Poppins](https://fonts.google.com/specimen/Poppins)（SIL Open Font License）
- Web 版オリジナル: [foolproof-dev/MyTools](https://github.com/foolproof-dev/MyTools)
