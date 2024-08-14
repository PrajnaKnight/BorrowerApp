import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, useWindowDimensions } from 'react-native';
import CustomDropdown from '../components/dropdownPicker';
import { styles } from '../../assets/style/personalStyle';
import CustomInput, { CustomInputFieldWithSuggestion, DateOfJoiningMaskedCustomInput } from '../components/input';
import DatePickerComponent from '../../Common/components/ControlPanel/datePicker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import MobileNumberInput from '../../Common/components/ControlPanel/mobileInput';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView } from 'react-native';
import { useAppContext } from '../../Common/components/useContext';
import { Platform } from 'react-native';


import SubmitEmploymentDetails, { GetOccupationType, GetEmploymentType, GetCompanyList } from '../services/API/SaveEmploymentDetails';
import { GetCityAndState } from '../services/API/AddressDetails';
import { GetLeadId, GetUserDob } from '../services/LOCAL/AsyncStroage';
import { STATUS } from '../services/API/Constants';
import LoadingOverlay from '../components/FullScreenLoader';
import { GoBack } from '../services/Utils/ViewValidator';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentStage, updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { fetchGetEmploymentDetails, updateEmploymentCategory, updateEmploymentCategoryError, updateEmploymentType, updateEmploymentTypeError, updateSalaried, updateSelfEmployed } from '../services/Utils/Redux/EmploymentDetailSlices';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';
import ScreenError, { useErrorEffect } from './ScreenError';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import CustomSlider from '../../Common/components/ControlPanel/CustomSlider';
import { checkLocationPermission } from './PermissionScreen';
import { useFocusEffect } from '@react-navigation/native';


const EmploymentDetailScreen = ({ navigation }) => {

  const dispatch = useDispatch()

  const extraSlices = useSelector(state => state.extraStageSlice);


  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);

  const EmploymentDetailSlice = useSelector(state => state.employmentDetailSlices);

  const EmploymentType = useSelector(state => state.employmentDetailSlices.data.EmploymentType);

  const EmploymentCategory = useSelector(state => state.employmentDetailSlices.data.EmploymentCategory);

  const EmploymentTypeError = useSelector(state => state.employmentDetailSlices.data.EmploymentTypeError);

  const EmploymentCategoryError = useSelector(state => state.employmentDetailSlices.data.EmploymentCategoryError);

  const Salaried = useSelector(state => state.employmentDetailSlices.data.Salaried);

  const SelfEmployed = useSelector(state => state.employmentDetailSlices.data.SelfEmployed);

  const LeadDOB = useSelector(state => state.employmentDetailSlices.data.LeadDOB);

  const [UserDob, SetUserDob] = useState()


  const [employmentTypeOptions, setEmploymentTypeOptions] = useState([])

  const [ocupationValueOptions, setOcupationValueOptions] = useState([]);

  const [currentSelectedEmploymentOptionId, setCurrentSelectedEmploymentOptionId] = useState()


  const [LeadId, setLeadId] = useState(null)
  const [otherError, setOtherError] = useState(null)

  const [loading, setLoading] = useState(false);

  const [refreshPage, setRefreshPage] = useState(true)
  const onTryAgainClick = () => {
    setRefreshPage(true)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)

  const [salariedCompanySearchResult, setSalariedCompanySearchResult] = useState(null)

  const [selfEmployeedCompanySearchResult, setSelfEmployeedCompanySearchResult] = useState(null)



  useEffect(() => {
    if (EmploymentType == null || employmentTypeOptions == null || employmentTypeOptions.length == 0) {
      return
    }

    console.log(employmentTypeOptions)

    let id = null

    for (let i = 0; i < employmentTypeOptions.length; i++) {
      if (employmentTypeOptions[i].label == EmploymentType) {

        setCurrentSelectedEmploymentOptionId(employmentTypeOptions[i].extra)

        break
      }
    }



  }, [EmploymentType, employmentTypeOptions])


  useEffect(() => {
    setLoading(EmploymentDetailSlice.loading)
  }, [EmploymentDetailSlice.loading])


  useEffect(() => {
    setNewErrorScreen(null)
    if (EmploymentDetailSlice.error == Network_Error || EmploymentDetailSlice.error != null) {
      setNewErrorScreen(EmploymentDetailSlice.error)
    }

  }, [EmploymentDetailSlice.error])


  useFocusEffect(
    useCallback(() => {

    if (!refreshPage) {
      return
    }
    setLoading(true)

    setProgress(0.1);

    dispatch(fetchGetEmploymentDetails())


    GetUserDob().then(response => {
      SetUserDob(response)
    })


    GetLeadId().then(response => {

      setLeadId(response)
    })

    GetEmploymentType().then(response => {

      setLoading(false)

      if (response.status == STATUS.ERROR) {
        setOtherError(response.message)
        return;
      }

      setOtherError(null)

      if (response.data != null) {

        let employmentTypes = []

        response.data.forEach((item) => {

          let isExist = false;
          for (let index = 0; index < employmentTypes.length; index++) {
            isExist = employmentTypes[index].label == item.Text || employmentTypes[index].value == item.Text
            if (isExist) {
              break
            }
          }

          if (!isExist)
            employmentTypes.push({ label: item.Text, value: item.Text, extra: item.Value })
        })

        setEmploymentTypeOptions([...employmentTypes])
      }
    })

    setRefreshPage(false)
  }, [refreshPage]))

  useEffect(() => {
    if (currentSelectedEmploymentOptionId == null) {
      return
    }


    setLoading(true)


    GetOccupationType(currentSelectedEmploymentOptionId).then(response => {
      setLoading(false)

      if (response.status == STATUS.ERROR) {
        setOtherError(response.message)
        return;
      }

      setOtherError(null)

      if (response.data != null) {

        let occupationTypes = []
        let currentEmploymentCategoryExist = false
        response.data.forEach((item) => {
          if (item.Text == EmploymentCategory) {
            currentEmploymentCategoryExist = true
          }
          occupationTypes.push({ label: item.Text, value: item.Text })
        })

        setOcupationValueOptions([...occupationTypes])

        if (!currentEmploymentCategoryExist) {
          dispatch(updateEmploymentCategory(null))
        }
      }
    })
  }, [currentSelectedEmploymentOptionId])

  const GetCityAndStateByPincode = async (pincode) => {

    const postalCodeValidity = isValidPostalCodeNumber(pincode, "Zip Code")

    if (postalCodeValidity != null) {
      return null
    }

    setLoading(true)

    const response = await GetCityAndState(pincode)
    setLoading(false)

    let city, state;

    if (response.status == STATUS.ERROR) {
      setOtherError(response.message)
      return
    }
    setOtherError(null)
    if (response.data.length > 0) {
      state = response.data[0].Text
    }
    if (response.data.length > 1) {
      city = response.data[1].Text
    }


    return { city, state }
  }

  // Callback for handling dropdown changes
  const onEmploymentTypeChange = (itemValue) => {
    console.log(`emplyment type : ${itemValue.label}`)

    dispatch(updateEmploymentType(itemValue.label))

  };

  const onEmploymenCategoryChange = (itemValue) => {
    console.log(`occupation type : ${itemValue.label}`)
    dispatch(updateEmploymentCategory(itemValue.label))
  };

  const { setProgress } = useProgressBar();

  function formatJoiningDate(date) {
    return new Date(date).toISOString().slice(0, 10);
  }

  const updateInfo = async (type, value, from = null) => {

    if (EmploymentType == 'Salaried') {
      const currentState = { ...Salaried }; // Shallow copy of previous state

      switch (type) {

        case "EmployerName":
          currentState.CompanyName = value;
          currentState.CompanyNameError = null

          break;

        case "Designation":
          currentState.Designation = value;
          currentState.DesignationError = null

          break;
        case "AddressLine1":
          currentState.AddressLine1 = value;
          currentState.AddressLine1Error = null
          break;

        case "AddressLine2":
          currentState.AddressLine2 = value;
          break;

        case "EmpCity":
          currentState.EmpCity = value;
          currentState.CityError = null

          break;

        case "EmpState":
          currentState.EmpState = value;
          currentState.StateError = null

          break;
        case "EmpCountry":
          currentState.EmpCountry = value;

          break;

        case "EmpZipCode":
          const pincode = value.replace(/[^0-9]/g, '')
          currentState.EmpZipCode = pincode;
          let cityAndState = await GetCityAndStateByPincode(pincode)
          if (cityAndState != null) {
            currentState.EmpCity = cityAndState.city;
            currentState.CityError = null
            currentState.EmpState = cityAndState.state;
            currentState.StateError = null
          }
          currentState.ZipCodeError = null
          break;

        case "WorkStartDate":
          // Usage:
          const formattedJoiningDate = value;
          currentState.JoiningDate = formattedJoiningDate;
          currentState.JoiningDateError = null

          break;

        case "Experience":
         
          currentState.Experience = value;
          currentState.ExperienceError = null

          break;

        case "OfficePhoneNo":
          currentState.OfficePhoneNo = value;
          currentState.OfficePhoneNoError = null

          break;

        case "WorkEmail":
          currentState.WorkEmail = value;
          currentState.WorkEmailError = null

          break;

        case "AnnualCTC":

          let finalValue = parseInt(properAmmount(value)) || 0
          if (from != null) {
            if (finalValue > 1000000) {
              finalValue = 1000000
            }
            else if (finalValue < 0) {
              finalValue = 0
            }
          }
          currentState.AnnualCTC = finalValue;

          currentState.AnnualCTCError = null
          break;

        case "OfficeLandmark":
          currentState.OfficeLandmark = value;
          break;


      }

      dispatch(updateSalaried(currentState))



    }
    else {

      const currentState = { ...SelfEmployed }; // Shallow copy of previous state

      switch (type) {

        case "EmployerName":
          currentState.CompanyName = value;
          currentState.CompanyNameError = null

          break;

        case "Designation":
          currentState.Designation = value;
          currentState.DesignationError = null

          break;
        case "AddressLine1":
          currentState.AddressLine1 = value;
          currentState.AddressLine1Error = null

          break;

        case "AddressLine2":
          currentState.AddressLine2 = value;
          break;

        case "EmpCity":
          currentState.EmpCity = value;
          currentState.CityError = null

          break;

        case "EmpState":
          currentState.EmpState = value;

          currentState.StateError = null

          break;
        case "EmpCountry":
          currentState.EmpCountry = value;

          break;

        case "EmpZipCode":
          const pincode = value.replace(/[^0-9]/g, '')
          currentState.EmpZipCode = pincode;
          let cityAndState = await GetCityAndStateByPincode(pincode)
          if (cityAndState != null) {
            currentState.EmpCity = cityAndState.city;
            currentState.CityError = null
            currentState.EmpState = cityAndState.state;
            currentState.StateError = null
          }
          currentState.ZipCodeError = null
          break;

        case "WorkStartDate":
          currentState.JoiningDate = `${value}`;
          currentState.JoiningDateError = null

          break;

        case "Experience":
        
          currentState.Experience = value;
          currentState.ExperienceError = null

          break;

        case "OfficePhoneNo":
          currentState.OfficePhoneNo = value;
          currentState.OfficePhoneNoError = null

          break;

        case "WorkEmail":
          currentState.WorkEmail = value;
          currentState.WorkEmailError = null

          break;

        case "AnnualCTC":
          let finalValue = parseInt(properAmmount(value)) || 0
          if (from != null) {
            if (finalValue > 1000000) {
              finalValue = 1000000
            }
            else if (finalValue < 0) {
              finalValue = 0
            }
          }
          currentState.AnnualCTC = finalValue;
          currentState.AnnualCTCError = null
          break;

        case "OfficeLandmark":
          currentState.OfficeLandmark = value;
          break;


      }

      dispatch(updateSelfEmployed(currentState))



    }

    if (type == "EmployerName") {
      fetchCompanyList(value)
    }
  }

  const fetchCompanyList = (query) => {


    console.log("======= Get Company Name =======")
    console.log(query)
    console.log("======= Get Company Name =======")


    GetCompanyList(query).then((response) => {
      if (EmploymentType == "Salaried") {
        setSalariedCompanySearchResult(response?.data)
      }
      else {
        setSelfEmployeedCompanySearchResult(response?.data)

      }
    })


    // Remember to clear the timer when component unmounts

  }

  const employmentValidity = (details, type) => {

    let employmentDetails = { ...details }

    let experienceValidity = isValidNumberOnlyField(details.Experience, "Experience")
    employmentDetails.ExperienceError = experienceValidity
    if (experienceValidity != null) {
      return employmentDetails;
    }

    let companyNameValidity = isValidField(details.CompanyName, "Company Name")
    employmentDetails.CompanyNameError = companyNameValidity
    if (companyNameValidity != null) {
      return employmentDetails;
    }

    if (type == "Salaried") {
      let designationValidity = isValidField(details.Designation, "Designation")
      employmentDetails.DesignationError = designationValidity
      if (designationValidity != null) {
        return employmentDetails;
      }
    }


    let joiningDateValidity = isValidField(details.JoiningDate, "Joining Date")
    employmentDetails.JoiningDateError = joiningDateValidity
    if (joiningDateValidity != null) {
      return employmentDetails;
    }

    let officePhoneNoErrorValidity = isValidPhoneNumber(details.OfficePhoneNo, "Office Phone No")
    employmentDetails.OfficePhoneNoError = officePhoneNoErrorValidity
    if (officePhoneNoErrorValidity != null) {
      return employmentDetails;
    }

    let workEmailErrorErrorValidity = isValidEmail(details.WorkEmail, "Work Email ID")
    employmentDetails.WorkEmailError = workEmailErrorErrorValidity
    if (workEmailErrorErrorValidity != null) {
      return employmentDetails;
    }

    let annualCTCErrorErrorValidity = isValidNumberOnlyField(details.AnnualCTC, "Monthly CTC")
    employmentDetails.AnnualCTCError = annualCTCErrorErrorValidity
    if (annualCTCErrorErrorValidity != null) {
      return employmentDetails;
    }
    if (details.AnnualCTC < 0 || details.AnnualCTC > 1000000) {
      employmentDetails.AnnualCTCError = "Please provide valid  net monthly salary is given range"
      return employmentDetails
    }

    let zipCodeErrorValidity = isValidPostalCodeNumber(details.EmpZipCode, "Zip Code")
    employmentDetails.ZipCodeError = zipCodeErrorValidity
    if (zipCodeErrorValidity != null) {
      return employmentDetails;
    }

    let cityErrorValidity = isValidField(details.EmpCity, "City")
    employmentDetails.CityError = cityErrorValidity
    if (cityErrorValidity != null) {
      return employmentDetails;
    }

    let stateErrorValidity = isValidField(details.EmpState, "State")
    employmentDetails.StateError = stateErrorValidity
    if (stateErrorValidity != null) {
      return employmentDetails;
    }

    let addressLine1ErrorValidity = isValidField(details.AddressLine1, "Address")
    employmentDetails.AddressLine1Error = addressLine1ErrorValidity
    if (addressLine1ErrorValidity != null) {
      return employmentDetails;
    }

    let doj = createDateFromDMY(details.JoiningDate)
    let joiningDateRight = isValidJoiningDate(new Date(LeadDOB), doj)

    employmentDetails.JoiningDateError = joiningDateRight
    if (joiningDateRight != null) {
      return employmentDetails;
    }

    return null
  }

  const submitEmploymentDetails = async () => {

    if (extraSlices.isBreDone) {
      navigation.navigate('bankDetail');
      return;
    }

    let employmentTypeValidity = isValidField(EmploymentType, "Employment Type")
    dispatch(updateEmploymentTypeError(employmentTypeValidity))
    if (employmentTypeValidity != null) {
      return;
    }

    let employmentOccupationValidity = isValidField(EmploymentCategory, "Occupation Type")
    dispatch(updateEmploymentCategoryError(employmentOccupationValidity))
    if (employmentOccupationValidity != null) {
      return;
    }


    let currentRequestModel = { "EmploymentType": EmploymentType, "EmploymentCategory": EmploymentCategory }

    if (EmploymentType == 'Salaried') {

      let employmentDetail = employmentValidity(Salaried, 'Salaried')
      if (employmentDetail != null) {
        dispatch(updateSalaried(employmentDetail))
        return
      }

      currentRequestModel = { ...Salaried, ...currentRequestModel }
    }
    else if (EmploymentType == 'Self-Employed') {
      let employmentDetail = employmentValidity(SelfEmployed, 'Self-Employed')
      if (employmentDetail != null) {
        dispatch(updateSelfEmployed(employmentDetail))
        return
      }

      currentRequestModel = { ...SelfEmployed, ...currentRequestModel }
    }


    let LeadStage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "employmentDetail") {
      LeadStage = nextJumpTo + 1
    }

    currentRequestModel.JoiningDate = createDateFromDMYToDash(currentRequestModel.JoiningDate)
    currentRequestModel.LeadId = LeadId
    currentRequestModel.Leadstage = LeadStage
    currentRequestModel.CompanyAddress = `${currentRequestModel.AddressLine1}${currentRequestModel.AddressLine2 ? ` | ${currentRequestModel.AddressLine2}` : ""}`
    console.log(currentRequestModel)


    if (await checkLocationPermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" })
      return
    }


    setLoading(true)
    SubmitEmploymentDetails(currentRequestModel).then(response => {
      setLoading(false)
      console.log(response)
      setNewErrorScreen(null)
      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message)
          return
        }
        setOtherError(response.message)
        return;
      }

      if (ALL_SCREEN[nextJumpTo] == "employmentDetail") {
        dispatch(updateJumpTo(LeadStage))
      }
      setOtherError(null)

      navigation.navigate('bankDetail')
    })
  }


  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };



  const CompanyItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item)} style={{ paddingHorizontal: 4, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "black" }}>

      <Text>{item.Value}</Text>

    </TouchableOpacity>
  );


  useEffect(() => {
    if (EmploymentType == 'Salaried') {
      if (Salaried.Experience && !Salaried.JoiningDate) {
        updateInfo("WorkStartDate", calculatePastDate(Salaried.Experience))
      }
    }
  }, [EmploymentType, Salaried.Experience])


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



                <ProgressBar progress={0.1} />
                <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>Employment Details</Text>
                {otherError && (
                  <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{otherError}</Text>
                )}
                <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Employment Type <Text style={styles.mandatoryStar}>*</Text></Text>
                <CustomDropdown
                  value={EmploymentType}
                  items={employmentTypeOptions}
                  setValue={(e) => onEmploymentTypeChange(e)}
                  placeholder="Select"
                  style={[styles.pickerContainer, { fontSize }]}
                  zIndex={3000}
                />

                {EmploymentTypeError && (
                  <Text style={styles.errorText}>{EmploymentTypeError}</Text>
                )}

                <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Occupation Type <Text style={styles.mandatoryStar}>*</Text></Text>
                <CustomDropdown
                  value={EmploymentCategory}
                  items={ocupationValueOptions}
                  setValue={(e) => { onEmploymenCategoryChange(e) }}
                  placeholder="Select"
                  style={[styles.pickerContainer, { fontSize }]}
                  zIndex={2000}
                  searchable={true}
                />
                {EmploymentCategoryError && (
                  <Text style={styles.errorText}>{EmploymentCategoryError}</Text>
                )}
                <View>
                  {EmploymentType == 'Salaried' ? (
                    <View style={styles.employmentWrapper}>
                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Total Experience(Years) <Text style={styles.mandatoryStar}>*</Text></Text>
                        <CustomInput 
                          placeholder="Total Experience(Years)" 
                          keyboardType="numeric" 
                          error={Salaried.ExperienceError} 
                          value={Salaried.Experience} 
                          onChangeText={(e) => { updateInfo("Experience", e) }}
                         />
                      </View>
                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Current Company Name <Text style={styles.mandatoryStar}>*</Text></Text>
                        <CustomInputFieldWithSuggestion
                          placeholder="Current Company Name"
                          error={Salaried.CompanyNameError}
                          value={Salaried.CompanyName}
                          listOfData={salariedCompanySearchResult}
                          onChangeText={(e) => { updateInfo("EmployerName", e) }} />



                      </View>




                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Your Current Designation <Text style={styles.mandatoryStar}>*</Text></Text>
                        <CustomInput placeholder="Your Current Designation" error={Salaried.DesignationError} value={Salaried.Designation} onChangeText={(e) => { updateInfo("Designation", e) }} />
                      </View>
                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Date of Joining <Text style={styles.mandatoryStar}>*</Text></Text>
                        <DateOfJoiningMaskedCustomInput
                          onDateChange={(masked, unmasked) => {
                            updateInfo("WorkStartDate", masked); // you can use the unmasked value as well
                          }}
                          initialDate={Salaried.JoiningDate}

                          error={Salaried.JoiningDateError}
                        />
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Work Phone Number <Text style={styles.mandatoryStar}>*</Text></Text>
                        <MobileNumberInput
                          setMobileNumber={(e) => updateInfo("OfficePhoneNo", e)}
                          mobileNumber={Salaried.OfficePhoneNo}
                          error={Salaried.OfficePhoneNoError}
                        />
                      </View>
                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Work Email ID <Text style={styles.mandatoryStar}>*</Text></Text>
                        <CustomInput placeholder="Work Email ID" error={Salaried.WorkEmailError} value={Salaried.WorkEmail} onChangeText={(e) => { updateInfo("WorkEmail", e) }}
                          keyboardType="email-address"
                          autoCapitalize="none" />
                      </View>

                      <CustomSlider
                        title="Net Monthly Salary"
                        icon="rupee"
                        keyboardType='numeric'
                        min={0}
                        max={1000000}
                        steps={5000}
                        sliderValue={properAmmount(Salaried.AnnualCTC)}
                        inputValue={formateAmmountValue(Salaried.AnnualCTC.toString())}
                        error={Salaried.AnnualCTCError}
                        onChange={(e, from) => updateInfo("AnnualCTC", e, from)}
                        isForAmount={true}

                      />
                      {/* <View style={styles.sliderContainer}>
                    <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}> Net Monthly Salary<Text style={styles.mandatoryStar}>*</Text></Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Icon name="rupee" size={16} color="#00194c" style={{ marginHorizontal: 10 }} />
                      <TextInput
                        placeholder=""
                        style={styles.Input}
                        value={formateAmmountValue(Salaried.AnnualCTC.toString())} onChangeText={(e) => { updateInfo("AnnualCTC", e) }}
                        keyboardType="numeric"
                      />
                    </View>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      step={5000}
                      maximumValue={1000000}
                      onValueChange={(e) => { updateInfo("AnnualCTC", e, "fromSlider") }}
                      value={properAmmount(Salaried.AnnualCTC)}
                      minimumTrackTintColor="#0010AC"
                      maximumTrackTintColor="#758BFD"
                      thumbTintColor="#F38F00"

                    />
                    <View style={styles.sliderLabels}>
                      <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>0</Text>
                      <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>₹10L</Text>
                    </View>
                    {Salaried.AnnualCTCError && (
                      <Text style={styles.errorText}>{Salaried.AnnualCTCError}</Text>
                    )}
                  </View> */}

                      <Text style={[styles.headerTitle, { fontSize: dynamicFontSize(styles.headerTitle.fontSize) }]}>Company Address <Text style={styles.mandatoryStar}>*</Text></Text>
                      <View style={styles.addressForm}>
                        <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                          <CustomInput widthPercentage={"48%"} error={Salaried.ZipCodeError} keyboardType="numeric" placeholder="PIN Code" value={Salaried.EmpZipCode} onChangeText={(e) => { updateInfo("EmpZipCode", e) }} maxLength={6} />
                          <CustomInput widthPercentage={"48%"} error={Salaried.CityError} placeholder="City" value={Salaried.EmpCity} onChangeText={(e) => { updateInfo("EmpCity", e) }} cityOrState={true} />
                        </View>
                        <CustomInput placeholder="State" error={Salaried.StateError} cityOrState={true} value={Salaried.EmpState} onChangeText={(e) => { updateInfo("EmpState", e) }} />
                        <CustomInput placeholder="Address line 1" error={Salaried.AddressLine1Error} value={Salaried.AddressLine1} onChangeText={(e) => { updateInfo("AddressLine1", e) }} />
                        <CustomInput placeholder="Address line 2" value={Salaried.AddressLine2} onChangeText={(e) => { updateInfo("AddressLine2", e) }} />
                        <CustomInput placeholder="Landmark" value={Salaried.OfficeLandmark} onChangeText={(e) => { updateInfo("OfficeLandmark", e) }} />
                      </View>
                    </View>
                  ) : null}
                  {EmploymentType == 'Self-Employed' ? (
                    <View style={styles.employmentWrapper}>
                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Total Business <Text style={styles.mandatoryStar}>*</Text></Text>
                        <CustomInput placeholder="Total Business" keyboardType="numeric" error={SelfEmployed.ExperienceError} value={SelfEmployed.Experience} onChangeText={(e) => { updateInfo("Experience", e) }} />
                      </View>
                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Business/Shop/Company Name <Text style={styles.mandatoryStar}>*</Text></Text>
                        <CustomInputFieldWithSuggestion


                          placeholder="Current Company Name"
                          error={SelfEmployed.CompanyNameError}
                          value={SelfEmployed.CompanyName}
                          onChangeText={(e) => { updateInfo("EmployerName", e) }}

                          listOfData={selfEmployeedCompanySearchResult}
                        />

                      </View>


                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Business/Shop Commencement <Text style={styles.mandatoryStar}>*</Text></Text>
                        <DateOfJoiningMaskedCustomInput
                          onDateChange={(masked, unmasked) => {
                            updateInfo("WorkStartDate", masked); // you can use the unmasked value as well
                          }}
                          initialDate={SelfEmployed.JoiningDate}

                          error={SelfEmployed.JoiningDateError}
                        />

                        {/* <DatePickerComponent
                          onDateChange={(e) => { updateInfo("WorkStartDate", e) }}
                          initialDate={SelfEmployed.JoiningDate}
                          maximumDate={new Date()}
                          minimumDate={new Date(UserDob)}
                        />
                        {SelfEmployed.JoiningDateError && (
                          <Text style={styles.errorText}>{SelfEmployed.JoiningDateError}</Text>
                        )} */}
                      </View>
                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Work Phone Number <Text style={styles.mandatoryStar}>*</Text></Text>
                        <MobileNumberInput
                          setMobileNumber={(e) => updateInfo("OfficePhoneNo", e)}

                          mobileNumber={SelfEmployed.OfficePhoneNo}
                          error={SelfEmployed.OfficePhoneNoError}
                        />

                      </View>
                      <View style={styles.formGroup}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Work Email ID <Text style={styles.mandatoryStar}>*</Text></Text>
                        <CustomInput placeholder="Work Email ID" value={SelfEmployed.WorkEmail} onChangeText={(e) => { updateInfo("WorkEmail", e) }}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          error={SelfEmployed.WorkEmailError} />
                      </View>

                      <CustomSlider
                        title="Net Monthly Salary"
                        icon="rupee"
                        keyboardType='numeric'
                        min={0}
                        max={1000000}
                        steps={5000}
                        sliderValue={properAmmount(SelfEmployed.AnnualCTC)}
                        inputValue={formateAmmountValue(SelfEmployed.AnnualCTC.toString())}
                        error={SelfEmployed.AnnualCTCError}
                        onChange={(e, from) => updateInfo("AnnualCTC", e, from)}
                        isForAmount={true}
                      />
                      {/* <View style={styles.sliderContainer}>
                        <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}> Net Monthly Salary <Text style={styles.mandatoryStar}>*</Text></Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Icon name="rupee" size={16} color="#00194c" style={{ marginHorizontal: 10 }} />
                          <TextInput
                            placeholder=""
                            style={[styles.Input, { fontSize: dynamicFontSize(styles.Input.fontSize) }]}
                            keyboardType="numeric"
                            value={formateAmmountValue(SelfEmployed.AnnualCTC.toString())} onChangeText={(e) => { updateInfo("AnnualCTC", e) }}
                          />
                        </View>
                        <Slider
                          style={styles.slider}
                          minimumValue={0}
                          step={5000}
                          maximumValue={1000000}
                          onValueChange={(e) => { updateInfo("AnnualCTC", e, "fromSlider") }}
                          value={properAmmount(SelfEmployed.AnnualCTC)}
                          minimumTrackTintColor="#0010AC"
                          maximumTrackTintColor="#758BFD"
                          thumbTintColor="#F38F00"
                        />
                        <View style={styles.sliderLabels}>
                          <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>0</Text>
                          <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>₹10L</Text>
                        </View>
                        {SelfEmployed.AnnualCTCError && (
                          <Text style={styles.errorText}>{SelfEmployed.AnnualCTCError}</Text>
                        )}
                      </View> */}
                      <Text style={[styles.headerTitle, { fontSize: dynamicFontSize(styles.headerTitle.fontSize) }]}>Company/Shop Address <Text style={styles.mandatoryStar}>*</Text></Text>
                      <View style={styles.addressForm}>
                        <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                          <CustomInput widthPercentage={"48%"} error={SelfEmployed.ZipCodeError} placeholder="PIN Code" keyboardType="numeric" value={SelfEmployed.EmpZipCode} onChangeText={(e) => { updateInfo("EmpZipCode", e) }} maxLength={6} />

                          <CustomInput widthPercentage={"48%"} error={SelfEmployed.CityError} placeholder="City" cityOrState={true} value={SelfEmployed.EmpCity} onChangeText={(e) => { updateInfo("EmpCity", e) }} />
                        </View>
                        <CustomInput placeholder="State" error={SelfEmployed.StateError} cityOrState={true} value={SelfEmployed.EmpState} onChangeText={(e) => { updateInfo("EmpState", e) }} />
                        <CustomInput placeholder="Address line 1" error={SelfEmployed.AddressLine1Error} value={SelfEmployed.AddressLine1} onChangeText={(e) => { updateInfo("AddressLine1", e) }} />
                        <CustomInput placeholder="Address line 2" value={SelfEmployed.AddressLine2} onChangeText={(e) => { updateInfo("AddressLine2", e) }} />
                        <CustomInput placeholder="Landmark" value={SelfEmployed.OfficeLandmark} onChangeText={(e) => { updateInfo("OfficeLandmark", e) }} />
                      </View>
                    </View>
                  ) : null}
                </View>

              </View>
              {/* Navigation Buttons */}
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => GoBack(navigation)}>
                  <Text style={[styles.backBtnText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize) }]}>BACK</Text>
                </TouchableOpacity>
                <LinearGradient
                  // button Linear Gradient
                  colors={['#002777', '#00194C']}
                  style={styles.verifyButton}
                >
                  <TouchableOpacity onPress={() => submitEmploymentDetails()}>
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


const empoymentDetailStyle = StyleSheet.create({
  formGroup: {
    position: 'relative', // Ensure relative positioning for proper absolute positioning of suggestions container
    // Other styles for formGroup
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 40, // Adjust this value according to your layout
    left: 0, // Adjust this value according to your layout
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)', // Shadow for suggestions container
    // Other styles for suggestionsContainer
  },
  companySearchSuggestion: {
    width: "100%", maxHeight: 400, borderWidth: 1, borderColor: "black", borderRadius: 10, zIndex: 100
  }

});

export default EmploymentDetailScreen;
