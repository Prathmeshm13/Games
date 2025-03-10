import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:5000/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleGameSelect = (game) => {
    if (game === "Finger-Cricket") {
      navigate("/finger-cricket");
    }
    // Add navigation for other games as they are developed
  };

  const gameNames = ["Finger-Cricket", "Undercover", "More Games"];

  return (
    <div className="dashboard-container">
      {user ? (
        <>
          <h2 className="welcome">Welcome, {user.message.split(" ")[1]}!</h2>
          <div className="card-container">
            {gameNames.map((title, index) => (
              <div 
                className="card" 
                key={index} 
                onClick={() => handleGameSelect(title)}
              >
                <div className="card-inner">
                  <div className="card-front">{title}</div>
                  <div className="card-back">Play Now</div>
                </div>
              </div>
            ))}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;