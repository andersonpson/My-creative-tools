function getPrototypeDataSource() {
  if (typeof ingredientPrototypeData !== "undefined") {
    return ingredientPrototypeData;
  }

  if (window.ingredientPrototypeData) {
    return window.ingredientPrototypeData;
  }

  return null;
}

function getCheckedRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function collectObjectDefinitionState() {
  return {
    ingredientName: document.getElementById("ingredient-name")?.value.trim() || "",
    scientificName: document.getElementById("scientific-name")?.value.trim() || "",
    hasSeparablePart: getCheckedRadioValue("hasSeparablePart"),
    separableParts: document.getElementById("separable-parts")?.value.trim() || "",
    studyObject: document.getElementById("study-object")?.value.trim() || ""
  };
}

function collectCompositionChildrenState(container) {
  function collectFromLevel(levelContainer) {
    const result = {};
    const children = Array.from(levelContainer.children || []);

    children.forEach((child) => {
      if (child.classList?.contains("nested-items") || child.classList?.contains("mixed-children")) {
        Object.assign(result, collectFromLevel(child));
        return;
      }

      if (child.classList?.contains("mixed-group-wrapper")) {
        const groupRow = child.querySelector(":scope > .mixed-group-row");
        if (!groupRow) {
          return;
        }

        const checkbox = groupRow.querySelector("input[data-item-id]");
        if (!checkbox) {
          return;
        }

        const itemId = checkbox.dataset.itemId;
        const amountSelect = groupRow.querySelector(".amount-field-select");
        const currentAmount = amountSelect?.value || "";
        const itemState = {
          selected: checkbox.checked,
          amount: currentAmount,
          relativeAmount: currentAmount
        };

        const nestedChildContainer = child.querySelector(":scope > .mixed-children");
        if (nestedChildContainer) {
          itemState.children = collectFromLevel(nestedChildContainer);
        }

        result[itemId] = itemState;
        return;
      }

      if (child.classList?.contains("nested-item-row")) {
        const checkbox = child.querySelector("input[data-item-id]");
        if (!checkbox) {
          return;
        }

        const itemId = checkbox.dataset.itemId;
        const amountSelect = child.querySelector(".amount-field-select");
        const currentAmount = amountSelect?.value || "";
        const itemState = {
          selected: checkbox.checked,
          amount: currentAmount,
          relativeAmount: currentAmount
        };

        const nextSibling = child.nextElementSibling;
        if (nextSibling?.classList?.contains("mixed-children")) {
          itemState.children = collectFromLevel(nextSibling);
        }

        result[itemId] = itemState;
      }
    });

    return result;
  }

  return collectFromLevel(container);
}

function collectCompositionState() {
  const result = {};
  const categoryCheckboxes = document.querySelectorAll("input[data-category-id]");

  categoryCheckboxes.forEach((checkbox) => {
    const categoryId = checkbox.dataset.categoryId;
    if (!categoryId) {
      return;
    }

    const group = checkbox.closest(".composition-group");
    if (!group) {
      return;
    }

    const mainAmountSelect = group.querySelector(".composition-top-row .amount-field-select");
    const childrenContainer = group.querySelector(".composition-children");
    const currentAmount = mainAmountSelect?.value || "";

    result[categoryId] = {
      selected: checkbox.checked,
      amount: currentAmount,
      relativeAmount: currentAmount,
      children: childrenContainer ? collectCompositionChildrenState(childrenContainer) : {}
    };
  });

  return result;
}

function collectTextureState() {
  const result = {};

  document.querySelectorAll('input[name="textureOption"]').forEach((checkbox) => {
    result[checkbox.value] = checkbox.checked;
  });

  return result;
}

function collectJudgementState() {
  const dataSource = getPrototypeDataSource();
  const options = dataSource?.judgementOptions || [];
  const result = {};

  options.forEach((option, index) => {
    result[option.id] = getCheckedRadioValue(`judgement-option-${index}`);
  });

  return result;
}

function collectGlobalControlState() {
  return {
    acceptShapeChange: getCheckedRadioValue("accept-shape-change"),
    considerTraditionalTechniques: getCheckedRadioValue("consider-traditional-techniques")
  };
}

function collectCurrentFormState() {
  return {
    objectDefinition: collectObjectDefinitionState(),
    composition: collectCompositionState(),
    texture: collectTextureState(),
    judgement: collectJudgementState(),
    globalControls: collectGlobalControlState()
  };
}

window.stateCollector = {
  collectCurrentFormState,
  collectObjectDefinitionState,
  collectCompositionState,
  collectTextureState,
  collectJudgementState,
  collectGlobalControlState
};
