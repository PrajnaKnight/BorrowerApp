import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {


  const userProfileInfo = useSelector((state)=>state.profileInfoSlices)

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.boxShadow, styles.perasonalCard]}>
            <Text style={styles.Personaltitle}>Personal Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Full Name</Text>
              <Text style={styles.Personalvalue}>{userProfileInfo?.data?.LeadName || ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Email</Text>
              <Text style={styles.Personalvalue}>{userProfileInfo?.data?.LeadEmail || ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Gender</Text>
              <Text style={styles.Personalvalue}>{userProfileInfo?.data?.LeadGender || ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>DOB</Text>
              <Text style={styles.Personalvalue}>{userProfileInfo?.data?.LeadDOB || ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Nationality</Text>
              <Text style={styles.Personalvalue}>Indian</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Registered Mobile No.</Text>
              <Text style={styles.Personalvalue}>{userProfileInfo?.data?.LeadPhone || ""}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.Personallabel}>Alternate Mobile No.</Text>
              <Text style={styles.Personalvalue}>{userProfileInfo?.data?.LeadPhone || ""}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};


export default ProfileScreen;
