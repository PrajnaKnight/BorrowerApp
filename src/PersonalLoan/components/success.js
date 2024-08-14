import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAppContext } from '../components/useContext';
import applyFontFamily from '../services/style/applyFontFamily';

const SuccessScreen = ({ message, subMessage }) => {
  
  const { fontSize } = useAppContext(); 
  const dynamicFontSize = (size) => size + fontSize;
  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          {/* Replace with your actual success icon image */}
          <Image
            source={require('../../assets/images/Done.gif')}
            resizeMode="contain"
            style={styles.successIcon}
          />
        </View>
        <Text style={[styles.message, { fontSize: dynamicFontSize(styles.message.fontSize) }]}>{message}</Text>
        <Text style={[styles.subMessage, { fontSize: dynamicFontSize(styles.subMessage.fontSize) }]}>{subMessage}</Text>
      </View>
    </View>
  );
};

const styles = applyFontFamily({
  iconContainer: {
    // Container for the success icon
    marginBottom: 30,
  },
  successContainer:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  },
  successIcon: {
    width: 200, 
    height: 300, 
  },
  message: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00194C',
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    color: '#666',
    textAlign:'center',
    color: '#00194C',
  },
});

export default SuccessScreen;

// usage in other screen

// <SuccessScreen message="Congratulations!" subMessage="Your loan application has been approved" />
