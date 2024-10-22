import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';

const AboutUsScreen = ({navigation, route}) => {


  const [message, setMessage] = useState(null)
  useState(()=>{
    console.log(route.params.data)
    let message = ""
    if(route.params.data?.Description){
      message = route.params.data?.Description
    }
    if(route.params.data?.Mission){
      message = message + route.params.data?.Mission
    }
    setMessage(message)
  },[route.params.data])
 

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.Sectiontitle}>About Us</Text>
            <View style={styles.Sectioncard}>
              <Text style={styles.description}>
                {message}
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </Layout>
  );
};


export default AboutUsScreen;
