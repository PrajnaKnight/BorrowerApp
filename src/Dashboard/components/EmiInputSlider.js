import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';

const formatIndianCurrency = (value) => {
  // Convert the value to a string and remove any existing commas
  let numStr = Math.floor(value).toString().replace(/,/g, '');
  
  // Split the string into parts before and after the decimal point
  let parts = numStr.split('.');
  let wholePart = parts[0];
  let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  // Format the whole part
  let formattedWholePart = '';
  let length = wholePart.length;

  // Handle the last 3 digits
  if (length > 3) {
    formattedWholePart = ',' + wholePart.substring(length - 3);
    wholePart = wholePart.substring(0, length - 3);
    length -= 3;
  }

  // Handle the rest of the digits
  while (length > 0) {
    if (length >= 2) {
      formattedWholePart = ',' + wholePart.substring(length - 2) + formattedWholePart;
      wholePart = wholePart.substring(0, length - 2);
      length -= 2;
    } else {
      formattedWholePart = wholePart + formattedWholePart;
      length = 0;
    }
  }

  // Remove leading comma if present
  formattedWholePart = formattedWholePart.replace(/^,/, '');

  // Combine whole and decimal parts
  return formattedWholePart + decimalPart;
};

const formatCrLFormat = (value) => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)}Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(2)}L`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  } else {
    return value.toString();
  }
};

const EmiInputSlider = ({
  label,
  value,
  onValueChange,
  isCurrency,
  suffix,
  sliderLabels,
  labelValues,
  showInput = true,
}) => {
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const index = labelValues.findIndex(v => v >= value);
    setSliderValue(index >= 0 ? index : labelValues.length - 1);
  }, [value, labelValues]);

  const formatDisplayValue = (val) => {
    if (isCurrency) {
      return `₹ ${formatIndianCurrency(val)}`;
    }
    return val.toString();
  };

  const handleSliderChange = (index) => {
    const newValue = labelValues[index];
    onValueChange(newValue);
  };

  const handleTextChange = (text) => {
    const numericValue = Number(text.replace(/[^0-9]/g, ''));
    onValueChange(numericValue);
  };

  return (
    <View style={styles.sliderContainerWrapper}>
      <View style={styles.sliderDetails}>
        <Text style={styles.label}>{label}</Text>
        {showInput && (
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputValue}
              value={formatDisplayValue(value)}
              keyboardType="numeric"
              onChangeText={handleTextChange}
            />
            {suffix && <Text style={styles.suffix}>{suffix}</Text>}
          </View>
        )}
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={labelValues.length - 1}
          step={1}
          value={sliderValue}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#0010AC"
          maximumTrackTintColor="#758BFD"
          thumbTintColor="#F38F00"
        />
      </View>
      <View style={styles.sliderLabelContainer}>
        {sliderLabels.map((label, index) => (
          <Text key={index} style={styles.sliderLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  sliderContainerWrapper: {
    marginBottom: 15,
  },
  sliderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#00194c',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00194C',
    backgroundColor: '#EBEFFF',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputValue: {
    width: 100,
    textAlign: 'center',
    paddingRight: 5,
  },
  suffix: {
    fontSize: 14,
    color: '#00194c',
    marginLeft: 5,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default EmiInputSlider;