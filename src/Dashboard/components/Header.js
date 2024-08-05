import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import applyFontFamily from '../../assets/style/applyFontFamily';

const Header = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.headerContainer}>
      {['Personal Loan', 'Home Loan', 'Vehicle Loan'].map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onTabPress(tab)}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = applyFontFamily({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#00194c',
    justifyContent: 'space-between',
  },
  tab: {
    padding: 15,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF8500',
    
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    fontWeight: 'bold',
    color:'#ffffff'
  },
});

export default Header;
