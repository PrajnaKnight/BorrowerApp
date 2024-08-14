import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../../assets/style/personalStyle';
import { useState, useRef, useEffect } from 'react';


const CustomDropdown = ({
  value,
  setValue,
  items,
  setItems,
  
  placeholder,
  searchable = false, 
  containerStyle = {},
  zIndex = 10000,
  selectedItemColor = '#ff8500',
  arrowIconColor = '#ff8500',
  tickIconColor = '#ff8500',
  focusedBorderColor = '#00194c', // Define a color for the focused border
}) => {

  const [open, setOpen] = useState(false);

  useEffect(()=>{
   
    if(items.length == 1){
      setValue(items[0])
    }
  },[items])

  return <DropDownPicker
    listMode='SCROLLVIEW'
    open={open}
    value={value}
    items={items}
    onSelectItem={
      (value) => {setValue(value)}
    }
    setOpen={(e) => {setOpen(e)}}
    setItems={setItems}
    placeholder={placeholder}
    maxHeight={150}
    style={[
      styles.dropdownBorder,
      containerStyle,
      open && { borderColor: focusedBorderColor, borderWidth: 1 }, // Apply focused style if open
    ]}
    dropDownContainerStyle={[
      open && { borderColor: focusedBorderColor, borderWidth: 1 }, // Apply focused style if open
    ]}
    searchable={searchable}
    selectedItemLabelStyle={{
      color: selectedItemColor,
    }}
    
    arrowIconStyle={{ tintColor: arrowIconColor }}
    tickIconStyle={{ tintColor: tickIconColor }}
    searchContainerStyle={{
      borderBottomWidth: 0, // Removes the border below the search input
      borderTopWidth: 0,    // Removes the border above the search input
    }}
    searchTextInputStyle={{
     borderColor:'#667593',
     borderRadius:5,
    }}

  
   zIndex={zIndex}
  
  />
  }

export default CustomDropdown;