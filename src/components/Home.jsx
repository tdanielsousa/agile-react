import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../logins.css";

function Home({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [fadeState, setFadeState] = useState("fade-in");

  // Updated helper: added keepMessage parameter (defaults to false)
  const toggleForm = (showRegister, keepMessage = false) => {
    // 1. Start fading out
    setFadeState("fade-out");

    // 2. Wait for the fade-out animation to finish (250ms), then swap components
    setTimeout(() => {
      setIsRegistering(showRegister);
      
      // ONLY clear the message if we aren't explicitly told to keep it
      if (!keepMessage) {
        setMessage("");
      }
      
      // 3. Fade the new component back in
      setFadeState("fade-in");
    }, 250); 
  };

  const handleRegisterSuccess = () => {
    setMessage("Account created! You can now Sign In.");
    // Pass true here to make sure the message stays alive during the transition!
    toggleForm(false, true); 
  };

  return (
    <div className="vh">
      <div className={`card ${fadeState}`}>
        <h1 className="brand-title">Agile</h1>
        <p className="brand-tagline">The app to help you organize your projects!</p>

        {message && <p style={{ color: "green", fontWeight: "bold", textAlign: "center" }}>{message}</p>}

        {isRegistering ? (
          <RegisterForm 
            onRegisterSuccess={handleRegisterSuccess} 
            onToggleLogin={() => toggleForm(false)} // Defaults to keepMessage = false
          />
        ) : (
          <LoginForm 
            onLogin={onLogin} 
            onToggleRegister={() => toggleForm(true)} // Defaults to keepMessage = false
          />
        )}
      </div>
    </div>
  );
}

export default Home;