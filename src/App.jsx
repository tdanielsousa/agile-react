import React from "react";
import App_Meta from "./App_Meta";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  return (
    <App_Meta>
      {({ user, realLogin, logout }) => {
        if (user) {
          return <Dashboard user={user} onLogout={logout} />;
        }

        return <Home onLogin={realLogin} />;
      }}
    </App_Meta>
  );
}

export default App;
