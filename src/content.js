(function () {
  const overlayId = "xtec-esfera-overlay";
  const summaryButtonId = "xtec-esfera-summary-button";
  const expandButtonId = "xtec-esfera-expand-button";
  const styleId = "xtec-esfera-style";
  const openEventName = "xtec-esfera-open-summary";
  const moduleCodePattern = /^\d{4}_ICB0$/;
  const subsectionCodePattern = /^\d{4}_ICB0_[A-Z0-9]+$/;
  const compactTableMinWidthSum = 40;
  const compactTableMaxWidthSum = 60;

  if (window.__xtecEsferaInitialized) {
    return;
  }
  window.__xtecEsferaInitialized = true;

  function cleanText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function getFieldValue(row, selector) {
    const field = row.querySelector(selector);
    if (!field) {
      return "";
    }

    if (field.tagName === "SELECT") {
      return field.value || field.getAttribute("value") || "";
    }

    return field.value || field.getAttribute("value") || "";
  }

  function getQualitativeValue(row) {
    const select = row.querySelector(
      'select[ng-model="contingut.qualitativa"], select[data-ng-model="contingut.qualitativa"]'
    );

    if (!select) {
      return "";
    }

    const selectedOption =
      select.selectedOptions?.[0] || select.querySelector("option[selected]");

    if (selectedOption) {
      return cleanText(selectedOption.label || selectedOption.textContent || selectedOption.value);
    }

    return select.value?.replace(/^string:/, "") || "";
  }

  function formatQualitativeValue(value) {
    const cleanedValue = cleanText(value);
    if (cleanedValue === "NP-No presentat") {
      return "NP";
    }

    if (cleanedValue.includes("Pendent de qualificar")) {
      return "Pendent";
    }

    return cleanedValue;
  }

  function getModuleName(rawName, code) {
    return cleanText(rawName).replace(new RegExp(`\\s*¬\\(${code}\\)\\s*$`), "").trim();
  }

  function getSubsectionName(code) {
    return code.split("_").at(-1) || code;
  }

  function getStudentName() {
    const breadcrumbItems = Array.from(
      document.querySelectorAll(".breadcrumb li, .breadcrumb a, .breadcrumb-wrapper li, .breadcrumb-wrapper a")
    );

    const studentPattern = /^\d+\s*-\s*(.+)$/;
    for (const item of breadcrumbItems.reverse()) {
      const match = cleanText(item.textContent).match(studentPattern);
      if (match) {
        return match[1].trim();
      }
    }

    return "";
  }

  function extractModules() {
    const modules = [];
    let currentModule = null;

    Array.from(document.querySelectorAll("tr")).forEach((row) => {
      const cells = Array.from(row.querySelectorAll("td"));
      if (cells.length < 2) {
        return;
      }

      const code = cleanText(cells[0].textContent);

      if (moduleCodePattern.test(code)) {
        currentModule = {
          code,
          name: getModuleName(cells[1].textContent, code),
          provisional: getFieldValue(
            row,
            'input[ng-model="contingut.qualificacioProv"], input[data-ng-model="contingut.qualificacioProv"]'
          ),
          quantitative: getFieldValue(
            row,
            'input[ng-model="contingut.quantitativa"], input[data-ng-model="contingut.quantitativa"]'
          ),
          qualitative: getQualitativeValue(row),
          subsections: []
        };
        modules.push(currentModule);
        return;
      }

      if (
        currentModule &&
        subsectionCodePattern.test(code) &&
        code.startsWith(`${currentModule.code}_`)
      ) {
        currentModule.subsections.push({
          code,
          name: getSubsectionName(code),
          qualitative: getQualitativeValue(row)
        });
      }
    });

    return modules;
  }

  function createValue(label, value, className, options = {}) {
    const cleanedValue = cleanText(value);
    const showMissing = options.showMissing ?? true;
    const displayValue = cleanedValue || (showMissing ? "FALTA" : "");
    const item = document.createElement("div");
    item.className = "xtec-esfera-value";

    const labelElement = document.createElement("span");
    labelElement.className = "xtec-esfera-value-label";
    labelElement.textContent = label;

    const valueElement = document.createElement("strong");
    valueElement.className = className;
    valueElement.textContent = displayValue;

    if (!cleanedValue && showMissing) {
      valueElement.className = "xtec-esfera-missing";
    }

    if (["FALTA", "PENDENT"].includes(displayValue.toUpperCase())) {
      valueElement.classList.add("xtec-esfera-short-status");
    }

    item.append(labelElement, valueElement);
    return item;
  }

  function createModuleCard(module) {
    const card = document.createElement("article");
    card.className = "xtec-esfera-module";

    const title = document.createElement("h3");
    title.textContent = module.name || module.code;

    const code = document.createElement("p");
    code.className = "xtec-esfera-code";
    code.textContent = module.code;

    const values = document.createElement("div");
    values.className = "xtec-esfera-values";
    const hasNumericGrade = Boolean(cleanText(module.provisional) || cleanText(module.quantitative));
    const hasQuantitativeGrade = cleanText(module.quantitative).toUpperCase() !== "FALTA" && Boolean(cleanText(module.quantitative));
    values.append(
      createValue("Provisional", module.provisional, "xtec-esfera-blue", {
        showMissing: !hasNumericGrade
      }),
      createValue("Qualificació", module.quantitative, "xtec-esfera-green", {
        showMissing: !hasNumericGrade
      }),
      createValue("Qualitativa", formatQualitativeValue(module.qualitative), "xtec-esfera-black", {
        showMissing: !hasQuantitativeGrade
      })
    );

    card.append(title, code, values);

    if (module.subsections.length) {
      const subsections = document.createElement("div");
      subsections.className = "xtec-esfera-subsections";

      module.subsections.forEach((subsection) => {
        const item = document.createElement("div");
        item.className = "xtec-esfera-subsection";

        const name = document.createElement("span");
        name.className = "xtec-esfera-subsection-name";
        name.textContent = subsection.name;

        const value = document.createElement("strong");
        const qualitative = formatQualitativeValue(subsection.qualitative);
        value.className = "xtec-esfera-subsection-value";
        value.textContent = qualitative || "FALTA";
        if (["FALTA", "PENDENT"].includes(value.textContent.toUpperCase())) {
          value.classList.add("xtec-esfera-short-status");
        }

        if (qualitative === "Pendent" && subsection.name === "01EM") {
          value.classList.add("xtec-esfera-subsection-purple");
        } else if (qualitative === "Pendent") {
          value.classList.add("xtec-esfera-subsection-red");
        } else if (qualitative === "En Procés") {
          value.classList.add("xtec-esfera-subsection-blue");
        } else {
          value.classList.add("xtec-esfera-subsection-grey");
        }

        item.append(name, value);
        subsections.append(item);
      });

      card.append(subsections);
    }

    return card;
  }

  function ensureStyles() {
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #${overlayId} {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px;
        background: rgba(28, 37, 48, 0.28);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #1c2530;
      }

      #${overlayId} * {
        box-sizing: border-box;
      }

      .xtec-esfera-panel {
        width: calc(100vw - 100px);
        height: calc(100vh - 100px);
        overflow: hidden;
        border: 1px solid #dfe7ef;
        border-radius: 14px;
        background: #f8fbff;
        box-shadow: 0 28px 70px rgba(24, 34, 47, 0.28), 0 10px 24px rgba(24, 34, 47, 0.16);
      }

      .xtec-esfera-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        padding: 22px 24px 16px;
        border-bottom: 1px solid #e5edf5;
        background: #ffffff;
      }

      .xtec-esfera-eyebrow {
        margin: 0 0 5px;
        color: #66788c;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .xtec-esfera-header h2 {
        margin: 0;
        color: #152231;
        font-size: 24px;
        line-height: 1.2;
      }

      .xtec-esfera-close {
        width: 36px;
        height: 36px;
        flex: 0 0 auto;
        border: 1px solid #ccd8e4;
        border-radius: 8px;
        background: #f8fbff;
        color: #334155;
        cursor: pointer;
        font-size: 24px;
        line-height: 30px;
      }

      .xtec-esfera-close:hover {
        background: #edf4fb;
      }

      .xtec-esfera-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 12px;
        height: calc(100% - 94px);
        overflow: auto;
        padding: 16px;
      }

      .xtec-esfera-module {
        min-width: 0;
        border: 1px solid #d9e3ee;
        border-radius: 8px;
        background: #ffffff;
        padding: 14px;
      }

      .xtec-esfera-module h3 {
        margin: 0 0 5px;
        overflow: hidden;
        color: #17212b;
        font-size: 15px;
        line-height: 1.25;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .xtec-esfera-code {
        margin: 0 0 12px;
        color: #66788c;
        font-size: 12px;
        font-weight: 700;
      }

      .xtec-esfera-values {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }

      .xtec-esfera-value {
        min-width: 0;
        padding: 8px;
        border-radius: 7px;
        background: #f4f8fc;
      }

      .xtec-esfera-value-label {
        display: block;
        margin-bottom: 4px;
        color: #66788c;
        font-size: 11px;
        line-height: 1.15;
      }

      .xtec-esfera-value strong {
        display: block;
        overflow-wrap: anywhere;
        font-size: 18px;
        line-height: 1.1;
      }

      .xtec-esfera-short-status {
        font-size: 15px !important;
        line-height: 1.15 !important;
        white-space: nowrap;
      }

      .xtec-esfera-subsections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
        gap: 8px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #e5edf5;
      }

      .xtec-esfera-subsection {
        min-width: 0;
        padding: 8px;
        border-radius: 7px;
        background: #f8fafc;
      }

      .xtec-esfera-subsection-name {
        display: block;
        margin-bottom: 4px;
        color: #66788c;
        font-size: 11px;
        font-weight: 700;
        line-height: 1.15;
      }

      .xtec-esfera-subsection-value {
        display: block;
        overflow-wrap: anywhere;
        font-size: 13px;
        line-height: 1.2;
      }

      .xtec-esfera-subsection-red {
        color: #dc2626;
      }

      .xtec-esfera-subsection-blue {
        color: #1d4ed8;
      }

      .xtec-esfera-subsection-purple {
        color: #7e22ce;
      }

      .xtec-esfera-subsection-grey {
        color: #374151;
      }

      .xtec-esfera-blue {
        color: #1d4ed8;
      }

      .xtec-esfera-green {
        color: #15803d;
      }

      .xtec-esfera-black {
        color: #111827;
      }

      .xtec-esfera-missing {
        color: #dc2626;
      }

      .xtec-esfera-empty {
        padding: 32px;
        color: #53657a;
        font-size: 15px;
      }

      #${summaryButtonId} {
        position: fixed;
        z-index: 2147483646;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        border: 1px solid #4cae4c;
        border-radius: 4px;
        background: #5cb85c;
        color: #ffffff;
        box-shadow: none;
        cursor: pointer;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0;
        line-height: 1.42857143;
      }

      #${expandButtonId} {
        position: fixed;
        z-index: 2147483646;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        border: 1px solid #d43f3a;
        border-radius: 4px;
        background: #d9534f;
        color: #ffffff;
        box-shadow: none;
        cursor: pointer;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: 0;
        line-height: 1.42857143;
      }

      #${summaryButtonId}:hover {
        border-color: #398439;
        background: #449d44;
      }

      #${expandButtonId}:hover {
        border-color: #ac2925;
        background: #c9302c;
      }

      #${summaryButtonId}:focus-visible {
        outline: 3px solid rgba(29, 78, 216, 0.35);
        outline-offset: 2px;
      }

      #${expandButtonId}:focus-visible {
        outline: 3px solid rgba(217, 83, 79, 0.35);
        outline-offset: 2px;
      }

      @media (max-width: 720px) {
        #${overlayId} {
          padding: 14px;
        }

        .xtec-esfera-panel {
          width: calc(100vw - 28px);
          height: calc(100vh - 28px);
        }

        .xtec-esfera-header {
          padding: 18px 18px 14px;
        }

        .xtec-esfera-grid {
          grid-template-columns: 1fr;
          height: calc(100% - 90px);
          padding: 12px;
        }

        .xtec-esfera-values {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.documentElement.append(style);
  }

  function renderOverlay(modules) {
    const existingOverlay = document.getElementById(overlayId);
    if (existingOverlay) {
      existingOverlay.remove();
    }

    ensureStyles();

    const overlay = document.createElement("div");
    overlay.id = overlayId;

    const panel = document.createElement("section");
    panel.className = "xtec-esfera-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "XTEC-Esfera summary");

    const header = document.createElement("header");
    header.className = "xtec-esfera-header";

    const headingGroup = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.className = "xtec-esfera-eyebrow";
    eyebrow.textContent = "XTEC-Esfera";

    const heading = document.createElement("h2");
    const studentName = getStudentName();
    heading.textContent = studentName ? `Resum de mòduls: ${studentName}` : "Resum de mòduls";

    headingGroup.append(eyebrow, heading);

    const closeButton = document.createElement("button");
    closeButton.className = "xtec-esfera-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close summary");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => overlay.remove());

    header.append(headingGroup, closeButton);
    panel.append(header);

    if (modules.length) {
      const grid = document.createElement("div");
      grid.className = "xtec-esfera-grid";
      modules.forEach((module) => grid.append(createModuleCard(module)));
      panel.append(grid);
    } else {
      const empty = document.createElement("p");
      empty.className = "xtec-esfera-empty";
      empty.textContent = "No s'han trobat mòduls en aquesta pàgina.";
      panel.append(empty);
    }

    overlay.append(panel);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.remove();
      }
    });

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          overlay.remove();
        }
      },
      { once: true }
    );

    document.body.append(overlay);
  }

  function openSummary() {
    renderOverlay(extractModules());
  }

  function isKnownPage() {
    return extractModules().length > 0;
  }

  function isVisible(element) {
    const style = getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      element.getClientRects().length > 0
    );
  }

  function getElementWidthPercent(element) {
    const width = element.style.width || "";
    const match = width.match(/^([0-9.]+)%$/);
    return match ? Number(match[1]) : null;
  }

  function getResizableHeaderCells(table) {
    return Array.from(table.querySelectorAll("thead th")).filter((cell) => {
      const ngStyle = cell.getAttribute("data-ng-style") || cell.getAttribute("ng-style") || "";
      return ngStyle.includes("getProporcioPonderada") && isVisible(cell);
    });
  }

  function getTableWidthSum(table) {
    const headerCells = getResizableHeaderCells(table);
    if (!headerCells.length) {
      return 0;
    }

    return headerCells.reduce((sum, cell) => sum + (getElementWidthPercent(cell) || 0), 0);
  }

  function isCompactGradesTable(table) {
    if (!isVisible(table)) {
      return false;
    }

    const widthSum = getTableWidthSum(table);
    return widthSum >= compactTableMinWidthSum && widthSum <= compactTableMaxWidthSum;
  }

  function findCompactGradesTables() {
    return Array.from(document.querySelectorAll("table.grades-table")).filter(isCompactGradesTable);
  }

  function expandCompactGradesTables() {
    const tables = findCompactGradesTables();

    tables.forEach((table) => {
      const widthSum = getTableWidthSum(table);
      if (!widthSum) {
        return;
      }

      const factor = 100 / widthSum;
      Array.from(table.querySelectorAll("th, td")).forEach((cell) => {
        const width = getElementWidthPercent(cell);
        if (!width) {
          return;
        }

        cell.style.width = `${width * factor}%`;
      });
    });

    return tables.length > 0;
  }

  function findAnteriorButton() {
    return Array.from(document.querySelectorAll("a, button")).find((element) => {
      if (element.id === summaryButtonId) {
        return false;
      }

      return cleanText(element.textContent).includes("Anterior");
    });
  }

  function positionSummaryButton(button) {
    const anteriorButton = findAnteriorButton();
    if (!anteriorButton) {
      button.style.top = "100px";
      button.style.right = "12px";
      button.style.left = "auto";
      return;
    }

    const anteriorStyle = getComputedStyle(anteriorButton);
    const rect = anteriorButton.getBoundingClientRect();
    const gap = 10;
    const leftOfAnterior = rect.left - button.offsetWidth - gap;
    const left = leftOfAnterior >= 12 ? leftOfAnterior : rect.right + gap;

    button.style.color = anteriorStyle.color;
    button.style.fontFamily = anteriorStyle.fontFamily;
    button.style.fontSize = anteriorStyle.fontSize;
    button.style.fontWeight = anteriorStyle.fontWeight;
    button.style.lineHeight = anteriorStyle.lineHeight;
    button.style.top = `${Math.max(12, rect.top)}px`;
    button.style.left = `${left}px`;
    button.style.right = "auto";
    button.style.height = `${Math.round(rect.height)}px`;
  }

  function copyButtonStyle(sourceButton, targetButton) {
    const sourceStyle = getComputedStyle(sourceButton);
    targetButton.style.color = sourceStyle.color;
    targetButton.style.fontFamily = sourceStyle.fontFamily;
    targetButton.style.fontSize = sourceStyle.fontSize;
    targetButton.style.fontWeight = sourceStyle.fontWeight;
    targetButton.style.lineHeight = sourceStyle.lineHeight;
    targetButton.style.height = `${Math.round(sourceButton.getBoundingClientRect().height)}px`;
  }

  function positionExpandButton(button, summaryButton) {
    const rect = summaryButton.getBoundingClientRect();
    const gap = 10;
    const leftOfSummary = rect.left - button.offsetWidth - gap;
    const left = leftOfSummary >= 12 ? leftOfSummary : rect.right + gap;

    copyButtonStyle(summaryButton, button);
    button.style.top = `${Math.max(12, rect.top)}px`;
    button.style.left = `${left}px`;
    button.style.right = "auto";
  }

  function syncSummaryButton() {
    const existingButton = document.getElementById(summaryButtonId);
    if (!document.body || !isKnownPage()) {
      existingButton?.remove();
      return false;
    }

    const summaryButton = existingButton || document.createElement("button");
    if (!existingButton) {
      summaryButton.id = summaryButtonId;
      summaryButton.type = "button";
      summaryButton.textContent = "Resum";
      summaryButton.setAttribute("aria-label", "Open XTEC-Esfera summary");
      summaryButton.addEventListener("click", openSummary);
    }

    ensureStyles();
    if (!existingButton) {
      document.body.append(summaryButton);
    }

    positionSummaryButton(summaryButton);
    return true;
  }

  function syncExpandButton() {
    const existingButton = document.getElementById(expandButtonId);
    const summaryButton = document.getElementById(summaryButtonId);
    if (!document.body || !summaryButton || !findCompactGradesTables().length) {
      existingButton?.remove();
      return false;
    }

    const expandButton = existingButton || document.createElement("button");
    if (!existingButton) {
      expandButton.id = expandButtonId;
      expandButton.type = "button";
      expandButton.textContent = "Expandir";
      expandButton.setAttribute("aria-label", "Expand compacted XTEC-Esfera tables");
      expandButton.addEventListener("click", () => {
        expandCompactGradesTables();
        syncExpandButton();
      });
    }

    ensureStyles();
    if (!existingButton) {
      document.body.append(expandButton);
    }

    positionExpandButton(expandButton, summaryButton);
    return true;
  }

  function watchForKnownPage() {
    syncSummaryButton();
    syncExpandButton();

    let pendingCheck = 0;
    const isExtensionMutation = (mutation) => {
      const target = mutation.target;
      if (!(target instanceof Element)) {
        return false;
      }

      return Boolean(
        target.closest(`#${overlayId}, #${summaryButtonId}, #${expandButtonId}`) ||
          target.id === styleId
      );
    };

    const scheduleSync = (mutations = []) => {
      if (mutations.length && mutations.every(isExtensionMutation)) {
        return;
      }

      window.clearTimeout(pendingCheck);
      pendingCheck = window.setTimeout(() => {
        syncSummaryButton();
        syncExpandButton();
      }, 250);
    };

    const observer = new MutationObserver(scheduleSync);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["aria-hidden", "class", "style"],
      childList: true,
      subtree: true
    });

    window.addEventListener("resize", scheduleSync);
    window.addEventListener("scroll", scheduleSync, true);
  }

  window.addEventListener(openEventName, openSummary);
  watchForKnownPage();
})();
