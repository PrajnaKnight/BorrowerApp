import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontAwesome6 } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import applyFontFamily from '../../assets/style/applyFontFamily';

const BottomTabBar = ({ navigation }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  const handleMenuToggle = () => {
    setMenuVisible(!isMenuVisible);
    setActiveTab('More');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabItem} onPress={() => { navigation.navigate('Home'); setActiveTab('Home'); }}>
        <View style={[styles.activeIndicator, activeTab === 'Home' && styles.active]} />
        <Ionicons name={activeTab === 'Home' ? "home" : "home-outline"}  size={24} color={activeTab === 'Home' ? "#FF8800" : "#00194C"} />
        <Text style={activeTab === 'Home' ? styles.activeLabel : styles.label}>Home</Text>  
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => { navigation.navigate('Loans'); setActiveTab('Loans'); }}>
        <View style={[styles.activeIndicator, activeTab === 'Loans' && styles.active]} />
        <FontAwesome6 name="sack-dollar" size={24} color={activeTab === 'Loans' ? "#FF8800" : "#00194C"} />
        <Text style={activeTab === 'Loans' ? styles.activeLabel : styles.label}>Loans</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => { navigation.navigate('SideMenu'); setActiveTab('More'); }}>
        <View style={[styles.activeIndicator, activeTab === 'More' && styles.active]} />
        <FontAwesome name={activeTab === 'More' ? "user" : "user-o"} size={24} color={activeTab === 'More' ? "#FF8800" : "#00194C"} />
        <Text style={activeTab === 'More' ? styles.activeLabel : styles.label}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  tabItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#00194C',
    marginTop: 4,
  },
  activeLabel: {
    fontSize: 12,
    color: '#FF8800',
    marginTop: 4,
  },
  activeIndicator: {
    width: '100%',
    height: 3,
    backgroundColor: 'transparent',
    position:'absolute',
    top:-10
  },
  active: {
    backgroundColor: '#FF8800',
    position:'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default BottomTabBar;
