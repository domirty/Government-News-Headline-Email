/**
 * メイン関数: 官庁速報メールを処理する
 */
function processGovernmentNewsEmails() {
    try {
        // 1. Gmail検索
        var threads = GmailApp.search(CONFIG.SEARCH_QUERY);

        if (threads.length === 0) {
            Logger.log("対象メールが見つかりませんでした。");
            return;
        }

        Logger.log(threads.length + " 件のスレッドが見つかりました。");

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];
            var messages = thread.getMessages();

            // スレッド内の各メッセージを処理
            for (var j = 0; j < messages.length; j++) {
                var message = messages[j];

                // すでにゴミ箱にあるものはスキップ（検索条件で除外されているはずだが念のため）
                if (message.isInTrash()) continue;

                var body = message.getPlainBody();
                var subject = message.getSubject();
                var date = message.getDate(); // 受信日時

                // 2. 解析
                Logger.log("解析中: " + subject);
                var parsedData = parseEmailBody(body);
                var headlines = parsedData.headlines;
                var schedule = parsedData.schedule;

                if (headlines.length === 0 && schedule.length === 0) {
                    Logger.log("ヘッドラインもスケジュールも抽出されませんでした。スキップします。");
                    continue;
                }

                // 3. メール本文作成 (HTML)
                var emailHtmlBody = generateEmailBody(headlines, schedule, subject, date);

                // 4. メール送信
                GmailApp.sendEmail(CONFIG.RECIPIENT_EMAIL, CONFIG.EMAIL_SUBJECT + ": " + subject, "", {
                    htmlBody: emailHtmlBody
                });

                Logger.log("メールを送信しました: " + CONFIG.RECIPIENT_EMAIL);
            }

            // 5. 処理済みメールを既読にしてアーカイブ
            thread.markRead(); // 既読にする
            thread.moveToArchive(); // アーカイブする
            Logger.log("スレッドを既読にし、アーカイブしました。");
        }

    } catch (e) {
        Logger.log("エラーが発生しました: " + e.toString());
    }
}

/**
 * 送信用のHTMLメール本文を生成する
 */
function generateEmailBody(headlines, schedule, originalSubject, date) {
    var html = '<h2>' + originalSubject + '</h2>';
    html += '<p>受信日時: ' + date.toLocaleString() + '</p>';

    // ヘッドラインセクション
    if (headlines.length > 0) {
        html += '<hr>';
        html += '<h3>▼きょうの官庁速報ヘッドライン▼</h3>';
        html += '<ul>';

        for (var k = 0; k < headlines.length; k++) {
            var headline = headlines[k];
            var searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(headline);

            html += '<li style="margin-bottom: 10px;">';
            html += '<strong>' + headline + '</strong><br>';
            html += '<a href="' + searchUrl + '" target="_blank">Google検索結果を見る</a>';
            html += '</li>';
        }
        html += '</ul>';
    }

    // スケジュールセクション
    if (schedule.length > 0) {
        html += '<hr>';
        html += '<h3>◎きょうの予定</h3>';
        html += '<div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">';
        for (var m = 0; m < schedule.length; m++) {
            html += '<div>' + schedule[m] + '</div>';
        }
        html += '</div>';
    }

    return html;
}
