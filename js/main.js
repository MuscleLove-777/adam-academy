/* ============================================
   ADaM仕様書アカデミー - メインJS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initHamburgerMenu();
  initNavDropdown();
  initClassCards();
  initDatasetsTable();
  initGuideSteps();
  initSmoothScroll();
  initFadeInAnimation();
});

/* --- ハンバーガーメニュー開閉 --- */
function initHamburgerMenu() {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    var isOpen = mobileMenu.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // メニュー内リンククリックで閉じる
  var links = mobileMenu.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    });
  });
}

/* --- デスクトップナビ ドロップダウン --- */
function initNavDropdown() {
  var dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach(function (dropdown) {
    var toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    // クリックで開閉
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      // 他のドロップダウンを閉じる
      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.classList.remove("active");
        }
      });
      dropdown.classList.toggle("active");
    });

    // ホバーで開閉（デスクトップ）
    dropdown.addEventListener("mouseenter", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.add("active");
      }
    });

    dropdown.addEventListener("mouseleave", function () {
      if (window.innerWidth >= 1024) {
        dropdown.classList.remove("active");
      }
    });
  });

  // ドキュメントクリックで全ドロップダウンを閉じる
  document.addEventListener("click", function () {
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove("active");
    });
  });
}

/* --- データセットクラスバッジクラス取得 --- */
function getClassBadgeClass(classKey) {
  var classMap = {
    adsl: "badge-adsl",
    bds: "badge-bds",
    occds: "badge-occds",
    other: "badge-other"
  };
  return classMap[classKey] || "badge-other";
}

/* --- データセットクラスカード生成 --- */
function initClassCards() {
  var container = document.getElementById("class-cards");
  if (!container || typeof DATASET_CLASSES === "undefined") return;

  var html = "";
  var keys = Object.keys(DATASET_CLASSES);

  keys.forEach(function (key) {
    var cls = DATASET_CLASSES[key];

    // 該当データセット数を取得
    var dsCount = 0;
    if (typeof DATASETS !== "undefined") {
      dsCount = DATASETS.filter(function (ds) {
        return ds.class === key;
      }).length;
    }

    // 説明を80文字で切り詰める
    var shortDesc = cls.description;
    if (shortDesc.length > 80) {
      shortDesc = shortDesc.substring(0, 80) + "...";
    }

    html +=
      '<div class="card class-card" style="border-top-color:' + cls.color + ';">' +
        '<div class="card-icon">' + cls.icon + '</div>' +
        '<div class="card-title">' + escapeHtml(cls.name) + '</div>' +
        '<div class="text-sm text-light mb-2">' + escapeHtml(cls.nameJa) + '</div>' +
        '<p class="card-text">' + escapeHtml(shortDesc) + '</p>' +
        '<div class="text-sm text-light mt-2">' + dsCount + ' データセット</div>' +
        '<a href="datasets/index.html" class="card-link">詳しく見る &rarr;</a>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- 代表的データセットテーブル生成 --- */
function initDatasetsTable() {
  var tableBody = document.getElementById("datasets-body");
  if (!tableBody || typeof DATASETS === "undefined") return;

  var html = "";
  DATASETS.forEach(function (ds) {
    var badgeClass = getClassBadgeClass(ds.class);
    var className = "";
    if (typeof DATASET_CLASSES !== "undefined" && DATASET_CLASSES[ds.class]) {
      className = DATASET_CLASSES[ds.class].name;
    }

    html +=
      '<tr>' +
        '<td data-label="データセット"><strong class="var-name">' + escapeHtml(ds.name) + '</strong></td>' +
        '<td data-label="クラス"><span class="badge ' + badgeClass + '">' + escapeHtml(className) + '</span></td>' +
        '<td data-label="説明">' + escapeHtml(ds.description) + '</td>' +
        '<td data-label="使用頻度">' + escapeHtml(ds.frequency) + '</td>' +
      '</tr>';
  });

  tableBody.innerHTML = html;
}

/* --- 作成ガイド ミニステップバー生成 --- */
function initGuideSteps() {
  var container = document.getElementById("guide-steps");
  if (!container || typeof GUIDE_STEPS === "undefined") return;

  var html = "";
  GUIDE_STEPS.forEach(function (step) {
    html +=
      '<div class="mini-step-item">' +
        '<div class="mini-step-number">' + step.step + '</div>' +
        '<div class="mini-step-icon">' + step.icon + '</div>' +
        '<div class="mini-step-text">' +
          '<div class="mini-step-title">' + escapeHtml(step.titleShort) + '</div>' +
          '<div class="mini-step-desc">' + escapeHtml(step.description) + '</div>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

/* --- スムーズスクロール --- */
function initSmoothScroll() {
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#") return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector(".site-header")
          ? document.querySelector(".site-header").offsetHeight
          : 0;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

/* --- フェードインアニメーション（Intersection Observer） --- */
function initFadeInAnimation() {
  var fadeElements = document.querySelectorAll(".fade-in");
  if (fadeElements.length === 0) return;

  // Intersection Observer が使えない場合はすべて表示
  if (!("IntersectionObserver" in window)) {
    fadeElements.forEach(function (el) {
      el.classList.add("visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* --- ユーティリティ: HTMLエスケープ --- */
function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* --- ユーティリティ: 数値フォーマット --- */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
