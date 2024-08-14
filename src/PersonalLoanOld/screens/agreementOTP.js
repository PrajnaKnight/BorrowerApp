import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView , useWindowDimensions} from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../Common/components/useContext';
import { GoBack } from '../services/Utils/ViewValidator';
import { isValidNumberOnlyFieldWithZero } from "../services/Utils/FieldVerifier";


const AgreementOTPVerificationScreen = ({ navigation, route }) => {
  const [OTP, setOTP] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const [focusedInput, setFocusedInput] = useState(null);

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;




  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, OTP.length);
  }, [OTP]);

  const handleOTPChange = (text, index) => {
    const newOTP = [...OTP];

  
    if(text == "Backspace"){
      newOTP[index] = ""
      if(index > 0){
        inputsRef.current[index - 1].focus();
      }
      setOTP(newOTP);
      return
    }

    if(isValidNumberOnlyFieldWithZero(text)){
      return
    }
    
    if(newOTP[index] == null || newOTP[index].length == 0){
      newOTP[index] = text
      setOTP(newOTP);
      if(index < 5){
        inputsRef.current[index + 1].focus();
      }
    }
    else{
      if(index < 5 && (newOTP[index+1] == null || newOTP[index+1].length == 0)){
        newOTP[index+1] = text
        inputsRef.current[index + 1].focus();
      }
      setOTP(newOTP);
    }


    

  
    // Focus the next input if there's a next one and the current one is filled
    
    
    
  };
  // Add onFocus and onBlur handlers
  const handleFocus = (index) => {
    setFocusedInput(index);
  };

  const handleBlur = () => {
    setFocusedInput(null); // Remove focus when input is blurred
  };


  useEffect(() => {
    // If timeLeft is 0, enable the resend button and return
    if (timeLeft === 0) {
      setIsResendEnabled(true);
      return;
    }

    // Disable the resend button initially
    setIsResendEnabled(false);

    // Decrease timeLeft by 1 every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = () => {
    // Reset the OTP array to clear the inputs
    setOTP(new Array(6).fill(''));
    // Reset the timer
    setTimeLeft(120);
    // Clear any existing error messages
    setError('');
    // Reset focus to the first input for user convenience
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  };

  const handleVerifyPress = () => {
    let isValid = true;
    OTP.forEach((value) => {
      if (value.trim().length !== 1) {
        isValid = false;
      }
    });

    if (isValid) {
      setError('');
      navigation.navigate('final')
    } else {
      setError('Please fill in all the OTP fields.');
    }
  };

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
      <View style={{ flex: 1, flexDirection: isWeb ? "row" : "column" }}>
        {isWeb && (isDesktop || (isTablet && width > height)) && (
          <View style={[styles.leftContainer, imageContainerStyle]}>
            <View style={styles.mincontainer}>
              <View style={styles.webheader}>
                <Text style={styles.WebheaderText}>Personal Loan</Text>
                <Text style={styles.websubtitleText}>
                  Move Into Your Dreams!
                </Text>
              </View>
              <LinearGradient
                // button Linear Gradient
                colors={["#000565", "#111791", "#000565"]}
                style={styles.webinterestButton}>
                <TouchableOpacity>
                  <Text style={styles.webinterestText}>
                    Interest starting from 8.4%*
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              <View style={styles.webfeaturesContainer}>
                <View style={styles.webfeature}>
                  <Text
                    style={[
                      styles.webfeatureIcon,
                      { fontSize: 30, marginBottom: 5 },
                    ]}>
                    %
                  </Text>
                  <Text style={styles.webfeatureText}>Nil processing fee*</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text
                    style={[
                      styles.webfeatureIcon,
                      { fontSize: 30, marginBottom: 5 },
                    ]}>
                    3
                  </Text>
                  <Text style={styles.webfeatureText}>
                    3-Step Instant approval in 30 minutes
                  </Text>
                </View>
                <View style={styles.webfeature}>
                  <Text
                    style={[
                      styles.webfeatureIcon,
                      { fontSize: 30, marginBottom: 5 },
                    ]}>
                    ⏳
                  </Text>
                  <Text style={styles.webfeatureText}>Longer Tenure</Text>
                </View>
              </View>

              <View style={styles.webdescription}>
                <Text style={styles.webdescriptionText}>
                  There's more! Complete the entire process in just 3-steps that
                  isn't any more than 30 minutes.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.weblinkText}>
                    To know more about product features & benefits, please click
                    here
                  </Text>
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
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View>
                <Text
                  style={[
                    styles.headerText,
                    { fontSize: dynamicFontSize(styles.headerText.fontSize) },
                  ]}>
                  Agreement OTP Verification
                </Text>
                <Text
                  style={[
                    styles.subText,
                    { fontSize: dynamicFontSize(styles.subText.fontSize) },
                  ]}>
                  Please enter the OTP sent to your mobile number
                </Text>
                <View style={styles.flexContent}>
                  <Text
                    style={[
                      styles.phoneNumber,
                      {
                        fontSize: dynamicFontSize(styles.phoneNumber.fontSize),
                      },
                    ]}>
                    +91
                  </Text>
                  <Text
                    style={[
                      styles.timer,
                      { fontSize: dynamicFontSize(styles.timer.fontSize) },
                    ]}>
                    {formatTimeLeft()}
                  </Text>
                </View>
                <View style={styles.otpContainer}>
                  {OTP.map((value, index) => (
                    <TextInput
                      key={index}
                      style={[
                        styles.otpInput,
                        error ? styles.errorBorder : null,
                        { fontSize: dynamicFontSize(styles.otpInput.fontSize) },
                        focusedInput === index && styles.focusedInput, // Conditional style for focused input
                      ]}
                      value={value}
                      // onChangeText={(text) => handleOTPChange(text, index)}
                      onFocus={() => handleFocus(index)}
                      onBlur={handleBlur}
                      maxLength={1}
                      keyboardType="numeric"
                      onKeyPress={({ nativeEvent: { key } }) => {
                        handleOTPChange(key, index);
                      }}
                      ref={(el) => (inputsRef.current[index] = el)}
                    />
                  ))}
                </View>
                {error ? (
                  <Text
                    style={[
                      styles.errorText,
                      { fontSize: dynamicFontSize(styles.errorText.fontSize) },
                    ]}>
                    {error}
                  </Text>
                ) : null}

                <View style={styles.flexContent}>
                  <Text
                    style={[
                      styles.resendText,
                      { fontSize: dynamicFontSize(styles.resendText.fontSize) },
                    ]}>
                    Please wait to resend OTP
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.resendButton,
                      !isResendEnabled && styles.resendButtonDisabled,
                    ]}
                    onPress={handleResendOTP}
                    disabled={!isResendEnabled}>
                    <Text
                      style={[
                        styles.resendButtonText,
                        {
                          fontSize: dynamicFontSize(
                            styles.resendButtonText.fontSize
                          ),
                        },
                      ]}>
                      RESEND
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    GoBack(navigation);
                  }}>
                  <Text
                    style={[
                      styles.backBtnText,
                      {
                        fontSize: dynamicFontSize(styles.backBtnText.fontSize),
                      },
                    ]}>
                    BACK
                  </Text>
                </TouchableOpacity>
                <LinearGradient
                  // button Linear Gradient
                  colors={["#002777", "#00194C"]}
                  style={styles.verifyButton}>
                  <TouchableOpacity onPress={handleVerifyPress}>
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          fontSize: dynamicFontSize(styles.buttonText.fontSize),
                        },
                      ]}>
                      VERIFY
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default AgreementOTPVerificationScreen;


