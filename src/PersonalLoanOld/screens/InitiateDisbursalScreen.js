import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions

} from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import { useAppContext } from '../../Common/components/useContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../../Common/components/ControlPanel/input';
import { STATUS } from '../services/API/Constants';
import LoadingOverlay from '../components/FullScreenLoader';
import ScreenError, { useErrorEffect } from './ScreenError';
import { CreateLA, GetDisbursalData, GetDisbursalModel } from '../services/API/InitialDisbursal';
import { format } from 'date-fns';
import { updateDisbursalInfoFromGetDisbursalData } from '../services/Utils/Redux/DisbursalInfo';

import { useDispatch, useSelector } from 'react-redux';
import { GetApplicantId } from '../services/LOCAL/AsyncStroage';
import { ALL_SCREEN } from '../services/Utils/Constants';
import SaveLeadStage from '../services/API/SaveLeadStage';
import { updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { useFocusEffect } from '@react-navigation/native';

const InitiateDisbursalScreen = ({ navigation }) => {

  const { width, height } = useWindowDimensions();
  const [applicationId, setApplicationId] = useState(null)
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);

  const dispatch = useDispatch()

  const onTryAgainClick = () => {
    setNewErrorScreen(null)
    setRefreshPage(true)
  }

  const [refreshPage, setRefreshPage] = useState(true)

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)

  const [eMandateUMRN, setEMandateUMRN] = useState('');

  const [selectedAccount, setSelectedAccount] = useState();
  const [selectedAccountError, setSelectedAccountError] = useState()

  const [loading, setLoading] = useState(false);

  const [requestModel, setRequestModel] = useState(null)


  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.8);
  }, [navigation]);

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };


  const isWeb = Platform.OS === 'web';

  useFocusEffect(
    useCallback(() => {
      if (!refreshPage) {
        return
      }
      setLoading(true)

      GetDisbursalData().then((response) => {
        setLoading(false)
        if (response.status == STATUS.ERROR) {
          setNewErrorScreen(response.message)
          return
        }
        let details = GetDisbursalModel(response.data)
        if(details.BankAccount.length == 1){
          setSelectedAccount(details.BankAccount[0])
        }
        setRequestModel(details)

      })
      GetApplicantId().then((response) => {
        setApplicationId(response)
      })
      setRefreshPage(false)

    }, [refreshPage]))


  useEffect(() => {
    if (selectedAccount) {
      setSelectedAccountError(null)
    }
    if (requestModel) {
      dispatch(updateDisbursalInfoFromGetDisbursalData(requestModel))
    }

  }, [requestModel, selectedAccount])

  const onProceed = async () => {
    if (!selectedAccount) {
      setSelectedAccountError("Please Provide Bank Account")
      return
    }

    setLoading(true)


    let createLaResponse = await CreateLA()

    if (createLaResponse.status == STATUS.ERROR) {
      setLoading(false)
      setNewErrorScreen(response.message)
    }

    let Leadstage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "InitiateDisbursalScreen") {
      Leadstage = nextJumpTo + 1
      const saveLeadStageResponse = await SaveLeadStage(Leadstage)
      if (saveLeadStageResponse == STATUS.ERROR) {
        setLoading(false)
        setNewErrorScreen(response.message)
        return
      }

      dispatch(updateJumpTo(Leadstage))

    }



    navigation.navigate("Disbursement")
  }

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
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >


          <LoadingOverlay visible={loading} />

          <ScrollView contentContainerStyle={{ flexGrow: 1 }} >

            <View style={styles.container}>
              <View>
                <ProgressBar progress={0.8} />
                <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>
                  Initiate Disbursal
                </Text>
                <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>Bank Account Number <Text style={styles.mandatoryStar}>*</Text></Text>

                <View style={styles.pickerContainer}>

                  {
                    requestModel?.BankAccount?.length == 1 ?
                      <View style={{marginVertical:12, marginHorizontal:10}}>
                          <Text style={{fontSize: 16, color: '#00194C'}}>{selectedAccount}</Text>
                      </View>
                      :
                      <Picker
                        selectedValue={selectedAccount}
                        onValueChange={(itemValue) => setSelectedAccount(itemValue)}
                        style={[styles.picker, { fontSize: dynamicFontSize(styles.picker.fontSize) }]}
                      >
                        <Picker.Item label="Select an account" value={null} />

                        {requestModel?.BankAccount?.map(account => (
                          <Picker.Item key={account} label={account} value={account} />
                        ))}
                      </Picker>


                  }





                </View>
                {selectedAccountError && (
                  <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{selectedAccountError}</Text>
                )}
                <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>
                  eMandate UMRN <Text style={styles.mandatoryStar}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <Icon name="book" size={24} color="#FFf" style={styles.inputIcon} />
                  <CustomInput
                    value={requestModel?.EmandateUMRN}
                    onChangeText={setEMandateUMRN}
                    placeholder="Enter eMandate UMRN"
                    keyboardType="numeric"
                  />
                </View>




                <View style={styles.tableContainer}>

                  <View

                    style={[
                      styles.tableRow,
                    ]}
                  >
                    <Text style={styles.tableHeader}>Loan ID</Text>
                    <Text style={styles.tableData}>{applicationId}</Text>
                  </View>



                  <View

                    style={[
                      styles.tableRow,
                    ]}
                  >
                    <Text style={styles.tableHeader}>Loan Amount</Text>
                    <Text style={styles.tableData}>{requestModel?.LoanAmount && `₹ ${requestModel?.LoanAmount}`}</Text>
                  </View>




                  <View

                    style={[
                      styles.tableRow,
                    ]}
                  >
                    <Text style={styles.tableHeader}>Processing Fee</Text>
                    <Text style={styles.tableData}>{requestModel?.ProcessingFeeAmount && `₹ ${requestModel?.ProcessingFeeAmount}`}</Text>
                  </View>



                  <View

                    style={[
                      styles.tableRow,
                    ]}
                  >
                    <Text style={styles.tableHeader}>EMI Start Date</Text>
                    <Text style={styles.tableData}>{requestModel?.FirstEMIDate && format(requestModel?.FirstEMIDate, "PPP")}</Text>
                  </View>




                  <View

                    style={[
                      styles.tableRow,
                    ]}
                  >
                    <Text style={styles.tableHeader}>EMI Amount</Text>
                    <Text style={styles.tableData}>{requestModel?.EmiAmount && `₹ ${requestModel?.EmiAmount}`}</Text>
                  </View>



                </View>


              </View>

              <LinearGradient colors={['#002777', '#00194C']} style={styles.initiateButton}>
                <TouchableOpacity onPress={() => onProceed()}>

                  <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>
                    {requestModel?.IsAutoDisbursement === true ? "Initiate" : "Self Disbursal"}

                  </Text>
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

export default InitiateDisbursalScreen;