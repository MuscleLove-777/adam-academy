/* ============================================
   ADaM仕様書アカデミー - 変数辞書ページ JS
   ============================================ */

var varState = {
  category: "all",
  classFilter: "all",
  coreFilter: "all",
  searchQuery: "",
  sortKey: "id",
  sortAsc: true,
  expandedVar: null
};

document.addEventListener("DOMContentLoaded", function () {
  initCategoryTabs();
  initFilters();
  initSortHeaders();
  renderVariableTable();
});

/* --- カテゴリタブの動的生成と初期化 --- */
function initCategoryTabs() {
  var container = document.getElementById("var-category-tabs");
  if (!container || typeof VARIABLE_CATEGORIES === "undefined") return;

  // 既存の「全て」タブの後にカテゴリタブを追加
  var html = '<button class="filter-tab active" data-category="all">全て</button>';
  VARIABLE_CATEGORIES.forEach(function (cat) {
    html += '<button class="filter-tab" data-category="' + escapeHtml(cat.id) + '">' + cat.icon + ' ' + escapeHtml(cat.id) + '</button>';
  });
  container.innerHTML = html;

  // クリックイベント
  var tabs = container.querySelectorAll(".filter-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      this.classList.add("active");
      varState.category = this.getAttribute("data-category");
      varState.expandedVar = null;
      renderVariableTable();
    });
  });
}

/* --- フィルタの初期化 --- */
function initFilters() {
  var classFilter = document.getElementById("var-class-filter");
  var coreFilter = document.getElementById("var-core-filter");
  var searchInput = document.getElementById("var-search");

  if (classFilter) {
    classFilter.addEventListener("change", function () {
      varState.classFilter = this.value;
      varState.expandedVar = null;
      renderVariableTable();
    });
  }

  if (coreFilter) {
    coreFilter.addEventListener("change", function () {
      varState.coreFilter = this.value;
      varState.expandedVar = null;
      renderVariableTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      varState.searchQuery = this.value.trim().toLowerCase();
      varState.expandedVar = null;
      renderVariableTable();
    });
  }
}

/* --- ソートヘッダーの初期化 --- */
function initSortHeaders() {
  var sortHeaders = document.querySelectorAll(".var-sortable");
  sortHeaders.forEach(function (header) {
    header.addEventListener("click", function () {
      var sortKey = this.getAttribute("data-sort");
      if (varState.sortKey === sortKey) {
        varState.sortAsc = !varState.sortAsc;
      } else {
        varState.sortKey = sortKey;
        varState.sortAsc = true;
      }
      updateSortIndicators();
      renderVariableTable();
    });
  });
}

/* --- ソートインジケータの更新 --- */
function updateSortIndicators() {
  var sortHeaders = document.querySelectorAll(".var-sortable");
  sortHeaders.forEach(function (header) {
    var indicator = header.querySelector(".sort-indicator");
    var sortKey = header.getAttribute("data-sort");
    if (sortKey === varState.sortKey) {
      indicator.textContent = varState.sortAsc ? " \u25B2" : " \u25BC";
      header.classList.add("sort-active");
    } else {
      indicator.textContent = "";
      header.classList.remove("sort-active");
    }
  });
}

/* --- 変数テーブルのレンダリング --- */
function renderVariableTable() {
  var tbody = document.getElementById("var-table-body");
  var countText = document.getElementById("var-count-text");
  if (!tbody || typeof VARIABLES === "undefined") return;

  // フィルタリング
  var filtered = VARIABLES.filter(function (v) {
    // カテゴリ
    if (varState.category !== "all" && v.category !== varState.category) return false;

    // クラス
    if (varState.classFilter !== "all" && v.classes.indexOf(varState.classFilter) === -1) return false;

    // Core
    if (varState.coreFilter !== "all" && v.core !== varState.coreFilter) return false;

    // テキスト検索
    if (varState.searchQuery) {
      var q = varState.searchQuery;
      return (
        v.id.toLowerCase().indexOf(q) !== -1 ||
        v.label.toLowerCase().indexOf(q) !== -1 ||
        v.labelJa.toLowerCase().indexOf(q) !== -1 ||
        v.description.toLowerCase().indexOf(q) !== -1
      );
    }

    return true;
  });

  // ソート
  filtered.sort(function (a, b) {
    var valA = a[varState.sortKey] || "";
    var valB = b[varState.sortKey] || "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (valA < valB) return varState.sortAsc ? -1 : 1;
    if (valA > valB) return varState.sortAsc ? 1 : -1;
    return 0;
  });

  // 件数更新
  if (countText) {
    countText.textContent = filtered.length + " 件の変数";
  }

  // テーブル生成
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-light" style="padding: 2rem;">該当する変数が見つかりません。</td></tr>';
    return;
  }

  var html = "";
  filtered.forEach(function (v) {
    var isExpanded = varState.expandedVar === v.id;
    var coreBadge = getCoreTagClass(v.core);

    // メイン行
    html += '<tr class="var-row' + (isExpanded ? " var-row-expanded" : "") + '" data-var-id="' + escapeHtml(v.id) + '">';
    html += '<td data-label="変数名"><span class="var-name var-clickable">' + escapeHtml(v.id) + '</span></td>';
    html += '<td data-label="ラベル">' + escapeHtml(v.labelJa) + '</td>';
    html += '<td data-label="型">' + escapeHtml(v.type) + '</td>';
    html += '<td data-label="Core"><span class="tag ' + coreBadge + '">' + escapeHtml(v.core) + '</span></td>';
    html += '<td data-label="クラス">';
    v.classes.forEach(function (cls) {
      var badgeClass = getClassBadgeClass(cls);
      var className = cls.toUpperCase();
      if (cls === "other") className = "Other";
      html += '<span class="badge ' + badgeClass + '" style="margin: 1px;">' + className + '</span> ';
    });
    html += '</td>';
    html += '<td data-label="カテゴリ">' + escapeHtml(v.category) + '</td>';
    html += '</tr>';

    // 詳細行（アコーディオン）
    if (isExpanded) {
      html += '<tr class="var-detail-row">';
      html += '<td colspan="6">';
      html += '<div class="var-detail">';
      html += '<div class="var-detail-grid">';
      html += '<div class="var-detail-section">';
      html += '<strong>英語ラベル:</strong> ' + escapeHtml(v.label);
      html += '</div>';
      html += '<div class="var-detail-section">';
      html += '<strong>長さ:</strong> ' + v.length;
      html += '</div>';
      html += '<div class="var-detail-section">';
      html += '<strong>ソース/導出:</strong> ' + escapeHtml(v.source);
      html += '</div>';
      html += '</div>';
      html += '<div class="var-detail-section mt-2">';
      html += '<strong>説明:</strong> ' + escapeHtml(v.description);
      html += '</div>';
      html += '</div>';
      html += '</td>';
      html += '</tr>';
    }
  });

  tbody.innerHTML = html;

  // 行クリックイベントの再バインド
  var rows = tbody.querySelectorAll(".var-row");
  rows.forEach(function (row) {
    row.addEventListener("click", function () {
      var varId = this.getAttribute("data-var-id");
      if (varState.expandedVar === varId) {
        varState.expandedVar = null;
      } else {
        varState.expandedVar = varId;
      }
      renderVariableTable();
    });
  });
}

/* --- Core値に対応するCSSクラスを返す --- */
function getCoreTagClass(core) {
  var map = {
    "Req": "tag-core-req",
    "Cond": "tag-core-cond",
    "Perm": "tag-core-perm"
  };
  return map[core] || "tag-core-perm";
}
