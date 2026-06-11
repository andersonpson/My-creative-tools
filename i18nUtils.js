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

  document.documentElement.lang = i18n.currentLanguage === "es" ? "es" : "zh-CN";
  document.body.style.visibility = "visible";
  document.dispatchEvent(new CustomEvent("translationsUpdated", { detail: { language: i18n.currentLanguage } }));
}

function initLanguageSwitcher() {
  updatePageTranslations();
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    initLanguageSwitcher();
  }, 100);
});
