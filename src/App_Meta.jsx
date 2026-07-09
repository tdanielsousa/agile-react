import React, { useState } from "react";

function App_Meta({ children }) {
  const [user, setUser] = useState(null);

  const logout = () => setUser(null);

  const realLogin = async (username, password) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  return children({ user, realLogin, logout });
}

export default App_Meta;
