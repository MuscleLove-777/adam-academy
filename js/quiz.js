/* ============================================
   ADaM理解度クイズ - quiz.js
   ============================================ */

(function () {
  "use strict";

  var currentQuestion = 0;
  var score = 0;
  var answers = [];    // { questionId, selected, correct, isCorrect }
  var answered = false;
  var totalQuestions = 0;

  /* --- 初期化 --- */
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof QUIZ_DATA === "undefined" || QUIZ_DATA.length === 0) return;

    totalQuestions = QUIZ_DATA.length;
    initQuiz();
    initNavButtons();
  });

  /* =========================================
     クイズ初期化
     ========================================= */
  function initQuiz() {
    currentQuestion = 0;
    score = 0;
    answers = [];
    answered = false;

    // 表示切り替え
    document.getElementById("quiz-screen").style.display = "block";
    document.getElementById("quiz-result").style.display = "none";

    // トータル表示
    document.getElementById("quiz-total").textContent = totalQuestions;

    showQuestion(currentQuestion);
  }

  function initNavButtons() {
    var btnNext = document.getElementById("btn-next-q");
    var btnRetry = document.getElementById("btn-retry");

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
          showQuestion(currentQuestion);
        } else {
          showResult();
        }
      });
    }

    if (btnRetry) {
      btnRetry.addEventListener("click", function () {
        initQuiz();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* =========================================
     問題表示
     ========================================= */
  function showQuestion(index) {
    var q = QUIZ_DATA[index];
    answered = false;

    // 進捗更新
    document.getElementById("quiz-current").textContent = "問" + (index + 1);
    var progress = ((index) / totalQuestions) * 100;
    document.getElementById("quiz-progress-fill").style.width = progress + "%";

    // 問題文
    document.getElementById("quiz-q-number").textContent = "Q" + (index + 1);
    document.getElementById("quiz-q-text").textContent = q.question;

    // 選択肢
    var choicesContainer = document.getElementById("quiz-choices");
    var html = "";
    var labels = ["A", "B", "C", "D"];

    q.choices.forEach(function (choice, i) {
      html +=
        '<button class="quiz-choice-btn" data-index="' + i + '">' +
          '<span class="quiz-choice-label">' + labels[i] + '</span>' +
          '<span class="quiz-choice-text">' + escapeHtml(choice) + '</span>' +
        '</button>';
    });

    choicesContainer.innerHTML = html;

    // フィードバック非表示
    document.getElementById("quiz-feedback").classList.remove("active", "correct", "incorrect");

    // 次へボタン非表示
    document.getElementById("btn-next-q").style.display = "none";

    // 最後の問題なら「結果を見る」に変更
    if (index === totalQuestions - 1) {
      document.getElementById("btn-next-q").textContent = "結果を見る";
    } else {
      document.getElementById("btn-next-q").textContent = "次の問題へ";
    }

    // 選択肢クリックイベント
    var buttons = choicesContainer.querySelectorAll(".quiz-choice-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (answered) return;
        handleAnswer(parseInt(this.getAttribute("data-index")));
      });
    });
  }

  /* =========================================
     回答処理
     ========================================= */
  function handleAnswer(selectedIndex) {
    answered = true;
    var q = QUIZ_DATA[currentQuestion];
    var isCorrect = selectedIndex === q.answer;

    if (isCorrect) {
      score++;
    }

    answers.push({
      questionId: q.id,
      selected: selectedIndex,
      correct: q.answer,
      isCorrect: isCorrect
    });

    // 選択肢のスタイル更新
    var buttons = document.querySelectorAll(".quiz-choice-btn");
    buttons.forEach(function (btn, i) {
      btn.classList.add("disabled");
      if (i === q.answer) {
        btn.classList.add("correct");
      }
      if (i === selectedIndex && !isCorrect) {
        btn.classList.add("incorrect");
      }
    });

    // フィードバック表示
    var feedback = document.getElementById("quiz-feedback");
    var fbIcon = document.getElementById("quiz-fb-icon");
    var fbLabel = document.getElementById("quiz-fb-label");
    var fbExplanation = document.getElementById("quiz-fb-explanation");

    feedback.classList.add("active");

    if (isCorrect) {
      feedback.classList.add("correct");
      feedback.classList.remove("incorrect");
      fbIcon.textContent = "\u25CB";
      fbLabel.textContent = "正解！";
    } else {
      feedback.classList.add("incorrect");
      feedback.classList.remove("correct");
      fbIcon.textContent = "\u00D7";
      fbLabel.textContent = "不正解";
    }

    fbExplanation.textContent = q.explanation;

    // 次へボタン表示
    document.getElementById("btn-next-q").style.display = "inline-flex";

    // 進捗バー更新
    var progress = ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById("quiz-progress-fill").style.width = progress + "%";
  }

  /* =========================================
     結果表示
     ========================================= */
  function showResult() {
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("quiz-result").style.display = "block";

    // スコア表示
    document.getElementById("quiz-score-num").textContent = score;
    document.getElementById("quiz-score-total").textContent = "/ " + totalQuestions;

    // スコアサークルの色
    var circle = document.getElementById("quiz-score-circle");
    var percentage = (score / totalQuestions) * 100;
    if (percentage >= 90) {
      circle.style.borderColor = "#059669";
      circle.style.color = "#059669";
    } else if (percentage >= 70) {
      circle.style.borderColor = "#0891b2";
      circle.style.color = "#0891b2";
    } else if (percentage >= 50) {
      circle.style.borderColor = "#d97706";
      circle.style.color = "#d97706";
    } else {
      circle.style.borderColor = "#dc2626";
      circle.style.color = "#dc2626";
    }

    // 診断結果
    var result = getQuizResult(score);
    document.getElementById("quiz-result-title").textContent = result.title;
    document.getElementById("quiz-result-desc").textContent = result.description;
    document.getElementById("quiz-result-advice").innerHTML =
      '<div class="quiz-advice-box">' +
        '<strong>アドバイス:</strong> ' + escapeHtml(result.advice) +
      '</div>';

    // 正誤一覧
    var reviewList = document.getElementById("quiz-review-list");
    var html = "";

    answers.forEach(function (a, index) {
      var q = QUIZ_DATA[index];
      var labels = ["A", "B", "C", "D"];
      var statusClass = a.isCorrect ? "review-correct" : "review-incorrect";
      var statusIcon = a.isCorrect ? "\u25CB" : "\u00D7";

      html +=
        '<div class="quiz-review-item ' + statusClass + '">' +
          '<div class="quiz-review-header">' +
            '<span class="quiz-review-status">' + statusIcon + '</span>' +
            '<span class="quiz-review-q-num">Q' + (index + 1) + '</span>' +
            '<span class="quiz-review-q-text">' + escapeHtml(q.question) + '</span>' +
          '</div>' +
          '<div class="quiz-review-body">' +
            '<div class="quiz-review-answer">' +
              '<span class="text-sm">あなたの回答: <strong>' + labels[a.selected] + '. ' + escapeHtml(q.choices[a.selected]) + '</strong></span>' +
              (!a.isCorrect ? '<br><span class="text-sm" style="color: var(--color-success);">正解: <strong>' + labels[a.correct] + '. ' + escapeHtml(q.choices[a.correct]) + '</strong></span>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
    });

    reviewList.innerHTML = html;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getQuizResult(score) {
    if (typeof QUIZ_RESULTS === "undefined") {
      return { title: "結果", description: "", advice: "" };
    }

    var keys = ["expert", "advanced", "intermediate", "beginner", "novice"];
    for (var i = 0; i < keys.length; i++) {
      var r = QUIZ_RESULTS[keys[i]];
      if (score >= r.min) {
        return r;
      }
    }

    return QUIZ_RESULTS.novice;
  }

  /* --- ユーティリティ --- */
  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();
