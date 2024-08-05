import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';

const AboutUsScreen = () => {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.Sectiontitle}>About Us</Text>
            <View style={styles.Sectioncard}>
              <Text style={styles.description}>
                Welcome to Knight FinTech, where we spearhead the transformation
                of the banking industry through groundbreaking technology
                solutions - Co-lending, Digital Lending, Treasury Management.
                Our unwavering commitment is to empower financial institutions
                by equipping them with the necessary tools to excel in the
                digital era. By harnessing the immense potential of cutting-edge
                technology, we provide an all-encompassing range of banking
                solutions meticulously crafted to optimize operations, enable
                Financial Institutions to work in collaboration and foster
                long-term & sustainable growth.
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </Layout>
  );
};


export default AboutUsScreen;
