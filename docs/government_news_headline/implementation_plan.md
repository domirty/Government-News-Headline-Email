# 実装計画: 官庁速報ヘッドライン処理

## ファイル構成
- `src/config.js`: 設定ファイル（検索クエリ、送信先アドレス、除外パターンなど）。
- `src/parser.js`: メール本文からヘッドラインを抽出するロジック。
- `src/main.js`: メインの処理フロー（メール取得、処理、送信、削除）。

## 詳細ステップ

### 1. 設定 (`src/config.js`)
- `SEARCH_QUERY`: 対象メールを特定するためのGmail検索クエリ（例: `from:news@example.com subject:"官庁速報"`）。
- `RECIPIENT_EMAIL`: 結果リストの送信先。
- `EMAIL_SUBJECT_PREFIX`: 送信メールの件名プレフィックス。

### 2. 解析ロジック (`src/parser.js`)
- `extractHeadlines(body)`:
    - メール本文を行ごとに分割。
    - 空行や特定の定型文（フッターなど）を除外。
    - ヘッドラインと思われる行をリストとして返す。
    - ※正規表現やフィルタリング条件は初期実装ではシンプルにし、必要に応じて拡張可能にする。

### 3. メイン処理 (`src/main.js`)
- `processEmails()`:
    - `GmailApp.search(SEARCH_QUERY)` でスレッドを取得。
    - 各スレッドの各メッセージに対してループ。
    - `extractHeadlines` を呼び出し。
    - 各ヘッドラインに対して検索URLを生成: `https://www.google.com/search?q=${encodeURIComponent(headline)}`
    - HTML形式またはテキスト形式で送信メール本文を構築。
        - HTMLの場合: `<ul><li><a href="...">headline</a></li>...</ul>`
    - `GmailApp.sendEmail` で送信。
    - 成功後、`message.moveToTrash()` を実行。

## ユーザーへの確認事項
- 実際に受信しているメールの件名や送信元アドレス。
- 見出しの具体的なフォーマット（「・」で始まる、番号付き、など）。

## 実行環境
Google Apps Script (GAS) 環境を想定。
ローカルでは `.js` として保存するが、GASエディタ上では `.gs` として扱われる。
