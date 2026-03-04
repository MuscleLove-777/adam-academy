/* ============================================
   ADaM仕様書アカデミー - ADaM基礎ページ JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initCDISCFlow();
  initBasicsClassCards();
  initGlossaryCards();
  initGlossarySearch();
});

/* --- CDISCフロー図のインタラクション --- */
function initCDISCFlow() {
  var flowContainer = document.getElementById("cdisc-flow");
  if (!flowContainer) return;

  var steps = flowContainer.querySelectorAll(".cdisc-flow-step");
  var detailTitle = document.getElementById("cdisc-flow-detail-title");
  var detailText = document.getElementById("cdisc-flow-detail-text");

  var flowData = {
    cdash: {
      title: "CDASH（Clinical Data Acquisition Standards Harmonization）",
      text: "CRF（症例報告書）のデータ収集項目を標準化する規格。どのような項目をどのような形式で収集するかを定義します。EDC（電子データ収集）システムのCRF設計時に参照されます。"
    },
    sdtm: {
      title: "SDTM（Study Data Tabulation Model）",
      text: "臨床試験の収集データを標準化した表形式モデル。DM（人口統計）、AE（有害事象）、LB（臨床検査）等のドメインに分類し、FDA/PMDAへの申請データの標準フォーマットとして使用されます。ADaMのソースデータとなります。"
    },
    adam: {
      title: "ADaM（Analysis Data Model）",
      text: "SDTMデータを基に、統計解析に直接使用できる形式でデータを構造化する標準モデル。変化量・ベースライン値の導出、解析フラグの設定等を行い、TFL（表・図・一覧）の出力元となります。"
    },
    define: {
      title: "define.xml（Define-XML）",
      text: "データセットのメタデータ（変数定義、導出ロジック、コードリスト等）をXML形式で記述するファイル。データの解釈と再現に不可欠で、SDTM/ADaMデータセットと共に規制当局へ提出します。"
    }
  };

  steps.forEach(function (step) {
    step.addEventListener("click", function () {
      var stepKey = this.getAttribute("data-step");
      if (!stepKey || !flowData[stepKey]) return;

      // アクティブ状態を更新
      steps.forEach(function (s) { s.classList.remove("active"); });
      this.classList.add("active");

      // 詳細を更新
      if (detailTitle) detailTitle.textContent = flowData[stepKey].title;
      if (detailText) detailText.textContent = flowData[stepKey].text;
    });
  });
}

/* --- 基礎ページ用クラスカード生成 --- */
function initBasicsClassCards() {
  var container = document.getElementById("basics-class-cards");
  if (!container || typeof DATASET_CLASSES === "undefined") return;

  var html = "";
  var keys = Object.keys(DATASET_CLASSES);

  keys.forEach(function (key) {
    var cls = DATASET_CLASSES[key];
    html +=
      '<div class="card class-card" style="border-top-color:' + cls.color + ';">' +
        '<div class="card-icon">' + cls.icon + '</div>' +
        '<div class="card-title">' + escapeHtml(cls.name) + '</div>' +
        '<div class="text-sm text-light mb-2">' + escapeHtml(cls.nameJa) + '</div>' +
        '<p class="card-text">' + escapeHtml(cls.description) + '</p>' +
        '<a href="../datasets/index.html#' + key + '" class="card-link">詳しく見る &rarr;</a>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- 用語集カードの動的生成 --- */
function initGlossaryCards() {
  var container = document.getElementById("glossary-cards");
  if (!container || typeof GLOSSARY === "undefined") return;

  renderGlossaryCards(GLOSSARY);
}

function renderGlossaryCards(items) {
  var container = document.getElementById("glossary-cards");
  var countEl = document.getElementById("glossary-count");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<p class="text-center text-light w-full" style="grid-column: 1 / -1;">該当する用語が見つかりません。</p>';
    if (countEl) countEl.textContent = "0 件の用語";
    return;
  }

  var html = "";
  items.forEach(function (item) {
    html +=
      '<div class="card glossary-card">' +
        '<div class="glossary-term">' + escapeHtml(item.term) + '</div>' +
        '<div class="glossary-full-form">' + escapeHtml(item.fullForm) + '</div>' +
        '<p class="card-text">' + escapeHtml(item.definition) + '</p>' +
      '</div>';
  });

  container.innerHTML = html;
  if (countEl) countEl.textContent = items.length + " 件の用語";
}

/* --- 用語検索フィルター --- */
function initGlossarySearch() {
  var searchInput = document.getElementById("glossary-search");
  if (!searchInput || typeof GLOSSARY === "undefined") return;

  searchInput.addEventListener("input", function () {
    var query = this.value.trim().toLowerCase();

    if (!query) {
      renderGlossaryCards(GLOSSARY);
      return;
    }

    var filtered = GLOSSARY.filter(function (item) {
      return (
        item.term.toLowerCase().indexOf(query) !== -1 ||
        item.fullForm.toLowerCase().indexOf(query) !== -1 ||
        item.definition.toLowerCase().indexOf(query) !== -1
      );
    });

    renderGlossaryCards(filtered);
  });
}
