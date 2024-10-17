import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import applyFontFamily from '../../../assets/style/applyFontFamily';

const CustomBankDropdown = ({
  value,
  setValue,
  items,
  placeholder,
  label,
  error,
  zIndex = 1000,
  selectedItemColor = '#ffffff',
  arrowIconColor = '#ff8500',
  selectedItemBackgroundColor = "#758BFD",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [dropdownHeight, setDropdownHeight] = useState(300);
  const buttonRef = useRef(null);

  useEffect(() => {
    if(!items){
      return
    }
    const windowHeight = Dimensions.get('window').height;
    const maxHeight = windowHeight * 0.4; // 40% of screen height
    setDropdownHeight(Math.min(items.length * 60, maxHeight));
  }, [items]);

  const getBankIcon = (bankName) => {
    switch (bankName) {
      case "HDFC Bank":
        return { text: "HDFC", color: "#ED0006" };
      case "State Bank of India":
        return { text: "SBI", color: "#2D5FA5" };
      case "Axis Bank":
        return { text: "AXIS", color: "#97144D" };
      default:
        return { text: "BK", color: "#666666" };
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = item.value === value;
    const icon = getBankIcon(item.bankName);
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => {
          setValue(item.value);
          setIsOpen(false);
        }}
      >
        <View style={[styles.bankIcon, { backgroundColor: icon.color }]}>
          <Text style={styles.bankIconText}>{icon.text}</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={[styles.accountNumber, isSelected && styles.selectedItemText]}>{item.value}</Text>
          <Text style={[styles.bankName, isSelected && styles.selectedItemText]}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedItem = items?.find(item => item.value === value);

  const onLayout = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownLayout({
          x: pageX,
          y: pageY + height,
          width: width,
          height: height,
        });
      });
    }
  };

  return (
    <View style={[styles.container, { zIndex }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        ref={buttonRef}
        style={styles.dropdownButton}
        onPress={() => {
          onLayout();
          setIsOpen(!isOpen);
        }}
      >
        {selectedItem ? (
          <View style={styles.selectedItemContainer}>
            <View style={[styles.bankIcon, { backgroundColor: getBankIcon(selectedItem.bankName).color }]}>
              <Text style={styles.bankIconText}>{getBankIcon(selectedItem.bankName).text}</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountNumber}>{selectedItem.value}</Text>
              <Text style={styles.bankName}>{selectedItem.label}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.placeholderText}>{placeholder}</Text>
        )}
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={24} color={arrowIconColor} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={[
              styles.dropdownListContainer, 
              { 
                top: dropdownLayout.y, 
                left: dropdownLayout.x,
                width: dropdownLayout.width,
                maxHeight: dropdownHeight,
              }
            ]}
          >
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              contentContainerStyle={styles.flatListContent}
              nestedScrollEnabled={true}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: '#00194c',
    fontWeight: '500',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#D8DFF2",
    borderRadius: 5,
    paddingVertical:5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  selectedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
  },
  dropdownListContainer: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: "#D8DFF2",
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 0.84,
  },
  flatListContent: {
    paddingVertical: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D8DFF2',
  },
  selectedItem: {
    backgroundColor: '#758BFD',
  },
  bankIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bankIconText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  accountInfo: {
    flex: 1,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00194c',
  },
  bankName: {
    fontSize: 12,
    color: '#666',
  },
  selectedItemText: {
    color: '#ffffff',
  },
});

export default CustomBankDropdown;