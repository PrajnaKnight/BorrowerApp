import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import applyFontFamily from '../../assets/style/applyFontFamily';

const LoanTenureSlider = ({
  label,
  value,
  onValueChange,
  toggle,
  onToggle,
  sliderLabels,
  labelValues,
  layout = 'default'
}) => {
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const index = findClosestLabelIndex(value);
    setSliderValue(index / (labelValues.length - 1));
  }, [value, labelValues]);

  const findClosestLabelIndex = (val) => {
    return labelValues.reduce((closestIndex, currentValue, currentIndex, array) => {
      return Math.abs(currentValue - val) < Math.abs(array[closestIndex] - val) 
        ? currentIndex 
        : closestIndex;
    }, 0);
  };

  const handleSliderChange = (normalizedValue) => {
    const index = Math.round(normalizedValue * (labelValues.length - 1));
    const newValue = labelValues[index];
    onValueChange(newValue);
  };

  const renderToggleButtons = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          toggle === "Yr" && styles.activeToggle,
          layout === 'compact' && styles.compactToggleButton
        ]}
        onPress={() => onToggle("Yr")}>
        <Text
          style={[
            styles.toggleButtonText,
            toggle === "Yr" && styles.activeToggleText,
          ]}>
          Yr
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          toggle === "Mo" && styles.activeToggle,
          layout === 'compact' && styles.compactToggleButton
        ]}
        onPress={() => onToggle("Mo")}>
        <Text
          style={[
            styles.toggleButtonText,
            toggle === "Mo" && styles.activeToggleText,
          ]}>
          Mo
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.sliderContainerWrapper}>
      {layout === 'default' && (
        <View style={styles.sliderDetails}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.toggleAndValueContainer}>
            {renderToggleButtons()}
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{value}</Text>
            </View>
          </View>
        </View>
      )}
      
      {layout === 'compact' && (
        <>
          <View style={styles.compactHeader}>
            <Text style={styles.label}>{label}</Text>
            {renderToggleButtons()}
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{value}</Text>
          </View>
        </>
      )}
      
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={1 / (labelValues.length - 1)}
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



const styles = applyFontFamily({
  sliderContainerWrapper: {
    marginBottom: 15,
  },
  sliderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  compactHeader: {
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
  toggleAndValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  toggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#00194C',
  },
  compactToggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  activeToggle: {
    backgroundColor: '#00194C',
  },
  toggleButtonText: {
    color: '#00194C',
    fontSize: 12,
  },
  activeToggleText: {
    color: '#fff',
  },
  valueContainer: {
    borderWidth: 1,
    borderColor: '#00194C',
    backgroundColor: '#EBEFFF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  valueText: {
    color: '#00194C',
    fontSize: 14,
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

export default LoanTenureSlider;