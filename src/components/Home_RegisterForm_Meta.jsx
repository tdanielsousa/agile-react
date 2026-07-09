import React, { useState } from "react";

function Home_RegisterForm_Meta({ onRegisterSuccess, children }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onRegisterSuccess();
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Error connecting to the registration server.");
    }
  };

  return children({
    username,
    setUsername,
    password,
    setPassword,
    error,
    handleSubmit,
  });
}

export default Home_RegisterForm_Meta;
