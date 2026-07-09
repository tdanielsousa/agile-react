import React, { useState, useEffect } from "react";

function Dashboard_Meta({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const handleHashClick = (e) => {
      if (e.target.tagName === "A" && e.target.getAttribute("href") === "#") {
        e.preventDefault();
      }
    };

    document.addEventListener("click", handleHashClick);
    return () => document.removeEventListener("click", handleHashClick);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case "projects":
        return "Project List";
      case "creator":
        return "Project Creator";
      case "editor":
        return "Project Editor";
      default:
        return "Dashboard";
    }
  };

  return children({
    darkMode,
    currentView,
    setCurrentView,
    selectedProjectId,
    setSelectedProjectId,
    toggleDarkMode,
    headerTitle: getHeaderTitle(),
  });
}

export default Dashboard_Meta;
