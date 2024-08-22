import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { styles } from '../services/style/gloablStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import VerifyLoginOTP, { GetVerifyLoginOtpRequestModel } from '../services/API/VerifyLoginOtp';
import GetOTPByPhoneNumber, { GetLoginTopByPhoneRequestModel } from '../services/API/GetLoginOtpByPhone';
import CreateBorrowerLead from '../services/API/CreateBorrowerLead';
import SetLeadProduct, { CreateSetLeadProductModel } from '../services/API/SetLeadProduct';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import { GetLeadId, StoreApplicantId, StoreBorrowerPhoneNumber, StoreLeadId } from '../services/LOCAL/AsyncStroage';
import { isValidNumberOnlyFieldWithZero, isValidOtp } from '../services/Utils/FieldVerifier';
import LoadingOverlay from '../components/FullScreenLoader';
import { GoBack, resetNavigationStack } from '../services/Utils/ViewValidator';
import GetLookUp from '../services/API/GetLookUp';
import { useDispatch, useSelector } from 'react-redux';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import ScreenError, { useErrorEffect } from './ScreenError';
import { Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';
import { updateBreStatus } from '../services/Utils/Redux/ExtraSlices';
import { GetBreEligibility } from '../services/API/LoanEligibility';
import {
  getHash,
  removeListener,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';
import { checkSMSPermission } from './PermissionScreen';
import { useProgressBar } from "../components/progressContext";
import ProgressBar from "../components/progressBar";


const OTPVerificationScreen = ({ navigation, route }) => {
  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.01);
  }, []);

  const dispatch = useDispatch()
  const { fontSize } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [OTP, setOTP] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const [focusedInput, setFocusedInput] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45); // 2 minutes in seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const dynamicFontSize = (size) => size + fontSize;
  const isOTPValid = OTP.join('').length === 6;

  const [requestModel, setRequestModel] = useState(GetLoginTopByPhoneRequestModel())
  const [responseModel, setResponseModel] = useState(null)
  const [isOTPInvalid, setIsOTPInvalid] = useState(false);

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
    // checkSMSPermission()
  }, [])

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, OTP.length);
  }, [OTP]);

  const handleOTPChange = (text, index) => {
    setIsOTPInvalid(false); // Reset invalid state
    setError(''); // Clear error message
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
    let otpVerification = isValidOtp(OTP);
  
    if (otpVerification != null) {
      setError(otpVerification);
      setIsOTPInvalid(true);
      return;
    }
    setIsOTPInvalid(false);
    submitOtp();
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


    let userAvailable = await GetLookUp()

    console.log("------------------------- get look up response ---------------------------")
    console.log(userAvailable)
    console.log("------------------------- get look up response ---------------------------")

    if (userAvailable.data != null && userAvailable.data.IsLeadExisted) {

      response.status = STATUS.ERROR
      response.message = null
      response.data = 0




      if (userAvailable.data.LeadStage != null) {
        const jumpTo = parseInt(userAvailable.data.LeadStage) || 0
        response.data = jumpTo
      }


      dispatch(updateJumpTo(response.data))



      if (userAvailable.data.leadID != null) {
        await StoreLeadId(userAvailable.data.leadID)
      }
      if (userAvailable.data.ApplicationID != null) {
        await StoreApplicantId(userAvailable.data.ApplicationID)
      }

      dispatch(updateBreStatus(userAvailable.data.IsBREcompleted))

      return response
    }





    let createLeadResponse = await CreateBorrowerLead({ LeadPhone: requestModel.LeadPhone })
    if (createLeadResponse.status == STATUS.ERROR) {
      response.status = STATUS.ERROR
      response.message = createLeadResponse.message
      return response
    }

    console.log("Browwer Lead Created")
    console.log(createLeadResponse)

    await StoreLeadId(createLeadResponse.data.LeadId)

    let createLeadProductModel = CreateSetLeadProductModel()
    createLeadProductModel.LeadId = await GetLeadId()
    let setLeadProductResponse = await SetLeadProduct(createLeadProductModel)
    if (setLeadProductResponse.status == STATUS.ERROR) {
      response.status = STATUS.ERROR
      response.message = setLeadProductResponse.message
      return response
    }
    response.status = STATUS.SUCCESS
    response.data = 0
    return response

  }


  const submitOtp = () => {
    setLoading(true);
    HandleMoveToNextPage().then(response => {
      console.log(response);
      setLoading(false);
      setNewErrorScreen(null);
  
      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || (response.message != null && response.message != "OTP Mismatch.")) {
          setNewErrorScreen(response.message)
          return
        }

        setError(response.message)
        if (response.data != null) {

          resetNavigationStack(navigation, response.data)

        }
        return

      }

      navigation.navigate("QLA")
      setResponseModel(response)
    })

  }



  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };


  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>

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
          <LoadingOverlay visible={loading} />

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View style={{paddingTop:16}}>
              <ProgressBar progress={0.01} />
                <Text
                  style={[
                    styles.headerText,
                    { fontSize: dynamicFontSize(styles.headerText.fontSize) },
                  ]}>
                  Mobile OTP Verification
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
                    {" "}
                    {`+91${requestModel.LeadPhone}`}
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
                        { fontSize: dynamicFontSize(styles.otpInput.fontSize) },
                        focusedInput === index && styles.focusedInput,
                        isOTPInvalid && styles.invalidOtpInput,
                      ]}
                      value={value}
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
                      { fontSize: dynamicFontSize(styles.errorText.fontSize) },
                    ]}>
                    {error}
                  </Text>
                ) : null}

                <View style={styles.flex}>
                  <Text
                    style={[
                      styles.resendText,
                      { fontSize: dynamicFontSize(styles.resendText.fontSize) },
                    ]}>
                    Did not receive the OTP?
                  </Text>
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
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.proceedButtonContainer}>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => GoBack(navigation)}>
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
                  colors={
                    isOTPValid ? ["#002777", "#00194C"] : ["#E9EEFF", "#D8E2FF"]
                  }
                  style={[
                    styles.verifyButton,
                    !isOTPValid && styles.disabledButton,
                  ]}>
                  <TouchableOpacity
                    onPress={handleVerifyPress}
                    disabled={!isOTPValid}>
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          fontSize: dynamicFontSize(styles.buttonText.fontSize),
                        },
                        !isOTPValid && styles.disabledButtonText,
                      ]}>
                      {isOTPValid ? "PROCEED" : "VERIFY"}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
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
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default OTPVerificationScreen;
