import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MultiSelectDropdown = ({ 
  label, 
  items, 
  selectedItems, 
  onItemsChange,
  placeholder = "Search...",
  chipLabel = (item) => item.split('-')[0] + '-...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, items]);

  const handleToggleItem = (value) => {
    const updatedItems = selectedItems.includes(value)
      ? selectedItems.filter(item => item !== value)
      : [...selectedItems, value];
    onItemsChange(updatedItems);
  };

  const handleRemoveItem = (value) => {
    onItemsChange(selectedItems.filter(item => item !== value));
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearch('');  // Clear search when closing dropdown
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dropdownContainer}>
        {selectedItems.length > 0 && (
          <View style={styles.chipsContainer}>
            {selectedItems.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{chipLabel(item)}</Text>
                <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                  <Text style={styles.chipRemove}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={search}
            onChangeText={setSearch}
            onFocus={() => !isOpen && setIsOpen(true)}
          />
          <TouchableOpacity onPress={toggleDropdown} style={styles.searchIcon}>
            <Icon name={isOpen ? "chevron-up-outline" : "search-outline"} size={20} color="#999" />
          </TouchableOpacity>
        </View>
        {isOpen && (
          <ScrollView style={styles.dropdown} nestedScrollEnabled={true}>
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.item}
                onPress={() => handleToggleItem(item.value)}
              >
                <View style={styles.checkbox}>
                  {selectedItems.includes(item.value) && <View style={styles.checkboxInner}>
                    <Icon name="checkmark-outline" size={12} color="#fff" />
                    </View>}
                </View>
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#00194c",
    fontWeight: "500",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  chip: {
    backgroundColor: '#758BFD',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 12,
    color: 'white',
  },
  chipRemove: {
    marginLeft: 4,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    padding: 12,
  },
  dropdown: {
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ff8500',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#ff8500',
    borderRadius: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
});

export default MultiSelectDropdown;