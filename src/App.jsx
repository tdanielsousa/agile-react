import { useState } from "react";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const realLogin = async (username, password) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = () => setUser(null);

  if (user) {
    return <Dashboard user={user} onLogout={logout} />;
  }

  return <Home onLogin={realLogin} />;
}

export default App;
