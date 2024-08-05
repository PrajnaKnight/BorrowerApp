import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useAppContext } from '../components/useContext';
import { styles } from '../../assets/style/personalStyle';
import applyFontFamily from '../../assets/style/applyFontFamily';

const MobileNumberInput = ({ mobileNumber, setMobileNumber, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleMobileNumberChange = (number) => {
    // Only allow numeric input
    const digitsOnly = number.replace(/\D/g, '');
    if (digitsOnly.length <= 10) {
      setMobileNumber(digitsOnly);
    }
  };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  return (
    <View>
      <View style={[fieldstyles.inputContainer, isFocused && fieldstyles.inputContainerFocused]}>
        <Text style={[fieldstyles.prefix, { fontSize: dynamicFontSize(fieldstyles.prefix.fontSize), paddingLeft: 10 }]}>+91</Text>
        <TextInput
          style={[fieldstyles.input, { fontSize: dynamicFontSize(fieldstyles.input.fontSize), flex: 1, paddingVertical: 10, paddingLeft: 3 }]}
          onChangeText={handleMobileNumberChange}
          value={mobileNumber}
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
          maxLength={10} // Limit to 10 digits
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error && <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>}
    </View>
  );
};

const fieldstyles = applyFontFamily({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  inputContainerFocused: {
    borderColor: '#00194C', 
  },
  prefix: {
    marginRight: 5,
    fontSize: 14,
  },
  input: {
    fontSize: 14,
  },
});

export default MobileNumberInput;
