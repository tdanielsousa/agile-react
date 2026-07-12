import React from "react";
import Home_Meta from "./Home_Meta";
import Home_LoginForm from "./Home_LoginForm";
import Home_RegisterForm from "./Home_RegisterForm";
//import "../logins.css";

function Home({ onLogin }) {
  return (
    <Home_Meta>
      {({
        isRegistering,
        message,
        fadeState,
        toggleForm,
        handleRegisterSuccess,
      }) => (
        <div className="vh">
          <div className={`card ${fadeState}`}>
            <h1 className="brand-title">Agile</h1>
            <p className="brand-tagline">
              The app to help you organize your projects!
            </p>

            {message && <p className="auth-success-msg">{message}</p>}

            {isRegistering ? (
              <Home_RegisterForm
                onRegisterSuccess={handleRegisterSuccess}
                onToggleLogin={() => toggleForm(false)}
              />
            ) : (
              <Home_LoginForm
                onLogin={onLogin}
                onToggleRegister={() => toggleForm(true)}
              />
            )}
          </div>
        </div>
      )}
    </Home_Meta>
  );
}

export default Home;
