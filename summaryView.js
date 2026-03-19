function getSummaryCompositionLabel(targetId) {
  return window.reviewFormatter?.getCompositionLabelById
    ? window.reviewFormatter.getCompositionLabelById(targetId)
    : targetId;
}

function getSummaryTextureLabel(targetId) {
  const mapping = {
    hardTexture: "texture-hard",
    fragileTexture: "texture-fragile",
    flexibleTexture: "texture-flexible",
    crispyTexture: "texture-crispy"
  };

  return mapping[targetId] ? i18n.t(mapping[targetId]) : targetId;
}

function getSummaryJudgementLabel(targetId) {
  const mapping = {
    obviousTaste: "judgement-taste",
    fillableSpace: "judgement-fillable",
    extractableLiquid: "judgement-liquid",
    acceptShapeChange: "judgement-shape",
    considerTraditionalTechniques: "judgement-tradition"
  };

  return mapping[targetId] ? i18n.t(mapping[targetId]) : targetId;
}

function getSummaryLevelLabel(level) {
  const mapping = {
    high: "amount-high",
    medium: "amount-medium",
    low: "amount-low"
  };

  return mapping[level] ? i18n.t(mapping[level]) : level;
}

function getTechniqueDisplayTitle(result = {}) {
  const techniqueConfig = window.techniqueDescriptions?.[result.id];
  return techniqueConfig?.labelKey ? i18n.t(techniqueConfig.labelKey) : result.label || i18n.t("technique-unnamed");
}

function getTechniqueDisplayDescription(result = {}) {
  const techniqueConfig = window.techniqueDescriptions?.[result.id];
  return techniqueConfig?.descriptionKey ? i18n.t(techniqueConfig.descriptionKey) : "";
}

function formatSourceMatch(match = {}) {
  const key = match.key || "";
  const levelText = getSummaryLevelLabel(match.level || "");

  if (key.endsWith("_yes")) {
    const baseKey = key.replace(/_yes$/, "");
    return `${getSummaryJudgementLabel(baseKey)} ${i18n.t("option-yes")}`;
  }

  if (key.endsWith("_no")) {
    const baseKey = key.replace(/_no$/, "");
    return `${getSummaryJudgementLabel(baseKey)} ${i18n.t("option-no")}`;
  }

  if (key === "hardTexture" || key === "fragileTexture" || key === "flexibleTexture" || key === "crispyTexture") {
    return getSummaryTextureLabel(key);
  }

  const supportGroupLabels = {
    astringencySupport: "涩感支持",
    bitternessSupport: "苦味支持",
    saltingSupport: "盐渍支持",
    fermentationNutrientSupport: "发酵营养支持",
    fermentationSubstrateSupport: "发酵底物支持",
    alkalineProcessSupport: "碱处理支持"
  };

  if (supportGroupLabels[key]) {
    return i18n.currentLanguage === "es" ? key : supportGroupLabels[key];
  }

  const compositionLabel = getSummaryCompositionLabel(key);
  if (compositionLabel && compositionLabel !== key) {
    return levelText ? `${compositionLabel} ${levelText}` : compositionLabel;
  }

  return levelText ? `${key} ${levelText}` : key;
}

function createSummaryBlock(title, body) {
  const section = document.createElement("section");
  section.className = "summary-block";

  const heading = document.createElement("h3");
  heading.className = "summary-block-title";
  heading.textContent = title;

  const content = document.createElement("div");
  content.className = "summary-block-body";

  if (body instanceof Node) {
    content.appendChild(body);
  } else {
    const text = document.createElement("p");
    text.className = "summary-block-text";
    text.textContent = body;
    content.appendChild(text);
  }

  section.appendChild(heading);
  section.appendChild(content);
  return section;
}

function createSummaryLineList(lines = []) {
  const list = document.createElement("div");
  list.className = "summary-line-list";

  if (!lines.length) {
    const empty = document.createElement("div");
    empty.className = "summary-empty-text";
    empty.textContent = i18n.t("summary-empty");
    list.appendChild(empty);
    return list;
  }

  lines.forEach((line) => {
    const item = document.createElement("div");
    item.className = "summary-line-item";
    item.textContent = line;
    list.appendChild(item);
  });

  return list;
}

function buildSummaryOverview(formState = {}, engineResult = {}) {
  const formatted = window.reviewFormatter?.formatReviewState
    ? window.reviewFormatter.formatReviewState(formState)
    : null;
  const lines = [];

  if (formatted?.objectCard) {
    lines.push(formatted.objectCard.analysisTarget || "");
  }

  const topCategories = (engineResult.groupedResults || [])
    .slice(0, 3)
    .map((group) => group.categoryLabel)
    .filter(Boolean)
    .join("、");

  if (topCategories) {
    lines.push(i18n.t("summary-top-categories", { value: topCategories }));
  }

  const topTechniques = (engineResult.flatResults || [])
    .slice(0, 5)
    .map((result) => getTechniqueDisplayTitle(result))
    .filter(Boolean)
    .join("、");

  if (topTechniques) {
    lines.push(i18n.t("summary-top-techniques", { value: topTechniques }));
  }

  lines.push(i18n.t("summary-selected-count", { count: (engineResult.flatResults || []).length }));

  return createSummaryLineList(lines.filter(Boolean));
}

function buildObjectInfoLines(objectDefinition = {}) {
  const separableValue = objectDefinition.hasSeparablePart === "yes"
    ? i18n.t("option-yes")
    : objectDefinition.hasSeparablePart === "no"
      ? i18n.t("option-no")
      : i18n.t("review-separable-notselected");

  const targetValue = objectDefinition.studyObject || i18n.t("review-analysis-target");

  return [
    i18n.t("summary-object-name", { value: objectDefinition.ingredientName || i18n.t("review-ingredient-name-empty") }),
    i18n.t("summary-object-scientific", { value: objectDefinition.scientificName || i18n.t("review-scientific-name-empty") }),
    i18n.t("summary-object-target", { value: targetValue }),
    i18n.t("summary-object-separable", { value: separableValue }),
    i18n.t("summary-object-parts", { value: objectDefinition.separableParts || i18n.t("review-parts-empty") })
  ];
}

function buildTechniqueGroupsList(engineResult = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "summary-technique-groups";
  const groups = (engineResult.groupedResults || []).filter((group) => (group.items || []).length > 0);

  if (!groups.length) {
    wrapper.appendChild(createSummaryLineList([]));
    return wrapper;
  }

  groups.forEach((group) => {
    const groupSection = document.createElement("section");
    groupSection.className = "summary-technique-group";

    const groupTitle = document.createElement("h4");
    groupTitle.className = "summary-technique-group-title";
    groupTitle.textContent = group.categoryLabel || group.categoryId || i18n.t("category-unnamed");
    groupSection.appendChild(groupTitle);

    (group.items || []).forEach((result) => {
      const item = document.createElement("article");
      item.className = "summary-technique-item";

      const title = document.createElement("h5");
      title.className = "summary-technique-item-title";
      title.textContent = getTechniqueDisplayTitle(result);
      item.appendChild(title);

      const score = document.createElement("div");
      score.className = "summary-technique-meta";
      score.textContent = i18n.t("summary-technique-score", { score: result.totalScore || 0 });
      item.appendChild(score);

      const descriptionText = getTechniqueDisplayDescription(result);
      if (descriptionText) {
        const descriptionTitle = document.createElement("div");
        descriptionTitle.className = "summary-technique-label";
        descriptionTitle.textContent = i18n.t("summary-technique-description-title");
        item.appendChild(descriptionTitle);

        const description = document.createElement("div");
        description.className = "summary-technique-description";
        description.textContent = descriptionText;
        item.appendChild(description);
      }
      groupSection.appendChild(item);
    });

    wrapper.appendChild(groupSection);
  });

  return wrapper;
}

function buildExportSummaryPanel(formState = {}, engineResult = {}) {
  const panel = document.createElement("div");
  panel.className = "export-summary-panel";

  const title = document.createElement("h2");
  title.className = "export-summary-title";
  title.textContent = i18n.t("summary-title");

  const subtitle = document.createElement("p");
  subtitle.className = "export-summary-subtitle";
  subtitle.textContent = i18n.t("summary-subtitle");

  panel.appendChild(title);
  panel.appendChild(subtitle);

  panel.appendChild(createSummaryBlock(
    i18n.t("summary-overview-title"),
    buildSummaryOverview(formState, engineResult)
  ));

  const structureGrid = document.createElement("div");
  structureGrid.className = "summary-structure-grid";

  structureGrid.appendChild(createSummaryBlock(
    i18n.t("summary-object-title"),
    createSummaryLineList(buildObjectInfoLines(formState.objectDefinition || {}))
  ));

  structureGrid.appendChild(createSummaryBlock(
    i18n.t("summary-composition-title"),
    createSummaryLineList(window.reviewFormatter?.formatSelectedCompositionSummary
      ? window.reviewFormatter.formatSelectedCompositionSummary(formState.composition || {})
      : [])
  ));

  structureGrid.appendChild(createSummaryBlock(
    i18n.t("summary-texture-title"),
    createSummaryLineList(window.reviewFormatter?.formatTextureReview
      ? window.reviewFormatter.formatTextureReview(formState.texture || {})
      : [])
  ));

  const judgementLines = [
    ...(window.reviewFormatter?.formatJudgementReview
      ? window.reviewFormatter.formatJudgementReview(formState.judgement || {})
      : []),
    ...(window.reviewFormatter?.formatGlobalControlsReview
      ? window.reviewFormatter.formatGlobalControlsReview(formState.globalControls || {})
      : [])
  ];

  structureGrid.appendChild(createSummaryBlock(
    i18n.t("summary-judgement-title"),
    createSummaryLineList(judgementLines)
  ));

  panel.appendChild(createSummaryBlock(i18n.t("summary-structure-title"), structureGrid));
  panel.appendChild(createSummaryBlock(i18n.t("summary-techniques-title"), buildTechniqueGroupsList(engineResult)));

  return panel;
}

window.summaryView = {
  buildExportSummaryPanel
};
