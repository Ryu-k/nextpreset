"use client";

import React, { useState, useEffect } from "react";

interface ScoreClass {
  score: number;
  className: string;
  label: string;
}

const scoreClasses: ScoreClass[] = [
  { score: 0, className: "text-gray-500", label: "Start" },
  { score: 100, className: "text-green-500", label: "Good" },
  { score: 200, className: "text-blue-500", label: "Great" },
  { score: 300, className: "text-yellow-500", label: "Awesome" },
  { score: 400, className: "text-red-500", label: "Amazing" },
  { score: 500, className: "text-purple-500", label: "Unbelievable" },
];

const StateComboStreak = () => {
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [hitHistory, setHitHistory] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCombo(0);
      setMultiplier(1);
      setHitHistory((prevHistory) => [...prevHistory, "Combo Reset: Timeout"]);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [combo]);

  const handleHit = () => {
    const newCombo = combo + 1;
    let newMultiplier = multiplier;

    if (newCombo % 5 === 0) {
      newMultiplier++;
      setMultiplier(newMultiplier);
    }

    const points = 10;
    const addedScore = points * newMultiplier;
    setScore((prevScore) => prevScore + addedScore);
    setCombo(newCombo);
    setHitHistory((prevHistory) => [
      ...prevHistory.slice(-4),
      `Combo ${newCombo}: +${addedScore} (Multiplier: x${newMultiplier})`,
    ]);
  };

  const handleReset = () => {
    setCombo(0);
    setScore(0);
    setMultiplier(1);
    setHitHistory(["Combo Reset: Manual Reset"]);
  };

  const getScoreClass = () => {
    return (
      scoreClasses
        .slice()
        .reverse()
        .find((sc) => score >= sc.score) || scoreClasses[0]
    );
  };

  const scoreClass = getScoreClass();

  return (
    <div className="p-4 space-y-2 min-h-52">
      <div className={`text-2xl font-bold ${scoreClass.className}`}>
        Score: {score} - {scoreClass.label}
      </div>
      <div className="text-xl">
        Combo: x{combo} (Multiplier: x{multiplier})
      </div>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={handleHit}
      >
        Hit (+10)
      </button>
      <button
        className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        onClick={handleReset}
      >
        Reset
      </button>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Hit History</h3>
        {hitHistory.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </div>
    </div>
  );
};

export default StateComboStreak;
