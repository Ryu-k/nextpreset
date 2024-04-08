"use client";

import React, { useReducer, useEffect } from "react";

interface State {
  combo: number;
  score: number;
  hitHistory: string[];
  multiplier: number;
}

interface ScoreClass {
  score: number;
  className: string;
  label: string;
}

type Action = { type: "hit"; points: number } | { type: "reset" } | { type: "timeout" };

const scoreClasses: ScoreClass[] = [
  { score: 0, className: "text-gray-500", label: "Start" },
  { score: 100, className: "text-green-500", label: "Good" },
  { score: 200, className: "text-blue-500", label: "Great" },
  { score: 300, className: "text-yellow-500", label: "Awesome" },
  { score: 400, className: "text-red-500", label: "Amazing" },
  { score: 500, className: "text-purple-500", label: "Unbelievable" },
];

const initialState: State = {
  combo: 0,
  score: 0,
  hitHistory: [],
  multiplier: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hit":
      const newCombo = state.combo + 1;
      let newMultiplier = state.multiplier;
      if (newCombo % 5 === 0) {
        newMultiplier++;
      }
      const addedPoints = action.points * newMultiplier;
      const newScore = state.score + addedPoints;
      let newHistory = [
        ...state.hitHistory,
        `Combo ${newCombo}: +${addedPoints} (Multiplier: x${newMultiplier})`,
      ];
      while (newHistory.length > 5) newHistory.shift();

      return {
        ...state,
        combo: newCombo,
        score: newScore,
        hitHistory: newHistory,
        multiplier: newMultiplier,
      };
    case "reset":
      
      return {
        ...initialState,
        hitHistory: [...state.hitHistory.slice(-5), "Combo Reset: Manual Reset"],
      };
    case "timeout":

      let timeoutHistory = [...state.hitHistory, "Combo Reset: Timeout"];
      while (timeoutHistory.length > 5) timeoutHistory.shift();

      return {
        ...state,
        combo: 0,
        score: 0,
        multiplier: 1,
        hitHistory: timeoutHistory,
      };
    default:
      return state;
  }
}

function getScoreClass(score: number): ScoreClass {
  const applicableClass =
    [...scoreClasses].reverse().find((sc) => score >= sc.score) || scoreClasses[0];
  return applicableClass;
}

const ComboStreak = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timeoutId = setTimeout(() => dispatch({ type: "timeout" }), 5000);
    return () => clearTimeout(timeoutId);
  }, [state.combo]);

  const scoreClass = getScoreClass(state.score);

  return (
    <div className="p-4 space-y-2 min-h-52">
      <div className={`text-2xl font-bold ${scoreClass.className}`}>
        Score: {state.score} - {scoreClass.label}
      </div>
      <div className="text-xl">
        Combo: x{state.combo} (Multiplier: x{state.multiplier})
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={() => dispatch({ type: "hit", points: 10 })}
      >
        Hit (+10)
      </button>
      <button
        className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        onClick={() => dispatch({ type: "reset" })}
      >
        Reset
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Hit History</h3>
        {state.hitHistory.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
    </div>
  );
};

export default ComboStreak;
