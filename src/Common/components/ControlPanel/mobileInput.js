import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Dimensions } from 'react-native';
import { useAppContext } from '../useContext';
import { styles } from '../../../assets/style/personalStyle';
import applyFontFamily from '../../../assets/style/applyFontFamily';
import Icon from "react-native-vector-icons/FontAwesome";


const countries = [
  { code: '+91', flag: require("../../../assets/images/india-flag.png") },
  { code: '+27', flag: require("../../../assets/images/africa.png") },
  { code: '+44', flag: require("../../../assets/images/uk.png") },
];

const MobileNumberInput = ({ mobileNumber, setMobileNumber, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const countrySelectorRef = useRef(null);

  const handleMobileNumberChange = (number) => {
    const digitsOnly = number.replace(/\D/g, '');
    if (digitsOnly.length <= 10) {
      setMobileNumber(digitsOnly);
    }
  };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const toggleDropdown = () => {
    if (!isDropdownVisible) {
      countrySelectorRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({
          top: py + height,
          left: px,
          width: width,
        });
      });
    }
    setIsDropdownVisible(!isDropdownVisible);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    const handleOutsideClick = () => {
      if (isDropdownVisible) {
        setIsDropdownVisible(false);
      }
    };

    let subscription;
    if (isDropdownVisible) {
      subscription = Dimensions.addEventListener('change', handleOutsideClick);
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isDropdownVisible]);

  return (
    <View>
      <View style={fieldstyles.container}>
        <TouchableOpacity 
          style={fieldstyles.countrySelector} 
          onPress={toggleDropdown}
          ref={countrySelectorRef}
        >
          <Image
            source={selectedCountry.flag}
            style={fieldstyles.flagIcon}
          />
          <Icon name="chevron-down" size={12} color="#ff8500" style={fieldstyles.dropdownIcon} />
        </TouchableOpacity>
        <View
          style={[
            fieldstyles.inputContainer,
            isFocused && fieldstyles.inputContainerFocused,
          ]}>
          <Text style={fieldstyles.countryCode}>{selectedCountry.code}</Text>
          <TextInput
            style={[fieldstyles.input, { fontSize: dynamicFontSize(14) }]}
            onChangeText={handleMobileNumberChange}
            value={mobileNumber}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>
      </View>
      {error && (
        <Text
          style={[
            styles.errorText,
            { fontSize: dynamicFontSize(styles.errorText.fontSize) },
          ]}>
          {error}
        </Text>
      )}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="none"
      >
        <TouchableOpacity 
          style={fieldstyles.modalOverlay}
          activeOpacity={1} 
          onPress={() => setIsDropdownVisible(false)}
        >
          <View 
            style={[
              fieldstyles.dropdownList,
              {
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }
            ]}
          >
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={fieldstyles.countryItem}
                  onPress={() => selectCountry(item)}
                >
                  <Image source={item.flag} style={fieldstyles.flagIcon} />
                  <Text style={fieldstyles.modalCountryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const fieldstyles = applyFontFamily({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8DFF2",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    position: 'relative'
  },
  flagIcon: {
    width: 26,
    height: 26,
    marginRight: 5,
  },
  countryCode: {
    fontSize: 14,
    color: "#00194c",
    marginHorizontal: 5,
  },
  modalCountryCode:{
    fontSize: 12,
    color: "#00194c",
  },
  dropdownIcon: {
    width: 12,
    height: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#D8DFF2",
    borderRadius: 8,
    overflow: "hidden",
  },
  inputContainerFocused: {
    borderColor: "#00194C",
  },
  input: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingLeft: 5,
    color: "#00194c",
    flex: 1,
  },
  errorText: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownList: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D8DFF2",
    borderRadius: 8,
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
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D8DFF2",
  },
});

export default MobileNumberInput;