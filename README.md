# medcheck

持病の服薬記録をつけるためのシングルページアプリ。

**公開URL: <https://www.hotoku.info/medcheck/>**

カレンダーから日付を選んで「朝食後」「夕食後」の服用を記録する。バックエンドは無く、
記録はブラウザの localStorage にのみ保存される。

## 使い方

```bash
npm install
npm run dev      # http://localhost:5173/
```

- カレンダーの日をクリックすると、右側にその日の記録UIが出る。
- 服用予定のある日にはドットが表示される（緑 = 記録済み / グレー = 未記録）。
- 前月・翌月のグレーのセルをクリックすると、その月に移動する。
- 「今月」ボタンで今日に戻る。

## 服薬スケジュール

曜日ごとの服用タイミングは `src/types.ts` の `SCHEDULE` で定義している。
現在の設定は次の通り。

| 曜日 | 朝食後 | 夕食後 |
| --- | :---: | :---: |
| 月 | ○ | ○ |
| 火 | ○ | |
| 木 | ○ | |
| 水・金・土・日 | | |

服用予定の無い日は記録UIに「本日は薬を飲む必要がありません」と表示される。
スケジュールを変えるときは `SCHEDULE` だけを書き換えればよく、カレンダーのドットも
記録UIのボタンも統計もそれに追従する。

## データの保存先

localStorage のキー `medicationData` に、次の形の JSON で保存される。

```json
{
  "2026-09-01": { "morning": true, "evening": false },
  "2026-09-02": { "morning": true }
}
```

**ブラウザのデータを消すと記録も消える。** エクスポート機能は未実装（TASKS.md B-4）。

## コマンド

```bash
npm run dev        # 開発サーバ
npm run build      # 型チェック込みのビルド（tsc -b && vite build）
npm run lint       # eslint
npm test           # テスト実行（Vitest）
npm run test:watch # テストの監視モード
npm run preview    # ビルド成果物の確認
```

## 技術スタック

React 19 / TypeScript / Vite 8 / Tailwind CSS v4

## デプロイ

`main` に push すると GitHub Actions（`.github/workflows/deploy.yml`）が
lint とテストを通してから GitHub Pages にデプロイする。

## その他

- 未対応の課題は [TASKS.md](TASKS.md) で管理している。
- 開発時の約束事は [CLAUDE.md](CLAUDE.md) に書いてある。
