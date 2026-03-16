import React, { useState, useEffect, useRef } from "react";
import "../GymPractice.css";

import HexFrame from "../assets/Hexagon_Frame_Gray.png";
import MovingHex from "../assets/Moving_Hex.png";
import MouseIcon from "../assets/MouseIcon.png";

// Hard-coded goal hex heights (in inches); measured from frames imposed onto a 500px x 500px Photoshop canvas
const HEIGHTS = [
  4.0, 3.78, 3.56, 3.31, 3.08, 2.85, 2.63, 2.49, 2.43, 2.33, 2.31, 2.26, 1.88,
  1.79, 1.75,
];

// Measured Durations (Seconds from start to outermost border)
const DURATIONS = [
  0.36, 0.33, 0.38, 0.41, 0.47, 0.41, 0.45, 0.4, 0.41, 0.37, 0.34, 0.31, 0.32,
  0.29, 0.29,
];

// Generating the 15 Custom Instances
const REP_INSTANCES = HEIGHTS.map((h, i) => {
  const frameScale = parseFloat((h / 4.0).toFixed(3));
  const outerRatio = 0.85;
  const distanceToOuter = 1.0 - frameScale * outerRatio;

  // Speed = Distance / (Duration * 60 FPS)
  const speed = distanceToOuter / (DURATIONS[i] * 60);

  return {
    rep: i + 1,
    frameScale: frameScale,
    speed: parseFloat(speed.toFixed(5)),
    // If you remake assets, you can change this to: asset: `/assets/HexFrame_${i+1}.png`
    asset: HexFrame,
    outerRatio: outerRatio,
    innerRatio: 0.726,
    failRatio: 0.725,
  };
});

const TarkovGymPractice = () => {
  const [currentRep, setCurrentRep] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [status, setStatus] = useState("active");
  const [score, setScore] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  const requestRef = useRef();
  const isProcessingRef = useRef(false);

  // Selects the specific instance for the current rep
  const activeInstance = REP_INSTANCES[currentRep];

  const actualOuter = activeInstance.frameScale * activeInstance.outerRatio;
  const actualInner = activeInstance.frameScale * activeInstance.innerRatio;
  const actualFail = activeInstance.frameScale * activeInstance.failRatio;

  const animate = () => {
    if (isProcessingRef.current || status !== "active") return;

    setScale((prevScale) => {
      const nextScale = prevScale - activeInstance.speed;
      if (nextScale <= actualFail) {
        handleResult(false);
        return actualFail;
      }
      return nextScale;
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (status === "active" && !sessionComplete) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [status, currentRep, sessionComplete]);

  const handleResult = (isClick) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    cancelAnimationFrame(requestRef.current);

    const isSuccess = isClick && scale <= actualOuter && scale >= actualInner;

    if (isSuccess) {
      setStatus("success");
      setScore((prev) => prev + 1);
    } else {
      setStatus("fail");
    }

    setTimeout(() => {
      if (currentRep < 14) {
        setScale(1.0);
        setCurrentRep((prev) => prev + 1);
        setStatus("active");
        isProcessingRef.current = false;
      } else {
        setSessionComplete(true);
      }
    }, 1000);
  };

  const restartSession = () => {
    setCurrentRep(0);
    setScore(0);
    setScale(1.0);
    setSessionComplete(false);
    setStatus("active");
    isProcessingRef.current = false;
  };

  if (sessionComplete) {
    return (
      <div className="wrapper">
        <div className="summary-card">
          <h1>Workout Complete</h1>
          <p>Successful Reps: {score} / 15</p>
          <button className="restart-btn" onClick={restartSession}>
            START NEW SET
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="rep-counter">
        REP: {activeInstance.rep} / 15 | SUCCESSES: {score}
      </div>

      <div
        className={`gym-container ${status}`}
        onClick={() => status === "active" && handleResult(true)}
      >
        <img
          src={activeInstance.asset} // Uses the custom asset per rep
          className="base-frame"
          alt="frame"
          style={{
            transform: `translate(-50%, -50%) scale(${activeInstance.frameScale})`,
          }}
        />
        <img
          src={MovingHex}
          className="moving-line"
          alt="moving-line"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity: status === "active" ? 1 : 0.6,
          }}
        />
        <img src={MouseIcon} className="center-icon" alt="input-hint" />
      </div>
    </div>
  );
};

export default TarkovGymPractice;
