import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useAppContext } from '../components/useContext';
import { styles } from '../../assets/style/personalStyle';
import applyFontFamily from '../services/style/applyFontFamily';
import { FontAwesome5 } from '@expo/vector-icons';
import { isValidField } from '../services/Utils/FieldVerifier';

const MobileNumberInput = ({ mobileNumber, setMobileNumber, error, placeholder }) => {
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
        <View style={{ flex: 1 }}>
          {!mobileNumber &&
            <Text style={[styles.inputPlaceholder, {paddingHorizontal:3}]}>
              {placeholder}
            </Text>
          }
          <View style={{flex:1, flexDirection:"row", alignItems:"center"}}>
          <TextInput
            style={[fieldstyles.input, { fontSize: dynamicFontSize(fieldstyles.input.fontSize), flex: 1, paddingVertical: 10, paddingLeft: 3 }]}
            onChangeText={handleMobileNumberChange}
            value={mobileNumber}
            keyboardType="phone-pad"
            maxLength={10} // Limit to 10 digits
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={[fieldstyles.prefix, { fontSize: dynamicFontSize(fieldstyles.prefix.fontSize), paddingRight: 10 }]}>
            <FontAwesome5 name="phone" size={16} style={[fieldstyles.phoneIcon, isFocused && fieldstyles.phoneIconFocused]} onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)} />
          </Text>
          </View>
         
        </View>
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
    borderColor: '#A2ACC6',
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
  phoneIcon: {
    color: '#A2ACC6'
  },
  phoneIconFocused: {
    color: '#ff8500'
  }
});

export default MobileNumberInput;
