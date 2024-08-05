import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import applyFontFamily from '../../assets/style/applyFontFamily';

const RadioButtonGroup = ({ options, selected, onSelect }) => {
  return (
    <View style={styles.Radiocontainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(option)}
          style={styles.radioButton}
        >
          <View style={selected === option ? styles.selectedradioCircle : styles.unselectedradioCircle}>
            {selected === option && <View style={styles.selectedRb} />}
          </View>
          <Text style={selected === option ? styles.selected : styles.unselected}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = applyFontFamily({
  Radiocontainer: {
    flexDirection: 'row',
    marginVertical:10
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  unselectedradioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A2ACC6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedradioCircle:{
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00194c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff8c00',
  },
  selected: {
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  unselected: {
    color: '#333',
  },
});

export default RadioButtonGroup;
