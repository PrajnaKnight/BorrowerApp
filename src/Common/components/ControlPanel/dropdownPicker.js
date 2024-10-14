import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, Text, StyleSheet, Platform, Dimensions,Image } from 'react-native';
import applyFontFamily from '../../../assets/style/applyFontFamily';
import { Icon } from 'lucide-react';

const CustomDropdown = ({
  value,
  setValue,
  items,
  setItems,
  error,
  placeholder,
  searchable = false,
  containerStyle = {},
  zIndex = 10000,
  selectedItemColor = '#ffffff',
  arrowIconColor = '#ff8500',
  tickIconColor = '#ff8500',
  selectedItemBackgroundColor = "#758BFD",
  focusedBorderColor = '#D8DFF2',
  label,
  onOpen,
  onClose,
  icon
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(300);

  useEffect(() => {
    if (open) {
      const windowHeight = Dimensions.get('window').height;
      const maxHeight = windowHeight * 0.4; // 40% of screen height
      setDropdownHeight(Math.min(items.length * 50, maxHeight));
      onOpen && onOpen();
    } else {
      onClose && onClose();
    }
  }, [open, items]);

  const styles = applyFontFamily({
    container: {
      marginBottom: 10,
    },
    label: {
      fontSize: 14,
      marginBottom: 5,
      color: '#00194c',
      fontWeight:'500'
    },
    dropdownBorder: {
      borderColor: "#D8DFF2",
      maxHeight: dropdownHeight,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: "#D8DFF2",
      color: "#fff",
      fontSize: 15,
      backgroundColor: "#ffffff",
      ...Platform.select({
        web: {
          minHeight: 42,
        },
      }),
    },
    dropdownText: {
      color: '#00194c',
      fontSize: 14,
    },
    placeholderText: {
      color: '#999',
      fontSize: 14
    },
    selectedItemText: {
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 5,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
  });

  
  return (
    <View style={[styles.container, { zIndex }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        searchable={searchable}
        style={[
          styles.dropdownBorder,
          styles.dropdown,
          containerStyle,
          open && { borderColor: focusedBorderColor, borderWidth: 1 },
        ]}
        dropDownContainerStyle={[
          styles.dropdownBorder,
          open && { borderColor: focusedBorderColor, borderWidth: 1 },
          { borderTopWidth: 0 },
        ]}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.placeholderText}
        labelStyle={styles.dropdownText}
        selectedItemLabelStyle={[
          styles.dropdownText,
          styles.selectedItemText,
          { color: selectedItemColor },
        ]}
        selectedItemContainerStyle={{
          backgroundColor: selectedItemBackgroundColor, 
        }}
        itemSeparator={true}
        itemSeparatorStyle={{
          backgroundColor: selectedItemBackgroundColor,
          height: 0,
        }}
        arrowIconStyle={{ tintColor: arrowIconColor }}
        tickIconStyle={{ tintColor: tickIconColor }}
        searchContainerStyle={{
          borderBottomWidth: 0,
        }}
        searchTextInputStyle={[
          styles.dropdownText,
          {
            borderColor: '#667593',
            borderRadius: 5,
          },
        ]}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        maxHeight={dropdownHeight}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomDropdown;