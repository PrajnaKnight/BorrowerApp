import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../../assets/style/personalStyle';

const CustomDropdown = ({
  value,
  setValue,
  items,
  setItems,
  placeholder,
  searchable = false,
  containerStyle = {},
  zIndex = 10000,
  selectedItemColor = '#ffffff',
  arrowIconColor = '#ff8500',
  tickIconColor = '#ff8500',
  selectedItemBackgroundColor = "#758BFD",
  focusedBorderColor = '#00194c',
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.length == 1) {
      setValue(items[0])
    }
  }, [items])

  return (
    <DropDownPicker
      listMode='SCROLLVIEW'
      open={open}
      value={value}
      items={items}
      onSelectItem={(value) => { setValue(value) }}
      setOpen={(e) => { setOpen(e) }}
      setItems={setItems}
      placeholder={placeholder}
      maxHeight={150}
      style={[
        styles.dropdownBorder,
        containerStyle,
        open && { borderColor: focusedBorderColor, borderWidth: 1 },
      ]}
      dropDownContainerStyle={[
        open && { borderColor: focusedBorderColor, borderWidth: 1 },
        { borderTopWidth: 0 }, // Remove top border to connect with the main component
      ]}
      searchable={searchable}
      selectedItemLabelStyle={{
        color: selectedItemColor,
      }}
      selectedItemContainerStyle={{
        backgroundColor: selectedItemBackgroundColor,
        marginVertical: -1, // Negative margin to remove gaps
      }}
      itemSeparator={true} // Enable item separator
      itemSeparatorStyle={{
        backgroundColor: selectedItemBackgroundColor,
        height: 0, // Thin separator line
      }}
      arrowIconStyle={{ tintColor: arrowIconColor }}
      tickIconStyle={{ tintColor: tickIconColor }}
      searchContainerStyle={{
        borderBottomWidth: 0,
        borderTopWidth: 0,
      }}
      searchTextInputStyle={{
        borderColor: '#667593',
        borderRadius: 5,
      }}
      zIndex={zIndex}
    />
  )
}

export default CustomDropdown;