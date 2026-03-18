function getPrototypeDataSource() {
  if (typeof ingredientPrototypeData !== "undefined") {
    return ingredientPrototypeData;
  }

  if (window.ingredientPrototypeData) {
    return window.ingredientPrototypeData;
  }

  return null;
}

function getTextureLabelMap() {
  return {
    hardTexture: "texture-hard",
    fragileTexture: "texture-fragile",
    flexibleTexture: "texture-flexible",
    crispyTexture: "texture-crispy",
    [i18n.translations.zh["texture-hard"]]: "texture-hard",
    [i18n.translations.zh["texture-fragile"]]: "texture-fragile",
    [i18n.translations.zh["texture-flexible"]]: "texture-flexible",
    [i18n.translations.zh["texture-crispy"]]: "texture-crispy"
  };
}

function getJudgementLabelMap() {
  return {
    obviousTaste: "judgement-taste",
    fillableSpace: "judgement-fillable",
    extractableLiquid: "judgement-liquid",
    acceptShapeChange: "judgement-shape",
    considerTraditionalTechniques: "judgement-tradition",
    [i18n.translations.zh["judgement-taste"]]: "judgement-taste",
    [i18n.translations.zh["judgement-fillable"]]: "judgement-fillable",
    [i18n.translations.zh["judgement-liquid"]]: "judgement-liquid",
    [i18n.translations.zh["judgement-shape"]]: "judgement-shape",
    [i18n.translations.zh["judgement-tradition"]]: "judgement-tradition"
  };
}

function getTextureLabel(targetId) {
  const key = getTextureLabelMap()[targetId];
  return key ? i18n.t(key) : targetId;
}

function getJudgementLabel(targetId) {
  const key = getJudgementLabelMap()[targetId];
  return key ? i18n.t(key) : targetId;
}

function getAmountLabel(value) {
  if (!value) {
    return "";
  }

  const mapping = {
    low: "amount-low",
    medium: "amount-medium",
    high: "amount-high",
    [i18n.translations.zh["amount-low"]]: "amount-low",
    [i18n.translations.zh["amount-medium"]]: "amount-medium",
    [i18n.translations.zh["amount-high"]]: "amount-high"
  };

  return mapping[value] ? i18n.t(mapping[value]) : value;
}

function formatObjectDefinitionReview(objectDefinition = {}) {
  const ingredientName = objectDefinition.ingredientName || i18n.t("review-ingredient-name-empty");
  const scientificName = objectDefinition.scientificName || i18n.t("review-scientific-name-empty");

  let analysisTarget = i18n.t("review-analysis-target");
  if (objectDefinition.hasSeparablePart === "yes") {
    analysisTarget = objectDefinition.studyObject
      ? i18n.t("review-analysis-target-part", { studyObject: objectDefinition.studyObject })
      : i18n.t("review-study-object-missing");
  }

  return {
    title: ingredientName,
    subtitle: scientificName,
    analysisTarget,
    hasSeparablePart: objectDefinition.hasSeparablePart || i18n.t("review-separable-notselected"),
    separableParts: objectDefinition.separableParts || i18n.t("review-parts-empty")
  };
}

function formatSelectedCompositionSummary(composition = {}) {
  const lines = [];

  Object.entries(composition).forEach(([categoryId, categoryValue]) => {
    if (!categoryValue || typeof categoryValue !== "object" || !categoryValue.selected) {
      return;
    }

    const categoryLabel = getCompositionLabelById(categoryId);
    const amountLabel = getAmountLabel(categoryValue.amount);
    lines.push(amountLabel ? `${categoryLabel} ${amountLabel}` : categoryLabel);

    appendSelectedCompositionChildren(categoryValue.children || {}, lines, 1);
  });

  return lines;
}

function appendSelectedCompositionChildren(children = {}, lines = [], level = 1) {
  Object.entries(children).forEach(([childId, childValue]) => {
    if (!childValue || typeof childValue !== "object") {
      return;
    }

    const hasNestedChildren = childValue.children && typeof childValue.children === "object" && Object.keys(childValue.children).length > 0;

    if (childValue.selected) {
      const childLabel = getCompositionLabelById(childId);
      const amountLabel = getAmountLabel(childValue.relativeAmount || childValue.amount);
      const prefix = "—".repeat(level);
      lines.push(amountLabel ? `${prefix}${childLabel} ${amountLabel}` : `${prefix}${childLabel}`);
    }

    if (hasNestedChildren) {
      appendSelectedCompositionChildren(childValue.children, lines, level + 1);
    }
  });
}

function getCompositionLabelById(targetId) {
  const dataSource = getPrototypeDataSource();
  const categories = dataSource?.compositionCategories || [];

  for (const category of categories) {
    if (category.id === targetId) {
      return i18n.t(category.i18nKey);
    }

    const childLabel = findCompositionChildLabel(category.children || [], targetId);
    if (childLabel) {
      return childLabel;
    }
  }

  return targetId;
}

function findCompositionChildLabel(children = [], targetId) {
  for (const child of children) {
    if (child.id === targetId) {
      return i18n.t(child.i18nKey);
    }

    if (Array.isArray(child.children) && child.children.length > 0) {
      const nested = findCompositionChildLabel(child.children, targetId);
      if (nested) {
        return nested;
      }
    }
  }

  return "";
}

function formatTextureReview(texture = {}) {
  return Object.entries(texture)
    .filter(([, selected]) => Boolean(selected))
    .map(([label]) => `${i18n.t("review-texture-prefix")}${getTextureLabel(label)}`);
}

function formatJudgementReview(judgement = {}) {
  const skipKeys = new Set([
    "acceptShapeChange",
    "considerTraditionalTechniques",
    i18n.translations.zh["judgement-shape"],
    i18n.translations.zh["judgement-tradition"]
  ]);

  return Object.entries(judgement)
    .filter(([key, value]) => !skipKeys.has(key) && (value === "yes" || value === "no"))
    .map(([label, value]) => `${getJudgementLabel(label)}：${value === "yes" ? i18n.t("review-separable-yes") : i18n.t("review-separable-no")}`);
}

function formatGlobalControlsReview(globalControls = {}) {
  const lines = [];

  if (globalControls.acceptShapeChange) {
    lines.push(`${getJudgementLabel("acceptShapeChange")}：${globalControls.acceptShapeChange === "yes" ? i18n.t("review-separable-yes") : i18n.t("review-separable-no")}`);
  }

  if (globalControls.considerTraditionalTechniques) {
    lines.push(`${getJudgementLabel("considerTraditionalTechniques")}：${globalControls.considerTraditionalTechniques === "yes" ? i18n.t("review-separable-yes") : i18n.t("review-separable-no")}`);
  }

  return lines;
}

function formatReviewState(formState = {}) {
  return {
    objectCard: formatObjectDefinitionReview(formState.objectDefinition || {}),
    compositionLines: formatSelectedCompositionSummary(formState.composition || {}),
    textureLines: formatTextureReview(formState.texture || {}),
    judgementLines: formatJudgementReview(formState.judgement || {}),
    globalControlLines: formatGlobalControlsReview(formState.globalControls || {})
  };
}

window.reviewFormatter = {
  formatReviewState,
  formatObjectDefinitionReview,
  formatSelectedCompositionSummary,
  formatTextureReview,
  formatJudgementReview,
  formatGlobalControlsReview,
  getCompositionLabelById
};
