import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import applyFontFamily from '../../../assets/style/applyFontFamily';

const WhatsAppToggle = ({ isEnabled, onToggle }) => {
  const animation = useRef(new Animated.Value(isEnabled ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isEnabled ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isEnabled, animation]);

  const backgroundColorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5ECFC', '#2CB142']
  });

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 38]
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>WhatsApp</Text>
      <TouchableOpacity 
        style={styles.toggleContainer} 
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Animated.View 
          style={[
            styles.toggleBackground,
            { backgroundColor: backgroundColorInterpolation }
          ]}
        >
          <Animated.Text 
            style={[
              styles.toggleText, 
              { opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
            ]}
          >
            OFF
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.toggleText, 
              { opacity: animation }
            ]}
          >
            ON
          </Animated.Text>
        </Animated.View>
        <Animated.View 
          style={[
            styles.toggleIndicator,
            { transform: [{ translateX }] }
          ]} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  label: {
    marginRight: 10,
    fontSize: 12,
    color: '#00194c',
  },
  toggleContainer: {
    width: 52,
    height:20,
    borderRadius: 20,
  },
  toggleBackground: {
    flex: 1,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIndicator: {
    width: 14,
    height: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  toggleText: {
    color: '#B2C2EE',
    fontSize: 10,
    fontWeight: 'bold',
    position: 'absolute',
    textAlign: 'center',
    top:2,
  },
});

export default WhatsAppToggle;