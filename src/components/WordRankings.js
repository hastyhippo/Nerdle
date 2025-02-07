import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import "../App.css";
function WordRankings() {
  const { results } = useContext(AppContext);

  useEffect(() => {}, [results]);

  return (
    <div className="word-rankings-container">
      <h2 className="word-rankings-title">Word Rankings</h2>

      <ul className="word-rankings-list">
        {results.map((item, index) => (
          <li key={index} className="word-rankings-item">
            <span className="word-text">{item.word}</span>
            <span className="word-score">{item.score.toFixed(3)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WordRankings;
