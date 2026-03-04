/* ============================================
   ADaM仕様書アカデミー - データセット詳細ページ JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initDatasetTabs();
  renderClassDetail(getCurrentClass());
  window.addEventListener("hashchange", function () {
    var cls = getCurrentClass();
    setActiveTab(cls);
    renderClassDetail(cls);
  });
});

/* --- 現在のクラスをURLハッシュから取得 --- */
function getCurrentClass() {
  var hash = window.location.hash.replace("#", "");
  var validClasses = ["adsl", "bds", "occds", "other"];
  if (validClasses.indexOf(hash) !== -1) return hash;
  return "adsl";
}

/* --- タブ初期化 --- */
function initDatasetTabs() {
  var tabs = document.querySelectorAll(".ds-tab");
  var currentClass = getCurrentClass();

  tabs.forEach(function (tab) {
    var cls = tab.getAttribute("data-class");
    if (cls === currentClass) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }

    tab.addEventListener("click", function () {
      var targetClass = this.getAttribute("data-class");
      window.location.hash = targetClass;
    });
  });
}

/* --- アクティブタブの設定 --- */
function setActiveTab(classKey) {
  var tabs = document.querySelectorAll(".ds-tab");
  tabs.forEach(function (tab) {
    if (tab.getAttribute("data-class") === classKey) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

/* --- クラス詳細のレンダリング --- */
function renderClassDetail(classKey) {
  var container = document.getElementById("ds-detail-container");
  if (!container || typeof DATASET_CLASSES === "undefined") return;

  var cls = DATASET_CLASSES[classKey];
  if (!cls) return;

  var html = "";

  // --- クラス概要 ---
  html += '<div class="ds-overview card mb-4" style="border-left: 4px solid ' + cls.color + ';">';
  html += '<div class="flex gap-3" style="align-items: flex-start;">';
  html += '<div style="font-size: 2.5rem;">' + cls.icon + '</div>';
  html += '<div>';
  html += '<h2 style="margin-bottom: 0.25rem;">' + escapeHtml(cls.name) + ' <span class="text-light text-sm">(' + escapeHtml(cls.fullName) + ')</span></h2>';
  html += '<div class="text-light mb-2">' + escapeHtml(cls.nameJa) + '</div>';
  html += '<p>' + escapeHtml(cls.description) + '</p>';
  html += '<div class="ds-when-to-use"><strong>いつ使うか:</strong> ' + escapeHtml(cls.whenToUse) + '</div>';
  html += '</div>';
  html += '</div>';
  html += '</div>';

  // --- 重要ポイント ---
  html += '<div class="card mb-4">';
  html += '<h3 class="mb-3">重要ポイント</h3>';
  html += '<ul class="ds-key-points">';
  cls.keyPoints.forEach(function (point) {
    html += '<li>' + escapeHtml(point) + '</li>';
  });
  html += '</ul>';
  html += '</div>';

  // --- ソースデータセット ---
  html += '<div class="card mb-4">';
  html += '<h3 class="mb-3">ソースデータセット</h3>';
  html += '<div class="tag-list">';
  cls.sourceDatasets.forEach(function (src) {
    html += '<span class="tag tag-variable">' + escapeHtml(src) + '</span>';
  });
  html += '</div>';
  html += '</div>';

  // --- 代表的データセット ---
  var classDatasets = [];
  if (typeof DATASETS !== "undefined") {
    classDatasets = DATASETS.filter(function (ds) {
      return ds.class === classKey;
    });
  }

  if (classDatasets.length > 0) {
    html += '<h3 class="mb-3">このクラスの代表的データセット</h3>';
    html += '<div class="grid grid-2 mb-4">';
    classDatasets.forEach(function (ds) {
      html += '<div class="card">';
      html += '<div class="card-title"><span class="var-name">' + escapeHtml(ds.name) + '</span></div>';
      html += '<div class="text-sm text-light mb-2">' + escapeHtml(ds.nameJa) + '</div>';
      html += '<p class="card-text">' + escapeHtml(ds.description) + '</p>';
      html += '<div class="flex gap-3 mt-2 flex-wrap" style="font-size: var(--font-size-sm);">';
      html += '<span class="text-light">頻度: ' + escapeHtml(ds.frequency) + '</span>';
      html += '<span class="text-light">ソース: ' + escapeHtml(ds.primarySource) + '</span>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  // --- 主要変数一覧テーブル ---
  var classVars = [];
  if (typeof VARIABLES !== "undefined") {
    classVars = VARIABLES.filter(function (v) {
      return v.classes.indexOf(classKey) !== -1;
    });
  }

  if (classVars.length > 0) {
    html += '<h3 class="mb-3">このクラスの主要変数一覧</h3>';
    html += '<div class="table-responsive-cards mb-4">';
    html += '<div class="table-wrapper">';
    html += '<table class="data-table">';
    html += '<thead><tr>';
    html += '<th>変数名</th><th>ラベル</th><th>型</th><th>Core</th><th>説明</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    classVars.forEach(function (v) {
      var coreBadge = getCoreClass(v.core);
      html += '<tr>';
      html += '<td data-label="変数名"><span class="var-name">' + escapeHtml(v.id) + '</span></td>';
      html += '<td data-label="ラベル">' + escapeHtml(v.labelJa) + '</td>';
      html += '<td data-label="型">' + escapeHtml(v.type) + '</td>';
      html += '<td data-label="Core"><span class="tag ' + coreBadge + '">' + escapeHtml(v.core) + '</span></td>';
      html += '<td data-label="説明" class="text-sm">' + escapeHtml(truncateText(v.description, 60)) + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += '</div>';
    html += '</div>';
  }

  // --- サンプルデータ ---
  html += '<h3 class="mb-3">サンプルデータ</h3>';
  html += renderSampleData(classKey);

  container.innerHTML = html;

  // スクロールトップ
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* --- Core値に対応するCSSクラスを返す --- */
function getCoreClass(core) {
  var map = {
    "Req": "tag-core-req",
    "Cond": "tag-core-cond",
    "Perm": "tag-core-perm"
  };
  return map[core] || "tag-core-perm";
}

/* --- テキスト切り詰め --- */
function truncateText(text, maxLen) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + "...";
}

/* --- サンプルデータの動的生成 --- */
function renderSampleData(classKey) {
  var sampleData = getSampleData(classKey);
  if (!sampleData) return '<p class="text-light">サンプルデータはありません。</p>';

  var html = '<div class="table-wrapper mb-4">';
  html += '<table class="data-table sample-data-table">';
  html += '<thead><tr>';
  sampleData.headers.forEach(function (h) {
    html += '<th>' + escapeHtml(h) + '</th>';
  });
  html += '</tr></thead>';
  html += '<tbody>';
  sampleData.rows.forEach(function (row) {
    html += '<tr>';
    row.forEach(function (cell) {
      html += '<td>' + escapeHtml(cell) + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  html += '</div>';
  html += '<p class="text-sm text-light">* サンプルデータは学習用の架空データです。</p>';

  return html;
}

function getSampleData(classKey) {
  var samples = {
    adsl: {
      headers: ["STUDYID", "USUBJID", "SUBJID", "AGE", "SEX", "RACE", "TRT01P", "TRT01A", "ITTFL", "SAFFL"],
      rows: [
        ["ABC-001", "ABC-001-001", "001", "55", "M", "WHITE", "Drug A 10mg", "Drug A 10mg", "Y", "Y"],
        ["ABC-001", "ABC-001-002", "002", "42", "F", "ASIAN", "Placebo", "Placebo", "Y", "Y"],
        ["ABC-001", "ABC-001-003", "003", "68", "M", "WHITE", "Drug A 10mg", "Drug A 10mg", "Y", "N"]
      ]
    },
    bds: {
      headers: ["STUDYID", "USUBJID", "PARAMCD", "PARAM", "AVISIT", "AVISITN", "ADT", "AVAL", "BASE", "CHG", "ABLFL", "ANL01FL"],
      rows: [
        ["ABC-001", "ABC-001-001", "ALT", "ALT (U/L)", "Baseline", "0", "2024-01-15", "25", "25", "", "Y", "Y"],
        ["ABC-001", "ABC-001-001", "ALT", "ALT (U/L)", "Week 4", "4", "2024-02-12", "30", "25", "5", "", "Y"],
        ["ABC-001", "ABC-001-001", "ALT", "ALT (U/L)", "Week 8", "8", "2024-03-11", "28", "25", "3", "", "Y"],
        ["ABC-001", "ABC-001-002", "ALT", "ALT (U/L)", "Baseline", "0", "2024-01-18", "22", "22", "", "Y", "Y"],
        ["ABC-001", "ABC-001-002", "ALT", "ALT (U/L)", "Week 4", "4", "2024-02-15", "20", "22", "-2", "", "Y"],
        ["ABC-001", "ABC-001-002", "ALT", "ALT (U/L)", "Week 8", "8", "2024-03-14", "21", "22", "-1", "", "Y"],
        ["ABC-001", "ABC-001-003", "SYSBP", "Systolic BP (mmHg)", "Baseline", "0", "2024-01-20", "135", "135", "", "Y", "Y"],
        ["ABC-001", "ABC-001-003", "SYSBP", "Systolic BP (mmHg)", "Week 4", "4", "2024-02-17", "128", "135", "-7", "", "Y"],
        ["ABC-001", "ABC-001-003", "SYSBP", "Systolic BP (mmHg)", "Week 8", "8", "2024-03-16", "125", "135", "-10", "", "Y"]
      ]
    },
    occds: {
      headers: ["STUDYID", "USUBJID", "AETERM", "AEDECOD", "AEBODSYS", "AESEV", "AESER", "AEREL", "ASTDT", "AOCCFL", "AOCCPFL"],
      rows: [
        ["ABC-001", "ABC-001-001", "頭痛", "Headache", "Nervous system disorders", "MILD", "N", "RELATED", "2024-01-20", "Y", "Y"],
        ["ABC-001", "ABC-001-001", "悪心", "Nausea", "Gastrointestinal disorders", "MILD", "N", "RELATED", "2024-02-05", "", "Y"],
        ["ABC-001", "ABC-001-001", "頭痛", "Headache", "Nervous system disorders", "MODERATE", "N", "RELATED", "2024-02-15", "", ""],
        ["ABC-001", "ABC-001-002", "発疹", "Rash", "Skin disorders", "MILD", "N", "NOT RELATED", "2024-02-01", "Y", "Y"],
        ["ABC-001", "ABC-001-003", "下痢", "Diarrhoea", "Gastrointestinal disorders", "MILD", "N", "RELATED", "2024-01-25", "Y", "Y"],
        ["ABC-001", "ABC-001-003", "肝機能異常", "Hepatic function abnormal", "Hepatobiliary disorders", "SEVERE", "Y", "RELATED", "2024-03-01", "", "Y"]
      ]
    },
    other: {
      headers: ["STUDYID", "USUBJID", "PARAMCD", "PARAM", "STARTDT", "ADT", "AVAL", "CNSR", "EVNTDESC"],
      rows: [
        ["ABC-001", "ABC-001-001", "PFS", "Progression Free Survival (Days)", "2024-01-15", "2024-06-10", "147", "0", "Disease Progression"],
        ["ABC-001", "ABC-001-002", "PFS", "Progression Free Survival (Days)", "2024-01-18", "2024-07-18", "182", "1", "Censored at last assessment"],
        ["ABC-001", "ABC-001-003", "PFS", "Progression Free Survival (Days)", "2024-01-20", "2024-04-20", "91", "0", "Death"],
        ["ABC-001", "ABC-001-001", "OS", "Overall Survival (Days)", "2024-01-15", "2024-09-15", "244", "1", "Censored - alive"],
        ["ABC-001", "ABC-001-002", "OS", "Overall Survival (Days)", "2024-01-18", "2024-09-18", "244", "1", "Censored - alive"],
        ["ABC-001", "ABC-001-003", "OS", "Overall Survival (Days)", "2024-01-20", "2024-04-20", "91", "0", "Death"]
      ]
    }
  };

  return samples[classKey] || null;
}
