import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import SuccessScreen from '../../Common/components/ControlPanel/success';
import { styles } from '../../assets/style/personalStyle';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import { useRoute } from "@react-navigation/native"

const Final = ({ navigation }) => {

  const route = useRoute()
  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.8);

    // Set a timeout to navigate to the RPS page after 15 seconds
 
    // Clean up the timer when the component is unmounted or if the navigation occurs before 15 seconds
    return () => clearTimeout(timer);
  }, [navigation]);


  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  
  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isMobile = width < 768; 
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };


  return (
    <View style={styles.mainContainer}>
    <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>
    {isWeb && (isDesktop || (isTablet && width > height)) && (
          <View style={[styles.leftContainer, imageContainerStyle]}>
            <View style={styles.mincontainer}>
              <View style={styles.webheader}>
                <Text style={styles.WebheaderText}>Personal Loan</Text>
                <Text style={styles.websubtitleText}>Move Into Your Dreams!</Text>
              </View>
              <LinearGradient
                // button Linear Gradient
                colors={['#000565', '#111791', '#000565']}
                style={styles.webinterestButton}
              >
                <TouchableOpacity >
                  <Text style={styles.webinterestText}>Interest starting from 8.4%*</Text>
                </TouchableOpacity>

              </LinearGradient>

              <View style={styles.webfeaturesContainer}>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5, }]}>%</Text>
                  <Text style={styles.webfeatureText}>Nil processing fee*</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>3</Text>
                  <Text style={styles.webfeatureText}>3-Step Instant approval in 30 minutes</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>⏳</Text>
                  <Text style={styles.webfeatureText}>Longer Tenure</Text>
                </View>
              </View>

              <View style={styles.webdescription}>
                <Text style={styles.webdescriptionText}>
                  There's more! Complete the entire process in just 3-steps that isn't any more than 30 minutes.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.weblinkText}>To know more about product features & benefits, please click here</Text>
                </TouchableOpacity>
              </View>
              {/* <View style={styles.bottomFixed}>
         <Image source={require('../assets/images/poweredby.png')} style={styles.logo} />
      </View> */}
            </View>
          </View>
        )}
         <KeyboardAvoidingView
      style={[styles.rightCOntainer, { flex: 1 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
    <View style={styles.finalResultConatiner}>
        <ProgressBar progress={0.8} />
        <View style={styles.finalContainer}>
             <SuccessScreen message="Congratulation!" subMessage="Your loan application has been approved" />
        </View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </View>
    </View>
  );
};

export default Final;
