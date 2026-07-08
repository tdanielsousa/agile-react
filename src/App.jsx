import { useState } from "react";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  const realLogin = async (username, password) => {
    try {
      // Send the username and password to your new Vercel backend API
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // If the backend says OK, log the user in with their DB data
        setUser(data.user);
      } else {
        //  Instead of alert(), throw the error to LoginForm
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      //  Instead of alert(), throw the error down to LoginForm
      throw error;
    }
  };

  const logout = () => setUser(null);

  /*  !user  */ 
  if (user) {
    return <Dashboard user={user} onLogout={logout} />;
  }

  return <Home onLogin={realLogin} />;
}

export default App;