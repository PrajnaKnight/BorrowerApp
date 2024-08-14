import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform , useWindowDimensions} from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import CustomInput from '../../Common/components/ControlPanel/input';
import Accordion from '../components/accordion';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../Common/components/useContext';
import RadioButton from '../components/radioButton';
import SubmitAddress, { GetCityAndState, AddressModel } from '../services/API/AddressDetails';
import { GetHeader, STATUS } from '../services/API/Constants';
import { GetLeadId } from '../services/LOCAL/AsyncStroage';
import { isValidField, isValidPostalCodeNumber } from '../services/Utils/FieldVerifier';  
import LoadingOverlay from '../components/FullScreenLoader';
import { GoBack } from '../services/Utils/ViewValidator';
import { BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetBorrowerAddress, updateCurrentAddress, updateMailingAddress, updatePermanentAddress } from '../services/Utils/Redux/AddressDetailSlices';
import { sampleAddress } from '../services/API/AddressDetails';
import { updateCurrentStage, updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';


import ScreenError, { useErrorEffect } from './ScreenError';
import { checkLocationPermission } from './PermissionScreen';
import { useFocusEffect } from '@react-navigation/native';
 



const AddressScreen = ({ navigation }) => {

  const dispatch = useDispatch()
  const AddressDetailSlice = useSelector(state => state.addressDetailSlices);

  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const extraSlices = useSelector(state => state.extraStageSlice);


  const [loading, setLoading] = useState(false);
  
  const { setProgress } = useProgressBar();
  const [leadId, setLeadId] = useState(null);
  const [otherError, setOtherError] = useState(null)


  const [refreshPage, setRefreshPage] = useState(true)


  const [mailingExpanded, setMailingExpanded] = useState(false);
  const [permanentExpanded, setPermanentExpanded] = useState(true);
  const [currentExpanded, setCurrentExpanded] = useState(false);

  const onTryAgainClick = () => {
     setRefreshPage(true)
   }
   
   const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)
 

   useFocusEffect(
    useCallback(() => {

    if(!refreshPage){
      return
    }
    setProgress(0.09);
    console.log("AddressDetailSlice", AddressDetailSlice)
    dispatch(fetchGetBorrowerAddress())
    GetLeadId().then(response => {
      console.log("Lead id from storage", response)
      setLeadId(response)
    })

    GetHeader().then((e)=>{
      console.log(e)
    })
    
    setRefreshPage(false)
  }, [refreshPage]))

  useEffect(()=>{
    setLoading(AddressDetailSlice.loading)
  },[AddressDetailSlice.loading])

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  // Options for radio buttons
  const addressOptions = {
    current: ['Same as Permanent Address', 'Different Address'],
    mailing: ['Same as Permanent Address', 'Same as Current Address', 'Different Address'],
  };

  // States for radio selections
  const [selectedCurrent, setSelectedCurrent] = useState(addressOptions.current[1]);
  const [selectedMailing, setSelectedMailing] = useState(addressOptions.mailing[2]);

  const isAddressEmpty = (address) => {
    if (address.AddressLine1 != null) {
      return false
    }
    if (address.AddressLine2 != null) {
      return false
    }
    if (address.PostalCode != null) {
      return false
    }
    if (address.City != null) {
      return false
    }
    if (address.State != null) {
      return false
    }
    if (address.landmark != null) {
      return false
    }


    return true
  }
  const isAddressAreSame = (address1, address2) => {


    if (isAddressEmpty(address1) || isAddressEmpty(address2)) {

      return false
    }


    if (address1.AddressLine1 != address2.AddressLine1) {

      return false
    }
    if (address1.AddressLine2 != address2.AddressLine2) {

      return false
    }
    if (address1.PostalCode != address2.PostalCode) {

      return false
    }
    if (address1.City != address2.City) {

      return false
    }
    if (address1.State != address2.State) {

      return false
    }


    return true
  }

  useEffect(() => {
    console.log("================================== AddressDetailSlice.data ===============================")
    console.log(AddressDetailSlice.data)
    console.log( selectedCurrent != addressOptions.current[0])
    const permanent = AddressDetailSlice.data[0]
    const current = AddressDetailSlice.data[1]
    const mailing = AddressDetailSlice.data[2]

    if (isAddressAreSame(permanent, current) && selectedCurrent != addressOptions.current[0]) {
      setSelectedCurrent(addressOptions.current[0])
    }
    if (isAddressAreSame(permanent, mailing) && selectedMailing != addressOptions.mailing[0]) {
      setSelectedMailing(addressOptions.mailing[0])
    }

    console.log("================================== AddressDetailSlice.data ===============================")

  }, [AddressDetailSlice.data])


  useEffect(()=>{
    setNewErrorScreen(null)

    console.log("================ USEeffect ==================")
    console.log(AddressDetailSlice.error)
    console.log("================ USEeffect ==================")

    if(AddressDetailSlice.error == Network_Error || AddressDetailSlice.error != null){
      setNewErrorScreen(AddressDetailSlice.error)
    }
  },[AddressDetailSlice.error])

  const GetCityAndStateByPincode = async (value) => {

    const postalCodeValidity = isValidPostalCodeNumber(value, "Postal Code")

    if (postalCodeValidity != null) {

      return null
    }

    setLoading(true)

    const response = await GetCityAndState(value)
    setLoading(false)

    if (response.status == STATUS.ERROR) {
      return null
    }
    setOtherError(null)

    let city;
    let state;
    if (response.data.length > 0) {
      state = response.data[0].Text
    }
    if (response.data.length > 1) {
      city = response.data[1].Text
    }


    return { city, state }
  }

  const OpenDiiferentAddress = (type, shouldOpenDifferent = false) => {
    if (type == "current") {
      setCurrentExpanded(true)
      if (shouldOpenDifferent) {
        setSelectedCurrent("Different Address")
      }
    }
    else if (type == "mailing") {
      setMailingExpanded(true)
      if (shouldOpenDifferent) {
        setSelectedMailing("Different Address")
      }
    }
    else if (type == "permanent") {
      setPermanentExpanded(true)
    }
  }

  useEffect(() => {

    let newAddress = { ...sampleAddress, Id: AddressDetailSlice.data[1].Id }
    if (selectedCurrent == addressOptions.current[0]) {
      newAddress = { ...AddressDetailSlice.data[0], Id: AddressDetailSlice.data[1].Id }
    }


    dispatch(updateCurrentAddress(newAddress))



  }, [selectedCurrent])

  useEffect(() => {

    let newAddress = { ...sampleAddress, Id: AddressDetailSlice.data[2].Id }

    if (selectedMailing == addressOptions.mailing[0]) {
      newAddress = { ...AddressDetailSlice.data[0], Id: AddressDetailSlice.data[2].Id }

    }
    else if (selectedMailing == addressOptions.mailing[1]) {
      newAddress = { ...AddressDetailSlice.data[1], Id: AddressDetailSlice.data[2].Id }

    }

    dispatch(updateMailingAddress(newAddress))


  }, [selectedMailing])






  const UpdatePermanentAddress = async (type, value) => {


    const updatedPermanentAddress = { ...AddressDetailSlice.data[0] }; // Shallow copy of previous state

    switch (type) {
      case "PIN-CODE":
        const pincode = value.replace(/[^0-9]/g, '')
        updatedPermanentAddress.PostalCode = pincode;
        const cityAndState = await GetCityAndStateByPincode(pincode)
        if (cityAndState != null) {
          updatedPermanentAddress.City = cityAndState.city
          updatedPermanentAddress.CityError = null;
          updatedPermanentAddress.State = cityAndState.state
          updatedPermanentAddress.StateError = null;
        }
        updatedPermanentAddress.PostalCodeError = null;
        break;

      case "CITY":
        updatedPermanentAddress.City = value;
        updatedPermanentAddress.CityError = null;
        break;

      case "STATE":
        updatedPermanentAddress.State = value;
        updatedPermanentAddress.StateError = null;
        break;

      case "ADD-1":
        updatedPermanentAddress.AddressLine1 = value;
        updatedPermanentAddress.AddressLine1Error = null;
        break;

      case "ADD-2":
        updatedPermanentAddress.AddressLine2 = value;
        break;

      case "landmark":
        updatedPermanentAddress.landmark = value;
        break;
      default:
        break;
    }

    dispatch(updatePermanentAddress(updatedPermanentAddress))

  }

  const UpdateCurrentAddress = async (type, value) => {

    const updatedCurrentAddress = { ...AddressDetailSlice.data[1] }; // Shallow copy of previous state
    switch (type) {
      case "PIN-CODE":
        const pincode = value.replace(/[^0-9]/g, '')
        updatedCurrentAddress.PostalCode =pincode;
        const cityAndState = await GetCityAndStateByPincode(pincode)
        if (cityAndState != null) {
          updatedCurrentAddress.City = cityAndState.city
          updatedCurrentAddress.CityError = null;
          updatedCurrentAddress.State = cityAndState.state
          updatedCurrentAddress.StateError = null;
        }
        updatedCurrentAddress.PostalCodeError = null;
        break;

      case "CITY":
        updatedCurrentAddress.City = value;
        updatedCurrentAddress.CityError = null;
        break;

      case "STATE":
        updatedCurrentAddress.State = value;
        updatedCurrentAddress.StateError = null;
        break;

      case "ADD-1":
        updatedCurrentAddress.AddressLine1 = value;
        updatedCurrentAddress.AddressLine1Error = null;
        break;

      case "ADD-2":
        updatedCurrentAddress.AddressLine2 = value;
        break;
      case "landmark":
        updatedCurrentAddress.landmark = value;
        break;

      default:
        break;
    }
    dispatch(updateCurrentAddress(updatedCurrentAddress))


  }


  const UpdateMailingAddress = async (type, value) => {
    const updatedMailingAddress = { ...AddressDetailSlice.data[2] }; // Shallow copy of previous state

    switch (type) {
      case "PIN-CODE":
        const pincode = value.replace(/[^0-9]/g, '')
        updatedMailingAddress.PostalCode = pincode;
        const cityAndState = await GetCityAndStateByPincode(pincode)
        if (cityAndState != null) {
          updatedMailingAddress.City = cityAndState.city
          updatedMailingAddress.CityError = null;
          updatedMailingAddress.State = cityAndState.state
          updatedMailingAddress.StateError = null;
        }
        updatedMailingAddress.PostalCodeError = null;
        break;

      case "CITY":
        updatedMailingAddress.City = value;
        updatedMailingAddress.CityError = null;
        break;

      case "STATE":
        updatedMailingAddress.State = value;
        updatedMailingAddress.StateError = null;
        break;

      case "ADD-1":
        updatedMailingAddress.AddressLine1 = value;
        updatedMailingAddress.AddressLine1Error = null;
        break;

      case "ADD-2":
        updatedMailingAddress.AddressLine2 = value;
        break;

      case "landmark":
        updateMailingAddress.landmark = value;
        break;

      default:
        break;
    }

    dispatch(updateMailingAddress(updatedMailingAddress))
  }





  const validateAddress = (address, type) => {
    const postalCodeValidity = isValidPostalCodeNumber(address.PostalCode, "Pin Code")
    if (postalCodeValidity != null) {
      if (type == "permanent") {
        dispatch(updatePermanentAddress({ ...AddressDetailSlice.data[0], PostalCodeError: postalCodeValidity }))
      }
      else if (type == "current") {
        dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[1], PostalCodeError: postalCodeValidity }))
      }
      else if (type == "mailing") {
        dispatch(updateMailingAddress({ ...AddressDetailSlice.data[2], PostalCodeError: postalCodeValidity }))
      }
      return false;
    }

    const cityValidity = isValidField(address.City, "City")
    if (cityValidity != null) {
      if (type == "permanent") {
        dispatch(updatePermanentAddress({ ...AddressDetailSlice.data[0], CityError: cityValidity }))
      }
      else if (type == "current") {
        dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[1], CityError: cityValidity }))
      }
      else if (type == "mailing") {
        dispatch(updateMailingAddress({ ...AddressDetailSlice.data[2], CityError: cityValidity }))
      }
      return false;
    }

    const stateValidity = isValidField(address.State, "State")
    if (stateValidity != null) {
      if (type == "permanent") {
        dispatch(updatePermanentAddress({ ...AddressDetailSlice.data[0], StateError: stateValidity }))
      }
      else if (type == "current") {
        dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[1], StateError: stateValidity }))
      }
      else if (type == "mailing") {
        dispatch(updateMailingAddress({ ...AddressDetailSlice.data[2], StateError: stateValidity }))
      }
      return false;
    }

    const addressLine1Validity = isValidField(address.AddressLine1, "Address Line 1")

    if (addressLine1Validity != null) {
      if (type == "permanent") {
        dispatch(updatePermanentAddress({ ...AddressDetailSlice.data[0], AddressLine1Error: addressLine1Validity }))
      }
      else if (type == "current") {
        dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[1], AddressLine1Error: addressLine1Validity }))
      }
      else if (type == "mailing") {
        dispatch(updateMailingAddress({ ...AddressDetailSlice.data[2], AddressLine1Error: addressLine1Validity }))
      }
      return false;
    }

    return true
  }

  const handleProcessed = async() => {


    if(extraSlices.isBreDone){
      navigation.navigate('employmentDetail');
      return;
    }


    let totalAddress = []

    if (!validateAddress(AddressDetailSlice.data[0], "permanent")) {
      OpenDiiferentAddress("permanent")
      return
    }
    totalAddress[0] = { ...AddressDetailSlice.data[0] }

    if (!validateAddress(AddressDetailSlice.data[1], "current")) {
      OpenDiiferentAddress("current")
      return
    }
    totalAddress[1] = { ...AddressDetailSlice.data[1] }

    if (!validateAddress(AddressDetailSlice.data[2], "mailing")) {
      OpenDiiferentAddress("mailing")
      return
    }
    totalAddress[2] = { ...AddressDetailSlice.data[2] }

    console.log("Lead id : ", leadId)

    let LeadStage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "addressDetail") {
      LeadStage = nextJumpTo + 1
    }

    for (let index = 0; index < totalAddress.length; index++) {
      totalAddress[index].LeadId = leadId
      totalAddress[index].Leadstage = LeadStage
    }

    console.log(totalAddress)


    if(await checkLocationPermission() == false){
      navigation.navigate("PermissionsScreen", {permissionStatus : "denied", permissionType : "location"})
      return
    }


    setLoading(true)



    SubmitAddress(totalAddress).then(response => {
     
      setNewErrorScreen(null)
      console.log(response)
      setLoading(false)

      if (response.status == STATUS.ERROR) {
        if(response.message == Network_Error || response.message != null){
          setNewErrorScreen(response.message)
          return
        }
        setOtherError(response.message)
        return
      }

      if (ALL_SCREEN[nextJumpTo] == "addressDetail") {
        dispatch(updateJumpTo(LeadStage))
      }

      setOtherError(null)
      navigation.navigate('employmentDetail')
    })

  }


   //required for web
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
            <ProgressBar progress={0.09} />
            <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>Address Details</Text>
            {otherError && (
              <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{otherError}</Text>
            )}
            <Accordion title="Permanent Address" expanded={permanentExpanded} setExpanded={(e)=>{setPermanentExpanded(!permanentExpanded)}}>
              <View style={styles.addressForm}>
                <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                  <CustomInput widthPercentage = {"48%"} maxLength={6} value={AddressDetailSlice.data[0].PostalCode} error={AddressDetailSlice.data[0].PostalCodeError} onChangeText={(e) => { UpdatePermanentAddress("PIN-CODE", e) }} placeholder="PIN Code" keyboardType="numeric" />
                  <CustomInput widthPercentage = {"48%"} value={AddressDetailSlice.data[0].City} error={AddressDetailSlice.data[0].CityError} onChangeText={(e) => { UpdatePermanentAddress("CITY", e) }} placeholder="City" cityOrState={true} />
                </View>

                <CustomInput placeholder="State" error={AddressDetailSlice.data[0].StateError} value={AddressDetailSlice.data[0].State} onChangeText={(e) => { UpdatePermanentAddress("STATE", e) }} cityOrState={true} />

                <CustomInput placeholder="Address line 1" error={AddressDetailSlice.data[0].AddressLine1Error} value={AddressDetailSlice.data[0].AddressLine1} onChangeText={(e) => { UpdatePermanentAddress("ADD-1", e) }} />

                <CustomInput placeholder="Address line 2" value={AddressDetailSlice.data[0].AddressLine2} onChangeText={(e) => { UpdatePermanentAddress("ADD-2", e) }} />
                <CustomInput placeholder="Landmark" value={AddressDetailSlice.data[0].landmark} onChangeText={(e) => { UpdatePermanentAddress("landmark", e) }} />

              </View>
            </Accordion>
            <Accordion title="Current Address" expanded={currentExpanded} setExpanded={(e)=>{setCurrentExpanded(!currentExpanded)}}>
              <View style={styles.addressForm}>
                <View style={styles.RadioWrapper}>
                  {addressOptions.current.map((option, index) => (
                    <RadioButton
                      key={index}
                      label={option}
                      isSelected={selectedCurrent === option}
                      onPress={() => setSelectedCurrent(option)}
                      style={{ marginBottom: 5 }}
                    />
                  ))}
                </View>

                <View>
                  <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                    <CustomInput  widthPercentage = {"48%"} maxLength={6} placeholder="PIN Code" keyboardType="numeric" value={AddressDetailSlice.data[1].PostalCode} error={AddressDetailSlice.data[1].PostalCodeError} onChangeText={(e) => { UpdateCurrentAddress("PIN-CODE", e) }} />
                    <CustomInput  widthPercentage = {"48%"} placeholder="City" cityOrState={true} value={AddressDetailSlice.data[1].City} error={AddressDetailSlice.data[1].CityError} onChangeText={(e) => { UpdateCurrentAddress("CITY", e) }} />
                  </View>

                  <CustomInput placeholder="State" error={AddressDetailSlice.data[1].StateError} cityOrState={true} value={AddressDetailSlice.data[1].State} onChangeText={(e) => { UpdateCurrentAddress("STATE", e) }} />

                  <CustomInput placeholder="Address line 1" error={AddressDetailSlice.data[1].AddressLine1Error} value={AddressDetailSlice.data[1].AddressLine1} onChangeText={(e) => { UpdateCurrentAddress("ADD-1", e) }} />

                  <CustomInput placeholder="Address line 2" value={AddressDetailSlice.data[1].AddressLine2} onChangeText={(e) => { UpdateCurrentAddress("ADD-2", e) }} />
                  <CustomInput placeholder="Landmark" value={AddressDetailSlice.data[1].landmark} onChangeText={(e) => { UpdateCurrentAddress("landmark", e) }} />
                </View>




              </View>
            </Accordion>
            <Accordion title="Mailing Address" expanded={mailingExpanded} setExpanded={(e)=>{setMailingExpanded(!mailingExpanded)}}>
              <View style={styles.addressForm}>
                <View style={styles.RadioWrapper}>
                  {addressOptions.mailing.map((option, index) => (
                    <RadioButton
                      key={index}
                      label={option}
                      isSelected={selectedMailing === option}
                      onPress={() => setSelectedMailing(option)}
                      style={{ marginBottom: 5 }}
                    />
                  ))}
                </View>
                <View>
                  <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                    <CustomInput  widthPercentage = {"48%"} maxLength={6} placeholder="PIN Code" keyboardType="numeric" value={AddressDetailSlice.data[2].PostalCode} error={AddressDetailSlice.data[2].PostalCodeError} onChangeText={(e) => { UpdateMailingAddress("PIN-CODE", e) }} />
                    <CustomInput  widthPercentage = {"48%"} placeholder="City" cityOrState={true} value={AddressDetailSlice.data[2].City} error={AddressDetailSlice.data[2].CityError} onChangeText={(e) => { UpdateMailingAddress("CITY", e) }} />
                  </View>

                  <CustomInput placeholder="State" error={AddressDetailSlice.data[2].StateError} cityOrState={true} value={AddressDetailSlice.data[2].State} onChangeText={(e) => { UpdateMailingAddress("STATE", e) }} />

                  <CustomInput placeholder="Address line 1" error={AddressDetailSlice.data[2].AddressLine1Error} value={AddressDetailSlice.data[2].AddressLine1} onChangeText={(e) => { UpdateMailingAddress("ADD-1", e) }} />

                  <CustomInput placeholder="Address line 2" value={AddressDetailSlice.data[2].AddressLine2} onChangeText={(e) => { UpdateMailingAddress("ADD-2", e) }} />
                  <CustomInput placeholder="Landmark" value={AddressDetailSlice.data[2].landmark} onChangeText={(e) => { UpdateMailingAddress("landmark", e) }} />
                </View>

              </View>
            </Accordion>
          </View>


          {/* Navigation Buttons */}

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => { GoBack(navigation) }}>
              <Text style={[styles.backBtnText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize) }]}>BACK</Text>
            </TouchableOpacity>
            <LinearGradient
              // button Linear Gradient
              colors={['#002777', '#00194C']}
              style={styles.verifyButton}
            >
              <TouchableOpacity onPress={() => handleProcessed()} >
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



export default AddressScreen;
