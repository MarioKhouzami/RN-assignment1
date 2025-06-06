// components/SkeletonCard.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

const SkeletonCard = () => {
  const {themeStyles} = useTheme();

  return (
    <View style={[styles.card, themeStyles.card]}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.info}>
        <View style={styles.line} />
        <View style={[styles.line, {width: '60%', marginTop: 8}]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  info: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  line: {
    height: 12,
    width: '80%',
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
});

export default SkeletonCard;
