import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Portal } from '@gorhom/portal';
import applyFontFamily from '../../assets/style/applyFontFamily';

const CustomDropdown = ({ options, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0].value);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current && isVisible) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({ top: py + height, left: px });
      });
    }
  }, [isVisible]);

  const handleSelect = (value) => {
    onSelect(value);
    setSelectedValue(value);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        style={styles.button}
        onPress={() => setIsVisible(!isVisible)}>
        <Text style={styles.buttonText}>
          {options.find((opt) => opt.value === selectedValue).label}
        </Text>
        <Icon
          name={isVisible ? "chevron-up" : "chevron-down"}
          size={8}
          color="#00194c"
          style={styles.icon}
        />
      </TouchableOpacity>

      <Portal>
        {isVisible && (
          <View style={[styles.dropdownContainer, dropdownPosition]}>
            <View style={styles.dropdown}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      selectedValue === item.value && styles.selectedItem,
                    ]}
                    onPress={() => handleSelect(item.value)}>
                    <Text
                      style={[
                        styles.itemText,
                        selectedValue === item.value && styles.selectedItemText,
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        )}
      </Portal>
    </>
  );
};

const styles = applyFontFamily({
  button: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 4,
    height: 24,
    width: 40,
  },
  buttonText: {
    fontSize: 9,
    color: '#00194c',
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 2,
  },
  dropdownContainer: {
    position: 'absolute',
    width: 40,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    maxHeight: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#758BFD',
  },
  itemText: {
    fontSize: 14,
    color: '#00194c',
  },
  selectedItemText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default CustomDropdown;