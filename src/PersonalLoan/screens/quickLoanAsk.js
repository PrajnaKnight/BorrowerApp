import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../assets/style/personalStyle';
import ButtonComponent from '../components/button';
import CustomDropdown from '../components/dropdownPicker';
import { useAppContext } from '../components/useContext';
import LoanAskDetails, { LoanPurpose } from '../services/API/LoanAskDetails';
import { GetLeadId } from '../services/LOCAL/AsyncStroage';
import { STATUS } from '../services/API/Constants';
import { isValidNumberOnlyField, isValidField, formateAmmountValue, properAmmount } from '../services/Utils/FieldVerifier';

import LoadingOverlay from '../components/FullScreenLoader';
import { useDispatch, useSelector } from 'react-redux';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { BackHandler } from 'react-native';
import { fetchLoanAskDetails, updateCurrentLoanAsk } from '../services/Utils/Redux/LoanAskSlices';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';

import ScreenError, { useErrorEffect } from './ScreenError';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import CustomSlider from '../components/CustomSlider';
import { checkLocationPermission } from './PermissionScreen';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { useFocusEffect } from '@react-navigation/native';

function QuickLoanAsk({ navigation }) {
  const dispatch = useDispatch();
  const nextJumpTo = useSelector((state) => state.leadStageSlice.jumpTo);
  const loanAskDetails = useSelector((state) => state.loanAskSlice);
  const extraSlices = useSelector(state => state.extraStageSlice);

  const [LeadId, setLeadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [loanAmountError, setLoanAmountError] = useState(null);
  const [purposeError, setPurposeError] = useState(null);
  const [tenureError, setTenureError] = useState(null);
  const [otherError, setOtherError] = useState(null);
  const [refreshPage, setRefreshPage] = useState(true);

  const onTryAgainClick = () => {
    setRefreshPage(true);
  };

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!refreshPage) return;

      dispatch(fetchLoanAskDetails());
      GetLeadId().then((response) => {
        setLeadId(response);
      });

      LoanPurpose().then((response) => {
        if (response.data) {
          const purpose = response.data.reduce((acc, item) => {
            if (!acc.find(p => p.label === item.Text)) {
              acc.push({ label: item.Text, value: item.Text });
            }
            return acc;
          }, []);
          setItems([...purpose]);
        }
      });

      setRefreshPage(false);

    }, [refreshPage]) // Empty dependency array means it will run once when the screen is focused
  );

  useEffect(() => {
    setLoading(loanAskDetails.loading);
  }, [loanAskDetails.loading]);

  useEffect(() => {
    if (loanAskDetails.error === Network_Error || loanAskDetails.error) {
      setNewErrorScreen(loanAskDetails.error);
    }
  }, [loanAskDetails.error]);

  const handleLoanAmountSliderChange = (value, from = null) => {

    if (extraSlices.isBreDone) {
      return
    }
    let finalValue = parseInt(properAmmount(value)) || 0;
    if (from) {
      if (finalValue > 500000) finalValue = 500000;
      else if (finalValue < 0) finalValue = 0;
    }

    const currentLoanAsk = { ...loanAskDetails.data, LoanAmount: finalValue };
    dispatch(updateCurrentLoanAsk(currentLoanAsk));
    setLoanAmountError(null);
  };

  const handleSliderTenureChange = (value, from = null) => {
    let finalValue = parseInt(value) || 0;
    if (from) {
      if (finalValue > 72) finalValue = 72;
      else if (finalValue < 0) finalValue = 0;
    }

    const currentLoanAsk = { ...loanAskDetails.data, AskTenure: finalValue };
    dispatch(updateCurrentLoanAsk(currentLoanAsk));
    setTenureError(null);
  };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const handleProceed = async () => {

    if (extraSlices.isBreDone) {

      navigation.navigate('primaryInfo');
      return;
    }

    const loanAmountValidity = isValidNumberOnlyField(loanAskDetails.data.LoanAmount, "Loan Amount");
    setLoanAmountError(loanAmountValidity);
    if (loanAmountValidity) return;

    if (loanAskDetails.data.LoanAmount < 0 || loanAskDetails.data.LoanAmount > 500000) {
      setLoanAmountError("Please provide valid loan amount in given range");
      return;
    }

    const askTenureValidity = isValidNumberOnlyField(loanAskDetails.data.AskTenure, "Tenure");
    setTenureError(askTenureValidity);
    if (askTenureValidity) return;

    if (loanAskDetails.data.AskTenure < 0 || loanAskDetails.data.AskTenure > 72) {
      setTenureError("Please provide valid tenure in given range");
      return;
    }

    const purposeValidity = isValidField(loanAskDetails.data.PurposeOfLoan, "Loan Purpose");
    setPurposeError(purposeValidity);
    if (purposeValidity) return;

    await submitLoanAsk();
  };

  const setPurposeOfLoad = (label) => {
    const currentLoanAsk = { ...loanAskDetails.data, PurposeOfLoan: label };
    dispatch(updateCurrentLoanAsk(currentLoanAsk));
    setPurposeError(null);
  };

  const submitLoanAsk = async () => {
    if (!(await checkLocationPermission())) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" });
      return;
    }

    setLoading(true);

    let LeadStage = nextJumpTo;
    if (ALL_SCREEN[nextJumpTo] === "QLA") {
      LeadStage = nextJumpTo + 1;
    }

    const model = { ...loanAskDetails.data, LeadStage, LeadId };
    console.log("-------------------- QLA REQUEST ------------------------");
    console.log(model);
    console.log("-------------------- QLA REQUEST END ------------------------");

    LoanAskDetails(model).then((response) => {
      setLoading(false);

      if (response.status === STATUS.ERROR) {
        if (response.message === Network_Error || response.message) {
          setNewErrorScreen(response.message);
          return;
        }
        setOtherError(response.message);
        return;
      }
      if (ALL_SCREEN[nextJumpTo] === "QLA") {
        dispatch(updateJumpTo(LeadStage));
      }
      navigation.navigate('primaryInfo');
    });
  };

  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.01);
  }, []);

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

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
                colors={['#000565', '#111791', '#000565']}
                style={styles.webinterestButton}
              >
                <TouchableOpacity>
                  <Text style={styles.webinterestText}>Interest starting from 8.4%*</Text>
                </TouchableOpacity>
              </LinearGradient>
              <View style={styles.webfeaturesContainer}>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>%</Text>
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
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          style={[styles.rightCOntainer, { flex: 1 }]}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <LoadingOverlay visible={loading} />
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View>
                <View>
                  <ProgressBar progress={0.01} />
                  <Text style={[styles.welcomeText, { fontSize: dynamicFontSize(styles.welcomeText.fontSize) }]}>
                    <Text style={[styles.boldText, { fontSize: dynamicFontSize(styles.boldText.fontSize) }]}>Welcome,</Text> please select the loan amount you require
                  </Text>
                  {otherError && <Text style={styles.errorText}>{otherError}</Text>}
                </View>
                <CustomSlider
                  title="Loan Amount"
                  icon="rupee"
                  keyboardType='numeric'
                  min={0}
                  max={500000}
                  steps={10000}
                  sliderValue={properAmmount(loanAskDetails.data.LoanAmount)}
                  inputValue={formateAmmountValue(loanAskDetails.data.LoanAmount.toString())}
                  error={loanAmountError}
                  onChange={(e, from) => handleLoanAmountSliderChange(e, from)}
                  isForAmount={true}
                />
                <CustomSlider
                  title="Tenure"
                  icon="calendar"
                  keyboardType='numeric'
                  min={0}
                  max={72}
                  steps={3}
                  sliderValue={loanAskDetails.data.AskTenure}
                  inputValue={loanAskDetails.data.AskTenure.toString()}
                  error={tenureError}
                  onChange={(e, from) => handleSliderTenureChange(e, from)}
                />
                <View style={styles.loanLabel}>
                  <Text style={[styles.loanLabel, { fontSize: dynamicFontSize(styles.loanLabel.fontSize) }]}>
                    Select a purpose <Text style={[styles.mandatoryStar, { fontSize: dynamicFontSize(styles.mandatoryStar.fontSize) }]}>*</Text>
                  </Text>
                </View>
                <CustomDropdown
                  value={loanAskDetails.data.PurposeOfLoan}
                  items={items}
                  setValue={(e) => setPurposeOfLoad(e.label)}
                  setItems={setItems}
                  placeholder="Select"
                  style={[styles.dropdownBorder, { fontSize }]}
                  autoScroll={true}
                />
                {purposeError && <Text style={styles.errorText}>{purposeError}</Text>}
              </View>
              <LinearGradient
                colors={['#002777', '#00194C']}
                style={[styles.proceedbutton, { fontSize }]}
              >
                <ButtonComponent
                  title="PROCEED"
                  onPress={handleProceed}
                  textStyle={styles.buttonEnabledText}
                />
              </LinearGradient>
            </View>
          </ScrollView>
          {errorScreen.type != null && <ScreenError errorObject={errorScreen} onTryAgainClick={onTryAgainClick} setNewErrorScreen={setNewErrorScreen} />}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

export default QuickLoanAsk;
