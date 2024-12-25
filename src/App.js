import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';
import './index.css';
import ToggleSwitch from './components/ToggleSwitch';
import LanguageSwitch from './components/LanguageSwitch';
import ShoppingListPage from './components/ShoppingListPage';
import ShoppingListsOverview from './components/ShoppingListsOverview';

function App() {
  const { theme, toggleTheme } = useAppContext();

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <LanguageProvider>
      <Router>
        <div className={`body ${theme}`}>
          <div className="toggle-container">
            <ToggleSwitch theme={theme} toggleTheme={toggleTheme} />
            <LanguageSwitch />
          </div>
          <div className="card">
            <Routes>
              <Route path="/lists" element={<ShoppingListsOverview />} />
              <Route path="/lists/:id" element={<ShoppingListPage />} />
              <Route path="*" element={<Navigate to="/lists" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
