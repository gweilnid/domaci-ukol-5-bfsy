function ToggleSwitch({ theme, toggleTheme }) {
    return (
      <div className={`toggle-switch ${theme}`}>
        <input
          id="theme-toggle"
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className="toggle-checkbox"
        />
        <label htmlFor="theme-toggle" className="toggle-label"></label>
      </div>
    );
  }
  
  export default ToggleSwitch;
  