import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import FAQModal from './FAQModal';
import applyFontFamily from '../../assets/style/applyFontFamily';

const TopBar = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    'Your next due date is 15th June.',
    'Minimum amount due is ₹5000.'
  ]);
  const route = useRoute();
  const showBackButton = route.name !== 'Home';

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={15} color="#00194c" style={{fontWeight:'bold'}} />
          </TouchableOpacity>
        )}
        <Image
          source={require("../../assets/images/your-logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}>
           <Ionicons name="notifications-outline" size={22}  color="#00194c"
            style={
              notifications.length > 0 ? styles.bellIconActive : styles.bellIcon
            } />
          {notifications.length > 0 && <View style={styles.notificationDot} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="info" size={10} color="#00194c" style={styles.infoIcon} />
        </TouchableOpacity>
      </View>

      {/* FAQ Modal */}
      <FAQModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 1
  },
  backButton: {
    marginRight: 10,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#00194c',
    borderRadius: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff8500',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#00194c',
    borderRadius: 100,
    textAlign: 'center',
    verticalAlign: 'middle',
  },
});

export default TopBar;
