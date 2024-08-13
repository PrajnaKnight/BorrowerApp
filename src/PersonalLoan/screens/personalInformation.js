import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import CustomDropdown from '../components/dropdownPicker';
import { styles } from '../services/style/gloablStyle';
import CustomInput from '../components/input';
import RadioButton from '../components/radioButton';
import DatePickerComponent, { WebCalendar } from '../components/datePicker';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import CreateBorrowerLead, { GetMaritalStatus } from '../services/API/CreateBorrowerLead';
import { STATUS } from '../services/API/Constants';
import { GetBorrowerPhoneNumber, StoreUserDob } from '../services/LOCAL/AsyncStroage';
import { isValidEmail, isValidField } from '../services/Utils/FieldVerifier';
import LoadingOverlay from '../components/FullScreenLoader';
import { BackHandler } from 'react-native';
import { GoBack } from '../services/Utils/ViewValidator';

import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentStage, updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { fetchPersonalDetails, updateCurrentPersonalData } from '../services/Utils/Redux/PersonalDataSlices';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';
import ScreenError, { useErrorEffect } from './ScreenError';
import { checkLocationPermission } from './PermissionScreen';
import { useFocusEffect } from '@react-navigation/native';

const PersonalInformationScreen = ({ navigation }) => {

  const dispatch = useDispatch()
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const personalDetails = useSelector(state => state.personalDetailSlice);
  const extraSlices = useSelector(state => state.extraStageSlice);

  const [borrowerPhone, setBorrowerPhone] = useState(null)
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [items, setItems] = useState([]);
  const genders = ['Male', 'Female', 'Other'];

  const [otherError, setOtherError] = useState(null)

  const [refreshPage, setRefreshPage] = useState(true)
  const onTryAgainClick = () => {
    setRefreshPage(true)
  }
  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)

  useEffect(() => {
    setLoading(personalDetails.loading)
  }, [personalDetails.loading])

  useEffect(() => {
    setNewErrorScreen(null)
    if (personalDetails.error == Network_Error || personalDetails.error == Something_Went_Wrong) {
      setNewErrorScreen(personalDetails.error)
    }
  }, [personalDetails.error])

  useFocusEffect(
    useCallback(() => {

    if (!refreshPage) {
      return
    }
    dispatch(fetchPersonalDetails())
    setRefreshPage(false)
  }, [refreshPage]))

  useFocusEffect(
    useCallback(() => {

    setLoading(true)
    GetMaritalStatus().then(response => {
      setLoading(false)
      setNewErrorScreen(null)
      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message)
          return
        }
        setOtherError(response.message)
        return;
      }
      setOtherError(null)
      if (response.data != null) {
        let maritalStatus = []
        response.data.forEach((item) => {
          let isExist = false;
          for (let index = 0; index < maritalStatus.length; index++) {
            isExist = maritalStatus[index].label == item.Text || maritalStatus[index].value == item.Text
            if (isExist) {
              break
            }
          }
          if (!isExist)
            maritalStatus.push({ label: item.Text, value: item.Text })
        })
        setItems([...maritalStatus])
      }
    })
  }, []))



  useEffect(() => {
    GetBorrowerPhoneNumber().then(response => {
      setBorrowerPhone(response)
    })
  }, [])

  useEffect(() => {
    validateForm();
  }, [personalDetails.data]);

  const validateEmail = (email) => {
    if (email == null || email == '') {
      return "Please Provide Email"
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Please Provide Valid Email"
    }
    return null
  };

  const validateForm = () => {
    const { LeadName, LeadDOB, LeadGender, LeadEmail, FatherName, LeadMaritalStatus } = personalDetails.data;
    const isFormValid = 
      isValidField(LeadName, "Name") === null &&
      isValidField(LeadDOB, "Date Of Birth") === null &&
      isValidField(LeadGender, "Gender") === null &&
      isValidEmail(LeadEmail) === null &&
      isValidField(FatherName, "Father Name") === null &&
      isValidField(LeadMaritalStatus, "Marital Status") === null;
    setIsFormValid(isFormValid);
  };

  const handleEmailChange = (text) => {
    let currentRequestModel = { ...personalDetails.data, LeadEmail: text, LeadEmailError: null }
    dispatch(updateCurrentPersonalData(currentRequestModel))
    validateForm();
  };

  const handleMaritalStatusChange = (text) => {
    let currentRequestModel = { ...personalDetails.data, LeadMaritalStatus: text, LeadMaritalStatusError: null }
    dispatch(updateCurrentPersonalData(currentRequestModel))
    validateForm();
  };

  const handleUserNameChange = (text) => {
    let currentRequestModel = { ...personalDetails.data, LeadName: text, LeadNameError: null }
    dispatch(updateCurrentPersonalData(currentRequestModel))
    validateForm();
  };

  const handleDateChange = (text) => {
    let currentRequestModel = { ...personalDetails.data, LeadDOB: `${text}`, LeadDOBError: null }
    dispatch(updateCurrentPersonalData(currentRequestModel))
    validateForm();
  };

  const handleFatherNameChange = (text) => {
    let currentRequestModel = { ...personalDetails.data, FatherName: text, FatherNameError: null }
    dispatch(updateCurrentPersonalData(currentRequestModel))
    validateForm();
  };

  const handleGenderChange = (text) => {
    let currentRequestModel = { ...personalDetails.data, LeadGender: text, LeadGenderError: null }
    dispatch(updateCurrentPersonalData(currentRequestModel))
    validateForm();
  };



  const handleOnProceed = async() => {

    if(extraSlices.isBreDone){
      navigation.navigate('addressDetail');
      return;
    }

    if(await checkLocationPermission() == false){
      navigation.navigate("PermissionsScreen", {permissionStatus : "denied", permissionType : "location"})
      return
    }

    console.log(personalDetails.data)

    let leadNameValidity = isValidField(personalDetails.data.LeadName, "Name")
    dispatch(updateCurrentPersonalData({ ...personalDetails.data, LeadNameError: leadNameValidity }))
    if (leadNameValidity != null) {
      return;
    }

    let leadDOBValidity = isValidField(personalDetails.data.LeadDOB, "Date Of Birth")
    dispatch(updateCurrentPersonalData({ ...personalDetails.data, LeadDOBError: leadDOBValidity }))
    if (leadDOBValidity != null) {
      return;
    }

    let leadGenderValidity = isValidField(personalDetails.data.LeadGender, "Gender")
    dispatch(updateCurrentPersonalData({ ...personalDetails.data, LeadGenderError: leadGenderValidity }));
    if (leadGenderValidity != null) {
      return;
    }

    let leadEmailValidity = isValidEmail(personalDetails.data.LeadEmail)
    dispatch(updateCurrentPersonalData({ ...personalDetails.data, LeadEmailError: leadEmailValidity }));
    if (leadEmailValidity != null) {
      return;
    }

    let leadFatherValidity = isValidField(personalDetails.data.FatherName, "Father Name")
    dispatch(updateCurrentPersonalData({ ...personalDetails.data, FatherNameError: leadFatherValidity }));
    if (leadFatherValidity != null) {
      return;
    }

    let leadMartialValidity = isValidField(personalDetails.data.LeadMaritalStatus, "Marital Status")
    dispatch(updateCurrentPersonalData({ ...personalDetails.data, LeadMaritalStatusError: leadMartialValidity }));
    if (leadMartialValidity != null) {
      return;
    }

    setLoading(true)
    StoreUserDob(personalDetails.data.LeadDOB)

    let LeadStage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "personalInfo") {
      LeadStage = nextJumpTo + 1
    }

    const model = { ...personalDetails.data, Leadstage: LeadStage, LeadPhone: borrowerPhone }

    console.log("------------------ personal info request model --------------------------")
    console.log(model)
    console.log("------------------ personal info request model --------------------------")

    CreateBorrowerLead(model, false, 3).then(response => {
      setLoading(false)
      setNewErrorScreen(null)
      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message)
          return
        }
        setOtherError(response.message)
        return;
      }
      if (ALL_SCREEN[nextJumpTo] == "personalInfo") {
        dispatch(updateJumpTo(LeadStage))
      }
      setOtherError(null)
      navigation.navigate('addressDetail')
    })
  }

  const eighteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.05);
  }, []);

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

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
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          style={[styles.rightCOntainer, { flex: 1 }]}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <LoadingOverlay visible={loading} />
          <View style={{ paddingHorizontal: 16 }}>
            <ProgressBar progress={0.05} />
            <Text
              style={[
                styles.headerText,
                { fontSize: dynamicFontSize(styles.headerText.fontSize) },
              ]}>
              Personal Information
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View>
                {otherError && (
                  <Text
                    style={[
                      styles.errorText,
                      { fontSize: dynamicFontSize(styles.errorText.fontSize) },
                    ]}>
                    {otherError}
                  </Text>
                )}

                <View style={styles.formGroup}>
                  <Text
                    style={[
                      styles.label,
                      { fontSize: dynamicFontSize(styles.label.fontSize) },
                    ]}>
                    Name <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <CustomInput
                    placeholder="Enter your name"
                    value={personalDetails.data.LeadName}
                    error={personalDetails.data.LeadNameError}
                    onChangeText={(e) => {
                      handleUserNameChange(e);
                    }}
                  />
                </View>

                <View style={{ zIndex: 4000 }}>
                  <Text
                    style={[
                      styles.label,
                      { fontSize: dynamicFontSize(styles.label.fontSize) },
                    ]}>
                    Date Of Birth <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <DatePickerComponent
                    onDateChange={(newDate) => handleDateChange(newDate)}
                    maximumDate={
                      new Date(
                        new Date().getFullYear() - 18,
                        new Date().getMonth(),
                        new Date().getDate()
                      )
                    }
                    minimumDate={new Date(null)}
                    initialDate={personalDetails.data.LeadDOB}
                  />
                  {personalDetails.data.LeadDOBError && (
                    <Text
                      style={[
                        styles.errorText,
                        {
                          fontSize: dynamicFontSize(styles.errorText.fontSize),
                        },
                      ]}>
                      {personalDetails.data.LeadDOBError}
                    </Text>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text
                    style={[
                      styles.label,
                      { fontSize: dynamicFontSize(styles.label.fontSize) },
                    ]}>
                    Gender <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <View style={styles.InlineGender}>
                    {genders.map((gender) => (
                      <RadioButton
                        key={gender}
                        label={gender}
                        isSelected={personalDetails.data.LeadGender === gender}
                        onPress={() => handleGenderChange(gender)}
                      />
                    ))}
                  </View>

                  {personalDetails.data.LeadGenderError && (
                    <Text
                      style={[
                        styles.errorText,
                        {
                          fontSize: dynamicFontSize(styles.errorText.fontSize),
                        },
                      ]}>
                      {personalDetails.data.LeadGenderError}
                    </Text>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text
                    style={[
                      styles.label,
                      { fontSize: dynamicFontSize(styles.label.fontSize) },
                    ]}>
                    Email ID <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <CustomInput
                    placeholder="Enter your email ID"
                    onChangeText={handleEmailChange}
                    error={personalDetails.data.LeadEmailError}
                    value={personalDetails.data.LeadEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text
                    style={[
                      styles.label,
                      { fontSize: dynamicFontSize(styles.label.fontSize) },
                    ]}>
                    Father's Name <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <CustomInput
                    value={personalDetails.data.FatherName}
                    placeholder="Enter your father's name"
                    error={personalDetails.data.FatherNameError}
                    onChangeText={(e) => {
                      handleFatherNameChange(e);
                    }}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text
                    style={[
                      styles.label,
                      { fontSize: dynamicFontSize(styles.label.fontSize) },
                    ]}>
                    Marital Status <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <CustomDropdown
                    value={personalDetails.data.LeadMaritalStatus}
                    items={items}
                    setValue={(e) => {
                      handleMaritalStatusChange(e.label);
                    }}
                    setItems={setItems}
                    placeholder="Select"
                    style={styles.dropdownBorder}
                  />
                  {personalDetails.data.LeadMaritalStatusError && (
                    <Text
                      style={[
                        styles.errorText,
                        {
                          fontSize: dynamicFontSize(styles.errorText.fontSize),
                        },
                      ]}>
                      {personalDetails.data.LeadMaritalStatusError}
                    </Text>
                  )}
                  <View style={{ height: 20 }}></View>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={[styles.actionContainer, styles.boxShadow]}>
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
              colors={["#002777", "#00194C"]}
              style={[styles.verifyButton]}
            >
              <TouchableOpacity 
                onPress={() => handleOnProceed()}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: dynamicFontSize(styles.buttonText.fontSize),
                    },
                  ]}
                >
                  PROCEED
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

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
}

export default PersonalInformationScreen;
