import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform , useWindowDimensions} from 'react-native';
import { styles } from '../services/style/gloablStyle';
import CustomInput from '../components/input';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import RadioButton from '../components/radioButton';
import SubmitAddress, { GetCityAndState } from '../services/API/AddressDetails';
import { GetHeader, STATUS } from '../services/API/Constants';
import { GetLeadId } from '../services/LOCAL/AsyncStroage';
import { isValidField, isValidPostalCodeNumber } from '../services/Utils/FieldVerifier';
import LoadingOverlay from '../components/FullScreenLoader';
import { GoBack } from '../services/Utils/ViewValidator';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetBorrowerAddress, updateCurrentAddress, updateMailingAddress, updatePermanentAddress } from '../services/Utils/Redux/AddressDetailSlices';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';
import ScreenError, { useErrorEffect } from './ScreenError';
import { checkLocationPermission } from './PermissionScreen';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';


const AddressScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const AddressDetailSlice = useSelector(state => state.addressDetailSlices);
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const extraSlices = useSelector(state => state.extraStageSlice);


  const [loading, setLoading] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [otherError, setOtherError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(true);
  const [activeTab, setActiveTab] = useState('permanent');
  const [isFormValid, setIsFormValid] = useState(false);
  
  const onTryAgainClick = () => {
    setRefreshPage(true);
  };

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);

   useFocusEffect(
    useCallback(() => {

    if(!refreshPage){
      return
    }
    setProgress(0.09);
    dispatch(fetchGetBorrowerAddress());
    GetLeadId().then(response => {
      setLeadId(response);
    });

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

  useFocusEffect(
    useCallback(() => {
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

  }, [AddressDetailSlice.data]))


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
    const postalCodeValidity = isValidPostalCodeNumber(value, "Postal Code");
    if (postalCodeValidity != null) {
      return null;
    }

    setLoading(true);
    const response = await GetCityAndState(value);
    setLoading(false);

    if (response.status == STATUS.ERROR) {
      return null;
    }
    setOtherError(null);

    let city;
    let state;
    if (response.data.length > 0) {
      state = response.data[0].Text;
    }
    if (response.data.length > 1) {
      city = response.data[1].Text;
    }

    return { city, state };
  };

  const handleAddressUpdate = async (type, value, addressType) => {
    let updatedAddress;
    if (addressType === 'permanent') {
      updatedAddress = { ...AddressDetailSlice.data[0] };
    } else if (addressType === 'current') {
      updatedAddress = { ...AddressDetailSlice.data[1] };
    } else {
      updatedAddress = { ...AddressDetailSlice.data[2] };
    }

    switch (type) {
      case "PIN-CODE":
        const pincode = value.replace(/[^0-9]/g, '');
        updatedAddress.PostalCode = pincode;
        const cityAndState = await GetCityAndStateByPincode(pincode);
        if (cityAndState != null) {
          updatedAddress.City = cityAndState.city;
          updatedAddress.CityError = null;
          updatedAddress.State = cityAndState.state;
          updatedAddress.StateError = null;
        }
        updatedAddress.PostalCodeError = null;
        break;
      case "CITY":
        updatedAddress.City = value;
        updatedAddress.CityError = null;
        break;
      case "STATE":
        updatedAddress.State = value;
        updatedAddress.StateError = null;
        break;
      case "ADD-1":
        updatedAddress.AddressLine1 = value;
        updatedAddress.AddressLine1Error = null;
        break;
      case "ADD-2":
        updatedAddress.AddressLine2 = value;
        break;
      case "landmark":
        updatedAddress.landmark = value;
        break;
      default:
        break;
    }

    if (addressType === 'permanent') {
      dispatch(updatePermanentAddress(updatedAddress));
    } else if (addressType === 'current') {
      dispatch(updateCurrentAddress(updatedAddress));
    } else {
      dispatch(updateMailingAddress(updatedAddress));
    }

    validateForm();
  };

  const validateAddress = (address, type, showError = true) => {
    const postalCodeValidity = isValidPostalCodeNumber(address.PostalCode, "Pin Code");
    if (postalCodeValidity != null) {
      if (showError) {
        if (type == "permanent") {
          dispatch(updatePermanentAddress({ ...AddressDetailSlice.data[0], PostalCodeError: postalCodeValidity }));
        } else if (type == "current") {
          dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[1], PostalCodeError: postalCodeValidity }));
        } else if (type == "mailing") {
          dispatch(updateMailingAddress({ ...AddressDetailSlice.data[2], PostalCodeError: postalCodeValidity }));
        }
      }
      return false;
    }

    const cityValidity = isValidField(address.City, "City");
    if (cityValidity != null) {
      if (showError) {
        if (type == "permanent") {
          dispatch(updatePermanentAddress({ ...AddressDetailSlice.data[0], CityError: cityValidity }));
        } else if (type == "current") {
          dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[1], CityError: cityValidity }));
        } else if (type == "mailing") {
          dispatch(updateMailingAddress({ ...AddressDetailSlice.data[2], CityError: cityValidity }));
        }
      }
      return false;
    }

    const stateValidity = isValidField(address.State, "State");
    if (stateValidity != null) {
      if (showError) {
        if (type == "permanent") {
          dispatch(updatePermanentAddress({ ...AddressDetailSlice.data[0], StateError: stateValidity }));
        } else if (type == "current") {
          dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[1], StateError: stateValidity }));
        } else if (type == "mailing") {
          dispatch(updateMailingAddress({ ...AddressDetailSlice.data[2], StateError: stateValidity }));
        }
      }
      return false;
    }

    const addressLine1Validity = isValidField(address.AddressLine1, "Address Line 1");
    if (addressLine1Validity != null) {
      if (showError) {
        if (type == "permanent") {
          dispatch(updatePermanentAddress({ ...AddressDetailSlice.data[0], AddressLine1Error: addressLine1Validity }));
        } else if (type == "current") {
          dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[1], AddressLine1Error: addressLine1Validity }));
        } else if (type == "mailing") {
          dispatch(updateMailingAddress({ ...AddressDetailSlice.data[2], AddressLine1Error: addressLine1Validity }));
        }
      }
      return false;
    }

    return true;
  };

  const handleProcessed = async() => {


    if(extraSlices.isBreDone){
      navigation.navigate('employmentDetail');
      return;
    }


    let totalAddress = []

    if (!validateAddress(AddressDetailSlice.data[0], "permanent")) {
      setActiveTab("permanent");
      return;
    }
    totalAddress[0] = { ...AddressDetailSlice.data[0] };

    if (!validateAddress(AddressDetailSlice.data[1], "current")) {
      setActiveTab("current");
      return;
    }
    totalAddress[1] = { ...AddressDetailSlice.data[1] };

    if (!validateAddress(AddressDetailSlice.data[2], "mailing")) {
      setActiveTab("mailing");
      return;
    }
    totalAddress[2] = { ...AddressDetailSlice.data[2] };

    let LeadStage = nextJumpTo;
    if (ALL_SCREEN[nextJumpTo] == "addressDetail") {
      LeadStage = nextJumpTo + 1;
    }

    for (let index = 0; index < totalAddress.length; index++) {
      totalAddress[index].LeadId = leadId;
      totalAddress[index].Leadstage = LeadStage;
    }

    if (await checkLocationPermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" });
      return;
    }

    setLoading(true);

    SubmitAddress(totalAddress).then(response => {
      setNewErrorScreen(null);
      setLoading(false);

      if (response.status == STATUS.ERROR) {
        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message);
          return;
        }
        setOtherError(response.message);
        return;
      }

      if (ALL_SCREEN[nextJumpTo] == "addressDetail") {
        dispatch(updateJumpTo(LeadStage));
      }

      setOtherError(null);
      navigation.navigate('employmentDetail');
    });
  };

  const { setProgress } = useProgressBar();

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
            <ProgressBar progress={0.09} />
            <Text
              style={[
                styles.headerText,
                { fontSize: dynamicFontSize(styles.headerText.fontSize) },
              ]}>
              Address Details
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer} style={styles.tabScrollView}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'permanent' && styles.activeTab]}
              onPress={() => setActiveTab('permanent')}>
              <Text style={[styles.tabText, activeTab === 'permanent' && styles.activeTabText]}>Permanent <Text style={styles.mandatoryStar}>*</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'current' && styles.activeTab]}
              onPress={() => setActiveTab('current')}>
              <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>Current <Text style={styles.mandatoryStar}>*</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'mailing' && styles.activeTab]}
              onPress={() => setActiveTab('mailing')}>
              <Text style={[styles.tabText, activeTab === 'mailing' && styles.activeTabText]}>Mailing <Text style={styles.mandatoryStar}>*</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'add' && styles.activeTab]}
              disabled={true}
              onPress={() =>{}}>
              <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
                <FontAwesome5 name="plus" size={16} /> Add
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              {otherError && (
                <Text
                  style={[
                    styles.errorText,
                    { fontSize: dynamicFontSize(styles.errorText.fontSize) },
                  ]}>
                  {otherError}
                </Text>
              )}
              {activeTab === 'permanent' && (
                <View style={styles.addressForm}>
                  <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                    <CustomInput
                      widthPercentage={"48%"}
                      maxLength={6}
                      value={AddressDetailSlice.data[0].PostalCode}
                      error={AddressDetailSlice.data[0].PostalCodeError}
                      onChangeText={(e) => handleAddressUpdate("PIN-CODE", e, "permanent")}
                      placeholder="PIN Code"
                      keyboardType="numeric"
                    />
                    <CustomInput
                      widthPercentage={"48%"}
                      value={AddressDetailSlice.data[0].City}
                      error={AddressDetailSlice.data[0].CityError}
                      onChangeText={(e) => handleAddressUpdate("CITY", e, "permanent")}
                      placeholder="City"
                      cityOrState={true}
                    />
                  </View>
                  <CustomInput
                    placeholder="State"
                    error={AddressDetailSlice.data[0].StateError}
                    value={AddressDetailSlice.data[0].State}
                    onChangeText={(e) => handleAddressUpdate("STATE", e, "permanent")}
                    cityOrState={true}
                  />
                  <CustomInput
                    placeholder="Address line 1"
                    error={AddressDetailSlice.data[0].AddressLine1Error}
                    value={AddressDetailSlice.data[0].AddressLine1}
                    onChangeText={(e) => handleAddressUpdate("ADD-1", e, "permanent")}
                  />
                  <CustomInput
                    placeholder="Address line 2"
                    value={AddressDetailSlice.data[0].AddressLine2}
                    onChangeText={(e) => handleAddressUpdate("ADD-2", e, "permanent")}
                  />
                  <CustomInput
                    placeholder="Landmark"
                    value={AddressDetailSlice.data[0].landmark}
                    onChangeText={(e) => handleAddressUpdate("landmark", e, "permanent")}
                  />
                </View>
              )}
              {activeTab === 'current' && (
                <View style={styles.addressForm}>
                  <View style={styles.RadioWrapper}>
                    <RadioButton
                      label="Same as Permanent Address"
                      isSelected={selectedCurrent === 'Same as Permanent Address'}
                      onPress={() => {
                        setSelectedCurrent('Same as Permanent Address');
                        dispatch(updateCurrentAddress({ ...AddressDetailSlice.data[0], Id: AddressDetailSlice.data[1].Id }));
                      }}
                      style={{ marginBottom: 5 }}
                    />
                    <RadioButton
                      label="Different Address"
                      isSelected={selectedCurrent === 'Different Address'}
                      onPress={() => setSelectedCurrent('Different Address')}
                      style={{ marginBottom: 5 }}
                    />
                  </View>
                  <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                    <CustomInput
                      widthPercentage={"48%"}
                      maxLength={6}
                      placeholder="PIN Code"
                      keyboardType="numeric"
                      value={AddressDetailSlice.data[1].PostalCode}
                      error={AddressDetailSlice.data[1].PostalCodeError}
                      onChangeText={(e) => handleAddressUpdate("PIN-CODE", e, "current")}
                    />
                    <CustomInput
                      widthPercentage={"48%"}
                      placeholder="City"
                      cityOrState={true}
                      value={AddressDetailSlice.data[1].City}
                      error={AddressDetailSlice.data[1].CityError}
                      onChangeText={(e) => handleAddressUpdate("CITY", e, "current")}
                    />
                  </View>
                  <CustomInput
                    placeholder="State"
                    error={AddressDetailSlice.data[1].StateError}
                    cityOrState={true}
                    value={AddressDetailSlice.data[1].State}
                    onChangeText={(e) => handleAddressUpdate("STATE", e, "current")}
                  />
                  <CustomInput
                    placeholder="Address line 1"
                    error={AddressDetailSlice.data[1].AddressLine1Error}
                    value={AddressDetailSlice.data[1].AddressLine1}
                    onChangeText={(e) => handleAddressUpdate("ADD-1", e, "current")}
                  />
                  <CustomInput
                    placeholder="Address line 2"
                    value={AddressDetailSlice.data[1].AddressLine2}
                    onChangeText={(e) => handleAddressUpdate("ADD-2", e, "current")}
                  />
                  <CustomInput
                    placeholder="Landmark"
                    value={AddressDetailSlice.data[1].landmark}
                    onChangeText={(e) => handleAddressUpdate("landmark", e, "current")}
                  />
                </View>
              )}
              {activeTab === 'mailing' && (
                <View style={styles.addressForm}>
                  <View style={styles.RadioWrapper}>
                    <RadioButton
                      label="Same as Permanent Address"
                      isSelected={selectedMailing === 'Same as Permanent Address'}
                      onPress={() => {
                        setSelectedMailing('Same as Permanent Address');
                        dispatch(updateMailingAddress({ ...AddressDetailSlice.data[0], Id: AddressDetailSlice.data[2].Id }));
                      }}
                      style={{ marginBottom: 5 }}
                    />
                    <RadioButton
                      label="Same as Current Address"
                      isSelected={selectedMailing === 'Same as Current Address'}
                      onPress={() => {
                        setSelectedMailing('Same as Current Address');
                        dispatch(updateMailingAddress({ ...AddressDetailSlice.data[1], Id: AddressDetailSlice.data[2].Id }));
                      }}
                      style={{ marginBottom: 5 }}
                    />
                    <RadioButton
                      label="Different Address"
                      isSelected={selectedMailing === 'Different Address'}
                      onPress={() => setSelectedMailing('Different Address')}
                      style={{ marginBottom: 5 }}
                    />
                  </View>
                  <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                    <CustomInput
                      widthPercentage={"48%"}
                      maxLength={6}
                      placeholder="PIN Code"
                      keyboardType="numeric"
                      value={AddressDetailSlice.data[2].PostalCode}
                      error={AddressDetailSlice.data[2].PostalCodeError}
                      onChangeText={(e) => handleAddressUpdate("PIN-CODE", e, "mailing")}
                    />
                    <CustomInput
                      widthPercentage={"48%"}
                      placeholder="City"
                      cityOrState={true}
                      value={AddressDetailSlice.data[2].City}
                      error={AddressDetailSlice.data[2].CityError}
                      onChangeText={(e) => handleAddressUpdate("CITY", e, "mailing")}
                    />
                  </View>
                  <CustomInput
                    placeholder="State"
                    error={AddressDetailSlice.data[2].StateError}
                    cityOrState={true}
                    value={AddressDetailSlice.data[2].State}
                    onChangeText={(e) => handleAddressUpdate("STATE", e, "mailing")}
                  />
                  <CustomInput
                    placeholder="Address line 1"
                    error={AddressDetailSlice.data[2].AddressLine1Error}
                    value={AddressDetailSlice.data[2].AddressLine1}
                    onChangeText={(e) => handleAddressUpdate("ADD-1", e, "mailing")}
                  />
                  <CustomInput
                    placeholder="Address line 2"
                    value={AddressDetailSlice.data[2].AddressLine2}
                    onChangeText={(e) => handleAddressUpdate("ADD-2", e, "mailing")}
                  />
                  <CustomInput
                    placeholder="Landmark"
                    value={AddressDetailSlice.data[2].landmark}
                    onChangeText={(e) => handleAddressUpdate("landmark", e, "mailing")}
                  />
                </View>
              )}
              {activeTab === 'add' && (
                  <View style={styles.addressForm}>
                  <View style={[styles.flexContent, { flex: 1, alignItems: "baseline" }]}>
                    <CustomInput
                      widthPercentage={"48%"}
                      maxLength={6}
                      placeholder="PIN Code"
                      keyboardType="numeric"
                      value={AddressDetailSlice.data[2].PostalCode}
                      error={AddressDetailSlice.data[2].PostalCodeError}
                      onChangeText={(e) => handleAddressUpdate("PIN-CODE", e, "mailing")}
                    />
                    <CustomInput
                      widthPercentage={"48%"}
                      placeholder="City"
                      cityOrState={true}
                      value={AddressDetailSlice.data[2].City}
                      error={AddressDetailSlice.data[2].CityError}
                      onChangeText={(e) => handleAddressUpdate("CITY", e, "mailing")}
                    />
                  </View>
                  <CustomInput
                    placeholder="State"
                    error={AddressDetailSlice.data[2].StateError}
                    cityOrState={true}
                    value={AddressDetailSlice.data[2].State}
                    onChangeText={(e) => handleAddressUpdate("STATE", e, "mailing")}
                  />
                  <CustomInput
                    placeholder="Address line 1"
                    error={AddressDetailSlice.data[2].AddressLine1Error}
                    value={AddressDetailSlice.data[2].AddressLine1}
                    onChangeText={(e) => handleAddressUpdate("ADD-1", e, "mailing")}
                  />
                  <CustomInput
                    placeholder="Address line 2"
                    value={AddressDetailSlice.data[2].AddressLine2}
                    onChangeText={(e) => handleAddressUpdate("ADD-2", e, "mailing")}
                  />
                  <CustomInput
                    placeholder="Landmark"
                    value={AddressDetailSlice.data[2].landmark}
                    onChangeText={(e) => handleAddressUpdate("landmark", e, "mailing")}
                  />
                </View>
              )}
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
              <TouchableOpacity onPress={() => handleProcessed()}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      fontSize: dynamicFontSize(styles.buttonText.fontSize),
                    },
                  ]}>
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
};

export default AddressScreen;
