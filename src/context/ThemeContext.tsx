import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {Appearance} from 'react-native';

const light = {
  background: {backgroundColor: '#fff'},
  text: {color: '#000'},
};

const dark = {
  background: {backgroundColor: '#000'},
  text: {color: '#fff'},
};

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  themeStyles: light,
});

export const ThemeProvider: React.FC<{
  initialScheme?: 'light' | 'dark' | null;
}> = ({children, initialScheme}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    initialScheme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const themeStyles = theme === 'dark' ? dark : light;

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, themeStyles}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
