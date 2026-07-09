import React from "react";
import Home_LoginForm_Meta from "./Home_LoginForm_Meta";

function Home_LoginForm({ onLogin, onToggleRegister }) {
  return (
    <Home_LoginForm_Meta onLogin={onLogin}>
      {({
        username,
        setUsername,
        password,
        setPassword,
        error,
        handleSubmit,
      }) => (
        <>
          <h2 className="form-title">Sign In</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="oauth-btn">
              Sign In
            </button>
          </form>

          <hr className="divider" />

          <button onClick={onToggleRegister} className="toggle-btn">
            Don't have an account?{" "}
            <span className="inline-red-btn">Register</span>
          </button>
        </>
      )}
    </Home_LoginForm_Meta>
  );
}

export default Home_LoginForm;
