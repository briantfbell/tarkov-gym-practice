import React, { useState, useEffect, useRef } from "react";
import "../GymPractice.css";

import HexFrame from "../assets/Hexagon_Frame_Gray.png";
import MovingHex from "../assets/Moving_Hex.png";
import MouseIcon from "../assets/MouseIcon.png";

const REP_CONFIGS = Array.from({ length: 15 }, (_, i) => {
  // Change the hex size each level (fixed interval - likely need to edit according to actual Tarkov gym)
  const frameScale = 1.0 - i * 0.05;
  // Changes gym speed each level - same ( ) as above
  const speed = 0.005 + i * 0.0004;
  return {
    id: i + 1,
    frameScale: parseFloat(frameScale.toFixed(3)),
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
  const actualOuter = config.frameScale * config.outerRatio;
  const actualInner = config.frameScale * config.innerRatio;
  const actualFail = config.frameScale * config.failRatio;

  const animate = () => {
    // If the rep is already over, stop the loop entirely
    if (isProcessingRef.current || status !== "active") return;

    setScale((prevScale) => {
      const nextScale = prevScale - config.speed;

      if (nextScale <= actualFail) {
        // Trigger auto-fail
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

    // Reset window
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
  };

  if (sessionComplete) {
    return (
      <div className="wrapper">
        <div className="summary-card">
          {/* Either temporary or will make prettier later */}
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
      {/* Temporary - scale let's you do an 'eyeball it' test to see if it looks right */}
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
