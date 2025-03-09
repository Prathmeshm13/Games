import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect if no token
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:5000/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // Ensure cookies work properly
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

  return (
    <div className="form-container">
      {user ? (
        <>
          <h2>Welcome, {user.message.split(" ")[1]}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
