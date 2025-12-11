/**
 * メール本文から必要な情報を解析する
 * @param {string} body - メールのプレーンテキスト本文
 * @returns {object} - { headlines: string[], schedule: string[] }
 */
function parseEmailBody(body) {
    var result = {
        headlines: [],
        schedule: []
    };

    // 共通の区切り線パターン (*10個以上)
    var separatorRegex = /\*{10,}/;

    // --- 1. ヘッドライン抽出 ---
    var headlinesStartMarker = "▼きょうの官庁速報ヘッドライン▼";
    var headlinesStartIndex = body.indexOf(headlinesStartMarker);

    if (headlinesStartIndex !== -1) {
        // マーカー以降のテキスト
        var textAfterMarker = body.substring(headlinesStartIndex + headlinesStartMarker.length);

        // 直後の区切り線を探す
        var firstSeparatorMatch = textAfterMarker.match(separatorRegex);
        if (firstSeparatorMatch) {
            var contentStartIndex = firstSeparatorMatch.index + firstSeparatorMatch[0].length;
            var textContent = textAfterMarker.substring(contentStartIndex);

            // 次の区切り線を探す（これがヘッドラインセクションの終わり）
            var secondSeparatorMatch = textContent.match(separatorRegex);

            var headlinesBlock = "";
            if (secondSeparatorMatch) {
                headlinesBlock = textContent.substring(0, secondSeparatorMatch.index);
            } else {
                headlinesBlock = textContent;
            }

            // 行ごとの処理
            var lines = headlinesBlock.split(/\r?\n/);
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line) {
                    // URLを除外
                    if (line.indexOf('https://www.jamp.jiji.com/') === -1) {
                        result.headlines.push(line);
                    }
                }
            }
        }
    } else {
        Logger.log("ヘッドライン開始マーカーが見つかりませんでした");
    }

    // --- 2. スケジュール抽出 "◎きょうの予定" ---
    var scheduleStartMarker = "◎きょうの予定";
    var scheduleStartIndex = body.indexOf(scheduleStartMarker);

    if (scheduleStartIndex !== -1) {
        // "◎きょうの予定" の次の文字から開始しないで、マーカー自体は含めず、その次から探す
        // ただし、もしマーカー自体も含めたいなら textAfterScheduleMarker にマーカーを含めるなどが考えられるが、
        // ここでは本文として抽出するのでマーカー以降を取得する
        var textAfterSchedule = body.substring(scheduleStartIndex);

        // マーカーの直後から、次の「*******」までを取得
        // textAfterSchedule は "◎きょうの予定..." で始まっている

        // 次の区切り線を探す
        var scheduleEndMatch = textAfterSchedule.match(separatorRegex);

        var scheduleBlock = "";
        if (scheduleEndMatch) {
            scheduleBlock = textAfterSchedule.substring(0, scheduleEndMatch.index);
        } else {
            scheduleBlock = textAfterSchedule;
        }

        // 行ごとに分割して保存（空白行は維持するか、トリムするかは要件次第だが、読みやすくするためトリムして入れる）
        var sLines = scheduleBlock.split(/\r?\n/);
        for (var j = 0; j < sLines.length; j++) {
            var sLine = sLines[j].trim();
            if (sLine) {
                result.schedule.push(sLine);
            }
        }
    } else {
        Logger.log("スケジュール開始マーカーが見つかりませんでした");
    }

    return result;
}
