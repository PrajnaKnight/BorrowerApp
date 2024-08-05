// RadioButton.js
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from '../../assets/style/personalStyle';

const RadioButton = ({ label, isSelected, onPress,style }) => {
  return (
    <TouchableOpacity style={[styles.radioContainer,style]} onPress={onPress}>
      <View style={[styles.circle, isSelected && styles.selectedCircle]} />
      <Text style={styles.Radiolabel}>{label}</Text>
    </TouchableOpacity>
  );
};



export default RadioButton;
