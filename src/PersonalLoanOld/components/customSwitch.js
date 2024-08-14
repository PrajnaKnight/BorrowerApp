import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import applyFontFamily from '../../assets/style/applyFontFamily';

const CustomSwitch = ({ value, onValueChange }) => {
   
  return (
    <TouchableOpacity
      style={[styles.switch, value ? styles.switchOn : styles.switchOff]}
      onPress={() => onValueChange(!value)}
      activeOpacity={1}
      accessibilityLabel={value ? 'Yes' : 'No'}
      accessibilityHint="Toggles the setting."
      accessibilityRole="switch"
    >
      <View style={[styles.switchTrack]}>
        {value ? (
          <>
            <Text style={[styles.switchText, styles.switchTextOn]}>YES</Text>
            <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
          </>
          
        ) : (
          <>
            <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
            <Text style={[styles.switchText, styles.switchTextOff]}>NO</Text>
          </>
        )}
       
        
      </View>
    </TouchableOpacity>
  );
};

const styles = applyFontFamily({
  switch: {

    borderRadius: 20, // Make it rounded
    padding: 4,
    backgroundColor: '#767577', // Default background color
    marginBottom:5
  },
  switchOn: {
    backgroundColor: '#EDF1FE', // Background color when switch is "on"
    borderWidth:1,
    borderColor:"#00194C"
  },
  switchOff: {
    backgroundColor: '#C7CEEB33', // Background color when switch is "off"
    borderWidth:1,
    borderColor:"#C8CEEB"
  },
  switchTrack: {
    flex:1,
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:"space-between"
  },
  
  switchText: {
    fontSize: 10,
    fontWeight:"600"
  },
  switchTextOn: {
    textAlign: 'right',
    color:"#00194C",
    marginHorizontal:8
  },
  switchTextOff: {
    textAlign: 'left',
    marginHorizontal:8,
    color:"#C8CEEB"
  },
  thumb: {
    width: 15, // Width of the thumb
    height: 15, // Height of the thumb
    borderRadius: 9, // Make it rounded
    backgroundColor: '#fff', // Background color of the thumb
  },
  thumbOn: {
    right: 2, // Move thumb to the right when switch is "on"
    backgroundColor:"#00194C"
  },
  thumbOff: {
    left: 2, // Keep thumb to the left when switch is "off"
    backgroundColor:"#C8CEEB"
  },
});

export default CustomSwitch;
