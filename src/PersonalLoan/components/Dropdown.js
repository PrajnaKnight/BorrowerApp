import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomDropdown = ({ options, selectedValue, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === selectedValue && styles.selectedOption
      ]}
      onPress={() => {
        onValueChange(item.value);
        setIsOpen(false);
      }}
    >
      {item.icon && <Icon name={item.icon} size={20} color="#000" style={styles.icon} />}
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionText, { color: item.value === selectedValue ? '#ffffff' : '#00194c' }]}>{item.label}</Text>
        {item.subLabel && <Text style={styles.subLabel}>{item.subLabel}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>
          {selectedValue ? options?.find(opt => opt?.value === selectedValue)?.label : 'Select'}
        </Text>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#FF8C00" />
      </TouchableOpacity>
      {isOpen && (
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={(item) => item?.value}
          style={styles.dropdownList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_400Regular'
  },
  dropdownList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#758BFD',
  },
  icon: {
    marginRight: 10,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_400Regular'

  },
  subLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default CustomDropdown;