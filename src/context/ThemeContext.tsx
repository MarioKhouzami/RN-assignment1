import React, {createContext, useContext, useState} from 'react';
import {ColorSchemeName, StyleSheet} from 'react-native';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  themeStyles: {
    background: object;
    text: object;
  };
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  themeStyles: {background: {}, text: {}},
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialScheme?: ColorSchemeName;
}> = ({children, initialScheme = 'light'}) => {
  const [theme, setTheme] = useState<Theme>(
    initialScheme === 'dark' ? 'dark' : 'light',
  );

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeStyles = {
    background:
      theme === 'dark' ? styles.darkBackground : styles.lightBackground,
    text: theme === 'dark' ? styles.darkText : styles.lightText,
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme, themeStyles}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const styles = StyleSheet.create({
  lightBackground: {backgroundColor: '#fff'},
  darkBackground: {backgroundColor: '#121212'},
  lightText: {color: '#000', fontFamily: 'Poppins-Regular'},
  darkText: {color: '#fff', fontFamily: 'Poppins-Regular'},
});
