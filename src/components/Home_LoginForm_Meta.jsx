import React, { useState } from "react";

function Home_LoginForm_Meta({ onLogin, children }) {
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
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || "Invalid username or password.");
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

export default Home_LoginForm_Meta;
