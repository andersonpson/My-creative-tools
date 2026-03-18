window.techniqueCategoryDisplay = [
  { id: "soften_structure", i18nKey: "technique-soften" },
  { id: "crisp_texture", i18nKey: "technique-crisp" },
  { id: "reshape_structure", i18nKey: "technique-reshape" },
  { id: "extract_components", i18nKey: "technique-extract" },
  { id: "build_flavor", i18nKey: "technique-flavor" },
  { id: "preservation", i18nKey: "technique-preservation" },
  { id: "tecnica_ancestral", i18nKey: "technique-ancestral" }
];

function getTechniqueCategoryDisplay() {
  return window.techniqueCategoryDisplay.map((category) => ({
    ...category,
    displayLabel: typeof i18n !== "undefined" && i18n.t ? i18n.t(category.i18nKey) : category.i18nKey
  }));
}
