"use client";

import { useState } from "react";

const positions = Array.from({ length: 100 }, (_, index) => index + 1);
const ranges = Array.from({ length: 10 }, (_, index) => ({
  index,
  start: index * 100 + 1,
  end: (index + 1) * 100,
}));

function AnimatedNumber({ value }: { value: number }) {
  const digits = String(value).split("");

  return (
    <span className="number-value" aria-hidden="true">
      {digits.map((digit, index) => {
        const placeFromRight = digits.length - index - 1;

        return (
          <span
            className="number-digit"
            key={`${placeFromRight}-${digit}`}
            style={{ gridColumn: 4 - placeFromRight }}
          >
            {digit}
          </span>
        );
      })}
    </span>
  );
}

export default function Home() {
  const [isBlank, setIsBlank] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [rangeIndex, setRangeIndex] = useState(0);
  const activeRange = ranges[rangeIndex];

  function showAll() {
    setIsBlank(false);
    setRevealed(new Set());
  }

  function hideAll() {
    setIsBlank(true);
    setRevealed(new Set());
  }

  function revealNumber(number: number) {
    if (!isBlank) return;

    setRevealed((current) => {
      const next = new Set(current);
      next.add(number);
      return next;
    });
  }

  function selectRange(index: number) {
    setRangeIndex(index);
  }

  return (
    <main className="page-shell">
      <section className="board-card" aria-labelledby="page-title">
        <header className="board-header">
          <div>
            <p className="eyebrow">Μαθαίνω τους αριθμούς</p>
            <h1 id="page-title">Πίνακας του 100</h1>
            <p className="instructions">
              Επίλεξε «Κενό» και πάτησε σε ένα τετραγωνάκι για να
              αποκαλύψεις τον αριθμό.
            </p>
          </div>

          <div className="view-switch" role="group" aria-label="Προβολή πίνακα">
            <button
              type="button"
              className={!isBlank ? "active" : ""}
              aria-pressed={!isBlank}
              onClick={showAll}
            >
              Αριθμοί
            </button>
            <button
              type="button"
              className={isBlank ? "active" : ""}
              aria-pressed={isBlank}
              onClick={hideAll}
            >
              Κενό
            </button>
          </div>
        </header>

        <nav className="range-nav" aria-label="Επιλογή εκατοντάδας">
          {ranges.map((range) => (
            <button
              type="button"
              key={range.index}
              className={rangeIndex === range.index ? "active" : ""}
              aria-current={rangeIndex === range.index ? "true" : undefined}
              onClick={() => selectRange(range.index)}
            >
              {range.start}–{range.end}
            </button>
          ))}
        </nav>

        <div
          className="number-grid"
          aria-label={`Πίνακας αριθμών από το ${activeRange.start} έως το ${activeRange.end}`}
        >
          {positions.map((position) => {
            const number = rangeIndex * 100 + position;
            const isVisible = !isBlank || revealed.has(position);

            return (
              <button
                key={position}
                type="button"
                className={`number-cell${isVisible ? " visible" : " hidden"}`}
                onClick={() => revealNumber(position)}
                aria-label={
                  isVisible ? `Αριθμός ${number}` : `Κρυμμένος αριθμός στη θέση ${number}`
                }
              >
                {isVisible ? <AnimatedNumber value={number} /> : null}
              </button>
            );
          })}
        </div>

        <footer className="board-footer">
          <span className="footer-dot" aria-hidden="true" />
          {isBlank
            ? `${revealed.size} από τους 100 αριθμούς εμφανίστηκαν`
            : `Οι αριθμοί από το ${activeRange.start} μέχρι το ${activeRange.end}`}
        </footer>
      </section>
    </main>
  );
}
