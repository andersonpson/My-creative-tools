function getPresenceEntry(presenceMap = {}, key) {
  return presenceMap[key] || null;
}

function getLevelScore(level) {
  if (level === "high") {
    return 3;
  }
  if (level === "medium") {
    return 2;
  }
  if (level === "low") {
    return 1;
  }
  return 1;
}

function collectMatchedEntries(keys = [], presenceMap = {}) {
  return keys
    .map((key) => {
      const entry = getPresenceEntry(presenceMap, key);
      if (!entry) {
        return null;
      }

      return {
        key,
        level: entry.level || "",
        sourceType: entry.sourceType || "",
        sourcePath: entry.sourcePath || ""
      };
    })
    .filter(Boolean);
}

function computeDirectScore(directMatches = []) {
  if (!directMatches.length) {
    return 0;
  }

  let score = 0;

  directMatches.forEach((match) => {
    score += 4;
    score += getLevelScore(match.level);
  });

  if (directMatches.length >= 2) {
    score += 2;
  }

  return score;
}

function computeSupportScore(supportMatches = []) {
  if (!supportMatches.length) {
    return 0;
  }

  let score = 0;

  supportMatches.forEach((match) => {
    score += 2;
    score += getLevelScore(match.level) - 1;
  });

  if (supportMatches.length >= 2) {
    score += 1;
  }

  return score;
}

function determineTechniqueStatus(directMatches = [], supportMatches = []) {
  if (directMatches.length > 0) {
    return "direct";
  }

  if (supportMatches.length > 0) {
    return "support";
  }

  return "none";
}

function buildTechniqueResult(rule, presenceMap = {}) {
  const declaredDirectInputs = Array.isArray(rule.directInputs) ? rule.directInputs : [];
  const declaredSupportInputs = Array.isArray(rule.functionalSupportInputs) ? rule.functionalSupportInputs : [];

  const directMatches = collectMatchedEntries(declaredDirectInputs, presenceMap);
  const rawSupportMatches = collectMatchedEntries(declaredSupportInputs, presenceMap);

  const hasDirectRequirements = declaredDirectInputs.length > 0;
  const hasDirectMatch = directMatches.length > 0;
  const allowSupportOnly = !hasDirectRequirements;

  if (hasDirectRequirements && !hasDirectMatch) {
    return null;
  }

  const supportMatches = hasDirectMatch || allowSupportOnly ? rawSupportMatches : [];
  const status = determineTechniqueStatus(directMatches, supportMatches);

  if (status === "none") {
    return null;
  }

  const directScore = computeDirectScore(directMatches);
  const supportScore = computeSupportScore(supportMatches);
  const totalScore = directScore + supportScore;

  return {
    id: rule.id,
    label: rule.label,
    categoryId: rule.categoryId,
    status,
    totalScore,
    directScore,
    supportScore,
    directMatches,
    supportMatches,
    directWeightRules: rule.directWeightRules || [],
    functionalSupportWeightRules: rule.functionalSupportWeightRules || [],
    invalidBoundary: rule.invalidBoundary || ""
  };
}

function buildTechniqueResultList(normalizedState = {}) {
  const rules = window.techniqueRules || [];
  const presenceMap = normalizedState.presenceMap || {};

  return rules
    .map((rule) => buildTechniqueResult(rule, presenceMap))
    .filter(Boolean);
}

function sortTechniqueResults(results = []) {
  const statusPriority = {
    direct: 2,
    support: 1,
    none: 0
  };

  return [...results].sort((a, b) => {
    const statusDiff = (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    return (a.label || "").localeCompare(b.label || "", "zh-Hans-CN");
  });
}

function sortTechniqueCategoryGroups(groups = []) {
  return [...groups].sort((a, b) => {
    const topScoreDiff = (b.topScore || 0) - (a.topScore || 0);
    if (topScoreDiff !== 0) {
      return topScoreDiff;
    }

    const totalScoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
    if (totalScoreDiff !== 0) {
      return totalScoreDiff;
    }

    const directCountDiff = (b.directCount || 0) - (a.directCount || 0);
    if (directCountDiff !== 0) {
      return directCountDiff;
    }

    return (a.categoryLabel || "").localeCompare(b.categoryLabel || "", "zh-Hans-CN");
  });
}

function groupTechniqueResultsByCategory(results = []) {
  const getTechConfig = typeof getTechniqueCategoryDisplay === 'function' ? getTechniqueCategoryDisplay() : (window.techniqueCategoryDisplay || []);
  const categoryConfig = getTechConfig;
  const groupedMap = {};

  categoryConfig.forEach((category) => {
    groupedMap[category.id] = {
      categoryId: category.id,
      categoryLabel: category.displayLabel || category.label,
      items: []
    };
  });

  results.forEach((result) => {
    if (!groupedMap[result.categoryId]) {
      groupedMap[result.categoryId] = {
        categoryId: result.categoryId,
        categoryLabel: result.categoryId,
        items: []
      };
    }

    groupedMap[result.categoryId].items.push(result);
  });

  const groupedResults = Object.values(groupedMap)
    .filter((group) => Array.isArray(group.items) && group.items.length > 0)
    .map((group) => {
      const sortedItems = sortTechniqueResults(group.items);
      const topScore = sortedItems.length ? Math.max(...sortedItems.map((item) => item.totalScore || 0)) : 0;
      const totalScore = sortedItems.reduce((sum, item) => sum + (item.totalScore || 0), 0);
      const directCount = sortedItems.filter((item) => item.status === "direct").length;

      return {
        ...group,
        items: sortedItems,
        visibleCount: sortedItems.length,
        topScore,
        totalScore,
        directCount
      };
    });

  return sortTechniqueCategoryGroups(groupedResults);
}

function runTechniqueEngine(formState = {}) {
  const normalizedState = window.normalizer?.normalizeFormState
    ? window.normalizer.normalizeFormState(formState)
    : {
        objectDefinition: formState.objectDefinition || {},
        presenceMap: {}
      };

  const flatResults = buildTechniqueResultList(normalizedState);
  const groupedResults = groupTechniqueResultsByCategory(flatResults);

  return {
    objectDefinition: normalizedState.objectDefinition || {},
    normalizedState,
    flatResults: sortTechniqueResults(flatResults),
    groupedResults
  };
}

window.techniqueEngine = {
  runTechniqueEngine,
  buildTechniqueResult,
  buildTechniqueResultList,
  groupTechniqueResultsByCategory,
  sortTechniqueCategoryGroups,
  sortTechniqueResults
};