/* ============================================
   ADaM仕様書ビルダー - builder.js
   ============================================ */

(function () {
  "use strict";

  var currentStep = 1;
  var selectedDataset = null;
  var selectedVars = [];       // { id, required }
  var additionalVars = [];     // 追加変数のIDリスト
  var modalSelectedVars = [];  // モーダル内で一時選択中

  /* --- 初期化 --- */
  document.addEventListener("DOMContentLoaded", function () {
    initDatasetCards();
    initWizardNav();
    initModal();
    initExportButtons();
  });

  /* =========================================
     ステップ1: データセット選択
     ========================================= */
  function initDatasetCards() {
    var container = document.getElementById("dataset-cards");
    if (!container || typeof SPEC_TEMPLATES === "undefined") return;

    var html = "";
    var keys = Object.keys(SPEC_TEMPLATES);

    keys.forEach(function (key) {
      var tmpl = SPEC_TEMPLATES[key];
      // DATASET_CLASSESから対応クラス情報を取得
      var ds = findDataset(key);
      var classKey = ds ? ds.class : "other";
      var classInfo = DATASET_CLASSES[classKey] || {};
      var badgeClass = getBadgeClass(classKey);

      html +=
        '<div class="card dataset-select-card" data-dataset="' + key + '">' +
          '<div class="dataset-select-radio">' +
            '<span class="dataset-radio-dot"></span>' +
          '</div>' +
          '<div class="dataset-select-info">' +
            '<div class="flex gap-2" style="align-items:center; margin-bottom: 0.25rem;">' +
              '<strong class="var-name" style="font-size: 1.1rem;">' + escapeHtml(tmpl.name) + '</strong>' +
              '<span class="badge ' + badgeClass + '" style="font-size: 0.7rem;">' + escapeHtml(classInfo.name || classKey.toUpperCase()) + '</span>' +
            '</div>' +
            '<p class="text-sm text-light mb-0">' + escapeHtml(tmpl.description) + '</p>' +
            '<p class="text-sm mt-1 mb-0" style="color: var(--color-accent);">' +
              '必須: ' + tmpl.requiredVars.length + '変数 / オプション: ' + tmpl.optionalVars.length + '変数' +
            '</p>' +
          '</div>' +
        '</div>';
    });

    container.innerHTML = html;

    // カードクリックイベント
    var cards = container.querySelectorAll(".dataset-select-card");
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        cards.forEach(function (c) { c.classList.remove("selected"); });
        card.classList.add("selected");
        selectedDataset = card.getAttribute("data-dataset");
        document.getElementById("btn-next-1").disabled = false;
      });
    });
  }

  function findDataset(key) {
    if (typeof DATASETS === "undefined") return null;
    for (var i = 0; i < DATASETS.length; i++) {
      if (DATASETS[i].id === key) return DATASETS[i];
    }
    return null;
  }

  function getBadgeClass(classKey) {
    var map = { adsl: "badge-adsl", bds: "badge-bds", occds: "badge-occds", other: "badge-other" };
    return map[classKey] || "badge-other";
  }

  /* =========================================
     ステップ2: 変数選択
     ========================================= */
  function buildVariableSelection() {
    if (!selectedDataset) return;

    var tmpl = SPEC_TEMPLATES[selectedDataset];
    if (!tmpl) return;

    selectedVars = [];
    additionalVars = [];

    // 必須変数リスト
    var reqHtml = "";
    tmpl.requiredVars.forEach(function (varId) {
      var v = findVariable(varId);
      if (!v) return;
      selectedVars.push({ id: varId, required: true });

      reqHtml += buildVarCheckItem(v, true, true);
    });
    document.getElementById("required-vars-list").innerHTML = reqHtml;

    // オプション変数リスト
    var optHtml = "";
    tmpl.optionalVars.forEach(function (varId) {
      var v = findVariable(varId);
      if (!v) return;
      selectedVars.push({ id: varId, required: false });

      optHtml += buildVarCheckItem(v, false, true);
    });
    document.getElementById("optional-vars-list").innerHTML = optHtml;

    // 追加変数エリアをリセット
    document.getElementById("additional-vars-list").innerHTML =
      '<p class="text-sm text-light" id="no-additional-msg">追加変数はまだありません</p>';

    // オプション変数のチェック切り替え
    bindOptionalCheckboxes();
  }

  function buildVarCheckItem(v, isRequired, isChecked) {
    var coreBadge = getCoreTag(v.core);
    var disabledAttr = isRequired ? ' disabled checked' : (isChecked ? ' checked' : '');
    var requiredLabel = isRequired ? '<span class="var-required-label">必須</span>' : '';

    return (
      '<label class="var-check-item' + (isRequired ? ' var-check-required' : '') + '">' +
        '<input type="checkbox" class="var-checkbox" data-var-id="' + escapeHtml(v.id) + '"' + disabledAttr + '>' +
        '<div class="var-check-info">' +
          '<div class="var-check-name">' +
            '<span class="var-name">' + escapeHtml(v.id) + '</span>' +
            requiredLabel +
            coreBadge +
          '</div>' +
          '<div class="var-check-label">' + escapeHtml(v.labelJa || v.label) + '</div>' +
        '</div>' +
      '</label>'
    );
  }

  function getCoreTag(core) {
    var cls = "tag-core-perm";
    if (core === "Req") cls = "tag-core-req";
    else if (core === "Cond") cls = "tag-core-cond";
    return '<span class="tag ' + cls + '" style="font-size: 0.7rem; padding: 0.1rem 0.4rem;">' + escapeHtml(core) + '</span>';
  }

  function findVariable(varId) {
    if (typeof VARIABLES === "undefined") return null;
    // AVAL_TTE は特殊名。AVALとして検索する前に完全一致を試みる
    for (var i = 0; i < VARIABLES.length; i++) {
      if (VARIABLES[i].id === varId) return VARIABLES[i];
    }
    return null;
  }

  function bindOptionalCheckboxes() {
    var checkboxes = document.querySelectorAll("#optional-vars-list .var-checkbox");
    checkboxes.forEach(function (cb) {
      cb.addEventListener("change", function () {
        var varId = this.getAttribute("data-var-id");
        if (this.checked) {
          // 追加
          if (!isVarSelected(varId)) {
            selectedVars.push({ id: varId, required: false });
          }
        } else {
          // 削除
          selectedVars = selectedVars.filter(function (v) { return v.id !== varId; });
        }
      });
    });
  }

  function isVarSelected(varId) {
    for (var i = 0; i < selectedVars.length; i++) {
      if (selectedVars[i].id === varId) return true;
    }
    return false;
  }

  /* =========================================
     変数追加モーダル
     ========================================= */
  function initModal() {
    var modal = document.getElementById("add-var-modal");
    var btnAdd = document.getElementById("btn-add-var");
    var btnClose = document.getElementById("modal-close");
    var btnCancel = document.getElementById("modal-cancel");
    var btnConfirm = document.getElementById("modal-add");
    var searchInput = document.getElementById("var-search");

    if (!btnAdd) return;

    btnAdd.addEventListener("click", function () {
      openModal();
    });

    btnClose.addEventListener("click", closeModal);
    btnCancel.addEventListener("click", closeModal);

    // オーバーレイクリックで閉じる
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    // 検索フィルター
    searchInput.addEventListener("input", function () {
      filterModalVars(this.value.trim().toLowerCase());
    });

    // 追加確定
    btnConfirm.addEventListener("click", function () {
      addSelectedModalVars();
      closeModal();
    });
  }

  function openModal() {
    modalSelectedVars = [];
    var modal = document.getElementById("add-var-modal");
    var searchInput = document.getElementById("var-search");
    searchInput.value = "";

    buildModalVarList("");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    searchInput.focus();
  }

  function closeModal() {
    var modal = document.getElementById("add-var-modal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
    modalSelectedVars = [];
  }

  function buildModalVarList(filter) {
    var container = document.getElementById("modal-var-list");
    if (!container || typeof VARIABLES === "undefined") return;

    // 選択中データセットのクラスを取得
    var ds = findDataset(selectedDataset);
    var dsClass = ds ? ds.class : null;

    // 既に選択済み or 必須/オプションのIDリスト
    var existingIds = selectedVars.map(function (v) { return v.id; });
    additionalVars.forEach(function (id) {
      if (existingIds.indexOf(id) === -1) existingIds.push(id);
    });

    var html = "";
    var count = 0;

    VARIABLES.forEach(function (v) {
      // 既に選択済みの変数は除外
      if (existingIds.indexOf(v.id) !== -1) return;

      // 該当クラスの変数のみ表示（またはフィルターに一致）
      var matchClass = dsClass && v.classes && v.classes.indexOf(dsClass) !== -1;
      var matchFilter = true;

      if (filter) {
        var searchStr = (v.id + " " + v.label + " " + (v.labelJa || "") + " " + v.category).toLowerCase();
        matchFilter = searchStr.indexOf(filter) !== -1;
      }

      if (!matchClass && !filter) return;
      if (filter && !matchFilter) return;

      var coreBadge = getCoreTag(v.core);
      var isSelected = modalSelectedVars.indexOf(v.id) !== -1;

      html +=
        '<label class="var-check-item modal-var-item' + (isSelected ? ' modal-var-selected' : '') + '">' +
          '<input type="checkbox" class="var-checkbox modal-var-cb" data-var-id="' + escapeHtml(v.id) + '"' + (isSelected ? ' checked' : '') + '>' +
          '<div class="var-check-info">' +
            '<div class="var-check-name">' +
              '<span class="var-name">' + escapeHtml(v.id) + '</span>' +
              coreBadge +
              '<span class="text-sm text-light" style="margin-left: 0.25rem;">(' + escapeHtml(v.category) + ')</span>' +
            '</div>' +
            '<div class="var-check-label">' + escapeHtml(v.labelJa || v.label) + '</div>' +
          '</div>' +
        '</label>';
      count++;
    });

    if (count === 0) {
      html = '<p class="text-sm text-light text-center pt-3 pb-3">該当する変数が見つかりません</p>';
    }

    container.innerHTML = html;

    // チェックボックスイベント
    var checkboxes = container.querySelectorAll(".modal-var-cb");
    checkboxes.forEach(function (cb) {
      cb.addEventListener("change", function () {
        var varId = this.getAttribute("data-var-id");
        if (this.checked) {
          if (modalSelectedVars.indexOf(varId) === -1) {
            modalSelectedVars.push(varId);
          }
          this.closest(".modal-var-item").classList.add("modal-var-selected");
        } else {
          modalSelectedVars = modalSelectedVars.filter(function (id) { return id !== varId; });
          this.closest(".modal-var-item").classList.remove("modal-var-selected");
        }
      });
    });
  }

  function filterModalVars(filter) {
    buildModalVarList(filter);
  }

  function addSelectedModalVars() {
    if (modalSelectedVars.length === 0) return;

    var listContainer = document.getElementById("additional-vars-list");
    var noMsg = document.getElementById("no-additional-msg");
    if (noMsg) noMsg.remove();

    modalSelectedVars.forEach(function (varId) {
      if (isVarSelected(varId) || additionalVars.indexOf(varId) !== -1) return;

      var v = findVariable(varId);
      if (!v) return;

      additionalVars.push(varId);
      selectedVars.push({ id: varId, required: false });

      // DOMに追加
      var item = document.createElement("div");
      item.innerHTML = buildAdditionalVarItem(v);
      listContainer.appendChild(item.firstChild);
    });

    // 削除ボタンイベント
    bindRemoveButtons();
  }

  function buildAdditionalVarItem(v) {
    var coreBadge = getCoreTag(v.core);
    return (
      '<div class="var-check-item var-additional-item" data-var-id="' + escapeHtml(v.id) + '">' +
        '<div class="var-check-info" style="flex:1;">' +
          '<div class="var-check-name">' +
            '<span class="var-name">' + escapeHtml(v.id) + '</span>' +
            coreBadge +
          '</div>' +
          '<div class="var-check-label">' + escapeHtml(v.labelJa || v.label) + '</div>' +
        '</div>' +
        '<button class="btn-remove-var" data-var-id="' + escapeHtml(v.id) + '" title="削除">&times;</button>' +
      '</div>'
    );
  }

  function bindRemoveButtons() {
    var buttons = document.querySelectorAll(".btn-remove-var");
    buttons.forEach(function (btn) {
      btn.onclick = function () {
        var varId = this.getAttribute("data-var-id");
        // 配列から削除
        additionalVars = additionalVars.filter(function (id) { return id !== varId; });
        selectedVars = selectedVars.filter(function (v) { return v.id !== varId; });
        // DOM削除
        var item = this.closest(".var-additional-item");
        if (item) item.remove();
        // 追加変数が空ならメッセージ表示
        if (additionalVars.length === 0) {
          var listContainer = document.getElementById("additional-vars-list");
          listContainer.innerHTML = '<p class="text-sm text-light" id="no-additional-msg">追加変数はまだありません</p>';
        }
      };
    });
  }

  /* =========================================
     ステップ3: プレビュー＆出力
     ========================================= */
  function buildSpecPreview() {
    if (!selectedDataset) return;

    var tmpl = SPEC_TEMPLATES[selectedDataset];
    var ds = findDataset(selectedDataset);
    var classInfo = ds ? DATASET_CLASSES[ds.class] : null;

    // ヘッダー情報
    var headerHtml =
      '<div class="spec-header-grid">' +
        '<div class="spec-header-item">' +
          '<span class="spec-header-label">データセット名</span>' +
          '<span class="spec-header-value"><strong class="var-name" style="font-size: 1.2rem;">' + escapeHtml(tmpl.name) + '</strong></span>' +
        '</div>' +
        '<div class="spec-header-item">' +
          '<span class="spec-header-label">説明</span>' +
          '<span class="spec-header-value">' + escapeHtml(tmpl.description) + '</span>' +
        '</div>' +
        '<div class="spec-header-item">' +
          '<span class="spec-header-label">クラス</span>' +
          '<span class="spec-header-value">' +
            (classInfo ? '<span class="badge ' + getBadgeClass(ds.class) + '">' + escapeHtml(classInfo.name) + '</span> ' + escapeHtml(classInfo.nameJa) : '-') +
          '</span>' +
        '</div>' +
        '<div class="spec-header-item">' +
          '<span class="spec-header-label">ソートキー</span>' +
          '<span class="spec-header-value"><code class="var-name">' + escapeHtml(tmpl.sortKeys) + '</code></span>' +
        '</div>' +
      '</div>';
    document.getElementById("spec-header").innerHTML = headerHtml;

    // テーブル生成
    var tbody = document.getElementById("spec-table-body");
    var html = "";
    var count = 0;

    // 選択された変数を順番に表示
    selectedVars.forEach(function (sv) {
      var v = findVariable(sv.id);
      if (!v) return;
      count++;

      var coreBadge = getCoreTag(v.core);

      html +=
        '<tr>' +
          '<td>' + count + '</td>' +
          '<td><span class="var-name">' + escapeHtml(v.id) + '</span></td>' +
          '<td>' + escapeHtml(v.labelJa || v.label) + '</td>' +
          '<td>' + escapeHtml(v.type) + '</td>' +
          '<td>' + v.length + '</td>' +
          '<td>' + coreBadge + '</td>' +
          '<td><div class="spec-source-cell" contenteditable="true" data-var-id="' + escapeHtml(v.id) + '">' + escapeHtml(v.source || "") + '</div></td>' +
        '</tr>';
    });

    tbody.innerHTML = html;
  }

  /* =========================================
     CSVダウンロード / クリップボードコピー
     ========================================= */
  function initExportButtons() {
    var btnCsv = document.getElementById("btn-csv");
    var btnCsvBottom = document.getElementById("btn-csv-bottom");
    var btnCopy = document.getElementById("btn-copy");
    var btnCopyBottom = document.getElementById("btn-copy-bottom");

    if (btnCsv) btnCsv.addEventListener("click", downloadCSV);
    if (btnCsvBottom) btnCsvBottom.addEventListener("click", downloadCSV);
    if (btnCopy) btnCopy.addEventListener("click", copyToClipboard);
    if (btnCopyBottom) btnCopyBottom.addEventListener("click", copyToClipboard);
  }

  function getTableData() {
    var rows = [];
    // ヘッダー行
    rows.push(["No.", "変数名", "ラベル", "型", "長さ", "Core", "ソース/導出方法"]);

    var count = 0;
    selectedVars.forEach(function (sv) {
      var v = findVariable(sv.id);
      if (!v) return;
      count++;

      // ソース列は編集されている可能性がある
      var sourceCell = document.querySelector('.spec-source-cell[data-var-id="' + sv.id + '"]');
      var source = sourceCell ? sourceCell.textContent.trim() : (v.source || "");

      rows.push([
        String(count),
        v.id,
        v.labelJa || v.label,
        v.type,
        String(v.length),
        v.core,
        source
      ]);
    });

    return rows;
  }

  function downloadCSV() {
    var rows = getTableData();
    var tmpl = SPEC_TEMPLATES[selectedDataset];
    var csvContent = "";

    // データセット情報ヘッダー
    csvContent += "# データセット: " + tmpl.name + "\r\n";
    csvContent += "# 説明: " + tmpl.description + "\r\n";
    csvContent += "# ソートキー: " + tmpl.sortKeys + "\r\n";
    csvContent += "\r\n";

    rows.forEach(function (row) {
      var line = row.map(function (cell) {
        // ダブルクオートをエスケープ
        var escaped = cell.replace(/"/g, '""');
        return '"' + escaped + '"';
      }).join(",");
      csvContent += line + "\r\n";
    });

    // BOM付きUTF-8
    var bom = "\uFEFF";
    var blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = tmpl.name + "_spec.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    var rows = getTableData();
    var text = "";

    rows.forEach(function (row) {
      text += row.join("\t") + "\n";
    });

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("クリップボードにコピーしました");
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast("クリップボードにコピーしました");
    } catch (e) {
      showToast("コピーに失敗しました");
    }
    document.body.removeChild(textarea);
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    var msgEl = toast.querySelector(".toast-message");
    if (msgEl) msgEl.textContent = message;
    toast.classList.add("active");
    setTimeout(function () {
      toast.classList.remove("active");
    }, 2500);
  }

  /* =========================================
     ウィザードナビゲーション
     ========================================= */
  function initWizardNav() {
    var btnNext1 = document.getElementById("btn-next-1");
    var btnBack2 = document.getElementById("btn-back-2");
    var btnNext2 = document.getElementById("btn-next-2");
    var btnBack3 = document.getElementById("btn-back-3");

    if (btnNext1) {
      btnNext1.addEventListener("click", function () {
        if (!selectedDataset) return;
        buildVariableSelection();
        goToStep(2);
      });
    }

    if (btnBack2) {
      btnBack2.addEventListener("click", function () { goToStep(1); });
    }

    if (btnNext2) {
      btnNext2.addEventListener("click", function () {
        // オプション変数の選択状態を再確認
        syncOptionalVars();
        buildSpecPreview();
        goToStep(3);
      });
    }

    if (btnBack3) {
      btnBack3.addEventListener("click", function () { goToStep(2); });
    }
  }

  function syncOptionalVars() {
    // オプション変数のチェック状態を selectedVars に同期
    var tmpl = SPEC_TEMPLATES[selectedDataset];
    if (!tmpl) return;

    tmpl.optionalVars.forEach(function (varId) {
      var cb = document.querySelector('#optional-vars-list .var-checkbox[data-var-id="' + varId + '"]');
      if (!cb) return;

      if (cb.checked && !isVarSelected(varId)) {
        selectedVars.push({ id: varId, required: false });
      } else if (!cb.checked) {
        selectedVars = selectedVars.filter(function (v) { return v.id !== varId; });
      }
    });
  }

  function goToStep(step) {
    var oldStep = currentStep;
    currentStep = step;

    // スライドの表示切り替え
    var slides = document.querySelectorAll(".wizard-slide");
    var direction = step > oldStep ? "slide-left" : "slide-right";

    slides.forEach(function (slide) {
      slide.classList.remove("active", "slide-left", "slide-right");
    });

    var targetSlide = document.getElementById("step-" + step);
    if (targetSlide) {
      targetSlide.classList.add("active", direction);
      // アニメーション後にクラス削除
      setTimeout(function () {
        targetSlide.classList.remove("slide-left", "slide-right");
      }, 400);
    }

    // インジケーター更新
    updateIndicator(step);

    // スクロールをトップに
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateIndicator(step) {
    var steps = document.querySelectorAll(".wizard-step");
    var lines = document.querySelectorAll(".wizard-step-line");

    steps.forEach(function (s, idx) {
      var stepNum = idx + 1;
      s.classList.remove("active", "completed");
      if (stepNum === step) {
        s.classList.add("active");
      } else if (stepNum < step) {
        s.classList.add("completed");
      }
    });

    lines.forEach(function (line, idx) {
      line.classList.remove("active");
      if (idx < step - 1) {
        line.classList.add("active");
      }
    });
  }

  /* --- ユーティリティ --- */
  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();
