function createTechniqueItem(result, categoryIndex, itemIndex) {
  const item = document.createElement("article");
  item.className = "technique-item-card";

  const techniqueConfig = window.techniqueDescriptions?.[result.id];
  const itemNumber = typeof categoryIndex === "number" && typeof itemIndex === "number"
    ? `${categoryIndex + 1}.${itemIndex + 1}`
    : "";

  const title = document.createElement("h4");
  title.className = "technique-item-title";
  const titleText = techniqueConfig?.labelKey ? i18n.t(techniqueConfig.labelKey) : result.label || i18n.t("technique-unnamed");
  title.textContent = itemNumber ? `${itemNumber} ${titleText}` : titleText;
  item.appendChild(title);

  const descriptionText = techniqueConfig?.descriptionKey ? i18n.t(techniqueConfig.descriptionKey) : "";
  if (descriptionText) {
    const description = document.createElement("div");
    description.className = "technique-item-description";
    description.textContent = descriptionText;
    item.appendChild(description);
  }

  return item;
}

function createTechniqueCategorySection(group, categoryIndex) {
  const section = document.createElement("section");
  section.className = "technique-category-section";

  const header = document.createElement("button");
  header.type = "button";
  header.className = "technique-category-header";

  const titleWrap = document.createElement("div");
  titleWrap.className = "technique-category-title-wrap";

  const title = document.createElement("h3");
  title.className = "technique-category-title";
  const categoryNumber = typeof categoryIndex === "number" ? `${categoryIndex + 1}.` : "";
  const categoryTitle = group.categoryLabel || group.categoryId || i18n.t("category-unnamed");
  title.textContent = categoryNumber ? `${categoryNumber} ${categoryTitle}` : categoryTitle;

  const count = document.createElement("div");
  count.className = "technique-category-count";
  count.textContent = i18n.t("item-count", { count: group.visibleCount || 0 });

  const toggle = document.createElement("span");
  toggle.className = "technique-category-arrow";
  toggle.textContent = i18n.t("btn-expand");

  titleWrap.appendChild(title);
  titleWrap.appendChild(count);
  header.appendChild(titleWrap);
  header.appendChild(toggle);

  const content = document.createElement("div");
  content.className = "technique-category-content";
  content.style.display = "none";

  group.items.forEach((result, itemIndex) => {
    content.appendChild(createTechniqueItem(result, categoryIndex, itemIndex));
  });

  header.addEventListener("click", () => {
    const isClosed = content.style.display === "none";
    content.style.display = isClosed ? "grid" : "none";
    section.classList.toggle("is-open", isClosed);
    toggle.textContent = isClosed ? i18n.t("btn-collapse") : i18n.t("btn-expand");
  });

  section.appendChild(header);
  section.appendChild(content);
  return section;
}

function buildTechniqueResultPanel(engineResult = {}) {
  const panel = document.createElement("div");
  panel.className = "technique-result-panel";

  const groups = (engineResult.groupedResults || []).filter((group) => (group.items || []).length > 0);

  if (!groups.length) {
    const empty = document.createElement("div");
    empty.className = "technique-result-empty";
    empty.textContent = i18n.t("result-empty");
    panel.appendChild(empty);
    return panel;
  }

  groups.forEach((group, categoryIndex) => {
    panel.appendChild(createTechniqueCategorySection(group, categoryIndex));
  });

  return panel;
}

window.resultView = {
  buildTechniqueResultPanel,
  createTechniqueCategorySection,
  createTechniqueItem
};
