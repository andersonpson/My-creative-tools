function createLanguageSwitcher() {
  const switcher = document.createElement("div");
  switcher.className = "language-switcher";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Language switcher");

  const languages = [
    { code: "zh", shortLabel: "中" },
    { code: "es", shortLabel: "Es" }
  ];

  languages.forEach(({ code, shortLabel }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-toggle";
    button.dataset.lang = code;
    button.textContent = shortLabel;
    button.setAttribute("aria-pressed", code === i18n.currentLanguage ? "true" : "false");
    button.classList.toggle("is-active", code === i18n.currentLanguage);

    button.addEventListener("click", () => {
      if (i18n.currentLanguage === code) {
        return;
      }

      i18n.setLanguage(code);
      updatePageTranslations();
    });

    switcher.appendChild(button);
  });

  return switcher;
}

function updatePageTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = i18n.t(key);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const key = element.getAttribute("data-i18n-html");
    element.innerHTML = i18n.t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.placeholder = i18n.t(key);
  });

  document.querySelectorAll(".language-toggle").forEach((button) => {
    const isActive = button.dataset.lang === i18n.currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  document.documentElement.lang = i18n.currentLanguage === "es" ? "es" : "zh-CN";
  document.dispatchEvent(new CustomEvent("translationsUpdated", { detail: { language: i18n.currentLanguage } }));
}

function initLanguageSwitcher() {
  const pageHeader = document.querySelector(".page-header");
  if (pageHeader) {
    pageHeader.appendChild(createLanguageSwitcher());
  }

  updatePageTranslations();
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    initLanguageSwitcher();
  }, 100);
});
