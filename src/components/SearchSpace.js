import React, { useContext, useMemo } from "react";
import { AppContext } from "../App";

const bits = (n) => (n > 0 ? Math.log2(n) : 0);

function SearchSpace() {
  const { allWords, currentWordBank, history } = useContext(AppContext);

  // Membership test for the dot grid. The grid renders every word once and
  // only toggles a class, so pruning animates instead of re-mounting 2000 nodes.
  const alive = useMemo(() => new Set(currentWordBank), [currentWordBank]);

  if (allWords.length === 0) return null;

  const left = currentWordBank.length;
  const remaining = bits(left);
  const total = bits(allWords.length);
  const solved = left === 1;

  return (
    <div className="search-space">
      <h2 className="search-space-title">Search space</h2>

      <div className="search-space-hero">
        <span className="search-space-count">{left.toLocaleString()}</span>
        <span className="search-space-label">
          {solved ? "candidate left" : "candidates left"}
        </span>
      </div>

      <div className="search-space-bar" title={`${remaining.toFixed(2)} bits`}>
        <div
          className="search-space-bar-fill"
          style={{ width: `${total ? (remaining / total) * 100 : 0}%` }}
        />
      </div>
      <div className="search-space-bits">
        {remaining.toFixed(2)} bits of uncertainty
      </div>

      <div className="search-space-grid" aria-hidden="true">
        {allWords.map((word) => (
          <span
            key={word}
            className={`sdot ${alive.has(word) ? "alive" : "cut"}`}
          />
        ))}
      </div>

      {history.length > 0 && (
        <ul className="search-space-steps">
          {history.map((step, i) => (
            <li key={i}>
              <span className="step-guess">{step.guess}</span>
              <span className="step-counts">
                {step.before.toLocaleString()} &rarr; {step.after.toLocaleString()}
              </span>
              <span className="step-bits">
                &minus;{(bits(step.before) - bits(step.after)).toFixed(2)} bits
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchSpace;
