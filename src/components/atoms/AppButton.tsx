import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

interface Props {
  title: string;
  onPress: () => void;
}

const AppButton: React.FC<Props> = ({title, onPress}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        theme === 'dark' ? styles.darkButton : styles.lightButton,
      ]}>
      <Text
        style={[
          styles.text,
          theme === 'dark' ? styles.darkText : styles.lightText,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  lightButton: {
    backgroundColor: '#007bff',
  },
  darkButton: {
    backgroundColor: '#1e90ff',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  lightText: {
    color: '#fff',
  },
  darkText: {
    color: '#fff',
  },
});

export default AppButton;
