import React, { useState, useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { useAppContext } from './useContext';
import { formateAmmountValue, properAmmount } from '../services/Utils/FieldVerifier';

const truncateToTwoDigitAfterDecimal = (resultString) => {


  let [integerPart, decimalPart] = resultString.split('.');

  // Truncate or pad the decimal part to exactly 2 digits
  if (decimalPart?.length > 2) {
    decimalPart = decimalPart.substring(0, 2);
  }

  if (decimalPart) {
    return `${integerPart}.${decimalPart}`
  }

  return `${integerPart}`


}

const formatValue = (value, isAmount, isTenure) => {
  if (isAmount) {
    if (value >= 10000000) { // 1 crore
      return `${truncateToTwoDigitAfterDecimal(`${value / 10000000}`)} Cr`;
    } else if (value >= 100000) { // 1 lakh
      return `${truncateToTwoDigitAfterDecimal(`${value / 100000}`)} Lakh`;
    } else if (value >= 1000000) { // 1 million
      return `${truncateToTwoDigitAfterDecimal(`${value / 1000000}`)} M`;
    } else if (value >= 1000) { // 1 thousand
      return `${truncateToTwoDigitAfterDecimal(`${value / 1000}`)}k`;
    } else {
      return `${value.toLocaleString('en-IN')}`;
    }
  } else if (isTenure) {
    return `${value}M`;
  } else {
    return value.toString();
  }
};

const CustomSlider = ({ title, icon, keyboardType, min, max, steps,currentValue, error, onChange, isAmount = false, isTenure = false}) => {
  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;



  const handleTextInputChange = (value) => {
    
    let numericValue = properAmmount(value) || 0;
    if(numericValue >  max){
      numericValue = max
    }
    onChange(numericValue);
    
  };

  const handleSlider  = (value) => {
    const numericValue = Math.max(min, Math.min(max, value));
    onChange(numericValue);
  };

  const TextFieldValue = (value) =>{
    if(isAmount){
      return (formateAmmountValue(value) || 0).toString()
    }
    return (value || 0).toString();
  }


  return (
    <View style={styles.sliderContainer}>
      <View style={styles.LabelInput}>
        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>{title}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Icon name={icon} size={16} color="#00194c" style={{ marginHorizontal: 10 }} />
          <TextInput
            style={[styles.Input, { fontSize: dynamicFontSize(styles.Input.fontSize) }]}
            onChangeText={handleTextInputChange}
            value={TextFieldValue(currentValue)}
            keyboardType={keyboardType}
          />
        </View>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={steps || 1}
        onValueChange={handleSlider}
        value={currentValue || min}
        minimumTrackTintColor="#0010AC"
        maximumTrackTintColor="#758BFD"
        thumbTintColor="#F38F00"
      />
      <View style={styles.sliderLabels}>
        <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>
          {isAmount ? `₹ ${formatValue(min,true, false)}` : formatValue(min, false, isTenure)}
        </Text>
        <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>
          {isAmount ? `₹ ${formatValue(max,true, false)}` : formatValue(max, false, isTenure)}
        </Text>
      </View>
      {error && (
        <Text style={[styles.errorText, { paddingHorizontal: 15 }]}>{error}</Text>
      )}
    </View>
  );
};

export default CustomSlider;