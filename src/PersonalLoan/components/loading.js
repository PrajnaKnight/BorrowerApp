import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import applyFontFamily from '../../assets/style/applyFontFamily';

const LoadingScreen = ({ message }) => {
  return (
    <View style={styles.container}>
      
      <Image 
        source={require('../../assets/images/hourglass.png')}
        style={styles.hourglassIcon} 
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = applyFontFamily({
  hourglassIcon: {
    width: 50, // Set the width as per your icon's aspect ratio
    height: 50, // Set the height as per your icon's aspect ratio
    marginBottom: 30,
  },
  message: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default LoadingScreen;


// usage in other screen

// <LoadingScreen message="Please wait while we work on your loan application" />
