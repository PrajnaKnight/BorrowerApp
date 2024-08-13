import React, { useState, useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from '../../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { useAppContext } from '../useContext';

const formatValue = (value, isForAmount, isTenure) => {
  if (isForAmount) {
    if (value >= 10000000) { // 1 crore
      return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) { // 1 lakh
      return `${(value / 100000).toFixed(2)} Lac`;
    } else if (value >= 1000000) { // 1 million
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) { // 1 thousand
      return `${(value / 1000).toFixed(0)}k`;
    } else {
      return `${value.toLocaleString('en-IN')}`;
    }
  } else if (isTenure) {
    return `${value}m`;
  } else {
    return value.toString();
  }
};

const CustomSlider = ({ title, icon, keyboardType, min, max, steps, sliderValue, inputValue, error, onChange, isForAmount, isTenure }) => {
  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;
  const [internalValue, setInternalValue] = useState(sliderValue.toString());

  useEffect(() => {
    setInternalValue(sliderValue.toString());
  }, [sliderValue]);

  const handleTextInputChange = (value) => {
    if (keyboardType === 'numeric' && isNaN(Number(value))) {
      return;
    }

    if (value === '') {
      setInternalValue('');
      onChange(min, 'fromInput');
    } else {
      const numericValue = Math.max(min, Math.min(max, Number(value)));
      setInternalValue(numericValue.toString());
      onChange(numericValue, 'fromInput');
    }
  };

  const handleSliderChange = (value) => {
    const numericValue = Math.max(min, Math.min(max, value));
    setInternalValue(numericValue.toString());
    onChange(numericValue, 'fromSlider');
  };

  const handleSliderComplete = (value) => {
    const numericValue = Math.max(min, Math.min(max, value));
    setInternalValue(numericValue.toString());
    onChange(numericValue, 'fromSlider');
  };

  const displayValue = formatValue(Number(internalValue), isForAmount, isTenure);

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.LabelInput}>
        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>{title}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Icon name={icon} size={16} color="#00194c" style={{ marginHorizontal: 10 }} />
          <TextInput
            style={[styles.Input, { fontSize: dynamicFontSize(styles.Input.fontSize) }]}
            onChangeText={handleTextInputChange}
            value={isForAmount ? `₹ ${displayValue}` : displayValue}
            keyboardType={keyboardType}
          />
        </View>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={steps || 1}
        onValueChange={handleSliderChange}
        onSlidingComplete={handleSliderComplete}
        value={internalValue === '' ? min : Number(internalValue)}
        minimumTrackTintColor="#0010AC"
        maximumTrackTintColor="#758BFD"
        thumbTintColor="#F38F00"
      />
      <View style={styles.sliderLabels}>
        <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>
          {isForAmount ? `₹ ${formatValue(min, true, false)}` : formatValue(min, false, isTenure)}
        </Text>
        <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>
          {isForAmount ? `₹ ${formatValue(max, true, false)}` : formatValue(max, false, isTenure)}
        </Text>
      </View>
      {error && (
        <Text style={[styles.errorText, { paddingHorizontal: 15 }]}>{error}</Text>
      )}
    </View>
  );
};

export default CustomSlider;