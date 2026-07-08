import { useState } from "react";

function LoginForm({ onLogin, onToggleRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 1. Local error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    // 2. Call login and catch any errors passed back from App.jsx
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || "Invalid username or password.");
    }
  };

  return (
    <>
      <h2 className="form-title">Sign In</h2>

      {/* 3. Render the same on-screen error banner if there is an error */}
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
        Don't have an account? <span className="inline-red-btn">Register</span>
    </button>
    </>
  );
}

export default LoginForm;