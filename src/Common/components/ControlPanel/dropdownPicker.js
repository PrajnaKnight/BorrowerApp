import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import applyFontFamily from '../../../assets/style/applyFontFamily';
import { min } from 'date-fns';

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
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.length === 1) {
      setValue(items[0].value);
    }
  }, [items]);

  const styles = applyFontFamily({
    dropdownBorder: {
      borderColor: "#D8DFF2",
      marginBottom: 15,
      maxHeight: 200,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: "#D8DFF2",
      color: "#fff",
      fontSize: 15,
      backgroundColor: "#ffffff",
      zIndex: 10000,
      ...Platform.select({
        web: {
          minHeight: 42,
        },
      }),
    },
    dropdownText: {
      color: '#333',
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
  });

  return (
    <View style={{ flex: 1 }}>
      <DropDownPicker
        listMode={Platform.OS === 'android' ? 'SCROLLVIEW' : 'FLATLIST'}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        onSelectItem={(value)=>setValue(value)}
        setItems={setItems}
        placeholder={placeholder}
        maxHeight={150}
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
        searchable={searchable}
        selectedItemContainerStyle={{
          backgroundColor: selectedItemBackgroundColor,
          marginVertical: -1,
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
          borderTopWidth: 0,
        }}
        searchTextInputStyle={[
          styles.dropdownText,
          {
            borderColor: '#667593',
            borderRadius: 5,
          },
        ]}
        zIndex={zIndex}
        scrollViewProps={{
          nestedScrollEnabled: true,
          scrollEnabled: true,
          persistentScrollbar: Platform.OS === 'android',
        }}
        flatListProps={{
          nestedScrollEnabled: true,
        }}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export default CustomDropdown;