function normalizeLevelValue(value) {
  const mapping = {
    high: "high",
    medium: "medium",
    low: "low",
    [i18n.translations.zh["amount-high"]]: "high",
    [i18n.translations.zh["amount-medium"]]: "medium",
    [i18n.translations.zh["amount-low"]]: "low",
    Alto: "high",
    Medio: "medium",
    Bajo: "low"
  };

  return mapping[value] || "";
}

function setPresenceFlag(target, key, config = {}) {
  if (!key) {
    return;
  }

  target[key] = {
    selected: true,
    level: config.level || "",
    sourceType: config.sourceType || "",
    sourcePath: config.sourcePath || ""
  };
}

function collectSelectedCompositionFlags(composition = {}) {
  const flags = {};

  Object.entries(composition).forEach(([categoryId, categoryValue]) => {
    if (!categoryValue || typeof categoryValue !== "object") {
      return;
    }

    if (categoryValue.selected) {
      setPresenceFlag(flags, categoryId, {
        level: normalizeLevelValue(categoryValue.amount),
        sourceType: "composition-category",
        sourcePath: categoryId
      });
    }

    collectSelectedCompositionChildren(flags, categoryValue.children || {}, categoryId);
  });

  return flags;
}

function collectSelectedCompositionChildren(target, children = {}, parentPath = "") {
  Object.entries(children).forEach(([childId, childValue]) => {
    if (!childValue || typeof childValue !== "object") {
      return;
    }

    const sourcePath = parentPath ? `${parentPath}.${childId}` : childId;

    if (childValue.selected) {
      setPresenceFlag(target, childId, {
        level: normalizeLevelValue(childValue.relativeAmount),
        sourceType: "composition-item",
        sourcePath
      });
    }

    if (childValue.children) {
      collectSelectedCompositionChildren(target, childValue.children, sourcePath);
    }
  });
}

function normalizeTextureFlags(texture = {}) {
  const mapping = {
    hardTexture: "hardTexture",
    fragileTexture: "fragileTexture",
    flexibleTexture: "flexibleTexture",
    crispyTexture: "crispyTexture",
    [i18n.translations.zh["texture-hard"]]: "hardTexture",
    [i18n.translations.zh["texture-fragile"]]: "fragileTexture",
    [i18n.translations.zh["texture-flexible"]]: "flexibleTexture",
    [i18n.translations.zh["texture-crispy"]]: "crispyTexture",
    [i18n.translations.es["texture-hard"]]: "hardTexture",
    [i18n.translations.es["texture-fragile"]]: "fragileTexture",
    [i18n.translations.es["texture-flexible"]]: "flexibleTexture",
    [i18n.translations.es["texture-crispy"]]: "crispyTexture"
  };

  const result = {};

  Object.entries(texture).forEach(([label, selected]) => {
    if (!selected) {
      return;
    }

    const normalizedKey = mapping[label];
    if (!normalizedKey) {
      return;
    }

    setPresenceFlag(result, normalizedKey, {
      sourceType: "texture",
      sourcePath: label
    });
  });

  return result;
}

function normalizeJudgementFlags(judgement = {}) {
  const mapping = {
    obviousTaste: { yes: "obviousTaste_yes", no: "obviousTaste_no" },
    fillableSpace: { yes: "fillableSpace_yes", no: "fillableSpace_no" },
    extractableLiquid: { yes: "extractableLiquid_yes", no: "extractableLiquid_no" },
    acceptShapeChange: { yes: "acceptShapeChange_yes", no: "acceptShapeChange_no" },
    considerTraditionalTechniques: { yes: "considerTraditionalTechniques_yes", no: "considerTraditionalTechniques_no" },
    [i18n.translations.zh["judgement-taste"]]: { yes: "obviousTaste_yes", no: "obviousTaste_no" },
    [i18n.translations.zh["judgement-fillable"]]: { yes: "fillableSpace_yes", no: "fillableSpace_no" },
    [i18n.translations.zh["judgement-liquid"]]: { yes: "extractableLiquid_yes", no: "extractableLiquid_no" },
    [i18n.translations.zh["judgement-shape"]]: { yes: "acceptShapeChange_yes", no: "acceptShapeChange_no" },
    [i18n.translations.zh["judgement-tradition"]]: { yes: "considerTraditionalTechniques_yes", no: "considerTraditionalTechniques_no" },
    [i18n.translations.es["judgement-taste"]]: { yes: "obviousTaste_yes", no: "obviousTaste_no" },
    [i18n.translations.es["judgement-fillable"]]: { yes: "fillableSpace_yes", no: "fillableSpace_no" },
    [i18n.translations.es["judgement-liquid"]]: { yes: "extractableLiquid_yes", no: "extractableLiquid_no" },
    [i18n.translations.es["judgement-shape"]]: { yes: "acceptShapeChange_yes", no: "acceptShapeChange_no" },
    [i18n.translations.es["judgement-tradition"]]: { yes: "considerTraditionalTechniques_yes", no: "considerTraditionalTechniques_no" }
  };

  const result = {};

  Object.entries(judgement).forEach(([label, value]) => {
    if (value !== "yes" && value !== "no") {
      return;
    }

    const normalizedKey = mapping[label]?.[value];
    if (!normalizedKey) {
      return;
    }

    setPresenceFlag(result, normalizedKey, {
      sourceType: "judgement",
      sourcePath: label
    });
  });

  return result;
}

function normalizeGlobalControlFlags(globalControls = {}) {
  const result = {};

  if (globalControls.acceptShapeChange === "yes") {
    setPresenceFlag(result, "acceptShapeChange_yes", {
      sourceType: "global-control",
      sourcePath: "acceptShapeChange"
    });
  }

  if (globalControls.acceptShapeChange === "no") {
    setPresenceFlag(result, "acceptShapeChange_no", {
      sourceType: "global-control",
      sourcePath: "acceptShapeChange"
    });
  }

  if (globalControls.considerTraditionalTechniques === "yes") {
    setPresenceFlag(result, "considerTraditionalTechniques_yes", {
      sourceType: "global-control",
      sourcePath: "considerTraditionalTechniques"
    });
  }

  if (globalControls.considerTraditionalTechniques === "no") {
    setPresenceFlag(result, "considerTraditionalTechniques_no", {
      sourceType: "global-control",
      sourcePath: "considerTraditionalTechniques"
    });
  }

  return result;
}

function normalizeObjectDefinition(objectDefinition = {}) {
  return {
    ingredientName: objectDefinition.ingredientName || "",
    scientificName: objectDefinition.scientificName || "",
    hasSeparablePart: objectDefinition.hasSeparablePart || "",
    separableParts: objectDefinition.separableParts || "",
    studyObject: objectDefinition.studyObject || ""
  };
}

function mergePresenceMaps(...maps) {
  return maps.reduce((accumulator, currentMap) => {
    Object.entries(currentMap || {}).forEach(([key, value]) => {
      accumulator[key] = value;
    });
    return accumulator;
  }, {});
}

function buildSupportGroups(presenceMap = {}) {
  const supportGroups = {};

  const groupDefinitions = {
    astringencySupport: ["polyphenolMonomer", "tannin"],
    bitternessSupport: ["bitterGlycoside", "terpeneBitter", "alkaloidBitter"],
    saltingSupport: ["water", "freeWater", "extractableLiquid_yes"],
    fermentationNutrientSupport: ["sweetSugar", "nonSweetSugar", "starchGroup"],
    fermentationSubstrateSupport: ["sweetSugar", "nonSweetSugar", "starchGroup"],
    alkalineProcessSupport: ["konjacGlucomannan", "gelGroup", "phSensitivePigment"]
  };

  Object.entries(groupDefinitions).forEach(([groupKey, sourceKeys]) => {
    const matched = sourceKeys.filter((key) => Boolean(presenceMap[key]));
    if (!matched.length) {
      return;
    }

    setPresenceFlag(supportGroups, groupKey, {
      sourceType: "support-group",
      sourcePath: matched.join(",")
    });
  });

  return supportGroups;
}

function normalizeFormState(formState = {}) {
  const normalizedComposition = collectSelectedCompositionFlags(formState.composition || {});
  const normalizedTexture = normalizeTextureFlags(formState.texture || {});
  const normalizedJudgement = normalizeJudgementFlags(formState.judgement || {});
  const normalizedGlobalControls = normalizeGlobalControlFlags(formState.globalControls || {});

  const presenceMap = mergePresenceMaps(
    normalizedComposition,
    normalizedTexture,
    normalizedJudgement,
    normalizedGlobalControls
  );

  const supportGroups = buildSupportGroups(presenceMap);
  const finalPresenceMap = mergePresenceMaps(presenceMap, supportGroups);

  return {
    objectDefinition: normalizeObjectDefinition(formState.objectDefinition || {}),
    presenceMap: finalPresenceMap,
    compositionMap: normalizedComposition,
    textureMap: normalizedTexture,
    judgementMap: normalizedJudgement,
    globalControlMap: normalizedGlobalControls,
    supportGroupMap: supportGroups
  };
}

window.normalizer = {
  normalizeFormState,
  normalizeLevelValue,
  collectSelectedCompositionFlags,
  normalizeTextureFlags,
  normalizeJudgementFlags,
  normalizeGlobalControlFlags,
  buildSupportGroups
};
