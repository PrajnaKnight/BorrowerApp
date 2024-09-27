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
  isROI = false, // New prop to identify if this is for ROI
}) => {
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const normalizedValue = (value - labelValues[0]) / (labelValues[labelValues.length - 1] - labelValues[0]);
    setSliderValue(normalizedValue);
  }, [value, labelValues]);

  const formatDisplayValue = (val) => {
    if (isCurrency) {
      return `₹ ${formatIndianCurrency(val)}`;
    }
    if (isROI) {
      return val.toFixed(2); // Display ROI with 2 decimal places
    }
    return val.toString();
  };

  const handleSliderChange = (normalizedValue) => {
    const range = labelValues[labelValues.length - 1] - labelValues[0];
    let newValue = labelValues[0] + (normalizedValue * range);
    if (isROI) {
      newValue = Number(newValue.toFixed(2)); // Round to 2 decimal places for ROI
    } else {
      newValue = Math.round(newValue); // Round to nearest integer for other values
    }
    onValueChange(newValue);
  };

  const handleTextChange = (text) => {
    let numericValue;
    if (isROI) {
      numericValue = Number(text.replace(/[^0-9.]/g, '')); // Allow decimal for ROI
      numericValue = Number(numericValue.toFixed(2)); // Limit to 2 decimal places
    } else {
      numericValue = Number(text.replace(/[^0-9]/g, '')); // Only integers for other values
    }
    onValueChange(numericValue);
  };

  const formatSliderLabel = (label) => {
    if (typeof label === 'number') {
      if (isROI) {
        return `${label}%`; // Add percentage sign for ROI labels
      }
      return formatCrLFormat(label);
    }
    return label;
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
              keyboardType={isROI ? "decimal-pad" : "numeric"}
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
          maximumValue={1}
          step={0.001}
          value={sliderValue}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#0010AC"
          maximumTrackTintColor="#758BFD"
          thumbTintColor="#F38F00"
        />
      </View>
      <View style={styles.sliderLabelContainer}>
        {sliderLabels.map((label, index) => (
          <Text key={index} style={styles.sliderLabel} numberOfLines={1} ellipsizeMode="tail">
            {formatSliderLabel(label)}
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
    marginHorizontal: -20, 
  },
  sliderLabel: {
    fontSize: 12, 
    color: '#00194c',
    textAlign: 'center',
    flex: 1, 
    paddingHorizontal: 2,
  },
});

export default EmiInputSlider;