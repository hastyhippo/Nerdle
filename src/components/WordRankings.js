import React, { useContext } from "react";
import { AppContext } from "../App";
import "../App.css";

function WordRankings() {
  const { results, rankingsLoading, onFillWord, gameOver } =
    useContext(AppContext);

  return (
    <div className="word-rankings-container">
      <h2 className="word-rankings-title">
        Word Rankings
        {rankingsLoading && (
          <span className="rankings-spinner" aria-label="updating" />
        )}
      </h2>

      <ul className={`word-rankings-list ${rankingsLoading ? "is-loading" : ""}`}>
        {results.map((item, index) => (
          <li key={item.word ?? index}>
            <button
              type="button"
              className="word-rankings-item"
              onClick={() => onFillWord(item.word)}
              disabled={gameOver.gameOver}
              title={`Fill in "${item.word}"`}
            >
              <span className="word-text">{item.word}</span>
              <span className="word-score">{item.score.toFixed(3)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WordRankings;
