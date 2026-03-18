document.addEventListener("DOMContentLoaded", () => {
  const separablePartRadios = document.querySelectorAll('input[name="hasSeparablePart"]');
  const separablePartsGroup = document.getElementById("separable-parts-group");
  const studyObjectGroup = document.getElementById("study-object-group");
  const compositionSummary = document.getElementById("composition-summary");
  const compositionFields = document.getElementById("composition-fields");
  const textureFields = document.getElementById("texture-fields");
  const judgementFields = document.getElementById("judgement-fields");
  const formLayout = document.getElementById("form-layout");
  const inputStepPage = document.getElementById("input-step-page");
  const reviewStepPage = document.getElementById("review-step-page");
  const resultStepPage = document.getElementById("result-step-page");
  const reviewSection = document.getElementById("review-section");
  const resultSection = document.getElementById("result-section");
  const reviewPanelContainer = document.getElementById("review-panel-container");
  const resultPanelContainer = document.getElementById("result-panel-container");
  const openReviewButton = document.getElementById("open-review-button");
  const reviewBackButton = document.getElementById("review-back-button");
  const reviewContinueButton = document.getElementById("review-continue-button");
  const resultBackButton = document.getElementById("result-back-button");
  let fieldIdentityCounter = 0;

  function t(key, params = {}) {
    return i18n.t(key, params);
  }

  function getNextFieldIdentity(prefix) {
    fieldIdentityCounter += 1;
    return `${prefix}-${fieldIdentityCounter}`;
  }

  function getItemText(item) {
    return item?.i18nKey ? t(item.i18nKey) : "";
  }

  function getAmountPlaceholderKey(labelKey) {
    return labelKey === ingredientPrototypeData.amountFieldLabels.child
      ? "placeholder-select-relative-amount"
      : "placeholder-select-amount";
  }

  function ensureAmountFieldErrorNode(amountField) {
    let errorNode = amountField.querySelector(".amount-field-error");
    if (!errorNode) {
      errorNode = document.createElement("div");
      errorNode.className = "amount-field-error";
      errorNode.hidden = true;
      amountField.appendChild(errorNode);
    }

    return errorNode;
  }

  function setAmountFieldError(amountField, errorKey = "") {
    if (!amountField) {
      return;
    }

    const errorNode = ensureAmountFieldErrorNode(amountField);
    const hasError = Boolean(errorKey);

    amountField.classList.toggle("is-invalid", hasError);
    errorNode.hidden = !hasError;
    errorNode.textContent = hasError ? t(errorKey) : "";
  }

  function getRowAmountRequirement(row) {
    if (!row) {
      return null;
    }

    const amountField = row.querySelector(".amount-field");
    const amountSelect = row.querySelector(".amount-field-select");
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (!amountField || !amountSelect || !checkbox || !checkbox.checked) {
      return null;
    }

    const labelKey = amountField.dataset.labelKey || ingredientPrototypeData.amountFieldLabels.child;
    const errorKey = labelKey === ingredientPrototypeData.amountFieldLabels.child
      ? "composition-field-error-relative-amount"
      : "composition-field-error-amount";

    return {
      amountField,
      amountSelect,
      isMissing: !amountSelect.value,
      errorKey
    };
  }

  function validateCompositionFields() {
    const missingEntries = [];
    let selectedCount = 0;

    document.querySelectorAll(".composition-group").forEach((group) => {
      const mainCheckbox = group.querySelector("input[data-category-id]");
      const mainAmountField = group.querySelector(".composition-top-row .amount-field");
      const mainAmountSelect = group.querySelector(".composition-top-row .amount-field-select");

      if (mainAmountField) {
        setAmountFieldError(mainAmountField);
      }

      if (mainCheckbox?.checked) {
        selectedCount += 1;

        if (!mainAmountSelect?.value) {
          const errorKey = "composition-field-error-amount";
          setAmountFieldError(mainAmountField, errorKey);
          missingEntries.push({
            amountField: mainAmountField,
            amountSelect: mainAmountSelect,
            errorKey
          });
        }
      }

      group.querySelectorAll(".nested-item-row").forEach((row) => {
        const requirement = getRowAmountRequirement(row);
        const amountField = row.querySelector(".amount-field");
        if (amountField) {
          setAmountFieldError(amountField);
        }

        if (!requirement) {
          return;
        }

        selectedCount += 1;

        if (requirement.isMissing) {
          setAmountFieldError(requirement.amountField, requirement.errorKey);
          missingEntries.push(requirement);
        }
      });
    });

    return {
      selectedCount,
      missingEntries
    };
  }

  function updateCompositionSummary() {
    if (!compositionSummary) {
      return { selectedCount: 0, missingEntries: [] };
    }

    const validation = validateCompositionFields();
    const { selectedCount, missingEntries } = validation;

    compositionSummary.classList.toggle("is-warning", missingEntries.length > 0);
    compositionSummary.innerHTML = `
      <span>${missingEntries.length > 0
        ? t("composition-summary-missing", { count: missingEntries.length })
        : t("composition-summary-complete")}</span>
      <span class="composition-summary-meta">${t("composition-summary-selected", { count: selectedCount })}</span>
    `;

    return validation;
  }

  function focusFirstMissingCompositionField(missingEntries) {
    const firstMissing = missingEntries?.[0];
    if (!firstMissing?.amountSelect) {
      return;
    }

    firstMissing.amountField?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      firstMissing.amountSelect.focus();
    }, 120);
  }

  function updateSeparablePartVisibility() {
    const selectedValue = document.querySelector('input[name="hasSeparablePart"]:checked')?.value;

    if (selectedValue === "yes") {
      separablePartsGroup.style.display = "grid";
      studyObjectGroup.style.display = "grid";
      return;
    }

    separablePartsGroup.style.display = "none";
    studyObjectGroup.style.display = "none";
  }

  function createAmountField(labelKey = ingredientPrototypeData.amountFieldLabels.main) {
    const wrapper = document.createElement("div");
    wrapper.className = "amount-field";
    wrapper.dataset.labelKey = labelKey;

    const label = document.createElement("span");
    label.className = "amount-field-label";
    label.textContent = t(labelKey);

    const select = document.createElement("select");
    select.className = "amount-field-select";
    const selectIdentity = getNextFieldIdentity("amount-select");
    select.id = selectIdentity;
    select.name = selectIdentity;

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = t(getAmountPlaceholderKey(labelKey));
    select.appendChild(emptyOption);

    ingredientPrototypeData.amountLevels.forEach((level) => {
      const option = document.createElement("option");
      option.value = level.id;
      option.textContent = t(level.i18nKey);
      select.appendChild(option);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    ensureAmountFieldErrorNode(wrapper);

    return { wrapper, select };
  }

  function resetNestedState(container) {
    container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });

    container.querySelectorAll("select").forEach((select) => {
      select.value = "";
      select.disabled = true;
    });

    container.querySelectorAll(".amount-field").forEach((field) => {
      field.style.display = "none";
    });

    container.querySelectorAll(".mixed-children").forEach((block) => {
      block.style.display = "none";
    });
  }

  function createStandardChildren(children) {
    const container = document.createElement("div");
    container.className = "nested-items";

    children.forEach((child) => {
      const row = document.createElement("div");
      row.className = "nested-item-row";

      const labelWrap = document.createElement("label");
      labelWrap.className = "nested-item-label";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.itemId = child.id;
      checkbox.id = getNextFieldIdentity("composition-child");
      checkbox.name = checkbox.id;

      const text = document.createElement("span");
      text.textContent = getItemText(child);

      labelWrap.appendChild(checkbox);
      labelWrap.appendChild(text);

      const { wrapper: amountField, select: amountSelect } = createAmountField(ingredientPrototypeData.amountFieldLabels.child);
      amountSelect.disabled = true;
      amountField.style.display = "none";

      checkbox.addEventListener("change", () => {
        amountSelect.disabled = !checkbox.checked;
        amountField.style.display = checkbox.checked ? "flex" : "none";
        if (!checkbox.checked) {
          amountSelect.value = "";
        }
        if (checkbox.checked) {
          window.setTimeout(() => amountSelect.focus(), 0);
        }
        updateCompositionSummary();
      });

      amountSelect.addEventListener("change", updateCompositionSummary);

      row.appendChild(labelWrap);
      row.appendChild(amountField);
      container.appendChild(row);
    });

    return container;
  }

  function createFlatChildren(children) {
    return createStandardChildren(children);
  }

  function createMixedLeafRow(item) {
    const row = document.createElement("div");
    row.className = "nested-item-row mixed-leaf-row";

    const labelWrap = document.createElement("label");
    labelWrap.className = "nested-item-label mixed-leaf-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.itemId = item.id;
    checkbox.id = getNextFieldIdentity("composition-leaf");
    checkbox.name = checkbox.id;

    const text = document.createElement("span");
    text.textContent = getItemText(item);

    labelWrap.appendChild(checkbox);
    labelWrap.appendChild(text);

    const { wrapper: amountField, select: amountSelect } = createAmountField(ingredientPrototypeData.amountFieldLabels.child);
    amountSelect.disabled = true;
    amountField.style.display = "none";

    checkbox.addEventListener("change", () => {
      amountSelect.disabled = !checkbox.checked;
      amountField.style.display = checkbox.checked ? "flex" : "none";

      if (!checkbox.checked) {
        amountSelect.value = "";
      }
      if (checkbox.checked) {
        window.setTimeout(() => amountSelect.focus(), 0);
      }
      updateCompositionSummary();
    });

    amountSelect.addEventListener("change", updateCompositionSummary);

    row.appendChild(labelWrap);
    row.appendChild(amountField);

    return row;
  }

  function createMixedChildren(children) {
    const container = document.createElement("div");
    container.className = "nested-items mixed-items";

    children.forEach((child) => {
      const row = document.createElement("div");
      row.className = "nested-item-row mixed-parent-row";

      const labelWrap = document.createElement("label");
      labelWrap.className = "nested-item-label mixed-parent-label";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.itemId = child.id;
      checkbox.id = getNextFieldIdentity("composition-mixed-parent");
      checkbox.name = checkbox.id;

      const text = document.createElement("span");
      text.textContent = getItemText(child);

      labelWrap.appendChild(checkbox);
      labelWrap.appendChild(text);

      const { wrapper: amountField, select: amountSelect } = createAmountField(ingredientPrototypeData.amountFieldLabels.child);
      amountSelect.disabled = true;
      amountField.style.display = "none";

      row.appendChild(labelWrap);
      row.appendChild(amountField);
      container.appendChild(row);

      if (Array.isArray(child.children) && child.children.length > 0) {
        const childContainer = document.createElement("div");
        childContainer.className = "mixed-children nested-items";
        childContainer.style.display = "none";

        child.children.forEach((grandChild) => {
          if (Array.isArray(grandChild.children) && grandChild.children.length > 0) {
            const groupWrapper = document.createElement("div");
            groupWrapper.className = "mixed-group-wrapper";

            const groupRow = document.createElement("div");
            groupRow.className = "nested-item-row mixed-group-row";

            const groupLabel = document.createElement("label");
            groupLabel.className = "nested-item-label mixed-group-label";

            const groupCheckbox = document.createElement("input");
            groupCheckbox.type = "checkbox";
            groupCheckbox.dataset.itemId = grandChild.id;
            groupCheckbox.id = getNextFieldIdentity("composition-mixed-group");
            groupCheckbox.name = groupCheckbox.id;

            const groupText = document.createElement("span");
            groupText.textContent = getItemText(grandChild);

            groupLabel.appendChild(groupCheckbox);
            groupLabel.appendChild(groupText);

            const { wrapper: groupAmountField, select: groupAmountSelect } = createAmountField(ingredientPrototypeData.amountFieldLabels.child);
            groupAmountSelect.disabled = true;
            groupAmountField.style.display = "none";

            groupRow.appendChild(groupLabel);
            groupRow.appendChild(groupAmountField);
            groupWrapper.appendChild(groupRow);

            const grandChildContainer = document.createElement("div");
            grandChildContainer.className = "mixed-children nested-items";
            grandChildContainer.style.display = "none";

            grandChild.children.forEach((leaf) => {
              const leafRow = createMixedLeafRow(leaf);
              leafRow.classList.add("mixed-grandchild-row");
              grandChildContainer.appendChild(leafRow);
            });

            groupCheckbox.addEventListener("change", () => {
              const isChecked = groupCheckbox.checked;
              groupAmountSelect.disabled = !isChecked;
              groupAmountField.style.display = isChecked ? "flex" : "none";
              grandChildContainer.style.display = isChecked ? "block" : "none";

              if (!isChecked) {
                groupAmountSelect.value = "";
                resetNestedState(grandChildContainer);
              }
              if (isChecked) {
                window.setTimeout(() => groupAmountSelect.focus(), 0);
              }
              updateCompositionSummary();
            });

            groupAmountSelect.addEventListener("change", updateCompositionSummary);

            groupWrapper.appendChild(grandChildContainer);
            childContainer.appendChild(groupWrapper);
            return;
          }

          const leafRow = createMixedLeafRow(grandChild);
          leafRow.classList.add("mixed-child-row");
          childContainer.appendChild(leafRow);
        });

        checkbox.addEventListener("change", () => {
          const isChecked = checkbox.checked;
          amountSelect.disabled = !isChecked;
          amountField.style.display = isChecked ? "flex" : "none";
          childContainer.style.display = isChecked ? "block" : "none";

          if (!isChecked) {
            amountSelect.value = "";
            resetNestedState(childContainer);
          }
          if (isChecked) {
            window.setTimeout(() => amountSelect.focus(), 0);
          }
          updateCompositionSummary();
        });

        amountSelect.addEventListener("change", updateCompositionSummary);

        container.appendChild(childContainer);
        return;
      }

      checkbox.addEventListener("change", () => {
        amountSelect.disabled = !checkbox.checked;
        amountField.style.display = checkbox.checked ? "flex" : "none";

        if (!checkbox.checked) {
          amountSelect.value = "";
        }
        if (checkbox.checked) {
          window.setTimeout(() => amountSelect.focus(), 0);
        }
        updateCompositionSummary();
      });

      amountSelect.addEventListener("change", updateCompositionSummary);
    });

    return container;
  }

  function createPlaceholderChildren(labelText) {
    const placeholder = document.createElement("div");
    placeholder.className = "composition-placeholder";
    placeholder.textContent = t("composition-placeholder-next", { label: labelText });
    return placeholder;
  }

  function renderCompositionCategories() {
    if (!compositionFields) {
      return;
    }

    compositionFields.innerHTML = "";

    ingredientPrototypeData.compositionCategories.forEach((category) => {
      const row = document.createElement("div");
      row.className = "field-group composition-group";

      const leftCell = document.createElement("div");
      leftCell.className = "composition-main-label";

      const mainLabel = document.createElement("label");
      mainLabel.className = "main-checkbox-label";

      const mainCheckbox = document.createElement("input");
      mainCheckbox.type = "checkbox";
      mainCheckbox.dataset.categoryId = category.id;
      mainCheckbox.id = getNextFieldIdentity("composition-category");
      mainCheckbox.name = mainCheckbox.id;

      const mainText = document.createElement("span");
      mainText.textContent = getItemText(category);

      mainLabel.appendChild(mainCheckbox);
      mainLabel.appendChild(mainText);
      leftCell.appendChild(mainLabel);

      const rightCell = document.createElement("div");
      rightCell.className = "composition-main-content";

      const topRow = document.createElement("div");
      topRow.className = "composition-top-row";

      const { wrapper: mainAmountField, select: mainAmountSelect } = createAmountField(ingredientPrototypeData.amountFieldLabels.main);
      mainAmountField.classList.add("composition-main-amount-field");
      mainAmountSelect.disabled = true;
      topRow.appendChild(mainAmountField);

      const childrenWrapper = document.createElement("div");
      childrenWrapper.className = "composition-children";
      childrenWrapper.style.display = "none";

      if (category.type === "standard") {
        childrenWrapper.appendChild(createStandardChildren(category.children));
      } else if (category.type === "flat") {
        childrenWrapper.appendChild(createFlatChildren(category.children));
      } else if (category.type === "mixed") {
        childrenWrapper.appendChild(createMixedChildren(category.children));
      } else {
        childrenWrapper.appendChild(createPlaceholderChildren(getItemText(category)));
      }

      mainCheckbox.addEventListener("change", () => {
        const isChecked = mainCheckbox.checked;
        mainAmountSelect.disabled = !isChecked;
        childrenWrapper.style.display = isChecked ? "block" : "none";

        if (isChecked) {
          childrenWrapper.querySelectorAll(".amount-field").forEach((field) => {
            field.style.display = "none";
          });
        }

        if (!isChecked) {
          mainAmountSelect.value = "";
          resetNestedState(childrenWrapper);
        }
        if (isChecked) {
          window.setTimeout(() => mainAmountSelect.focus(), 0);
        }
        updateCompositionSummary();
      });

      mainAmountSelect.addEventListener("change", updateCompositionSummary);

      rightCell.appendChild(topRow);
      rightCell.appendChild(childrenWrapper);
      row.appendChild(leftCell);
      row.appendChild(rightCell);
      compositionFields.appendChild(row);
    });

    updateCompositionSummary();
  }

  function renderTextureOptions() {
    if (!textureFields) {
      return;
    }

    textureFields.innerHTML = "";

    ingredientPrototypeData.textureOptions.forEach((option, index) => {
      const row = document.createElement("div");
      row.className = "field-group texture-option-row";

      const labelCell = document.createElement("div");
      labelCell.className = "field-label";
      labelCell.textContent = getItemText(option);

      const inputCell = document.createElement("div");
      inputCell.className = "radio-group texture-option-cell";

      const checkboxLabel = document.createElement("label");
      checkboxLabel.className = "texture-checkbox-label";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "textureOption";
      checkbox.value = option.id;
      checkbox.id = `texture-option-${index}`;

      const checkboxText = document.createElement("span");
      checkboxText.textContent = t("btn-select");

      checkboxLabel.appendChild(checkbox);
      checkboxLabel.appendChild(checkboxText);
      inputCell.appendChild(checkboxLabel);

      row.appendChild(labelCell);
      row.appendChild(inputCell);
      textureFields.appendChild(row);
    });
  }

  function renderJudgementOptions() {
    if (!judgementFields) {
      return;
    }

    judgementFields.innerHTML = "";

    ingredientPrototypeData.judgementOptions.forEach((option, index) => {
      const row = document.createElement("div");
      row.className = "field-group judgement-option-row";

      const labelCell = document.createElement("div");
      labelCell.className = "field-label";
      labelCell.textContent = getItemText(option);

      const inputCell = document.createElement("div");
      inputCell.className = "radio-group judgement-option-cell";

      const yesLabel = document.createElement("label");
      yesLabel.className = "judgement-radio-label";

      const yesRadio = document.createElement("input");
      yesRadio.type = "radio";
      yesRadio.name = `judgement-option-${index}`;
      yesRadio.value = "yes";
      yesRadio.dataset.judgementId = option.id;
      yesRadio.id = `judgement-option-${index}-yes`;

      const yesText = document.createElement("span");
      yesText.textContent = t("option-yes");

      yesLabel.appendChild(yesRadio);
      yesLabel.appendChild(yesText);

      const noLabel = document.createElement("label");
      noLabel.className = "judgement-radio-label";

      const noRadio = document.createElement("input");
      noRadio.type = "radio";
      noRadio.name = `judgement-option-${index}`;
      noRadio.value = "no";
      noRadio.dataset.judgementId = option.id;
      noRadio.id = `judgement-option-${index}-no`;

      const noText = document.createElement("span");
      noText.textContent = t("option-no");

      noLabel.appendChild(noRadio);
      noLabel.appendChild(noText);

      [yesRadio, noRadio].forEach((radio) => {
        radio.dataset.wasChecked = "false";

        const rememberState = () => {
          radio.dataset.wasChecked = radio.checked ? "true" : "false";
        };

        radio.addEventListener("pointerdown", rememberState);
        radio.addEventListener("keydown", (event) => {
          if (event.key === " " || event.key === "Enter") {
            rememberState();
          }
        });

        radio.addEventListener("click", () => {
          if (radio.dataset.wasChecked === "true") {
            window.setTimeout(() => {
              radio.checked = false;
              radio.dataset.wasChecked = "false";
            }, 0);
          }
        });
      });

      inputCell.appendChild(yesLabel);
      inputCell.appendChild(noLabel);
      row.appendChild(labelCell);
      row.appendChild(inputCell);
      judgementFields.appendChild(row);
    });
  }

  function hideAllStepPages() {
    [inputStepPage, reviewStepPage, resultStepPage].forEach((page) => {
      if (!page) {
        return;
      }

      page.hidden = true;
      page.classList.remove("is-active");
    });
  }

  function showReviewStepPage() {
    if (!reviewStepPage) {
      return;
    }

    hideAllStepPages();
    reviewStepPage.hidden = false;
    reviewStepPage.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showInputStepPage() {
    if (!inputStepPage) {
      return;
    }

    hideAllStepPages();
    inputStepPage.hidden = false;
    inputStepPage.classList.add("is-active");
  }

  function showResultStepPage() {
    if (!resultStepPage) {
      return;
    }

    hideAllStepPages();
    resultStepPage.hidden = false;
    resultStepPage.classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderReviewPanel() {
    if (!reviewPanelContainer || !window.stateCollector?.collectCurrentFormState || !window.reviewView?.buildReadableReviewPanel) {
      return;
    }

    const formState = window.stateCollector.collectCurrentFormState();
    const reviewPanel = window.reviewView.buildReadableReviewPanel(formState);

    reviewPanelContainer.innerHTML = "";
    reviewPanelContainer.appendChild(reviewPanel);
  }

  function renderResultPanel() {
    if (!resultPanelContainer || !window.stateCollector?.collectCurrentFormState || !window.techniqueEngine?.runTechniqueEngine || !window.resultView?.buildTechniqueResultPanel) {
      return;
    }

    const formState = window.stateCollector.collectCurrentFormState();
    const engineResult = window.techniqueEngine.runTechniqueEngine(formState);
    const resultPanel = window.resultView.buildTechniqueResultPanel(engineResult);

    resultPanelContainer.innerHTML = "";
    resultPanelContainer.appendChild(resultPanel);
  }

  function setRadioValue(name, value) {
    document.querySelectorAll(`input[name="${name}"]`).forEach((radio) => {
      radio.checked = radio.value === value;
    });
  }

  function triggerChangeEvent(element) {
    if (element) {
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function restoreObjectDefinitionState(objectDefinition = {}) {
    const ingredientNameInput = document.getElementById("ingredient-name");
    const scientificNameInput = document.getElementById("scientific-name");
    const separablePartsInput = document.getElementById("separable-parts");
    const studyObjectInput = document.getElementById("study-object");

    if (ingredientNameInput) {
      ingredientNameInput.value = objectDefinition.ingredientName || "";
    }
    if (scientificNameInput) {
      scientificNameInput.value = objectDefinition.scientificName || "";
    }
    if (separablePartsInput) {
      separablePartsInput.value = objectDefinition.separableParts || "";
    }
    if (studyObjectInput) {
      studyObjectInput.value = objectDefinition.studyObject || "";
    }

    if (objectDefinition.hasSeparablePart) {
      setRadioValue("hasSeparablePart", objectDefinition.hasSeparablePart);
    }

    updateSeparablePartVisibility();
  }

  function setAmountSelectValue(select, value) {
    if (!select || !value) {
      return;
    }

    select.disabled = false;
    select.value = value;
  }

  function restoreCompositionChildrenState(scope, nodeData = {}) {
    Object.entries(nodeData).forEach(([itemId, itemValue]) => {
      const checkbox = scope.querySelector(`input[data-item-id="${itemId}"]`);
      if (!checkbox || !itemValue || typeof itemValue !== "object") {
        return;
      }

      checkbox.checked = Boolean(itemValue.selected);
      triggerChangeEvent(checkbox);

      const row = checkbox.closest(".nested-item-row");
      const select = row?.querySelector(".amount-field-select");
      setAmountSelectValue(select, itemValue.relativeAmount || itemValue.amount);

      if (itemValue.children && typeof itemValue.children === "object") {
        const childContainer = row?.nextElementSibling?.classList.contains("mixed-children")
          ? row.nextElementSibling
          : row?.parentElement?.querySelector(":scope > .mixed-children");

        if (childContainer) {
          restoreCompositionChildrenState(childContainer, itemValue.children);
        }
      }
    });
  }

  function restoreCompositionState(composition = {}) {
    Object.entries(composition).forEach(([categoryId, categoryValue]) => {
      const checkbox = document.querySelector(`input[data-category-id="${categoryId}"]`);
      if (!checkbox || !categoryValue || typeof categoryValue !== "object") {
        return;
      }

      checkbox.checked = Boolean(categoryValue.selected);
      triggerChangeEvent(checkbox);

      const group = checkbox.closest(".composition-group");
      const mainSelect = group?.querySelector(".composition-top-row .amount-field-select");
      setAmountSelectValue(mainSelect, categoryValue.amount);

      if (categoryValue.children && typeof categoryValue.children === "object") {
        const childScope = group?.querySelector(".composition-children");
        if (childScope) {
          restoreCompositionChildrenState(childScope, categoryValue.children);
        }
      }
    });
  }

  function restoreTextureState(texture = {}) {
    document.querySelectorAll('input[name="textureOption"]').forEach((checkbox) => {
      checkbox.checked = Boolean(texture[checkbox.value]);
    });
  }

  function restoreJudgementState(judgement = {}) {
    ingredientPrototypeData.judgementOptions.forEach((option, index) => {
      const value = judgement[option.id];
      if (value !== "yes" && value !== "no") {
        return;
      }

      const radio = document.querySelector(`input[name="judgement-option-${index}"][value="${value}"]`);
      if (radio) {
        radio.checked = true;
      }
    });
  }

  function restoreFormState(formState = {}) {
    restoreObjectDefinitionState(formState.objectDefinition || {});
    restoreCompositionState(formState.composition || {});
    restoreTextureState(formState.texture || {});
    restoreJudgementState(formState.judgement || {});
  }

  function rerenderDynamicSectionsPreservingState() {
    const savedState = window.stateCollector?.collectCurrentFormState
      ? window.stateCollector.collectCurrentFormState()
      : null;

    renderCompositionCategories();
    renderTextureOptions();
    renderJudgementOptions();

    if (savedState) {
      restoreFormState(savedState);
    }

    updateCompositionSummary();

    if (reviewStepPage?.classList.contains("is-active")) {
      renderReviewPanel();
    }

    if (resultStepPage?.classList.contains("is-active")) {
      renderResultPanel();
    }
  }

  function openReviewStep() {
    const validation = updateCompositionSummary();
    if (validation.missingEntries.length > 0) {
      window.alert(t("composition-validation-blocked"));
      focusFirstMissingCompositionField(validation.missingEntries);
      return;
    }

    renderReviewPanel();
    showReviewStepPage();
  }

  function returnToEditing() {
    showInputStepPage();
    if (formLayout) {
      formLayout.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function openResultStep() {
    renderResultPanel();
    showResultStepPage();
  }

  function returnToReviewStep() {
    showReviewStepPage();
  }

  separablePartRadios.forEach((radio) => {
    radio.addEventListener("change", updateSeparablePartVisibility);
  });

  if (openReviewButton) {
    openReviewButton.addEventListener("click", openReviewStep);
  }

  if (reviewBackButton) {
    reviewBackButton.addEventListener("click", returnToEditing);
  }

  if (reviewContinueButton) {
    reviewContinueButton.addEventListener("click", openResultStep);
  }

  if (resultBackButton) {
    resultBackButton.addEventListener("click", returnToReviewStep);
  }

  document.addEventListener("translationsUpdated", rerenderDynamicSectionsPreservingState);

  updateSeparablePartVisibility();
  showInputStepPage();

  if (reviewSection) {
    reviewSection.hidden = false;
  }
  if (resultSection) {
    resultSection.hidden = false;
  }

  renderCompositionCategories();
  renderTextureOptions();
  renderJudgementOptions();
});
