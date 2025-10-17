import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';

export default function About() {
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [themeColor, setThemeColor] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      setThemeColor(theme);
    } else {
      setThemeColor(theme);
    }
  }, [theme]);

  return (
    <div>
      <h1>About Page</h1>
      <p>Current Theme: {themeColor}</p>
      <button
        onClick={() => dispatch(toggleTheme())}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
}
