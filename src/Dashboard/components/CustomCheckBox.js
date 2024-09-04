import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import applyFontFamily from '../../assets/style/applyFontFamily';
import Icons from 'react-native-vector-icons/FontAwesome';

const CustomCheckBox = ({ label, isChecked, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
      {isChecked && <Text style={styles.checkmark}>
          <Icons name="check" size={16} color="#fff" />
          </Text>}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = applyFontFamily({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#cacfdd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:3
  },
  checked: {
    backgroundColor: '#FF8800',
  },
  checkmark: {
    color: '#fff',
  },
  label: {
    marginLeft: 10,
  },
});

export default CustomCheckBox;
