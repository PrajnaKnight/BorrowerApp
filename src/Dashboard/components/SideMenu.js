import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, SafeAreaView, ImageBackground,Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import applyFontFamily from '../../assets/style/applyFontFamily';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome6 } from '@expo/vector-icons';
import Layout from './Layout';
import { DeleteUser } from '../../PersonalLoan/services/API/CreateBorrowerLead';
import { STATUS } from '../../PersonalLoan/services/API/Constants';
import { StoreApplicantId, StoreBorrowerPhoneNumber, StoreLeadId, StoreTokenValidity, StoreUserAadhaar, StoreUserPan } from '../../PersonalLoan/services/LOCAL/AsyncStroage';

const SideMenu = ({navigation}) => {
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(false);


  const handleSocialMediaPress = (url) => {
    Linking.openURL(url);
  };

  const HandleLogOut = async() =>{
      const deleteStatus = await DeleteUser()
      if(deleteStatus.status == STATUS.SUCCESS){
        await StoreLeadId(null);
        await StoreApplicantId(null)
        await StoreTokenValidity(null)
        await StoreBorrowerPhoneNumber(null)
        await StoreUserPan(null)
        await StoreUserAadhaar(null)
        navigation.navigate("Common")
        return
      }
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            HandleLogOut()
            // Implement logout logic here
            console.log("User logged out");
            
            // Navigate to login screen or perform other logout actions
            // navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const toggleWhatsApp = () => {
    setIsWhatsAppEnabled(previousState => !previousState);
    // Here you would typically update this setting on your backend or in local storage
    console.log("WhatsApp notifications:", !isWhatsAppEnabled);
  };

  return (
    <Layout>
      <SafeAreaView style={styles.container}>
      <ImageBackground
          source={require("../../assets/images/menuBg.png")}
          style={styles.background}
          resizeMode="cover">
          <View style={styles.profileSection}>
            <Text style={styles.profileName}>Satat Mishra</Text>
            <Text style={styles.profilePhone}>+91 9938391919</Text>
          </View>
        </ImageBackground>
        <View style={styles.menuWrapper}>
          <MenuItem
            icon="account-outline"
            label="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
          <MenuItem icon="bank" label="Bureau" onPress={() => {}} />
          <MenuItem
            icon="cog-outline"
            label="General Setting"
            onPress={() => navigation.navigate("GeneralSetting")}
          />
          <MenuItem
            icon="information-outline"
            label="About Us"
            onPress={() => navigation.navigate("AboutUs")}
          />
          <MenuItem
            icon="phone"
            label="+91 8655748974"
            onPress={() => Linking.openURL("tel:+918655748974")}
          />
          <MenuItem
            icon="email-outline"
            label="support@knightfintech.com"
            onPress={() => Linking.openURL("mailto:support@knightfintech.com")}
          />
          <MenuItem
            icon="whatsapp"
            label="WhatsApp Notifications"
            isToggle={true}
            toggleValue={isWhatsAppEnabled}
            onToggle={toggleWhatsApp}
          />
          <MenuItem icon="logout" label="Logout" onPress={handleLogout} />
          
        </View>
        <View style={styles.socialMediaContainer}>
          <SocialMediaIcon
            icon="linkedin"
            color="#0077B5"
            onPress={() => handleSocialMediaPress("https://www.linkedin.com/company/knightfintech/")}
          />
          <SocialMediaIcon
            icon="facebook"
            color="#1877F2"
            onPress={() => handleSocialMediaPress("https://www.facebook.com/KnightFinTech/")}
          />
          <FontAwesome6 name="square-x-twitter" style={styles.socialMediaIcon} 
          size={30} color="#000000" onPress={() => handleSocialMediaPress("https://x.com/knightfintech?mx=2")} />
          
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by</Text>
          <Image
            source={require("../../assets/images/knightFintech.png")}
            style={styles.footerLogo}
          />
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const MenuItem = ({ icon, label, onPress, isToggle, toggleValue, onToggle }) => (
  <TouchableOpacity style={styles.menuItem} onPress={isToggle ? null : onPress}>
    <Icon name={icon} size={24} color="#00194C" style={styles.menuIcon} />
    <Text style={styles.menuLabel}>{label}</Text>
    {isToggle && (
      <Switch
        trackColor={{ false: "#767577", true: "#D0E4FE" }}
        thumbColor={toggleValue ? "#758BFD" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggle}
        value={toggleValue}
        style={styles.toggleSwitch}
      />
    )}
  </TouchableOpacity>
);
const SocialMediaIcon = ({ icon, onPress, color }) => (
  <TouchableOpacity onPress={onPress} style={styles.socialMediaIcon}>
    <Icon name={icon} size={30} color={color} />
  </TouchableOpacity>
);

const styles = applyFontFamily({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linearGradient: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical:30
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  profilePhone: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  menuWrapper: {
    padding: 20,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'space-between', 
  },
  menuIcon: {
    width: 30,
  },
  menuLabel: {
    fontSize: 16,
    color: '#00194C',
    marginLeft: 10,
    flex: 1, 
  },
  toggleSwitch: {
    
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom:20
  },
  socialMediaIcon: {
    marginHorizontal: 10,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#0158BC38',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  footerLogo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
});

export default SideMenu;