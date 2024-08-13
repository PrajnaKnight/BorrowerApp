import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../Common/components/useContext';
import { isValidNumberOnlyFieldWithZero, isValidOtp } from '../services/Utils/FieldVerifier';
import LoadingOverlay from '../components/FullScreenLoader';
import SubmitAadhaarOtpRequest from '../services/API/SubmitAadhaarOtpRequest';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import SendAadhaarOtpRequest from '../services/API/SendAadhaarOtpRequest';
import { GetBorrowerPhoneNumber, GetUserAadhaar } from '../services/LOCAL/AsyncStroage';
import { SaveAadhaarKycResult } from '../services/API/OcrPanRequest';
import CreateBorrowerLead, { CreateBorrowerLeadFromDocuments } from '../services/API/CreateBorrowerLead';
import PostSaveProceedtage from '../services/API/SaveProceedStage';
import { useDispatch, useSelector } from 'react-redux';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { clearAadhaarCkyc, executeAadhaarEkyc, updateAadhaarEkyc, updateAadhaarError, updateAadhaarLoading } from '../services/Utils/Redux/DocumentVerificationSlices';
import { SubmitAddressFromDocuments } from '../services/API/AddressDetails';  
import { da } from 'date-fns/locale';
import { fetchGetBorrowerAddress } from '../services/Utils/Redux/AddressDetailSlices';
import ScreenError, { useErrorEffect } from './ScreenError';
import { checkLocationPermission } from './PermissionScreen';


const EKycVerificationScreen = ({ navigation, route }) => {

  const documentationKycStatus = useSelector(state => state.documentVerificationSlices);
  const AddressDetailSlice = useSelector(state => state.addressDetailSlices);



  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);

  const [OTP, setOTP] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const [aadhaarNumber, setAadhaarNumber] = useState()

  const [transactionId, setTransactionId] = useState()
  const { fontSize } = useAppContext();

  const [sendOtpRequest, setSendOtpRequest] = useState(true)
  const dynamicFontSize = (size) => size + fontSize;


  
  const onTryAgainClick = () => {
    
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)

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


  useEffect(() => {
    setProgress(0.08);
    dispatch(clearAadhaarCkyc())
    dispatch(updateAadhaarError(null))

    GetUserAadhaar().then((response) => {
      setAadhaarNumber(response)
    })

  }, [])



  const Proceeding = async () => {

    const repsonse = API_RESPONSE_STATUS(STATUS.SUCCESS)

    console.log('Dispatch completed successfully');
    console.log("================================== Documentation ========================================")
    console.log("PAN OCR", documentationKycStatus.data.PanOcr)
    console.log("PAN COMPREHENSIVE", documentationKycStatus.data.PanComprehensive)
    console.log("PAN CKYC", documentationKycStatus.data.PanCkyc)
    console.log("AADHAAR OCR", documentationKycStatus.data.AadhaarOcr)
    console.log("AADHAAR EKYC", documentationKycStatus.data.AadhaarEkyc)
    console.log("CIBIL", documentationKycStatus.data.Cibil)
    console.log("================================== Documentation ========================================")

    const requestModel = {
      PanComprehensive: documentationKycStatus.data.PanComprehensive,
      PanOcr: documentationKycStatus.data.PanOcr,
      PanCkyc: documentationKycStatus.data.PanCkyc,
      AadhaarOcr: documentationKycStatus.data.AadhaarOcr,
      AadhaarEkyc: documentationKycStatus.data.AadhaarEkyc,
      Cibil: documentationKycStatus.data.Cibil
    }

    const borrowerLeadResponse = await CreateBorrowerLeadFromDocuments(requestModel)

    let id = 0;
    if(AddressDetailSlice.data != null && AddressDetailSlice.data.length > 0){
      id = AddressDetailSlice.data[0].Id || 0
    }


    const submitAddressResponse = await SubmitAddressFromDocuments(requestModel, id)
    if(submitAddressResponse.status == STATUS.SUCCESS){
      dispatch(fetchGetBorrowerAddress())
    }
   

    let LeadStage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "primaryInfo") {
      LeadStage = nextJumpTo + 1
    }

    const storeTheLead = await PostSaveProceedtage(LeadStage)
    if (storeTheLead.status == STATUS.ERROR) {
      repsonse.status = STATUS.ERROR
      repsonse.message = storeTheLead.message
      return repsonse
    }

    if (ALL_SCREEN[nextJumpTo] == "primaryInfo") {
      dispatch(updateJumpTo(LeadStage))
    }


    return repsonse
  }

  useEffect(() => {
    if (documentationKycStatus.data.AadhaarEkyc == null) {
      return
    }

    setLoading(true)
    Proceeding().then(res => {
      setLoading(false)
      setNewErrorScreen(null)
      if(res.status == STATUS.ERROR){
        if(res.message == Network_Error || res.message != null){
          setNewErrorScreen(res.message)
          return
        }
        setError(res.message)
        return
      }
      navigation.navigate("personalInfo")
    })

  }, [documentationKycStatus.data.AadhaarEkyc])





  useEffect(() => {
    if (!sendOtpRequest || aadhaarNumber == null) {
      return
    }

    SendAadhaarOtpRequest(aadhaarNumber).then((response) => {
      console.log(response)
      setNewErrorScreen(null)
      if (response.status == STATUS.ERROR) {
        if(response.message == Network_Error || response.message != null){
          setNewErrorScreen(response.message)
          return
        }
        setError(response.message)
        return
      }
      setTransactionId(response?.data?.TransactionId)
      console.log(response)
    })

    setSendOtpRequest(false)
  }, [sendOtpRequest, aadhaarNumber])

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = () => {
    // Reset the timer
    setTimeLeft(120);
    setSendOtpRequest(true)

    // Optionally, trigger OTP resend logic here
  };

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, OTP.length);
  }, [OTP]);


  const handleVerifyPress = async () => {
    let otpVerification = isValidOtp(OTP)
    setError(otpVerification)
    if (otpVerification != null) {
      return
    }

    if(await checkLocationPermission() == false){
      navigation.navigate("PermissionsScreen", {permissionStatus : "denied", permissionType : "location"})
      return
    }
    setLoading(true)


    const successResponse = await SubmitAadhaarOtpRequest(aadhaarNumber, OTP.join(""), transactionId);
    setLoading(false)
    setNewErrorScreen(null)

    if (successResponse.status == STATUS.ERROR) {
      
      if(successResponse.message == Network_Error || successResponse.message != null){
        setNewErrorScreen(successResponse.message)
        return
      }
      setError(successResponse.message)
      return
    }

    dispatch(updateAadhaarEkyc(successResponse.data?.ResidentDetails))


  };


  const { setProgress } = useProgressBar();
  const [focusedInput, setFocusedInput] = useState(null);

  const handleFocus = (index) => {
    setFocusedInput(index);
  };

  const handleBlur = () => {
    setFocusedInput(null); // Remove focus when input is blurred
  };

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

      <LoadingOverlay visible={loading} />


      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
        <View style={styles.container}>
          <View>
            <ProgressBar progress={0.08} />
            <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>eKYC OTP Verification</Text>

            <Text style={[styles.subText, { fontSize: dynamicFontSize(styles.subText.fontSize) }]}>Please enter the OTP sent to your Aadhar linked mobile number</Text>


            <View style={styles.flexContentTime}>
              <Text style={[styles.timer, { fontSize: dynamicFontSize(styles.timer.fontSize) }]}>{formatTimeLeft()}</Text>
            </View>
            <View style={styles.otpContainer}>
            {OTP.map((value, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    { fontSize: dynamicFontSize(styles.otpInput.fontSize) },
                    focusedInput === index && styles.focusedInput, // Conditional style for focused input
                  ]}
                  value={value}
                  // onChangeText={(text) => handleOTPChange(text, index)}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  maxLength={1}
                  onKeyPress={({ nativeEvent: { key } }) => {

                    handleOTPChange(key, index)
                    
                  }}
                  keyboardType="numeric"
                  ref={(el) => inputsRef.current[index] = el}
                />
              ))}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.flexContent}>
              <Text style={[styles.resendText, { fontSize: dynamicFontSize(styles.resendText.fontSize) }]}>Please wait to resend OTP</Text>
              <TouchableOpacity
                style={[
                  styles.resendButton,
                  !isResendEnabled && styles.resendButtonDisabled // Apply disabled style conditionally
                ]}
                onPress={handleResendOTP}
                disabled={!isResendEnabled}
              >
                <Text style={[styles.resendButtonText, { fontSize: dynamicFontSize(styles.resendButtonText.fontSize) }]}>RESEND</Text>
              </TouchableOpacity>
            </View>

          </View>

          <LinearGradient
            // button Linear Gradient
            colors={['#002777', '#00194C']}
            style={styles.button}
          >
            <TouchableOpacity onPress={handleVerifyPress}>
              <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>I AGREE</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

      </ScrollView>
      {errorScreen.type != null && <ScreenError errorObject={errorScreen} onTryAgainClick={onTryAgainClick} setNewErrorScreen={setNewErrorScreen} />}

    </KeyboardAvoidingView>
    </View>
    </View>
  );
};



export default EKycVerificationScreen;
