import React from 'react';
import { View, Modal, ActivityIndicator, Text, StyleSheet } from 'react-native';
import applyFontFamily from '../services/style/applyFontFamily';

const LoadingOverlay = ({ visible }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#758BFD" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = applyFontFamily({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  loaderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, 
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, 
  },
  loadingText: {
    marginTop: 10, 
    fontSize: 16,
    color: '#758BFD',
    fontWeight: '500',
  },
});

export default LoadingOverlay;
