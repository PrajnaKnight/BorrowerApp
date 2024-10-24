import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, TextInput, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { styles } from '../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import LoadingOverlay from '../components/FullScreenLoader';
import SaveBankAccountDetails, { SubmitBorrowerLoanApplicationAsyncSubmit, GetBranchNameWithIFSC } from '../services/API/SaveBankAccountDetail';  
import { GetApplicantId, GetLoanAskAmmount, StoreApplicantId } from '../services/LOCAL/AsyncStroage';
import { formateAmmountValue, isValidNumberOnlyField, properAmmount } from '../services/Utils/FieldVerifier';

import { useFocusEffect, useRoute } from "@react-navigation/native"
import { GoBack } from '../services/Utils/ViewValidator';
import GetQuickEligibilityDetailInfo, { GetBreEligibility, SendSaveBREEligibilityInfo } from '../services/API/LoanEligibility';
import { API_RESPONSE_STATUS, STATUS, SaveBREEligibility } from '../services/API/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';

import ScreenError, { useErrorEffect } from './ScreenError';
import CustomSlider from '../components/CustomSlider';
import { checkLocationPermission } from './PermissionScreen';
import { updateBreStatus } from '../services/Utils/Redux/ExtraSlices';

const LoanEligibilityScreen = ({ navigation }) => {

  const route = useRoute()
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const loanAskDetails = useSelector(state => state.loanAskSlice);

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false);
  const [otherError, setOtherError] = useState(null)
  const [isEligible, setIsEligible] = useState(true)

  const [loanAmount, setLoanAmount] = useState(0);
  const [emiAmount, setEmiAmount] = useState(0);
  const [loanAskAmount, setLoanAskAmount] = useState(null)

  // Convert loan amount to string and remove decimals if any

  const [minTenure, setMinTenure] = useState(0)
  const [maxTenure, setMaxTenure] = useState(0)

  const [tenure, setTenure] = useState(0);

  const [minLoanAmount, setMinLoanAmount] = useState(0)
  const [maxLoanAmount, setMaxLoanAmount] = useState(0)

  const [rateOfInterest, setRateOfInterest] = useState(0);

  const { setProgress } = useProgressBar();

  const [loanCriteria, setLoanCriteria] = useState()

  const [tenureError, setTenureError] = useState(null)
  const [loanAmountError, setLoanAmountError] = useState(null)


  const [loanApproved, setLoanApproved] = useState(null)

  const [ApplicationID, setApplicationID] = useState(null)

  const [refreshPage, setRefreshPage] = useState(true)
  const onTryAgainClick = () => {
    setRefreshPage(true)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)


  useEffect(() => {
    setProgress(0.3);
  }, []);


  const ProcessTheLoanApplication = async () => {
    let apiResponse = API_RESPONSE_STATUS()
    let submitBorrowerLoan = await SubmitBorrowerLoanApplicationAsyncSubmit()



    if (submitBorrowerLoan.status == STATUS.ERROR) {
      apiResponse.status = STATUS.ERROR
      apiResponse.message = submitBorrowerLoan.message
      return apiResponse
    }



    
    let getBreEligibility = await GetBreEligibility()

    console.log("=============================== Get Bre Eligibility =============================")
    console.log(getBreEligibility)
    console.log("=============================== Get Bre Eligibility =============================")

    if (getBreEligibility.status == STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR
        apiResponse.message = getBreEligibility.message
        return apiResponse
    }


    apiResponse.data = { BreElligibility: getBreEligibility.data }

    let BREPolicyResponseWillShowLoanAmountAndTenure = true

    if(!apiResponse.data.BreElligibility?.MPBFLimit){
      let loanEligibility = await GetQuickEligibilityDetailInfo()
      console.log("=============================== Loan Eligibility =============================")
      console.log(loanEligibility)
      console.log("=============================== Loan Eligibility =============================")
  
      if (loanEligibility.status == STATUS.ERROR) {
       
        apiResponse.status = STATUS.ERROR
        apiResponse.message = loanEligibility.message
        return apiResponse
      }
      BREPolicyResponseWillShowLoanAmountAndTenure = false
      apiResponse.data = { ...apiResponse.data, BREPolicyResponse: loanEligibility.data.BREPolicyResponse[0] }
    }
    else{

      let MPBFLimit = JSON.parse(apiResponse.data.BreElligibility?.MPBFLimit);
      
      apiResponse.data = {...apiResponse.data, BREPolicyResponse: MPBFLimit[0][0] }
    }

    const BREPolicyResponse = apiResponse.data.BREPolicyResponse
    
    const BreElligibility = apiResponse.data.BreElligibility

    setLoanAskAmount(BreElligibility?.LoanAskAmount)
    setRateOfInterest(BreElligibility?.InterestRate|| BREPolicyResponse?.ROI || 0)

    if(!BREPolicyResponseWillShowLoanAmountAndTenure){
      setTenure(BREPolicyResponse?.MaxTenure || 0)
      setLoanAmount(BREPolicyResponse?.MPBFRangeMinMaxData[Object.keys(BREPolicyResponse?.MPBFRangeMinMaxData)[Object.keys(BREPolicyResponse?.MPBFRangeMinMaxData).length - 1]] || 0)
    }
    else{
      setTenure(BreElligibility?.Tenure || BREPolicyResponse?.MaxTenure || 0)
      setLoanAmount(BreElligibility?.LoanAmount || BREPolicyResponse?.MPBFRangeMinMaxData[Object.keys(BREPolicyResponse?.MPBFRangeMinMaxData)[Object.keys(BREPolicyResponse?.MPBFRangeMinMaxData).length - 1]] || 0)
    }

    const maxEmi = BREPolicyResponse?.EMIRangeMinMaxData[Object.keys(BREPolicyResponse?.EMIRangeMinMaxData)[Object.keys(BREPolicyResponse?.EMIRangeMinMaxData).length - 1]] || 0
    setEmiAmount(BreElligibility?.EMIAmount || maxEmi)

    setMinTenure(BREPolicyResponse?.MinTenure || 0)
    setMaxTenure(BREPolicyResponse?.MaxTenure || 0)

    setMaxLoanAmount(BREPolicyResponse?.MPBFRangeMinMaxData[Object.keys(BREPolicyResponse?.MPBFRangeMinMaxData)[Object.keys(BREPolicyResponse?.MPBFRangeMinMaxData).length - 1]] || 0)
    setMinLoanAmount(BREPolicyResponse?.LoanAmountMin || 0)

    setLoanCriteria(BREPolicyResponse?.MPBFRangeMinMaxData)
      
    setLoanApproved(true)

    console.log("============ Application ID CREATE ================" + await GetApplicantId())

   
    setApplicationID(await GetApplicantId())

    dispatch(updateBreStatus(true))
    apiResponse.status = STATUS.SUCCESS

    return apiResponse

  }

  useFocusEffect(
    useCallback(() => {
    if (!refreshPage) {
      return
    }
    setLoading(true)

    ProcessTheLoanApplication().then((response) => {
      setNewErrorScreen(null)

      setLoading(false)

      if (response.status == STATUS.ERROR) {
        if (response.message == "NOT ELIGIBLE") {
          setLoanApproved(false)
          navigation.replace("rejection")
        }
        else if (response.message != Network_Error && response.message != null) {
          setNewErrorScreen(response.message)
        }
        else {
          setOtherError(response.message)
        }

        return
      }

     
    })

    setRefreshPage(false)










    // const BREPolicyResponse = {
    //   "PolicyId": 2874,
    //   "ROI": 16,
    //   "MinTenure": 10,
    //   "MaxTenure": 100,
    //   "IsPassed": "Yes",
    //   "LoanAmountMin": 5000,
    //   "LoanAmountMax": 100000,
    //   "MPBFRangeMinMaxData": {
    //     "10": 930414,
    //     "11": 1016856,
    //     "12": 1102161,
    //     "13": 1186343,
    //     "14": 1269417,
    //     "15": 1351399,
    //     "16": 1432301,
    //     "17": 1512140,
    //     "18": 1590927,
    //     "19": 1668678,
    //     "20": 1745406,
    //     "21": 1821124,
    //     "22": 1895846,
    //     "23": 1969585,
    //     "24": 2042354,
    //     "25": 2114165,
    //     "26": 2185031,
    //     "27": 2254965,
    //     "28": 2323979,
    //     "29": 2392084,
    //     "30": 2459294,
    //     "31": 2525619,
    //     "32": 2591071,
    //     "33": 2655662,
    //     "34": 2719404,
    //     "35": 2782306,
    //     "36": 2844381,
    //     "37": 2905639,
    //     "38": 2966091,
    //     "39": 3025748,
    //     "40": 3084620,
    //     "41": 3142717,
    //     "42": 3200050,
    //     "43": 3256628,
    //     "44": 3312462,
    //     "45": 3367561,
    //     "46": 3421935,
    //     "47": 3475594,
    //     "48": 3528547,
    //     "49": 3580803,
    //     "50": 3632371,
    //     "51": 3683261,
    //     "52": 3733481,
    //     "53": 3783040,
    //     "54": 3831948,
    //     "55": 3880212,
    //     "56": 3927840,
    //     "57": 3974843,
    //     "58": 4021226,
    //     "59": 4067000,
    //     "60": 4112171,
    //     "61": 4156747,
    //     "62": 4200737,
    //     "63": 4244149,
    //     "64": 4286989,
    //     "65": 4329265,
    //     "66": 4370986,
    //     "67": 4412157,
    //     "68": 4452786,
    //     "69": 4492881,
    //     "70": 4532449,
    //     "71": 4571495,
    //     "72": 4610028,
    //     "73": 4648054,
    //     "74": 4685580,
    //     "75": 4722612,
    //     "76": 4759156,
    //     "77": 4795220,
    //     "78": 4830809,
    //     "79": 4865930,
    //     "80": 4900589,
    //     "81": 4934792,
    //     "82": 4968545,
    //     "83": 5001853,
    //     "84": 5034724,
    //     "85": 5067161,
    //     "86": 5099172,
    //     "87": 5130762,
    //     "88": 5161936,
    //     "89": 5192700,
    //     "90": 5223060,
    //     "91": 5253019,
    //     "92": 5282585,
    //     "93": 5311761,
    //     "94": 5340554,
    //     "95": 5368968,
    //     "96": 5397008,
    //     "97": 5424679,
    //     "98": 5451985,
    //     "99": 5478933,
    //     "100": 5505526
    //   },
    //   "EMIRangeMinMaxData": {
    //     "10": 100000,
    //     "11": 100000,
    //     "12": 100000,
    //     "13": 100000,
    //     "14": 100000,
    //     "15": 100000,
    //     "16": 100000,
    //     "17": 100000,
    //     "18": 100000,
    //     "19": 100000,
    //     "20": 100000,
    //     "21": 100000,
    //     "22": 100000,
    //     "23": 100000,
    //     "24": 100000,
    //     "25": 100000,
    //     "26": 100000,
    //     "27": 100000,
    //     "28": 100000,
    //     "29": 100000,
    //     "30": 100000,
    //     "31": 100000,
    //     "32": 100000,
    //     "33": 100000,
    //     "34": 100000,
    //     "35": 100000,
    //     "36": 100000,
    //     "37": 100000,
    //     "38": 100000,
    //     "39": 100000,
    //     "40": 100000,
    //     "41": 100000,
    //     "42": 100000,
    //     "43": 100000,
    //     "44": 100000,
    //     "45": 100000,
    //     "46": 100000,
    //     "47": 100000,
    //     "48": 100000,
    //     "49": 100000,
    //     "50": 100000,
    //     "51": 100000,
    //     "52": 100000,
    //     "53": 100000,
    //     "54": 100000,
    //     "55": 100000,
    //     "56": 100000,
    //     "57": 100000,
    //     "58": 100000,
    //     "59": 100000,
    //     "60": 100000,
    //     "61": 100000,
    //     "62": 100000,
    //     "63": 100000,
    //     "64": 100000,
    //     "65": 100000,
    //     "66": 100000,
    //     "67": 100000,
    //     "68": 100000,
    //     "69": 100000,
    //     "70": 100000,
    //     "71": 100000,
    //     "72": 100000,
    //     "73": 100000,
    //     "74": 100000,
    //     "75": 100000,
    //     "76": 100000,
    //     "77": 100000,
    //     "78": 100000,
    //     "79": 100000,
    //     "80": 100000,
    //     "81": 100000,
    //     "82": 100000,
    //     "83": 100000,
    //     "84": 100000,
    //     "85": 100000,
    //     "86": 100000,
    //     "87": 100000,
    //     "88": 100000,
    //     "89": 100000,
    //     "90": 100000,
    //     "91": 100000,
    //     "92": 100000,
    //     "93": 100000,
    //     "94": 100000,
    //     "95": 100000,
    //     "96": 100000,
    //     "97": 100000,
    //     "98": 100000,
    //     "99": 100000,
    //     "100": 100000
    //   }
    // }
    // setRateOfInterest(BREPolicyResponse.ROI || 0)
    // setMinTenure(BREPolicyResponse.MinTenure || 0)
    // setMaxTenure(BREPolicyResponse.MaxTenure || 0)
    // setMaxLoanAmount(BREPolicyResponse.MPBFRangeMinMaxData[Object.keys(BREPolicyResponse.MPBFRangeMinMaxData)[Object.keys(BREPolicyResponse.MPBFRangeMinMaxData).length - 1]] || 0)
    // setMinLoanAmount(BREPolicyResponse.LoanAmountMin || 0)
    // setLoanCriteria(BREPolicyResponse.MPBFRangeMinMaxData)

    // const maxEmi = BREPolicyResponse.EMIRangeMinMaxData[Object.keys(BREPolicyResponse.EMIRangeMinMaxData)[Object.keys(BREPolicyResponse.EMIRangeMinMaxData).length - 1]] || 0
    // setEmiAmount(maxEmi)

    // setTenure(BREPolicyResponse.MaxTenure || 0)
    // setLoanAmount(BREPolicyResponse.MPBFRangeMinMaxData[Object.keys(BREPolicyResponse.MPBFRangeMinMaxData)[Object.keys(BREPolicyResponse.MPBFRangeMinMaxData).length - 1]] || 0)
    // setLoanApproved(true)





  }, [refreshPage]))

  const handleLoanAmountChange = (value, from) => {
    console.log("trying to chnage loan Ammount ", value)

    let finalValue = parseInt(properAmmount(value)) || 0
    if (from != null) {
      if (finalValue > maxLoanAmount) {
        finalValue = maxLoanAmount
      }
      else if (finalValue < minLoanAmount) {
        finalValue = minLoanAmount
      }
    }


    setLoanAmount(finalValue);

    setLoanAmountError(null)
  };




  const handleTenureChange = (value, from) => {

    let finalValue = parseInt(value) || 0

    if (from != null) {
      if (finalValue > maxTenure) {
        finalValue = maxTenure
      }
      else if (finalValue < minTenure) {
        finalValue = minTenure
      }
    }

    setTenure(finalValue);

    setTenureError(null)

  };


  // Function to calculate EMI based on loan amount, tenure, and rate of interest
  // This is a simplified formula and might need adjustment based on your specific calculation method
  const calculateEMI = () => {

    console.log("====== calculate emi ======")
    console.log("rate of interest = " + rateOfInterest)
    console.log("tenure = " + tenure)
    console.log("loanAmount = " + loanAmount)


    let monthlyInterestRatio = rateOfInterest / 100 / 12;
    let top = Math.pow((1 + monthlyInterestRatio), tenure);
    let bottom = top - 1;
    let sp = top / bottom;
    let emi = ((loanAmount * monthlyInterestRatio) * sp);

    let finalEmi = Math.round(emi)
    setEmiAmount(finalEmi);
  };

  // Update state and recalculate EMI whenever the loan amount or tenure changes
  useEffect(() => {

    setOtherError(null)

    if (loanCriteria == null) {
      return
    }

    if (loanAmount > loanCriteria[`${tenure}`]) {
      setIsEligible(false)
      return
    }
    setIsEligible(true)

    calculateEMI();

  }, [loanAmount, tenure]);

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const handleProceed = async() => {

    let askLoanAmountValidity = isValidNumberOnlyField(loanAmount, "Loan Amount")
    setLoanAmountError(askLoanAmountValidity)
    if (askLoanAmountValidity != null) {
      return
    }

    if (loanAmount < minLoanAmount || loanAmount > maxLoanAmount) {
      setLoanAmountError("Please provide valid loan amount in given range")
      return
    }


    let askTenureValidity = isValidNumberOnlyField(tenure, "Tenure")
    setTenureError(askTenureValidity)
    if (askTenureValidity != null) {
      return
    }

    if (tenure < minTenure || tenure > maxTenure) {
      setTenureError("Please provide valid tenure in given range")
      return
    }


    if (loanCriteria == null || loanCriteria[`${tenure}`] == null) {
      setOtherError("Something went wrong")
      return
    }


    if (loanAmount > loanCriteria[`${tenure}`]) {
      setIsEligible(false)
      return
    }


    setIsEligible(true)


    if(await checkLocationPermission() == false){
      navigation.navigate("PermissionsScreen", {permissionStatus : "denied", permissionType : "location"})
      return
    }

    let LeadStage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "loanEligibility") {
      LeadStage = nextJumpTo + 1
    }


    let reponseModel = { Tenure: tenure, RateOfInterest: rateOfInterest, Amount: loanAmount, EMI: emiAmount, Leadstage: LeadStage }
    setLoading(true)
    SendSaveBREEligibilityInfo(reponseModel).then((response) => {
      setLoading(false)

      setNewErrorScreen(null)

      if (response.status == STATUS.ERROR) {

        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message)
          return
        }
        setOtherError(response.message)
        return
      }

      if (ALL_SCREEN[nextJumpTo] == "loanEligibility") {
        dispatch(updateJumpTo(LeadStage))
      }

      navigation.navigate('sanctionLetter')

    })


  }



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
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <LoadingOverlay visible={loading} />

          <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
            <View style={styles.container}>
              <View>
                <ProgressBar progress={0.3} />

                <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>Loan Eligibility</Text>
                {otherError && (
                  <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{otherError}</Text>
                )}

                <View style={styles.marginBtm}>

                  {loanApproved != null && loanApproved == true &&
                    <View style={{ flexDirection: "column" }}>
                      <Text style={[styles.description, { fontSize: dynamicFontSize(styles.description.fontSize) }]}>
                        Hurray, your requested loan amount of
                      </Text>


                      <Text style={[styles.descriptionAmt, { fontSize: dynamicFontSize(styles.descriptionAmt.fontSize) }]}>{loanAskAmount != null && `Rs. ${loanAskAmount.toLocaleString()} is approved.`}  </Text>

                      <Text style={[styles.description, { fontSize: dynamicFontSize(styles.description.fontSize) }]}>
                        You're also eligible for a higher loan value. Please use the slider below to select loan amount. To proceed, kindly confirm and provide the necessary documents and sign the loan agreement and eMandate.
                      </Text>
                    </View>
                  }



                </View>

                <Text style={[styles.loanId, { fontSize: dynamicFontSize(styles.loanId.fontSize) }]}>Loan ID: {ApplicationID}</Text>

                {/* Loan Amount Slider */}

                <CustomSlider
                  title="Loan Amount"
                  icon="rupee"
                  keyboardType='numeric'
                  min={minLoanAmount}
                  max={maxLoanAmount}
                  steps={10000}
                  sliderValue={properAmmount(loanAmount)}
                  inputValue={formateAmmountValue(loanAmount.toString())}
                  error={loanAmountError}
                  onChange={(e, from) => handleLoanAmountChange(e, from)}
                  isForAmount={true}

                />
                {/* <View style={styles.sliderContainer}>
                  <View style={styles.LabelInput}>
                    <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Loan Amount</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Icon name="rupee" size={16} color="#00194c" style={{ marginHorizontal: 10 }} />
                      <TextInput
                        style={[styles.Input, { fontSize: dynamicFontSize(styles.Input.fontSize) }]}
                        onChangeText={(e) => handleLoanAmountChange(e)}
                        value={formateAmmountValue(loanAmount.toString())}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <Slider
                    style={styles.slider}
                    minimumValue={minLoanAmount}
                    maximumValue={maxLoanAmount}
                    step={10000}
                    onValueChange={(e) => handleLoanAmountChange(e, "fromSlider")}
                    value={properAmmount(loanAmount)}
                    minimumTrackTintColor="#0010AC"
                    maximumTrackTintColor="#758BFD"
                    thumbTintColor="#F38F00"
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>{minLoanAmount}</Text>
                    <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>₹ {maxLoanAmount}</Text>
                  </View>
                  {loanAmountError && (
                    <Text style={[styles.errorText, { paddingHorizontal: 15 }]}>{loanAmountError}</Text>
                  )}
                </View> */}

                {/* Tenure Slider */}

                <CustomSlider
                  title="Tenure"
                  icon="calendar"
                  keyboardType='numeric'
                  min={minTenure}
                  max={maxTenure}
                  steps={3}
                  sliderValue={tenure}
                  inputValue={tenure.toString()}
                  error={tenureError}
                  onChange={(e, from) => handleTenureChange(e, from)}

                />
                {/* <View style={styles.sliderContainer}>
                  <View style={styles.LabelInput}>
                    <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Tenure</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Icon name="calendar" size={16} color="#00194c" style={{ marginHorizontal: 10 }} />
                      <TextInput
                        style={[styles.Input, { fontSize: dynamicFontSize(styles.Input.fontSize) }]}
                        onChangeText={(e) => handleTenureChange(e)}
                        value={tenure.toString()}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={minTenure}
                    maximumValue={maxTenure}
                    onValueChange={(e) => handleTenureChange(e, "fromSlider")}
                    value={tenure}
                    step={3}
                    minimumTrackTintColor="#0010AC"
                    maximumTrackTintColor="#758BFD"
                    thumbTintColor="#F38F00"
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>{minTenure}</Text>
                    <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>{maxTenure} Months</Text>
                  </View>
                  {tenureError && (
                    <Text style={[styles.errorText, { paddingHorizontal: 15 }]}>{tenureError}</Text>
                  )}
                </View> */}


                <View>
                  <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Rate of Interest</Text>
                  <Text style={[styles.input, styles.readonly, { fontSize: dynamicFontSize(styles.input.fontSize) }]}>{rateOfInterest || 0} %</Text>
                </View>

                <View style={styles.emiContainer}>
                  <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>EMI Amount</Text>
                  {!isEligible && (
                    <Text style={styles.errorText}>You are not elegible for selected loan amount</Text>
                  )}

                  <Text style={[styles.input, styles.readonly, { fontSize: dynamicFontSize(styles.input.fontSize) }]}>₹ {emiAmount || 0}</Text>

                </View>

              </View>

              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => GoBack(navigation)}>
                  <Text style={[styles.backBtnText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize) }]}>BACK</Text>
                </TouchableOpacity>
                <LinearGradient
                  // button Linear Gradient
                  colors={['#002777', '#00194C']}
                  style={styles.verifyButton}
                >
                  <TouchableOpacity onPress={() => handleProceed()} >
                    <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>PROCEED</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>

          {errorScreen.type != null && <ScreenError errorObject={errorScreen} onTryAgainClick={onTryAgainClick} setNewErrorScreen={setNewErrorScreen} />}

        </KeyboardAvoidingView>

      </View>
    </View>

  );
};



export default LoanEligibilityScreen;



