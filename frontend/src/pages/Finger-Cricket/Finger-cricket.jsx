import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CricketToss from "./CricketToss"; // Import the new component
import "./FingerCricket.css";

const FingerCricket = () => {
  const navigate = useNavigate();
  const [userScore, setUserScore] = useState(0);
  const [computerChoice, setComputerChoice] = useState(null);
  const [gameStatus, setGameStatus] = useState("toss"); // toss, batting, bowling, gameOver
  const [message, setMessage] = useState("Select a number from 0 to 6");
  const [inningsOver, setInningsOver] = useState(false);
  const [computerScore, setComputerScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [gameSettings, setGameSettings] = useState(null);

  // Emojis corresponding to the numbers
  const numberEmojis = {
    0: "👊",
    1: "👍",
    2: "✌️",
    3: "🤟",
    4: "🖖",
    5: "🖐️",
    6: "👋"
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const startGame = (settings) => {
    setGameSettings(settings);
    // Set initial game state based on player's choice
    if (settings.playerChoice === "Bat") {
      setGameStatus("batting");
      setMessage(`You're batting first! Select a number from 0 to 6`);
    } else {
      setGameStatus("bowling");
      setMessage(`You're bowling first! Select a number from 0 to 6`);
    }
  };

  const handleNumberSelect = (number) => {
    // Generate computer's choice (0-6)
    const compChoice = Math.floor(Math.random() * 7);
    setComputerChoice(compChoice);

    if (gameStatus === "batting") {
      if (number === compChoice) {
        // User is out
        setMessage(`Out! Computer also chose ${compChoice} ${numberEmojis[compChoice]}`);
        setTargetScore(userScore + 1);
        setInningsOver(true);
        setGameStatus("bowling");
      } else {
        // User scores
        setUserScore(userScore + number);
        setMessage(`You scored ${number} ${numberEmojis[number]}! Computer chose ${compChoice} ${numberEmojis[compChoice]}`);
      }
    } else if (gameStatus === "bowling") {
      if (number === compChoice) {
        // Computer is out
        setMessage(`Computer out! You win by ${targetScore - computerScore} runs!`);
        setGameStatus("gameOver");
      } else {
        // Computer scores
        const newComputerScore = computerScore + compChoice;
        setComputerScore(newComputerScore);
        
        if (newComputerScore >= targetScore) {
          setMessage(`Computer wins by ${7 - (computerScore + compChoice - targetScore)} wickets!`);
          setGameStatus("gameOver");
        } else {
          setMessage(`Computer scored ${compChoice} ${numberEmojis[compChoice]}! You chose ${number} ${numberEmojis[number]}`);
        }
      }
    }
  };

  const resetGame = () => {
    setUserScore(0);
    setComputerScore(0);
    setComputerChoice(null);
    setGameStatus("toss");
    setMessage("Select a number from 0 to 6");
    setInningsOver(false);
    setTargetScore(0);
    setGameSettings(null);
  };

  const backToDashboard = () => {
    navigate("/");
  };

  // If in toss state, show the toss component
  if (gameStatus === "toss") {
    return <CricketToss startGame={startGame} />;
  }

  return (
    <div className="dashboard-container">
      <h2 className="welcome">Finger Cricket</h2>
      
      {gameSettings && (
        <div className="team-info">
          <p>You: {gameSettings.playerTeam} | Computer: {gameSettings.computerTeam}</p>
          <p>You chose to {gameSettings.playerChoice} first</p>
        </div>
      )}
      
      <div className="game-status">
        <p className="status-message">{message}</p>
        <div className="score-display">
          {gameStatus === "batting" ? (
            <p>Your Score: {userScore}</p>
          ) : gameStatus === "bowling" ? (
            <>
              <p>Your Score: {userScore} (Target: {targetScore})</p>
              <p>Computer Score: {computerScore}/{computerChoice === null ? 0 : (computerChoice === 0 ? "0" : computerChoice)}</p>
            </>
          ) : (
            <>
              <p>Final Score - You: {userScore}, Computer: {computerScore}</p>
              <div className="action-buttons">
                <button className="game-btn" onClick={resetGame}>Play Again</button>
                <button className="game-btn" onClick={backToDashboard}>Back to Games</button>
              </div>
            </>
          )}
        </div>
      </div>

      {gameStatus !== "gameOver" && (
        <div className="card-container cricket-cards">
          {[0, 1, 2, 3, 4, 5, 6].map((number) => (
            <div 
              className="card cricket-card" 
              key={number}
              onClick={() => handleNumberSelect(number)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="number-emoji">{numberEmojis[number]}</div>
                  <div className="number-value">{number}</div>
                </div>
                <div className="card-back">
                  <div className="number-value">{number}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {inningsOver && gameStatus === "bowling" && (
        <div className="innings-message">
          <p>First innings over! You scored {userScore}.</p>
          <p>Now bowl to defend your score.</p>
        </div>
      )}

      <button className="logout-btn back-btn" onClick={backToDashboard}>Back</button>
    </div>
  );
};

export default FingerCricket;