import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import applyFontFamily from '../../assets/style/applyFontFamily';

const formatIndianCurrency = (value) => {
  if (value >= 10000000) { // 1 Crore
    return `${(value / 10000000).toFixed(2)}Cr`;
  } else if (value >= 100000) { // 1 Lakh
    return `${(value / 100000).toFixed(2)}L`;
  } else if (value >= 1000) { // 1 Thousand
    return `${(value / 1000).toFixed(2)}k`;
  } else {
    return value.toString();
  }
};

const InputSlider = ({ label, value, min, max, step, onValueChange, isCurrency, suffix }) => {
  const formatDisplayValue = (val) => {
    if (isCurrency) {
      return `₹${formatIndianCurrency(val)}`;
    }
    return val.toString();
  };

  const handleTextChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    onValueChange(Number(numericValue));
  };

  return (
    <View style={styles.sliderContainerWrapper}>
      <View style={styles.sliderDetails}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputValue}
            value={formatDisplayValue(value)}
            keyboardType="numeric"
            onChangeText={handleTextChange}
          />
          {suffix && <Text style={styles.suffix}>{suffix}</Text>}
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor="#0010AC"
          maximumTrackTintColor="#758BFD"
          thumbTintColor="#F38F00"
        />
      </View>
      <View style={styles.sliderLabelContainer}>
        <Text style={styles.sliderLabel}>{formatDisplayValue(min)}</Text>
        <Text style={styles.sliderLabel}>{formatDisplayValue(max)}</Text>
      </View>
    </View>
  );
};

const styles = applyFontFamily({
  sliderContainerWrapper: {
    marginBottom: 15,
  },
  sliderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#00194c',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00194C',
    backgroundColor: '#EBEFFF',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputValue: {
    width: 120,
    textAlign: 'right',
    paddingRight: 5,
  },
  suffix: {
    fontSize: 14,
    color: '#00194c',
    marginLeft: 5,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  slider: {
    flex: 1,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#00194c',
  },
});

export default InputSlider;