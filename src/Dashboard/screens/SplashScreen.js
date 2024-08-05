// SplashScreen.js
import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import applyFontFamily from '../../assets/style/applyFontFamily';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/splash.png')} style={styles.image} />
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00194c',
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
  },
  loader:{
    position:'absolute',
    zIndex:1000,
    top:'52%',
    left:0,
    right:0
  },
});

export default SplashScreen;
