import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';

const ProfileScreen = () => {
  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.boxShadow, styles.perasonalCard]}>
            <Text style={styles.Personaltitle}>Personal Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Full Name</Text>
              <Text style={styles.Personalvalue}>Satat Mishra</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Email</Text>
              <Text style={styles.Personalvalue}>loremipsum@gmail.com</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Gender</Text>
              <Text style={styles.Personalvalue}>Male</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>DOB</Text>
              <Text style={styles.Personalvalue}>31/12/1993</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Nationality</Text>
              <Text style={styles.Personalvalue}>Indian</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Registered Mobile No.</Text>
              <Text style={styles.Personalvalue}>+91 9938391919</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Alternate Mobile No.</Text>
              <Text style={styles.Personalvalue}>+91 8421757814</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};


export default ProfileScreen;
