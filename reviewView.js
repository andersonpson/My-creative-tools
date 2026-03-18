function createReviewLineList(lines = []) {
  const list = document.createElement("div");
  list.className = "review-line-list";

  if (!lines.length) {
    const empty = document.createElement("div");
    empty.className = "review-empty-text";
    empty.textContent = i18n.t("review-empty");
    list.appendChild(empty);
    return list;
  }

  lines.forEach((line) => {
    const item = document.createElement("div");
    item.className = "review-line-item";
    item.textContent = line;
    list.appendChild(item);
  });

  return list;
}

function createReviewCard(title, bodyContent) {
  const card = document.createElement("section");
  card.className = "review-card";

  const heading = document.createElement("h3");
  heading.className = "review-card-title";
  heading.textContent = title;

  const body = document.createElement("div");
  body.className = "review-card-body";

  if (bodyContent instanceof Node) {
    body.appendChild(bodyContent);
  } else if (typeof bodyContent === "string") {
    const text = document.createElement("div");
    text.className = "review-card-text";
    text.textContent = bodyContent;
    body.appendChild(text);
  }

  card.appendChild(heading);
  card.appendChild(body);

  return card;
}

function createObjectCardContent(objectCard = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "review-object-card-content";

  const title = document.createElement("div");
  title.className = "review-object-title";
  title.textContent = objectCard.title || i18n.t("review-ingredient-name-empty");

  const subtitle = document.createElement("div");
  subtitle.className = "review-object-subtitle";
  subtitle.textContent = objectCard.subtitle || i18n.t("review-scientific-name-empty");

  const target = document.createElement("div");
  target.className = "review-object-target";
  target.textContent = objectCard.analysisTarget || i18n.t("review-analysis-target");

  const meta = document.createElement("div");
  meta.className = "review-object-meta";

  const separable = document.createElement("div");
  separable.className = "review-object-meta-item";
  const separableText = objectCard.hasSeparablePart === "yes"
    ? i18n.t("review-separable-yes")
    : objectCard.hasSeparablePart === "no"
      ? i18n.t("review-separable-no")
      : i18n.t("review-separable-notselected");
  separable.textContent = i18n.t("review-separable-label") + separableText;

  const parts = document.createElement("div");
  parts.className = "review-object-meta-item";
  parts.textContent = i18n.t("review-parts-label") + (objectCard.separableParts || i18n.t("review-parts-empty"));

  meta.appendChild(separable);
  meta.appendChild(parts);

  wrapper.appendChild(title);
  wrapper.appendChild(subtitle);
  wrapper.appendChild(target);
  wrapper.appendChild(meta);

  return wrapper;
}

function buildReadableReviewPanel(formState = {}) {
  const formatted = window.reviewFormatter?.formatReviewState
    ? window.reviewFormatter.formatReviewState(formState)
    : null;

  const panel = document.createElement("div");
  panel.className = "review-panel";

  if (!formatted) {
    const errorText = document.createElement("div");
    errorText.className = "review-empty-text";
    errorText.textContent = i18n.t("review-unavailable");
    panel.appendChild(errorText);
    return panel;
  }

  const objectCard = createReviewCard(i18n.t("review-object-title"), createObjectCardContent(formatted.objectCard));
  const featureLines = [
    ...formatted.compositionLines,
    ...formatted.textureLines,
    ...formatted.judgementLines,
    ...formatted.globalControlLines
  ];
  const featureCard = createReviewCard(i18n.t("review-features-title"), createReviewLineList(featureLines));

  panel.appendChild(objectCard);
  panel.appendChild(featureCard);

  return panel;
}

window.reviewView = {
  buildReadableReviewPanel,
  createReviewCard,
  createReviewLineList,
  createObjectCardContent
};
