import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import applyFontFamily from '../../assets/style/applyFontFamily';

const LoanTenureSlider = ({ label, value, min, max, step, onValueChange, toggle, onToggle }) => {
  return (
    <View style={styles.sliderContainerWrapper}>
      <View style={styles.sliderDetails}>
        <Text style={styles.label}>{label}</Text>
        <View style={{flexDirection:"row"}}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                toggle === "Yr" && styles.activeToggle,
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
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputValue}
              value={String(value)}
              keyboardType="numeric"
              onChangeText={(text) => onValueChange(Number(text))}
            />
          </View>
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
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
      <Text style={styles.sliderLabel}>{min}</Text>
      <Text style={styles.sliderLabel}>{max}</Text>
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
    justifyContent: 'center',
    alignItems:'center',
  },
  inputValue: {
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00194C',
    backgroundColor: '#EBEFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
  },
  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical:4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00194C',
    marginRight: 5,
  },
  activeToggle: {
    backgroundColor: '#00194C',
  },
  toggleButtonText: {
    color: '#00194C',
  },
  activeToggleText: {
    color: '#fff',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  slider: {
    flex: 1,
  },
  sliderLabel: {
    width: 'auto',
    textAlign: 'center',
    fontSize: 14,
    color: '#00194c',
  },
});

export default LoanTenureSlider;
