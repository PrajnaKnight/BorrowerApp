import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import applyFontFamily from '../../assets/style/applyFontFamily';

const CustomDropdown = ({ options, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0].value);

  const handleSelect = (value) => {
    onSelect(value);
    setSelectedValue(value);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.buttonText}>
          {options.find(opt => opt.value === selectedValue).label}
        </Text>
        <Icon name="chevron-down" size={12} color="#00194c" style={styles.downIcon} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    // Container styles if needed
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#667593', // Replace with your color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    height: 30, // Match this height to your icons' container height
  },
  buttonText: {
    fontSize: 10,
    color: '#00194c', 
    fontWeight:'bold'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    paddingHorizontal:40,
    paddingVertical:15,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 5,
    width: '15%', // Set the width of the dropdown
    maxHeight: 200, // Set the max height if you want to limit the dropdown height
    top:40,
  },
  item: {
    paddingTop: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#00194c', 
    textAlign:'center'
  },
  downIcon:{
    marginLeft:5
  },
});

export default CustomDropdown;