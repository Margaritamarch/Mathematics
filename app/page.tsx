"use client";

import { useState } from "react";

const numbers = Array.from({ length: 100 }, (_, index) => index + 1);

export default function Home() {
  const [isBlank, setIsBlank] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

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

        <div className="number-grid" aria-label="Πίνακας αριθμών από το 1 έως το 100">
          {numbers.map((number) => {
            const isVisible = !isBlank || revealed.has(number);

            return (
              <button
                key={number}
                type="button"
                className={`number-cell${isVisible ? " visible" : " hidden"}`}
                onClick={() => revealNumber(number)}
                aria-label={
                  isVisible ? `Αριθμός ${number}` : `Κρυμμένος αριθμός στη θέση ${number}`
                }
              >
                <span aria-hidden={!isVisible}>{isVisible ? number : ""}</span>
              </button>
            );
          })}
        </div>

        <footer className="board-footer">
          <span className="footer-dot" aria-hidden="true" />
          {isBlank
            ? `${revealed.size} από τους 100 αριθμούς εμφανίστηκαν`
            : "Οι αριθμοί από το 1 μέχρι το 100"}
        </footer>
      </section>
    </main>
  );
}
