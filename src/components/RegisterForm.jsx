import { useState } from "react";

function RegisterForm({ onRegisterSuccess, onToggleLogin }) {
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

  return (
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
  );
}

export default RegisterForm;
