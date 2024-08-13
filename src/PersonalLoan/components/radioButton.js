// RadioButton.js
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from '../services/style/gloablStyle';

const RadioButton = ({ label, isSelected, onPress,style }) => {
  return (
    <TouchableOpacity style={[styles.radioContainer,style]} onPress={onPress}>
      <View style={[styles.outerCircle, isSelected && styles.selectedOuterCircle]}>
        {isSelected && <View style={styles.selectedInnerCircle} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};



export default RadioButton;
