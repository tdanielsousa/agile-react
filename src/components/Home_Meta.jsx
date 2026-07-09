import React, { useState } from "react";

function Home_Meta({ children }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [fadeState, setFadeState] = useState("fade-in");

  const toggleForm = (showRegister, keepMessage = false) => {
    setFadeState("fade-out");

    setTimeout(() => {
      setIsRegistering(showRegister);

      if (!keepMessage) {
        setMessage("");
      }

      setFadeState("fade-in");
    }, 250);
  };

  const handleRegisterSuccess = () => {
    setMessage("Account created! You can now Sign In.");
    toggleForm(false, true);
  };

  return children({
    isRegistering,
    message,
    fadeState,
    toggleForm,
    handleRegisterSuccess,
  });
}

export default Home_Meta;
