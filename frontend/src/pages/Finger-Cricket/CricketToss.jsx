import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CricketToss.css"; // Updated to use the dedicated CSS file

const CricketToss = ({ startGame }) => {
  const navigate = useNavigate();
  const [playerTeam, setPlayerTeam] = useState("");
  const [computerTeam, setComputerTeam] = useState("");
  const [tossChoice, setTossChoice] = useState("");
  const [tossResult, setTossResult] = useState("");
  const [gameChoice, setGameChoice] = useState("");
  const [showTeamSelection, setShowTeamSelection] = useState(true);
  const [tossButtonsEnabled, setTossButtonsEnabled] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showChoiceOptions, setShowChoiceOptions] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [tossResultMessage, setTossResultMessage] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleTeamSelect = (team) => {
    if (team === "Team 1") {
      setPlayerTeam("Team 1");
      setComputerTeam("Team 2");
    } else {
      setPlayerTeam("Team 2");
      setComputerTeam("Team 1");
    }
    setTossButtonsEnabled(true);
  };

  const handleTossSelect = (choice) => {
    setTossChoice(choice);
    setIsFlipping(true);
    setTossButtonsEnabled(false);
    
    // Determine toss result
    setTimeout(() => {
      const result = Math.random() < 0.5 ? "Heads" : "Tails";
      setTossResult(result);
      
      if (result === choice) {
        setTossResultMessage("You won the toss!");
        setTimeout(() => {
          setShowChoiceOptions(true);
        }, 1000);
      } else {
        setTossResultMessage("You lost the toss!");
        // Computer makes choice
        const computerChoice = Math.random() < 0.5 ? "Bat" : "Bowl";
        setTimeout(() => {
          setGameChoice(computerChoice === "Bat" ? "Bowl" : "Bat");
          setShowFinalMessage(true);
          setShowStartButton(true);
        }, 1500);
      }
      
      setIsFlipping(false);
    }, 3000);
  };

  const handleGameChoice = (choice) => {
    setGameChoice(choice);
    setShowChoiceOptions(false);
    setShowFinalMessage(true);
    setShowStartButton(true);
  };

  const handleStartGame = () => {
    // Save game state to sessionStorage
    sessionStorage.setItem("playerTeam", playerTeam);
    sessionStorage.setItem("computerTeam", computerTeam);
    sessionStorage.setItem("playerChoice", gameChoice);
    
    // Call the startGame prop function with the game state
    startGame({
      playerTeam,
      computerTeam,
      playerChoice: gameChoice
    });
  };

  const backToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="toss-container">
        <h1 className="toss-title">Cricket Toss</h1>
        <p className="toss-subtitle">Choose your team and call the toss</p>
        
        {showTeamSelection && (
          <div className="team-selection visible">
            <h2 className="team-selection-title">Select Your Team</h2>
            <div className="teams">
              <button 
                className={`team-button ${playerTeam === "Team 1" ? "selected" : ""}`} 
                onClick={() => handleTeamSelect("Team 1")}
              >
                Team 1
              </button>
              <button 
                className={`team-button ${playerTeam === "Team 2" ? "selected" : ""}`} 
                onClick={() => handleTeamSelect("Team 2")}
              >
                Team 2
              </button>
            </div>
          </div>
        )}
        
        <div className="toss-options">
          <button 
            className={`toss-button ${!tossButtonsEnabled ? "disabled" : ""} ${tossChoice === "Heads" ? "selected" : ""}`} 
            onClick={() => tossButtonsEnabled && handleTossSelect("Heads")}
            disabled={!tossButtonsEnabled || isFlipping}
          >
            Heads
          </button>
          <button 
            className={`toss-button ${!tossButtonsEnabled ? "disabled" : ""} ${tossChoice === "Tails" ? "selected" : ""}`} 
            onClick={() => tossButtonsEnabled && handleTossSelect("Tails")}
            disabled={!tossButtonsEnabled || isFlipping}
          >
            Tails
          </button>
        </div>
        
        <div className="coin-container">
          <div className={`coin ${isFlipping ? "flipping" : ""}`}>
            <div className="coin-face heads">H</div>
            <div className="coin-face tails">T</div>
          </div>
        </div>
        
        {tossResultMessage && (
          <div className="toss-result">
            {tossResultMessage}
          </div>
        )}
        
        {showChoiceOptions && (
          <div className="choice-container">
            <h2 className="choice-title">What would you like to do?</h2>
            <div className="choice-options">
              <button 
                className="choice-button" 
                onClick={() => handleGameChoice("Bat")}
              >
                Bat
              </button>
              <button 
                className="choice-button" 
                onClick={() => handleGameChoice("Bowl")}
              >
                Bowl
              </button>
            </div>
          </div>
        )}
        
        {showFinalMessage && (
          <div className="final-message">
            {tossResult === tossChoice ? (
              <span>You chose to <span className="highlight-choice">{gameChoice}</span> first!</span>
            ) : (
              <span>{computerTeam} chose to <span className="highlight-choice">{gameChoice === "Bat" ? "Bowl" : "Bat"}</span> first.</span>
            )}
          </div>
        )}
        
        {showStartButton && (
          <button 
            className="start-game game-btn" 
            onClick={handleStartGame}
          >
            Start Game
          </button>
        )}
      </div>

      <button className="logout-btn back-btn" onClick={backToDashboard}>Back</button>
    </div>
  );
};

export default CricketToss;