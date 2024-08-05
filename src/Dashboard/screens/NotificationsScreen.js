import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';

const NotificationScreen = () => {
  const [selectedTab, setSelectedTab] = useState('transactional');
  const notifications = {
    transactional: [
      { id: '1', message: 'HDFC Bank account holder, payment of Rs. 22,224 was debited', date: '10/04/2023', time: '04:35 PM', image: require('../../assets/images/bankLogo.png') },
      { id: '2', message: 'HDFC Bank account holder, payment of Rs. 22,224 was debited', date: '10/03/2023', time: '04:35 PM', image: require('../../assets/images/bankLogo.png') },
      { id: '3', message: 'HDFC Bank account holder, payment of Rs. 22,224 was debited', date: '10/02/2023', time: '04:35 PM', image: require('../../assets/images/bankLogo.png') },
      { id: '4', message: 'HDFC Bank account holder, payment of Rs. 22,224 was debited', date: '10/01/2023', time: '04:35 PM', image: require('../../assets/images/bankLogo.png') },
    ],
    promotional: [
      { id: '1', message: 'Instant Pre-approved home loan', action: 'Apply Now', date: '10/04/2023', time: '04:35 PM' },
      { id: '2', message: 'Instant Pre-approved personal loan Rs. 50,000 @ 10% p.a', action: 'Avail Now', date: '15/02/2023', time: '04:00 PM' },
    ],
  };

  const currentNotifications = notifications[selectedTab];

  const renderTabs = () => (
    <View style={styles.IndividualtabBar}>
      <TouchableOpacity
        style={[
          styles.Notificationtab,
          selectedTab === "transactional" && styles.NotificationactiveTab,
        ]}
        onPress={() => setSelectedTab("transactional")}>
        <Text
          style={[
            styles.NotificationtabText,
            selectedTab === "transactional" &&
              styles.NotificationactiveTabText,
          ]}>
          Transactional
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.Notificationtab,
          selectedTab === "promotional" && styles.NotificationactiveTab,
        ]}
        onPress={() => setSelectedTab("promotional")}>
        <Text
          style={[
            styles.NotificationtabText,
            selectedTab === "promotional" &&
              styles.NotificationactiveTabText,
          ]}>
          Promotional
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout>
      <FlatList
        ListHeaderComponent={renderTabs}
        data={currentNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            {item.image && (
              <Image
                source={item.image}
                style={styles.notificationImage}
              />
            )}
            <View style={styles.notificationContent}>
              <Text style={styles.notificationMessage}>
                {item.message}
              </Text>
              {item.action && (
                <Text style={styles.notificationAction}>
                  {item.action}
                </Text>
              )}
              <Text style={styles.notificationDate}>
                {item.date} | {item.time}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.noNotificationsContainer}>
            <Icon
              name="bell-off-outline"
              size={80}
              color="#a0c1d1"
              style={styles.noNotificationsIcon}
            />
            <Text style={styles.noNotificationsText}>No Notifications</Text>
          </View>
        }
      />
    </Layout>
  );
};


export default NotificationScreen;
