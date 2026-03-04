/* ============================================
   ADaM仕様書アカデミー - 作成ガイドページ JS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  initGuideSidebar();
  initGuideMobileNav();
  initGuideContent();
  initGuideScrollSpy();
});

/* --- サイドバーナビの動的生成 --- */
function initGuideSidebar() {
  var container = document.getElementById("guide-sidebar-nav");
  if (!container || typeof GUIDE_STEPS === "undefined") return;

  var html = '<div class="guide-sidebar-title">ステップ一覧</div>';
  html += '<ul class="guide-sidebar-list">';
  GUIDE_STEPS.forEach(function (step) {
    html +=
      '<li>' +
        '<a href="#guide-step-' + step.step + '" class="guide-sidebar-link" data-step="' + step.step + '">' +
          '<span class="guide-sidebar-number">' + step.step + '</span>' +
          '<span class="guide-sidebar-icon">' + step.icon + '</span>' +
          '<span class="guide-sidebar-text">' + escapeHtml(step.titleShort) + '</span>' +
        '</a>' +
      '</li>';
  });
  html += '</ul>';
  container.innerHTML = html;

  // クリックでスムーススクロール
  var links = container.querySelectorAll(".guide-sidebar-link");
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = this.getAttribute("href").substring(1);
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        var headerHeight = document.querySelector(".site-header")
          ? document.querySelector(".site-header").offsetHeight
          : 0;
        var targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });
}

/* --- モバイルナビの動的生成 --- */
function initGuideMobileNav() {
  var container = document.getElementById("guide-mobile-nav-inner");
  if (!container || typeof GUIDE_STEPS === "undefined") return;

  var html = "";
  GUIDE_STEPS.forEach(function (step) {
    html +=
      '<a href="#guide-step-' + step.step + '" class="guide-mobile-nav-item" data-step="' + step.step + '">' +
        '<span class="guide-mobile-nav-number">' + step.step + '</span>' +
        '<span class="guide-mobile-nav-text">' + escapeHtml(step.titleShort) + '</span>' +
      '</a>';
  });
  container.innerHTML = html;

  // クリックでスムーススクロール
  var items = container.querySelectorAll(".guide-mobile-nav-item");
  items.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = this.getAttribute("href").substring(1);
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        var headerHeight = document.querySelector(".site-header")
          ? document.querySelector(".site-header").offsetHeight
          : 0;
        var mobileNavHeight = document.getElementById("guide-mobile-nav")
          ? document.getElementById("guide-mobile-nav").offsetHeight
          : 0;
        var targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - mobileNavHeight - 10;
        window.scrollTo({ top: targetPos, behavior: "smooth" });
      }
    });
  });
}

/* --- ステップコンテンツの動的生成 --- */
function initGuideContent() {
  var container = document.getElementById("guide-steps-content");
  if (!container || typeof GUIDE_STEPS === "undefined") return;

  var html = "";
  GUIDE_STEPS.forEach(function (step) {
    html += '<section class="guide-step-section fade-in" id="guide-step-' + step.step + '">';
    html += '<div class="card guide-step-card">';

    // ヘッダー
    html += '<div class="guide-step-header">';
    html += '<div class="guide-step-number-lg">' + step.step + '</div>';
    html += '<div>';
    html += '<div class="guide-step-icon-inline">' + step.icon + '</div>';
    html += '<h2 class="guide-step-title">' + escapeHtml(step.title) + '</h2>';
    html += '</div>';
    html += '</div>';

    // 説明
    html += '<p class="guide-step-desc">' + escapeHtml(step.description) + '</p>';

    // 詳細チェックリスト
    html += '<div class="guide-checklist">';
    html += '<h4 class="mb-2">確認ポイント</h4>';
    html += '<ul class="guide-checklist-list">';
    step.details.forEach(function (detail) {
      html += '<li class="guide-checklist-item">';
      html += '<span class="guide-check-icon">&#x2610;</span>';
      html += '<span>' + escapeHtml(detail) + '</span>';
      html += '</li>';
    });
    html += '</ul>';
    html += '</div>';

    // TIPSボックス
    html += '<div class="guide-tip-box">';
    html += '<div class="guide-tip-header">TIPS</div>';
    html += '<p>' + escapeHtml(step.tips) + '</p>';
    html += '</div>';

    // 落とし穴ボックス
    html += '<div class="guide-pitfall-box">';
    html += '<div class="guide-pitfall-header">よくある落とし穴</div>';
    html += '<p>' + escapeHtml(step.pitfalls) + '</p>';
    html += '</div>';

    html += '</div>'; // card
    html += '</section>';
  });

  container.innerHTML = html;

  // フェードインアニメーション再適用
  initFadeInAnimation();
}

/* --- スクロール追従（Intersection Observer） --- */
function initGuideScrollSpy() {
  var sections = document.querySelectorAll(".guide-step-section");
  if (sections.length === 0) return;

  // Intersection Observer が使えない場合はスキップ
  if (!("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var sectionId = entry.target.id;
          var stepNum = sectionId.replace("guide-step-", "");
          highlightSidebarItem(stepNum);
          highlightMobileNavItem(stepNum);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-80px 0px -40% 0px"
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

/* --- サイドバーのハイライト更新 --- */
function highlightSidebarItem(stepNum) {
  var links = document.querySelectorAll(".guide-sidebar-link");
  links.forEach(function (link) {
    if (link.getAttribute("data-step") === stepNum) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* --- モバイルナビのハイライト更新 --- */
function highlightMobileNavItem(stepNum) {
  var items = document.querySelectorAll(".guide-mobile-nav-item");
  items.forEach(function (item) {
    if (item.getAttribute("data-step") === stepNum) {
      item.classList.add("active");
      // アクティブアイテムを表示領域にスクロール
      var navInner = document.getElementById("guide-mobile-nav-inner");
      if (navInner) {
        var itemLeft = item.offsetLeft;
        var navWidth = navInner.parentElement.offsetWidth;
        var scrollPos = itemLeft - navWidth / 2 + item.offsetWidth / 2;
        navInner.parentElement.scrollTo({ left: scrollPos, behavior: "smooth" });
      }
    } else {
      item.classList.remove("active");
    }
  });
}
