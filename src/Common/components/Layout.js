// Layout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from './topBar';

const Layout = ({ children }) => {
  return (
    <View style={styles.Wrapcontainer}>
      <TopBar />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    Wrapcontainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
