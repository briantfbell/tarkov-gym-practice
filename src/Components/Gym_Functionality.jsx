import React, { useState, useEffect, useRef } from "react";
import "../GymPractice.css";

import HexFrame from "../assets/Hexagon_Frame_Gray.png";
import MovingHex from "../assets/Moving_Hex.png";
import MouseIcon from "../assets/MouseIcon.png";

// Measurements from your UI Hexagon Scaling chart (Height / 4.00 baseline)
const SCALING_DATA = [
  4.0, 3.78, 3.56, 3.31, 3.08, 2.85, 2.63, 2.49, 2.43, 2.33, 2.31, 2.26, 1.88,
  1.79, 1.75,
].map((height) => parseFloat((height / 4.0).toFixed(3)));

const REP_CONFIGS = SCALING_DATA.map((frameScale, i) => {
  // Maintaining your speed ramp logic: starts at 0.005, increases by 0.0004 per rep
  const speed = 0.005 + i * 0.0004;
  return {
    id: i + 1,
    frameScale: frameScale,
    speed: parseFloat(speed.toFixed(3)),
    outerRatio: 0.85,
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

  const config = REP_CONFIGS[currentRep] || REP_CONFIGS[0];

  // These now calculate dynamically based on your Photoshop measurements
  const actualOuter = config.frameScale * config.outerRatio;
  const actualInner = config.frameScale * config.innerRatio;
  const actualFail = config.frameScale * config.failRatio;

  const animate = () => {
    if (isProcessingRef.current || status !== "active") return;

    setScale((prevScale) => {
      const nextScale = prevScale - config.speed;

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
        REP: {currentRep + 1} / 15 | SUCCESSES: {score} | SCALE:{" "}
        {scale.toFixed(3)}
      </div>

      <div
        className={`gym-container ${status}`}
        onClick={() => status === "active" && handleResult(true)}
      >
        <img
          src={HexFrame}
          className="base-frame"
          alt="frame"
          style={{
            transform: `translate(-50%, -50%) scale(${config.frameScale})`,
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
