document.addEventListener("DOMContentLoaded", () => {
  initializeAiPrefill();
});

function getObjectDefinitionFormData() {
  const ingredientName = document.getElementById("ingredient-name")?.value.trim() || "";
  const scientificName = document.getElementById("scientific-name")?.value.trim() || "";
  const separableParts = document.getElementById("separable-parts")?.value.trim() || "";
  const studyObject = document.getElementById("study-object")?.value.trim() || "";
  const hasSeparablePart = document.querySelector('input[name="hasSeparablePart"]:checked')?.value || "";

  return {
    ingredientName,
    scientificName,
    hasSeparablePart,
    separableParts,
    studyObject
  };
}

function setAiLoadingState(isLoading) {
  const button = document.getElementById("ai-prefill-button");

  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? i18n.t("btn-ai-prefilling") : i18n.t("btn-ai-prefill");
}

function validateAiPrefillInput(formData) {
  const hasAnyResearchAnchor = Boolean(
    formData.ingredientName || formData.scientificName || formData.studyObject
  );

  if (!hasAnyResearchAnchor) {
    window.alert(i18n.t("error-no-input"));
    return false;
  }

  if (formData.hasSeparablePart === "yes" && !formData.studyObject) {
    window.alert(i18n.t("error-missing-study-object"));
    return false;
  }

  return true;
}

function sanitizeAiObjectDefinition(objectDefinition = {}, originalFormData = {}) {
  return {
    ingredientName: originalFormData.ingredientName || "",
    scientificName: originalFormData.scientificName || "",
    hasSeparablePart: originalFormData.hasSeparablePart || "",
    separableParts: originalFormData.separableParts || "",
    studyObject: originalFormData.studyObject || ""
  };
}

async function requestAiPrefill(formData) {
  const systemPrompt = window.aiPromptConfig?.systemPrompt || "";
  const userPrompt = window.aiPromptConfig?.buildUserPrompt
    ? window.aiPromptConfig.buildUserPrompt(formData)
    : "";

  let response;

  try {
    response = await fetch("/api/prefill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt
      })
    });
  } catch (error) {
    throw new Error(i18n.t("error-ai-network"), { cause: error });
  }

  const responseText = await response.text();
  let data = null;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    console.error("AI prefill returned non-JSON response:", responseText);
    throw new Error(i18n.t("error-ai-invalid-response"), { cause: error });
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.error || "AI request failed.");
  }

  if (!data.rawText) {
    throw new Error("AI returned empty content.");
  }

  const rawText = String(data.rawText).trim();
  const fencedMatch = rawText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const cleanedText = fencedMatch ? fencedMatch[1].trim() : rawText;

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse AI JSON:", data.rawText);
    throw new Error(i18n.t("error-parse-json"), { cause: error });
  }
}

function setRadioValue(name, value) {
  if (!name) {
    return;
  }

  document.querySelectorAll(`input[name="${name}"]`).forEach((radio) => {
    radio.checked = radio.value === value;
  });
}

function triggerChangeEvent(element) {
  if (element) {
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function normalizeAmountValue(value) {
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

  return mapping[value] || value || "";
}

function normalizeTextureKey(value) {
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

  return mapping[value] || value;
}

function normalizeJudgementKey(value) {
  const mapping = {
    obviousTaste: "obviousTaste",
    fillableSpace: "fillableSpace",
    extractableLiquid: "extractableLiquid",
    acceptShapeChange: "acceptShapeChange",
    considerTraditionalTechniques: "considerTraditionalTechniques",
    [i18n.translations.zh["judgement-taste"]]: "obviousTaste",
    [i18n.translations.zh["judgement-fillable"]]: "fillableSpace",
    [i18n.translations.zh["judgement-liquid"]]: "extractableLiquid",
    [i18n.translations.zh["judgement-shape"]]: "acceptShapeChange",
    [i18n.translations.zh["judgement-tradition"]]: "considerTraditionalTechniques",
    [i18n.translations.es["judgement-taste"]]: "obviousTaste",
    [i18n.translations.es["judgement-fillable"]]: "fillableSpace",
    [i18n.translations.es["judgement-liquid"]]: "extractableLiquid",
    [i18n.translations.es["judgement-shape"]]: "acceptShapeChange",
    [i18n.translations.es["judgement-tradition"]]: "considerTraditionalTechniques"
  };

  return mapping[value] || value;
}

function setAmountSelectValueInRow(row, value) {
  if (!row || typeof value !== "string") {
    return;
  }

  const select = row.querySelector(".amount-field-select");
  if (!select) {
    return;
  }

  select.disabled = false;
  select.value = normalizeAmountValue(value);
}

function applyObjectDefinitionPrefill(objectDefinition = {}) {
  const ingredientNameInput = document.getElementById("ingredient-name");
  const scientificNameInput = document.getElementById("scientific-name");
  const separablePartsInput = document.getElementById("separable-parts");
  const studyObjectInput = document.getElementById("study-object");

  if (ingredientNameInput && typeof objectDefinition.ingredientName === "string") {
    ingredientNameInput.value = objectDefinition.ingredientName;
  }

  if (scientificNameInput && typeof objectDefinition.scientificName === "string") {
    scientificNameInput.value = objectDefinition.scientificName;
  }

  if (typeof objectDefinition.hasSeparablePart === "string" && objectDefinition.hasSeparablePart) {
    setRadioValue("hasSeparablePart", objectDefinition.hasSeparablePart);
    const selectedRadio = document.querySelector(`input[name="hasSeparablePart"][value="${objectDefinition.hasSeparablePart}"]`);
    triggerChangeEvent(selectedRadio);
  }

  if (separablePartsInput && typeof objectDefinition.separableParts === "string") {
    separablePartsInput.value = objectDefinition.separableParts;
  }

  if (studyObjectInput && typeof objectDefinition.studyObject === "string") {
    studyObjectInput.value = objectDefinition.studyObject;
  }
}

function clearCompositionPrefill() {
  document.querySelectorAll("input[data-category-id]").forEach((checkbox) => {
    const wasChecked = checkbox.checked;
    checkbox.checked = false;

    if (wasChecked) {
      triggerChangeEvent(checkbox);
    }
  });
}

function applyCompositionNodeData(scope, nodeData = {}) {
  Object.entries(nodeData).forEach(([itemId, itemValue]) => {
    const checkbox = scope.querySelector(`input[data-item-id="${itemId}"]`);

    if (!checkbox || !itemValue || typeof itemValue !== "object") {
      return;
    }

    checkbox.checked = Boolean(itemValue.selected);
    triggerChangeEvent(checkbox);

    const row = checkbox.closest(".nested-item-row");
    if (row && typeof itemValue.relativeAmount === "string" && itemValue.relativeAmount) {
      setAmountSelectValueInRow(row, itemValue.relativeAmount);
    }

    if (itemValue.children && typeof itemValue.children === "object") {
      const childContainer = row?.nextElementSibling?.classList.contains("mixed-children")
        ? row.nextElementSibling
        : row?.parentElement?.querySelector(":scope > .mixed-children");

      if (childContainer) {
        applyCompositionNodeData(childContainer, itemValue.children);
      }
    }
  });
}

function applyCompositionPrefill(composition = {}) {
  clearCompositionPrefill();

  Object.entries(composition).forEach(([categoryId, categoryValue]) => {
    const mainCheckbox = document.querySelector(`input[data-category-id="${categoryId}"]`);

    if (!mainCheckbox || !categoryValue || typeof categoryValue !== "object") {
      return;
    }

    mainCheckbox.checked = Boolean(categoryValue.selected);
    triggerChangeEvent(mainCheckbox);

    const categoryRow = mainCheckbox.closest(".composition-group");
    const mainAmountSelect = categoryRow?.querySelector(".composition-top-row .amount-field-select");

    if (mainAmountSelect && typeof categoryValue.amount === "string" && categoryValue.amount) {
      mainAmountSelect.disabled = false;
      mainAmountSelect.value = normalizeAmountValue(categoryValue.amount);
    }

    if (categoryValue.children && typeof categoryValue.children === "object") {
      const childrenScope = categoryRow?.querySelector(".composition-children");
      if (childrenScope) {
        applyCompositionNodeData(childrenScope, categoryValue.children);
      }
    }
  });
}

function clearTexturePrefill() {
  document.querySelectorAll('input[name="textureOption"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

function clearJudgementPrefill() {
  document.querySelectorAll('input[name^="judgement-option-"]').forEach((radio) => {
    radio.checked = false;
  });
}

function applyTexturePrefill(texture = {}) {
  clearTexturePrefill();
  const normalizedTexture = {};

  Object.entries(texture || {}).forEach(([key, value]) => {
    normalizedTexture[normalizeTextureKey(key)] = value;
  });

  document.querySelectorAll('input[name="textureOption"]').forEach((checkbox) => {
    checkbox.checked = Boolean(normalizedTexture[checkbox.value]);
  });
}

function applyJudgementPrefill(judgement = {}) {
  clearJudgementPrefill();
  const normalizedJudgement = {};

  Object.entries(judgement || {}).forEach(([key, value]) => {
    normalizedJudgement[normalizeJudgementKey(key)] = value;
  });

  (window.ingredientPrototypeData?.judgementOptions || []).forEach((option, index) => {
    const value = normalizedJudgement[option.id];
    if (value !== "yes" && value !== "no") {
      return;
    }

    const radio = document.querySelector(`input[name="judgement-option-${index}"][value="${value}"]`);
    if (radio) {
      radio.checked = true;
    }
  });
}

function applyAiPrefillResult(result, originalFormData = {}) {
  applyObjectDefinitionPrefill(sanitizeAiObjectDefinition(result.objectDefinition || {}, originalFormData));
  applyCompositionPrefill(result.composition || {});
  applyTexturePrefill(result.texture || {});
  applyJudgementPrefill(result.judgement || {});
}

function initializeAiPrefill() {
  const button = document.getElementById("ai-prefill-button");

  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    const formData = getObjectDefinitionFormData();

    if (!validateAiPrefillInput(formData)) {
      return;
    }

    try {
      setAiLoadingState(true);
      const result = await requestAiPrefill(formData);
      applyAiPrefillResult(result, formData);
      window.alert(i18n.t("ai-prefill-success"));
    } catch (error) {
      console.error("AI prefill error:", error);
      window.alert(error?.message || i18n.t("ai-prefill-failure"));
    } finally {
      setAiLoadingState(false);
    }
  });
}
