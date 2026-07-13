import React from "react";
import Home_RegisterForm_Meta from "./Home_RegisterForm_Meta";

function Home_RegisterForm({ onRegisterSuccess, onToggleLogin }) {
  return (
    <Home_RegisterForm_Meta onRegisterSuccess={onRegisterSuccess}>
      {({
        username,
        setUsername,
        password,
        setPassword,
        error,
        handleSubmit,
      }) => (
        <>
          <h2 className="form-title">Create an Account</h2>

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
            <button type="submit" className="register-btn">
              Register
            </button>
          </form>

          <hr className="divider" />

          <button onClick={onToggleLogin} className="toggle-btn">
            Already have an account?{" "}
            <span className="inline-blue-btn">Sign In</span>
          </button>
        </>
      )}
    </Home_RegisterForm_Meta>
  );
}

export default Home_RegisterForm;
