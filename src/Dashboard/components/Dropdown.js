import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import applyFontFamily from '../../assets/style/applyFontFamily';

const Dropdown = ({ options = [], onSelect, initialValue = '', placeholder = 'Select an option' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedBorderWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isOpen ? Math.min(options.length, 5) * 40 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false
      }),
      Animated.timing(animatedBorderWidth, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: false
      })
    ]).start();
  }, [isOpen, options.length]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    if (typeof onSelect === 'function') {
      onSelect(value);
    }
    toggleDropdown();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isOpen && styles.buttonOpen]}
        onPress={toggleDropdown}
      >
        <Text style={[styles.buttonText, !selectedValue && styles.placeholderText]}>
          {selectedValue ? options.find(opt => opt.value === selectedValue)?.label || placeholder : placeholder}
        </Text>
        <Icon
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={12}
          color="#00194c"
          style={styles.icon}
        />
      </TouchableOpacity>
      <Animated.View 
        style={[
          styles.dropdown, 
          { 
            maxHeight: animatedHeight,
            borderWidth: animatedBorderWidth,
            borderColor: '#E0E0E0',
          }
        ]}
      >
        <FlatList
          data={options}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.item,
                item.value === selectedValue && styles.selectedItem,
                index === options.length - 1 && styles.lastItem
              ]}
              onPress={() => handleSelect(item.value)}
            >
              <Text style={[
                styles.itemText,
                item.value === selectedValue && styles.selectedItemText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          scrollEnabled={options.length > 5}
          contentContainerStyle={styles.flatListContent}
        />
      </Animated.View>
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonText: {
    fontSize: 14,
    color: '#00194c',
  },
  placeholderText: {
    color: '#999',
  },
  icon: {
    marginLeft: 5,
  },
  dropdown: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  lastItem: {
    borderBottomWidth: 0,
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
  },
});

export default Dropdown;