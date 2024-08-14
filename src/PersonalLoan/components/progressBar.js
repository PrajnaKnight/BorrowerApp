import React from 'react';
import { View } from 'react-native';
import { styles } from '../../assets/style/personalStyle';


const ProgressBar = ({ progress }) => {
  const width = `${Math.min(Math.max(progress, 0), 1) * 100}%`;
  return (
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width }]} />
    </View>
  );
};


export default ProgressBar;
