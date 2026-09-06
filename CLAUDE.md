# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

持病の服薬記録をつける SPA。React 19 + TypeScript + Vite 8 + Tailwind CSS v4。
バックエンドは無く、データはブラウザの localStorage にのみ保存される。
UI 文言・コミットメッセージ・TASKS.md はすべて日本語。

## コマンド

```bash
npm run dev        # 開発サーバ (http://localhost:5173/)
npm run build      # tsc -b && vite build ... 型チェック込み
npm run lint       # eslint
npm test           # vitest run ... 1 回実行
npm run test:watch # vitest ... 監視モード
npm run preview    # ビルド成果物の確認

npx vitest run src/calendar.test.ts        # ファイル単位
npx vitest run -t "閏年"                    # テスト名で絞り込み
```

**テストは Vitest**。`src/*.test.ts` に置く。DOM を使わない純粋関数だけを対象に
しているので jsdom は入れていない。**コンポーネントから計算ロジックを取り出して
テストする方針**（`buildCalendarDays` がその例）。

## 課題管理は TASKS.md で行う

- 課題は `TASKS.md` に ID 付きチェックボックス（`A-1`, `B-2` …）で管理する。
  カテゴリは **A=バグ / B=仕様 / C=後片付け / D=環境**。
- 完了したら `- [ ]` を `- [x]` に変え、**完了日とコミットハッシュ**を子項目に追記する。
  項目を削除したり ID を振り直したりしない（欠番のまま残す）。
- 「着手順の案」セクションからも完了項目を外す。
- 新しく気づいた課題は、その場で直さない場合は TASKS.md に追記する。

## アーキテクチャ

コンポーネントは 3 つだけで、状態は `src/App.tsx` が一手に持つ。
`Calendar` と `MedicationRecord` は props を受け取るだけの表示コンポーネント。
カレンダーのマス目を組み立てる `buildCalendarDays()` は `src/calendar.ts` の
純粋関数に切り出してある（テストのため）。

**日付の状態が 2 つあり、役割が違う** — ここの取り違えが既知バグの原因になっている:

- `currentDate` … カレンダーが表示している「月」。前月/翌月ボタンが動かす。
- `selectedDate` … 右側の記録UIが対象にしている「日」。日セルのクリックが動かす。

**データ形状** — `MedicationData = Record<"YYYY-MM-DD", { morning?: boolean; evening?: boolean }>`。
localStorage のキーは `"medicationData"`。`App.tsx` の `useEffect` が `data` 全体を
毎回書き戻す方式。

**`SCHEDULE`（`src/types.ts`）が曜日 → 服用タイミングの唯一の定義**。
カレンダーのドット表示も、記録UIに出るボタンも、統計の対象も、すべてここを参照して
決まる。服薬スケジュールを変えるときはこの 1 箇所だけを触れば全体が連動する。

**日付はすべてローカルタイムで扱う**。`dateToKey()` がローカルタイムでキー文字列を
組み立て、`Date` の生成は引数なしか数値引数（`new Date(year, month, day)`）のみ。
**日付キーを `new Date(key)` で読み戻さないこと** — 文字列の `"YYYY-MM-DD"` は UTC 深夜
として解釈されるため、この非対称性を持ち込むとタイムゾーンによって 1 日ずれる。
以前は統計パネルと `keyToDate()` がこれをやっていたが、どちらも削除済み。

## 踏みやすい罠

1. **Tailwind は v4**。`@tailwind base;` 等のディレクティブと `tailwind.config.js` は
   v3 の書き方で、使うとビルドが落ちる。CSS は `@import "tailwindcss";` の 1 行のみ、
   PostCSS プラグインは `@tailwindcss/postcss`。autoprefixer は v4 が内蔵するので不要。
2. **未使用の import があるとビルドが落ちる**。`tsconfig.app.json` の `noUnusedLocals` /
   `noUnusedParameters` による。`npm run dev` は通っても `npm run build` で失敗するので、
   変更後は `npm run build` まで確認する。
3. **`verbatimModuleSyntax: true`** — 型だけを import する箇所は必ず `import type` を使う。
4. **`erasableSyntaxOnly: true`** — `enum` とコンストラクタのパラメータプロパティは使えない。
5. **`README.md` は Vite のテンプレートのまま**で、このアプリの説明ではない（TASKS.md C-3）。
   記述を参照しないこと。

## Git

**`main` に直接コミットしない。作業ごとに必ずトピックブランチを切る。**

```bash
git switch main
git switch -c fix/a-1-selected-date-highlight   # ブランチ名は下記の規則で
# ... 作業 ...
npm run build && npm run lint                    # 通してからコミット
npm run dev                                      # ブランチ上で動作確認（マージ前に必須）
git switch main
git merge --no-ff fix/a-1-selected-date-highlight
git branch -d fix/a-1-selected-date-highlight
```

- **ブランチ名**: `<種別>/<課題ID>-<英小文字の短い説明>`
  例: `fix/a-1-selected-date-highlight`、`chore/c-1-remove-unused-files`。
  種別は `fix` / `feat` / `chore` / `docs`。TASKS.md に無い作業は課題IDを省いてよい。
- **1 ブランチ 1 課題**。複数の課題をまとめない。
- **マージ前に、そのブランチ上で開発サーバを起動してブラウザで動作確認する。**
  `npm run build` と `npm run lint` が通っただけではマージしない。
  - この環境にはヘッドレスブラウザが入っていないため、**Claude は描画結果を見られない**。
    Claude は `npm run dev` を起動したうえで「どこを見てほしいか」を具体的に伝え、
    **ユーザーの確認を待ってからマージする**。自己判断でマージを進めない。
  - HTTP レスポンスやビルドの成否は Claude 側で確認できるので、そこまでは先に潰しておく。
  - 画面に影響しない変更（CLAUDE.md / TASKS.md / README.md などドキュメントのみ）は対象外。
- **マージは `--no-ff`** で行い、トピックブランチの単位を履歴に残す。マージ後はブランチを削除する。
- TASKS.md の更新も同じブランチに含める。完了記録にはコミットハッシュを書くため、
  修正をコミットした後に TASKS.md を更新する 2 コミット構成になる。
- コミットメッセージは日本語で書く。
- リモートは未設定。将来 GitHub に置く場合はこのフローが PR ベースに変わる。
