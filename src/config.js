/**
 * 設定ファイル
 */
var CONFIG = {
    // Gmail検索クエリ (例: 特定の件名や送信者)
    // ユーザー様: ここを実際のメールに合わせて変更してください
    SEARCH_QUERY: 'subject:"官庁速報ヘッドラインメール" is:inbox',

    // 送信先メールアドレス
    // ユーザー様: ここを受信したいメールアドレスに変更してください
    RECIPIENT_EMAIL: 'dt.domi@gmail.com',

    // 送信元メールアドレス (オプション: 指定しない場合は実行ユーザーのアドレス)
    // SENDER_EMAIL: 'sender@example.com',

    // 送信されるメールの件名
    EMAIL_SUBJECT: '官庁速報ヘッドライン・検索リンク集'
};
