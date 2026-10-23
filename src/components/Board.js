import React from "react";
import Letter from "./Letter";
import { boardDefault } from "./Words";

function Board() {
  return (
    <div className="board">
      {boardDefault.map((row, attemptVal) => (
        <div className="row" key={attemptVal}>
          {row.map((_, letterPos) => (
            <Letter key={letterPos} letterPos={letterPos} attemptVal={attemptVal} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
