import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import applyFontFamily from '../../assets/style/applyFontFamily';

const ProceedButton = ({ onPress, disabled, text }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = applyFontFamily({
  button: {
    backgroundColor: '#00194c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonDisabled: {
    backgroundColor: '#bdcef0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProceedButton;
