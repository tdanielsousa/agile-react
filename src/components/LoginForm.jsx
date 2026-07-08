import { useState } from "react";

function LoginForm({ onLogin, onToggleRegister }) {
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

  return (
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
        Don't have an account? <span className="inline-red-btn">Register</span>
      </button>
    </>
  );
}

export default LoginForm;
