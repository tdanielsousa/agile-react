import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../logins.css";

function Home({ onLogin }) {
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

  return (
    <div className="vh">
      <div className={`card ${fadeState}`}>
        <h1 className="brand-title">Agile</h1>
        <p className="brand-tagline">
          The app to help you organize your projects!
        </p>

        {message && (
          <p
            style={{ color: "green", fontWeight: "bold", textAlign: "center" }}
          >
            {message}
          </p>
        )}

        {isRegistering ? (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
            onToggleLogin={() => toggleForm(false)}
          />
        ) : (
          <LoginForm
            onLogin={onLogin}
            onToggleRegister={() => toggleForm(true)}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
