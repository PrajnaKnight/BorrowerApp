import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, Image } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import VerifyLoginOTP, { GetVerifyLoginOtpRequestModel } from '../../PersonalLoan/services/API/VerifyLoginOtp';
import GetOTPByPhoneNumber, { GetLoginTopByPhoneRequestModel } from '../../PersonalLoan/services/API/GetLoginOtpByPhone';
import CreateBorrowerLead from '../../PersonalLoan/services/API/CreateBorrowerLead';
import SetLeadProduct, { CreateSetLeadProductModel } from '../../PersonalLoan/services/API/SetLeadProduct';
import { API_RESPONSE_STATUS, STATUS } from '../../PersonalLoan/services/API/Constants';
import { GetLeadId, StoreBorrowerPhoneNumber, StoreLeadId } from '../../PersonalLoan/services/LOCAL/AsyncStroage';
import { isValidNumberOnlyFieldWithZero } from '../../PersonalLoan/services/Utils/FieldVerifier';
import LoadingOverlay from '../../PersonalLoan/components/FullScreenLoader';
import { GoBack } from '../../PersonalLoan/services/Utils/ViewValidator';
import ScreenError, { useErrorEffect } from '../../PersonalLoan/screens/ScreenError';
import { Network_Error } from '../../PersonalLoan/services/Utils/Constants';
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';


import {
  getHash,
  removeListener,
  startOtpListener,
} from 'react-native-otp-verify';

import Layout from '../components/Layout';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar'
import { CommonActions } from '@react-navigation/native';

const OTPVerificationScreen = ({ navigation, route }) => {

  const { fontSize } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [OTP, setOTP] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const [focusedInput, setFocusedInput] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45); // 2 minutes in seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const dynamicFontSize = (size) => size + fontSize;


  const [requestModel, setRequestModel] = useState(GetLoginTopByPhoneRequestModel())

  const onTryAgainClick = () => {
    submitPhoneNumber()
  }


  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)

  useEffect(() => {

    if (Platform.OS != "web") {
      getHash().then(hash => {
      }).catch(console.log);

      startOtpListener(message => {
        try {

          const otp = /(\d{6})/g.exec(message)[1];
          setOTP(otp.split(''));
        }
        catch (e) {

          console.error(e)
        }

      });

      return () => removeListener();
    }


  }, [timeLeft]);

  useEffect(() => {
    let currentRequestModel = { ...requestModel, LeadPhone: route.params.mobileNumber }
    setRequestModel(currentRequestModel)
  }, [])

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, OTP.length);
  }, [OTP]);

  const handleOTPChange = (text, index) => {
    const newOTP = [...OTP];


    if (text == "Backspace") {
      newOTP[index] = ""
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
      setOTP(newOTP);
      return
    }

    if (isValidNumberOnlyFieldWithZero(text)) {
      return
    }

    if (newOTP[index] == null || newOTP[index].length == 0) {
      newOTP[index] = text
      setOTP(newOTP);
      if (index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
    else {
      if (index < 5 && (newOTP[index + 1] == null || newOTP[index + 1].length == 0)) {
        newOTP[index + 1] = text
        inputsRef.current[index + 1].focus();
      }
      setOTP(newOTP);
    }

  };

  useEffect(()=>{

    if(OTP && OTP.join("").length == 6){
      submitOtp();
    }
  },[OTP])


  // Add onFocus and onBlur handlers
  const handleFocus = (index) => {
    setFocusedInput(index);
  };

  const handleBlur = () => {
    setFocusedInput(null); // Remove focus when input is blurred
  };

  const submitPhoneNumber = () => {

    setLoading(true)

    GetOTPByPhoneNumber(requestModel).then(response => {
      console.log(response)

      setLoading(false)

      setNewErrorScreen(null)

      if (response.status == STATUS.ERROR) {
        // setError(response.message)
        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message)
          return
        }

        console.log("Failed OTP Sended Successfully")
        return
      }




      if (response.data.length > 0 && response.data[0].otp_generated) {
        console.log("OTP Sended Successfully")
      }
      // Reset the OTP array to clear the inputs
      setOTP(new Array(6).fill(''));
      // Reset the timer
      setTimeLeft(45);
      // Clear any existing error messages
      setError('');
      // Reset focus to the first input for user convenience
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus();
      }


    })

  }

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

  

  const handleVerifyPress = () => {
    navigation.navigate("ChoiceScreen")

    // let otpVerification = isValidOtp(OTP)

    // setError(otpVerification)
    // if (otpVerification != null) {
    //   return
    // }
    // submitOtp()
  };


  
  const HandleMoveToNextPage = async () => {
    let response = API_RESPONSE_STATUS()
    let otpModel = GetVerifyLoginOtpRequestModel()
    otpModel.OTP = OTP.join("");;
    otpModel.mobileNo = route.params.mobileNumber
    let verificationResponse = await VerifyLoginOTP(otpModel)
    if (verificationResponse.status == STATUS.ERROR) {
      response.status = STATUS.ERROR
      response.message = verificationResponse.message
      return response
    }
    console.log("OTP Verified")

    await StoreBorrowerPhoneNumber(requestModel.LeadPhone)


    let createLeadResponse = await CreateBorrowerLead({ LeadPhone: requestModel.LeadPhone })
   

    console.log("Browwer Lead Created")
    console.log(createLeadResponse)

    await StoreLeadId(createLeadResponse.data.LeadId)

    let createLeadProductModel = CreateSetLeadProductModel()
    createLeadProductModel.LeadId = await GetLeadId()
    let setLeadProductResponse = await SetLeadProduct(createLeadProductModel)
   
    response.status = STATUS.SUCCESS
    response.data = 0
    return response

  }


  const submitOtp = () => {

    setLoading(true)
    HandleMoveToNextPage().then(response => {
      console.log(response)
      setLoading(false)
      setNewErrorScreen(null)

      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || (response.message != null && response.message != "OTP Mismatch.")) {
          setNewErrorScreen(response.message)
          return
        }

        setError(response.message)
        
        return

      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0, // The index of the active route
          routes: [
            { name: 'MsmeLoan' }, // Name of the screen you want to navigate to
          ],
        })
      );
    })

  }




  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };

  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.1);
  }, []);

  
  const steps = [
    { id: 1, title: 'Primary Information', subtitle: 'प्राथमिक जानकारी', icon: CheckCircle2, status: 'current' },
    { id: 2, title: 'Personal Information', subtitle: 'व्यक्तिगत जानकारी', icon: MapPin, status: 'disabled' },
    { id: 3, title: 'eKYC OTP Verification', subtitle: 'ईकेवाईसी ओटीपी सत्यापन', icon: Lock, status: 'disabled' },
    { id: 4, title: 'Address Details', subtitle: 'पते का विवरण', icon: Building2, status: 'disabled' },
  ];


  return (
    <View style={{ flex: 1 }}>
      <Layout>
        <View style={styles.mainContainer}>
          <View style={{ flex: 1, flexDirection: isWeb ? "row" : "column" }}>
            {isWeb && (isDesktop || (isTablet && width > height)) && (
              <View style={[styles.leftContainer, imageContainerStyle]}>
                <View style={styles.mincontainer}>
                  <View style={styles.webheader}>
                    <Text style={styles.websubtitleText}>Get Your</Text>
                    <Text style={styles.WebheaderText}>Loan Approved</Text>
                  </View>
                  <View>
                    {steps.map((step, index) => (
                      <View key={step.id} style={styles.step}>
                        <View
                          style={[
                            styles.stepiconContainer,
                            step.status === "done" &&
                              styles.stepiconContainerDone,
                            step.status === "current" &&
                              styles.stepiconContainerCurrent,
                            step.status === "disabled" &&
                              styles.stepiconContainerDisabled,
                          ]}>
                          <step.icon
                            size={24}
                            color={
                              step.status === "disabled" ? "#A0AEC0" : "#FFFFFF"
                            }
                          />
                        </View>
                        <View style={styles.steptextContainer}>
                          <Text
                            style={[
                              styles.steptitle,
                              step.status === "disabled" &&
                                styles.steptextDisabled,
                            ]}>
                            {step.title}
                          </Text>
                          <Text
                            style={[
                              styles.stepsubtitle,
                              step.status === "disabled" &&
                                styles.steptextDisabled,
                            ]}>
                            {step.subtitle}
                          </Text>
                        </View>
                        {index < steps.length - 1 && (
                          <View style={styles.connectorContainer}>
                            {[...Array(10)].map((_, i) => (
                              <View
                                key={i}
                                style={[
                                  styles.dashItem,
                                  step.status === "done" && styles.dashItemDone,
                                ]}
                              />
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                  <View style={styles.bottomFixed}>
                    <Image
                      source={require("../../assets/images/poweredby.png")}
                      style={styles.logo}
                    />
                  </View>
                </View>
              </View>
            )}

            <KeyboardAvoidingView
              style={[styles.rightCOntainer, { flex: 1 }]}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
              <LoadingOverlay visible={loading} />

              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.centerAlignedContainer}>
                  <View style={styles.container}>
                    <View>
                      <ProgressBar progress={0.1} />
                      <Text
                        style={[
                          styles.headerText,
                          {
                            fontSize: dynamicFontSize(
                              styles.headerText.fontSize
                            ),
                          },
                        ]}>
                        Mobile OTP Verification
                      </Text>
                      <Text
                        style={[
                          styles.subText,
                          {
                            fontSize: dynamicFontSize(styles.subText.fontSize),
                          },
                        ]}>
                        Please enter the OTP sent to your mobile number
                      </Text>
                      <View style={styles.flexContent}>
                        <Text
                          style={[
                            styles.phoneNumber,
                            {
                              fontSize: dynamicFontSize(
                                styles.phoneNumber.fontSize
                              ),
                            },
                          ]}>
                          {" "}
                          {`+91 ${requestModel.LeadPhone}`}
                        </Text>
                      </View>
                      <View style={styles.otpContainer}>
                        {OTP.map((value, index) => (
                          <TextInput
                            key={index}
                            style={[
                              styles.otpInput,
                              {
                                fontSize: dynamicFontSize(
                                  styles.otpInput.fontSize
                                ),
                              },
                              focusedInput === index && styles.focusedInput, // Conditional style for focused input
                            ]}
                            value={value}
                            // onChangeText={(text) => handleOTPChange(text, index)}
                            onFocus={() => handleFocus(index)}
                            onBlur={handleBlur}
                            maxLength={1}
                            onKeyPress={({ nativeEvent: { key } }) => {
                              handleOTPChange(key, index);
                            }}
                            keyboardType="numeric"
                            ref={(el) => (inputsRef.current[index] = el)}
                          />
                        ))}
                      </View>
                      {error ? (
                        <Text
                          style={[
                            styles.errorText,
                            {
                              fontSize: dynamicFontSize(
                                styles.errorText.fontSize
                              ),
                            },
                          ]}>
                          {error}
                        </Text>
                      ) : null}

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}>
                        <TouchableOpacity
                          style={[
                            styles.resendButton,
                            !isResendEnabled && styles.resendButtonDisabled,
                          ]}
                          onPress={submitPhoneNumber}
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
                            RESEND OTP
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={[
                            styles.timer,
                            {
                              fontSize: dynamicFontSize(styles.timer.fontSize),
                            },
                          ]}>
                          {formatTimeLeft()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {errorScreen.type != null && (
                <ScreenError
                  errorObject={errorScreen}
                  onTryAgainClick={onTryAgainClick}
                  setNewErrorScreen={setNewErrorScreen}
                />
              )}
              
                <View style={[styles.boxShadow]}>
                <View style={styles.centerAlignedContainer}>
                  <View style={[styles.actionContainer]}>
                 
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => GoBack(navigation)}>
                      <Text
                        style={[
                          styles.backBtnText,
                          {
                            fontSize: dynamicFontSize(
                              styles.backBtnText.fontSize
                            ),
                          },
                        ]}>
                        BACK
                      </Text>
                    </TouchableOpacity>
                    <LinearGradient
                      // button Linear Gradient
                      colors={["#2B478B", "#2B478B"]}
                      style={styles.verifyButton}>
                      <TouchableOpacity onPress={handleVerifyPress}>
                        <Text
                          style={[
                            styles.buttonText,
                            {
                              fontSize: dynamicFontSize(
                                styles.buttonText.fontSize
                              ),
                            },
                          ]}>
                          VERIFY
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Layout>
    </View>
  );
};

export default OTPVerificationScreen;
