import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAppContext } from '../components/useContext';
import { styles } from '../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomDropdown from './customDropdown';
import { Ionicons } from '@expo/vector-icons';
import { GoBack } from '../services/Utils/ViewValidator';

const Header = ({navigation, isOnFAQScreen }) => {
  const { handleFontSize } = useAppContext();
  const [increaseButtonColor, setIncreaseButtonColor] = useState('#E6EDFF');

  const onIncreasePressIn = () => setIncreaseButtonColor('#FF9D36');
  const onIncreasePressOut = () => {
    setIncreaseButtonColor('#E6EDFF');
    handleFontSize();
  };

  const languageOptions = [
    { value: 'en', label: 'EN' },
    { value: 'hi', label: 'हि' },
    { value: 'na', label: 'NA' },
    { value: 'ta', label: 'த' },
    { value: 'te', label: 'తె' },
    { value: 'ka', label: 'ಕ' },
  ];

  const handleFAQPress = () => {
    console.log("FAQ button pressed");
    if (navigation) {
      console.log("Attempting to navigate to FAQScreen");
      navigation.navigate('FAQScreen');
    } else {
      console.log("Navigate function is not available");
    }
  };

  const handleBackPress = () => {
    if (navigation) {
      navigation.goBack()
    }
  };

  return (
    <View style={styles.TopBar}>
      <View style={styles.logoContainer}>
        {/* {isOnFAQScreen && (
          <TouchableOpacity onPress={handleBackPress} style={styles.goBackButton}>
             <Ionicons name="chevron-back-circle-outline" size={24} color="#00194c" />
          </TouchableOpacity>
        )} */}
        <TouchableOpacity onPress={()=>{navigation.navigate("Dashboard")}}>
        <Image
          source={require("../../assets/images/your-logo.png")}
          style={styles.logo}
        />
        </TouchableOpacity>
        
      </View>
      <View style={styles.iconRow}>
        <TouchableOpacity
          onPressIn={onIncreasePressIn}
          onPressOut={onIncreasePressOut}
          style={[styles.iconButton, { backgroundColor: increaseButtonColor }]}>
          <Text style={styles.iconText}>A</Text>
        </TouchableOpacity>

        <View style={styles.drpDownWrapper}>
          <CustomDropdown
            options={languageOptions}
            onSelect={(value) => {
              // Update the context or state as needed
            }}
          />
        </View>

        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color="#00194c"
            style={styles.bellIcon}
          />
        </TouchableOpacity>
        {!isOnFAQScreen && (
          <TouchableOpacity style={styles.iconContainer} onPress={handleFAQPress}>
            <Icon name="info" size={12} color="#00194c" style={styles.infoIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;