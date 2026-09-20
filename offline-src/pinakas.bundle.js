(() => {
  "use strict";

  const ranges = Array.from({ length: 10 }, (_, index) => ({
    index,
    start: index * 100 + 1,
    end: (index + 1) * 100,
  }));

  const state = {
    rangeIndex: 0,
    isBlank: false,
    revealed: new Set(),
  };

  const showAllButton = document.querySelector("#show-all");
  const showBlankButton = document.querySelector("#show-blank");
  const rangeNav = document.querySelector("#range-nav");
  const numberGrid = document.querySelector("#number-grid");
  const boardStatus = document.querySelector("#board-status");
  const cells = [];

  function restartDigitAnimation(digit) {
    digit.classList.remove("changing");
    void digit.offsetWidth;
    digit.classList.add("changing");
  }

  function renderDigits(cell, number) {
    const nextDigits = String(number).padStart(4, " ");
    const previousDigits = cell.dataset.digits ?? "    ";
    const digitElements = cell.querySelectorAll(".number-digit");

    digitElements.forEach((digit, index) => {
      const nextDigit = nextDigits[index];
      const previousDigit = previousDigits[index];

      if (nextDigit !== previousDigit) {
        digit.textContent = nextDigit === " " ? "" : nextDigit;
        restartDigitAnimation(digit);
      }
    });

    cell.dataset.digits = nextDigits;
  }

  function clearDigits(cell) {
    cell.querySelectorAll(".number-digit").forEach((digit) => {
      digit.textContent = "";
      digit.classList.remove("changing");
    });
    cell.dataset.digits = "    ";
  }

  function updateView() {
    const activeRange = ranges[state.rangeIndex];

    showAllButton.classList.toggle("active", !state.isBlank);
    showAllButton.setAttribute("aria-pressed", String(!state.isBlank));
    showBlankButton.classList.toggle("active", state.isBlank);
    showBlankButton.setAttribute("aria-pressed", String(state.isBlank));

    [...rangeNav.children].forEach((button, index) => {
      const isActive = index === state.rangeIndex;
      button.classList.toggle("active", isActive);
      if (isActive) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });

    numberGrid.setAttribute(
      "aria-label",
      `Πίνακας αριθμών από το ${activeRange.start} έως το ${activeRange.end}`,
    );

    cells.forEach((cell, index) => {
      const position = index + 1;
      const number = state.rangeIndex * 100 + position;
      const isVisible = !state.isBlank || state.revealed.has(position);

      cell.classList.toggle("visible", isVisible);
      cell.classList.toggle("hidden", !isVisible);

      if (isVisible) renderDigits(cell, number);
      else clearDigits(cell);

      cell.setAttribute(
        "aria-label",
        state.isBlank && isVisible
          ? `Αριθμός ${number}. Πάτησε για απόκρυψη`
          : isVisible
            ? `Αριθμός ${number}`
            : `Κρυμμένος αριθμός στη θέση ${number}. Πάτησε για εμφάνιση`,
      );
    });

    boardStatus.textContent = state.isBlank
      ? `${state.revealed.size} από τους 100 αριθμούς εμφανίστηκαν`
      : `Οι αριθμοί από το ${activeRange.start} μέχρι το ${activeRange.end}`;
  }

  ranges.forEach((range) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${range.start}–${range.end}`;
    button.addEventListener("click", () => {
      state.rangeIndex = range.index;
      updateView();
    });
    rangeNav.append(button);
  });

  for (let position = 1; position <= 100; position += 1) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "number-cell visible";
    cell.innerHTML = `
      <span class="number-value" aria-hidden="true">
        <span class="number-digit"></span>
        <span class="number-digit"></span>
        <span class="number-digit"></span>
        <span class="number-digit"></span>
      </span>
    `;
    cell.addEventListener("click", () => {
      if (!state.isBlank) return;

      if (state.revealed.has(position)) state.revealed.delete(position);
      else state.revealed.add(position);
      updateView();
    });
    cells.push(cell);
    numberGrid.append(cell);
  }

  showAllButton.addEventListener("click", () => {
    state.isBlank = false;
    state.revealed.clear();
    updateView();
  });

  showBlankButton.addEventListener("click", () => {
    state.isBlank = true;
    state.revealed.clear();
    updateView();
  });

  updateView();
})();
