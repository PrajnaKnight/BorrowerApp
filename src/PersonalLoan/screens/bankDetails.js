import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions, Alert } from 'react-native';
import CustomInput from '../components/input';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import { styles } from '../services/style/gloablStyle';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import SaveBankAccountDetails, { DeleteBankAccount, GetBranchNameWithIFSC, VerifyBankAccount } from '../services/API/SaveBankAccountDetail';
import LoadingOverlay from '../components/FullScreenLoader';
import { FontAwesome5 } from '@expo/vector-icons';
import { GetLeadId } from '../services/LOCAL/AsyncStroage';
import { isValidField, isValidIfsc, isValidNumberOnlyField } from '../services/Utils/FieldVerifier';
import { GoBack } from '../services/Utils/ViewValidator';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentStage, updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { addBankAccount, deleteBankAccount, fetchGetBankAccountDetails, updateBankDetails } from '../services/Utils/Redux/BankDetailSlices';
import { ALL_SCREEN, Network_Error } from '../services/Utils/Constants';
import { compareTwoStrings } from 'string-similarity';
import ScreenError, { useErrorEffect } from './ScreenError';
import { SendGeoLocation } from '../services/API/LocationApi';
import { checkLocationPermission } from './PermissionScreen';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import useJumpTo from "../components/StageComponent";

const BankDetailsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const stageMaintance = useJumpTo("bankDetail", "loanEligibility", navigation);

  const extraSlices = useSelector(state => state.extraStageSlice);
  const bankAccountSlices = useSelector(state => state.bankDetailSlices);

  const [loading, setLoading] = useState(false);
  const [otherError, setOtherError] = useState(null);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);

  const [addButtonState, setAddButtonState] = useState(true)

  const addAccount = () => {
  
      dispatch(addBankAccount());
      setSelectedAccountIndex(bankAccountSlices.data.BankList.length);
    
  };

  const confirmDeleteAccount = (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteAccount(index) }
      ],
      { cancelable: true }
    );
  };

  const deleteAccount = async(index) => {

    const primaryId = bankAccountSlices.data.BankList[index].PrimaryId

    if(primaryId){
      console.log(primaryId)
      setLoading(true)
      const deleteBankAccoountResponse = await DeleteBankAccount(primaryId)
      setLoading(false)
      if(deleteBankAccoountResponse.status == STATUS.ERROR){
        setNewErrorScreen(deleteBankAccoountResponse.message)
        return
      }
    }
    

    dispatch(deleteBankAccount(index));
    setSelectedAccountIndex(Math.max(0, index - 1));
  };

  const [refreshPage, setRefreshPage] = useState(true);
  const onTryAgainClick = () => {
    setRefreshPage(true);
  };

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick);
  const { setProgress } = useProgressBar();

  useEffect(() => {
    setLoading(bankAccountSlices.loading);
  }, [bankAccountSlices.loading]);

  useFocusEffect(
    useCallback(() => {

      setAddButtonState(bankAccountSlices.data.BankList.length < 3)

      
    },[bankAccountSlices.data.BankList]))

  useFocusEffect(
    useCallback(() => {
      if (refreshPage == false) {
        return
      }
      setProgress(0.2);
      dispatch(fetchGetBankAccountDetails())
      setRefreshPage(false)
    }, [refreshPage]))


  useEffect(() => {
    setNewErrorScreen(null);
    if (bankAccountSlices.error === Network_Error || bankAccountSlices.error != null) {
      setNewErrorScreen(bankAccountSlices.error);
    }
  }, [bankAccountSlices.error]);

  const GetBranchName = async (ifsc) => {
    const ifscValid = isValidIfsc(ifsc);
    if (ifscValid != null) {
      return null;
    }

    setLoading(true);
    const response = await GetBranchNameWithIFSC(ifsc);
    setLoading(false);
    if (response.status === STATUS.ERROR) {
      setOtherError(response.message);
      return null;
    }
    setOtherError(null);

    return response.data;
  };

  const UpdateBankInfo = async (index, key, value) => {

    let bankAcc = { ...bankAccountSlices.data.BankList[index] }
    let nameResponse
    console.log("UpdateBankInfo", `${index}, ${key}, ${value}`)
    switch (key) {
      case "IFSC-CODE":
        bankAcc.IFSC = value;
        bankAcc.IFSCError = null;
        nameResponse = await fetchAccountNumber(bankAcc, value);
        if (nameResponse != null) {

          const isValidName = isValidBankAccountName(bankAccountSlices.data.LeadName, nameResponse)

          if (!isValidName) {
            bankAcc.isAccountNameVaid = false
          }
          else {
            bankAcc.isAccountNameVaid = true
          }

          bankAcc.AccountHolderName = nameResponse
          bankAcc.AccountHolderNameError = null
        }
        const branchName = await GetBranchName(value);
        if (branchName != null) {
          bankAcc.BankBrachName = branchName.BranchName;
          bankAcc.BankName = branchName.BankName;
          bankAcc.BankCode = branchName.BankID;
        }
        bankAcc.BankBracnchNameError = null;
        break;
      case "BRANCH-NAME":
        bankAcc.BankBrachName = value;
        bankAcc.BankBracnchNameError = null;
        break;
      case "ACCOUNT-NUMBER":
        let accountNumber = value.replace(/[^0-9]/g, '');
        bankAcc.AccountNumber = accountNumber;
        bankAcc.AccountNumberError = null;
        if (bankAcc.ReAccountNumber && bankAcc.ReAccountNumber.length > 0) {
          bankAcc.isAccountNumberMatching = bankAcc.ReAccountNumber === bankAcc.AccountNumber;
        }
        nameResponse = await fetchAccountNumber(bankAcc, null, value);
        if (nameResponse != null) {
          const isValidName = isValidBankAccountName(bankAccountSlices.data.LeadName, nameResponse)

          if (!isValidName) {

            bankAcc.isAccountNameVaid = false
          }
          else {

            bankAcc.isAccountNameVaid = true

          }


          bankAcc.AccountHolderName = nameResponse
          bankAcc.AccountHolderNameError = null
        }
        break;
      case "RE-ACCOUNT-NUMBER":
        let reAccountNumber = value.replace(/[^0-9]/g, '');
        bankAcc.ReAccountNumber = reAccountNumber;
        bankAcc.ReAccountNumberError = null;
        if (bankAcc.AccountNumber && bankAcc.AccountNumber.length > 0) {
          bankAcc.isAccountNumberMatching = bankAcc.ReAccountNumber === bankAcc.AccountNumber;
        }
        nameResponse = await fetchAccountNumber(bankAcc, null, null, value);
        if (nameResponse != null) {
          const isValidName = isValidBankAccountName(bankAccountSlices.data.LeadName, nameResponse)
          if (!isValidName) {

            bankAcc.isAccountNameVaid = false
          }
          else {

            bankAcc.isAccountNameVaid = true

          }

          bankAcc.AccountHolderName = nameResponse
          bankAcc.AccountHolderNameError = null
        }
        break;
      case "HOLDER-NAME":
        bankAcc.AccountHolderName = value;
        bankAcc.AccountHolderNameError = null;
        break;
    }
    dispatch(updateBankDetails({ index, data: bankAcc }));
  };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  const isValidBankAccountName = (str1, str2) => {
    const similarity = compareTwoStrings(str1.toLowerCase(), str2.toLowerCase());
    return similarity * 100 >= 75;
  };

  const fetchAccountNumber = async (item, ifsc, accountNumberTemp, reAccountNumberTemp) => {
    const accountNumber = accountNumberTemp || item.AccountNumber;
    const reAccountNumber = reAccountNumberTemp || item.ReAccountNumber;
    if (item.isAccountNameVaid || isValidIfsc(ifsc || item.IFSC) != null ||
      isValidNumberOnlyField(accountNumber) != null ||
      isValidNumberOnlyField(reAccountNumber) != null ||
      accountNumber !== reAccountNumber) {
      return null;
    }
    setLoading(true);
    const verificationResponse = await VerifyBankAccount(item.AccountNumber, item.IFSC);
    setLoading(false);
    setNewErrorScreen(null);
    if (verificationResponse.status === STATUS.ERROR) {
      setNewErrorScreen(verificationResponse.message);
      return null;
    }
    if (verificationResponse.data?.code === 200 && verificationResponse.data?.data?.account_exists) {
      return verificationResponse.data?.data?.name_at_bank;
    }
    return null;
  };

  const SendDeatilsToServer = async () => {


    let leadid = await GetLeadId()

    const apiResponse = API_RESPONSE_STATUS()
    const account = [...bankAccountSlices.data.BankList]
    console.log(leadid)

    const accounts = [...bankAccountSlices.data.BankList]
    let atleastOneValid = false
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].isAccountNameVaid) {
        atleastOneValid = true;
        break;
      }
    }
    if (!atleastOneValid) {
      apiResponse.status = STATUS.ERROR;
      apiResponse.message = "Please Provide AtLeast 1 Valid Bank Account";
      return apiResponse;
    }

    for (let item of accounts) {
      item = { ...item, LeadId: leadid, LeadStage: stageMaintance.jumpTo };
      const response = await SaveBankAccountDetails(item);
      console.log(item)
      if (response.status === STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR;
        apiResponse.message = response.message;
        return apiResponse;
      }
    }

    dispatch(updateJumpTo(stageMaintance));

    await SendGeoLocation(6);
    apiResponse.status = STATUS.SUCCESS;
    return apiResponse;
  };

  const validateBankAccounts = () => {

    const currentRequestModel = [...bankAccountSlices.data.BankList]
    for (let i = 0; i < currentRequestModel.length; i++) {
      const currentBankAccount = { ...currentRequestModel[i] };
      const ifscValidity = isValidIfsc(currentBankAccount.IFSC);
      if (ifscValidity != null) {
        currentBankAccount.IFSCError = ifscValidity;
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }));
        return false;
      }
      const branchNameValidity = isValidField(currentBankAccount.BankBrachName, "Branch Name");
      if (branchNameValidity != null) {
        currentBankAccount.BankBracnchNameError = branchNameValidity;
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }));
        return false;
      }
      const accountNumberValidity = isValidNumberOnlyField(currentBankAccount.AccountNumber, "Account Number");
      if (accountNumberValidity != null) {
        currentBankAccount.AccountNumberError = accountNumberValidity;
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }));
        return false;
      }
      const reAccountNumberValidity = isValidNumberOnlyField(currentBankAccount.ReAccountNumber, "Account Number");
      if (reAccountNumberValidity != null) {
        currentBankAccount.ReAccountNumberError = reAccountNumberValidity;
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }));
        return false;
      }
      const isAccountNumberMatchWithReaccountNumber = currentBankAccount.AccountNumber === currentBankAccount.ReAccountNumber;
      if (!isAccountNumberMatchWithReaccountNumber) {
        currentBankAccount.isAccountNumberMatching = false;
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }));
        return false;
      }
      const accountHolderNameValidity = isValidField(currentBankAccount.AccountHolderName, "Account Holder Name");
      if (accountHolderNameValidity != null) {
        currentBankAccount.AccountHolderNameError = accountHolderNameValidity;
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }));
        return false;
      }
    }
    return true;
  };

  const handleBankDetailSubmit = async () => {


    if (extraSlices.isBreDone) {
      navigation.navigate('loanEligibility');
      return;
    }

    if (!validateBankAccounts()) {
      return
    }



    console.log(bankAccountSlices.data.BankList)


    if (await checkLocationPermission() == false) {
      navigation.navigate("PermissionsScreen", { permissionStatus: "denied", permissionType: "location" })
      return
    }
    setLoading(true);
    SendDeatilsToServer().then(response => {
      setLoading(false);
      setOtherError(null);
      if (response.status === STATUS.ERROR) {
        setNewErrorScreen(response.message);
        return;
      }
      navigation.navigate('loanEligibility');
    });
  };

  const BankIfscWithBankName = (account) => {
    if (!account?.BankName && !account?.BankBrachName) return '';
    if (account?.BankName && !account?.BankBrachName) return account.BankName;
    if (!account?.BankName && account?.BankBrachName) return account.BankBrachName;
    return `${account?.BankName}, ${account?.BankBrachName}`;
  };

  // const UpdateBankCodeAndNameAndBranch = async () => {
  //   if (bankAccountSlices.data.BankList == null || !forFirstTimeLoad) {
  //     return
  //   }

  //   let k = 0;

  //   for (let i = 0; i < bankAccountSlices.data.BankList.length; i++) {
  //     let bankAcc = { ...bankAccountSlices.data.BankList[i] }

  //     const branchName = await GetBranchName(bankAcc.IFSC)
  //     if (branchName != null) {
  //       bankAcc.BankBrachName = branchName.BranchName
  //       bankAcc.BankName = branchName.BankName
  //       bankAcc.BankCode = branchName.BankID
  //       bankAcc.BankBracnchNameError = null

  //       dispatch(updateBankDetails({ index: i, data: bankAcc }))
  //       k = 1
  //     }
  //   }

  //   if(k == 1){
  //     setForFirstTimeLoad(false)

  //   }

  // }
  // useEffect(() => {

  //   UpdateBankCodeAndNameAndBranch()

  // }, [bankAccountSlices.data.BankList, forFirstTimeLoad])

  const isFirstAccountValid = () => {
    if (bankAccountSlices.data.BankList.length === 0) {
      return false;
    }
    const firstAccount = bankAccountSlices.data.BankList[0];
    const ifscValidity = isValidIfsc(firstAccount.IFSC);
    const branchNameValidity = isValidField(firstAccount.BankBrachName, "Branch Name");
    const accountNumberValidity = isValidNumberOnlyField(firstAccount.AccountNumber, "Account Number");
    const reAccountNumberValidity = isValidNumberOnlyField(firstAccount.ReAccountNumber, "Account Number");
    const isAccountNumberMatchWithReaccountNumber = firstAccount.AccountNumber === firstAccount.ReAccountNumber;
    const accountHolderNameValidity = isValidField(firstAccount.AccountHolderName, "Account Holder Name");
    return ifscValidity == null && branchNameValidity == null && accountNumberValidity == null && reAccountNumberValidity == null && isAccountNumberMatchWithReaccountNumber && accountHolderNameValidity == null;
  };

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
                  <Text style={styles.weblinkText}>
                    To know more about product features & benefits, please click here
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
            <ProgressBar progress={0.2} />
            <Text
              style={[
                styles.headerText,
                { fontSize: dynamicFontSize(styles.headerText.fontSize) },
              ]}>
              Bank Details
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
              {bankAccountSlices.data.BankList.map((account, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedAccountIndex(index)}
                  style={[
                    styles.accountIcon,
                    selectedAccountIndex === index && styles.selectedAccountIcon,
                  ]}>

                  <FontAwesome name="bank" size={30} color={selectedAccountIndex === index ? "#000565" : "#ccc"} />

                  {index > 0 && <TouchableOpacity
                    style={styles.BankdeleteIcon}
                    onPress={() => confirmDeleteAccount(index)}>
                    <AntDesign name="closecircleo" size={16} color="red" />
                  </TouchableOpacity>}


                </TouchableOpacity>
              ))}
              <LinearGradient
                colors={addButtonState ? ["#002777", "#00194C"] : ["#E9EEFF", "#D8E2FF"]}
                style={[styles.addbutton]}>
                <TouchableOpacity onPress={addAccount} disabled={!addButtonState}>
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        fontSize: dynamicFontSize(styles.buttonText.fontSize),
                      },
                    ]}>
                    <FontAwesome5 name="plus" size={14} /> ADD
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
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

                {/* Additional Accounts Section */}
                {bankAccountSlices.data.BankList.length > 0 && (
                  <View style={styles.accountContainer}>


                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      IFSC<Text style={styles.mandatoryStar}> *</Text>
                    </Text>
                    <CustomInput
                      placeholder="Bank Branch IFSC Code"
                      value={bankAccountSlices.data.BankList[selectedAccountIndex]?.IFSC || ''}
                      error={bankAccountSlices.data.BankList[selectedAccountIndex]?.IFSCError}
                      autoCapitalize="characters"
                      onChangeText={(text) =>
                        UpdateBankInfo(selectedAccountIndex, "IFSC-CODE", text)
                      }
                    />
                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      Bank Branch Name <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomInput
                      placeholder="Bank Branch Name"
                      value={BankIfscWithBankName(bankAccountSlices.data.BankList[selectedAccountIndex])}
                      error={bankAccountSlices.data.BankList[selectedAccountIndex]?.BankBracnchNameError}
                      onChangeText={(text) =>
                        UpdateBankInfo(selectedAccountIndex, "BRANCH-NAME", text)
                      }
                    />
                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      Bank Account Number <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomInput
                      placeholder="Bank Account Number"
                      value={bankAccountSlices.data.BankList[selectedAccountIndex]?.AccountNumber || ''}
                      onChangeText={(text) =>
                        UpdateBankInfo(selectedAccountIndex, "ACCOUNT-NUMBER", text)
                      }
                      error={bankAccountSlices.data.BankList[selectedAccountIndex]?.AccountNumberError}
                      secureTextEntry
                      keyboardType="numeric"
                    />
                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      Re-enter Bank Account Number <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomInput
                      placeholder="Re-enter Bank Account Number"
                      error={bankAccountSlices.data.BankList[selectedAccountIndex]?.ReAccountNumberError}
                      value={bankAccountSlices.data.BankList[selectedAccountIndex]?.ReAccountNumber || ''}
                      onChangeText={(text) =>
                        UpdateBankInfo(selectedAccountIndex, "RE-ACCOUNT-NUMBER", text)
                      }
                      keyboardType="numeric"
                    />
                    {bankAccountSlices.data.BankList[selectedAccountIndex]?.ReAccountNumber != null &&
                      bankAccountSlices.data.BankList[selectedAccountIndex]?.AccountNumber != null &&
                      bankAccountSlices.data.BankList[selectedAccountIndex]?.ReAccountNumber.length >= 8 &&
                      bankAccountSlices.data.BankList[selectedAccountIndex]?.AccountNumber.length >= 8 && (
                        <Text
                          style={[
                            styles.statusMessage,
                            bankAccountSlices.data.BankList[selectedAccountIndex]?.isAccountNumberMatching
                              ? styles.match
                              : styles.noMatch,
                            {
                              fontSize: dynamicFontSize(styles.statusMessage.fontSize),
                            },
                          ]}>
                          {bankAccountSlices.data.BankList[selectedAccountIndex]?.isAccountNumberMatching
                            ? "✓ Account number match"
                            : "✗ Account number does not match"}
                        </Text>
                      )}

                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      Account Holder Name <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomInput
                      placeholder="Account Holder Name"
                      error={bankAccountSlices.data.BankList[selectedAccountIndex]?.AccountHolderNameError}
                      value={bankAccountSlices.data.BankList[selectedAccountIndex]?.AccountHolderName || ''}
                      onChangeText={(text) =>
                        UpdateBankInfo(selectedAccountIndex, "HOLDER-NAME", text)
                      }
                    />

                    {bankAccountSlices.data.BankList[selectedAccountIndex]?.isAccountNameVaid != null && (
                      <Text
                        style={[
                          styles.statusMessage,
                          bankAccountSlices.data.BankList[selectedAccountIndex]?.isAccountNameVaid
                            ? styles.match
                            : styles.noMatch,
                          {
                            fontSize: dynamicFontSize(styles.statusMessage.fontSize),
                          },
                        ]}>
                        {bankAccountSlices.data.BankList[selectedAccountIndex]?.isAccountNameVaid
                          ? "✓ Name is matching with account name"
                          : "✗ Name not matching with account name"}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          <View style={[styles.actionContainer, styles.boxShadow]}>
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
              colors={["#002777", "#00194C"]}
              style={[styles.verifyButton]}>
              <TouchableOpacity onPress={handleBankDetailSubmit}>
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

export default BankDetailsScreen;