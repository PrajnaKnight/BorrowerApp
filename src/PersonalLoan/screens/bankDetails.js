import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import CustomInput from '../components/input';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../components/useContext';
import { styles } from '../../assets/style/personalStyle';
import { API_RESPONSE_STATUS, STATUS } from '../services/API/Constants';
import SaveBankAccountDetails, { SubmitBorrowerLoanApplicationAsyncSubmit, GetBranchNameWithIFSC, VerifyBankAccount } from '../services/API/SaveBankAccountDetail';
import LoadingOverlay from '../components/FullScreenLoader';

import { GetLeadId } from '../services/LOCAL/AsyncStroage';
import { isValidField, isValidIfsc, isValidNumberOnlyField } from '../services/Utils/FieldVerifier';
import GetQuickEligibilityDetailInfo from '../services/API/LoanEligibility';
import { GoBack } from '../services/Utils/ViewValidator';


import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentStage, updateJumpTo } from '../services/Utils/Redux/LeadStageSlices';
import { addBankAccount, deleteBankAccount, fetchGetBankAccountDetails, updateBankDetails } from '../services/Utils/Redux/BankDetailSlices';
import { ALL_SCREEN, Network_Error, Something_Went_Wrong } from '../services/Utils/Constants';

import { compareTwoStrings } from 'string-similarity';
import ScreenError, { useErrorEffect } from './ScreenError';
import { SendGeoLocation } from '../services/API/LocationApi';
import { checkLocationPermission } from './PermissionScreen';
import { useFocusEffect } from '@react-navigation/native';


const BankDetailsScreen = ({ navigation }) => {

  const dispatch = useDispatch()
  const nextJumpTo = useSelector(state => state.leadStageSlice.jumpTo);
  const extraSlices = useSelector(state => state.extraStageSlice);

  const bankAccountSlices = useSelector(state => state.bankDetailSlices);

  const [loading, setLoading] = useState(false);
  const [otherError, setOtherError] = useState(null)
  // const [forFirstTimeLoad, setForFirstTimeLoad] = useState(true)
  const addAccount = () => {
    dispatch(addBankAccount())
  };

  const deleteAccount = (index) => {

    dispatch(deleteBankAccount(index))
  };




  const [refreshPage, setRefreshPage] = useState(true)
  const onTryAgainClick = () => {
    setRefreshPage(true)
  }

  const { errorScreen, setNewErrorScreen } = useErrorEffect(onTryAgainClick)


  const { setProgress } = useProgressBar();

  useEffect(() => {
    setLoading(bankAccountSlices.loading)
  }, [bankAccountSlices.loading])

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
    setNewErrorScreen(null)
    if (bankAccountSlices.error == Network_Error || bankAccountSlices.error != null) {
      setNewErrorScreen(bankAccountSlices.error)
    }
  }, [bankAccountSlices.error])

  const GetBranchName = async (ifsc) => {
    const ifscValid = isValidIfsc(ifsc)
    if (ifscValid != null) {
      return null
    }

    setLoading(true)

    const response = await GetBranchNameWithIFSC(ifsc)
    setLoading(false)
    if (response.status == STATUS.ERROR) {
      setOtherError(response.message)
      return null
    }
    setOtherError(null)

    return response.data
  }




  const UpdateBankInfo = async (index, key, value) => {

    let bankAcc = { ...bankAccountSlices.data.BankList[index] }
    let nameResponse
    console.log("UpdateBankInfo", `${index}, ${key}, ${value}`)
    switch (key) {
      case "IFSC-CODE":
        // { ...bankAcc, IFSC = value}
        bankAcc.IFSC = value
        bankAcc.IFSCError = null


        nameResponse = await fetchAccountNumber(bankAcc, value)
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



        const branchName = await GetBranchName(value)
        if (branchName != null) {
          bankAcc.BankBrachName = branchName.BranchName
          bankAcc.BankName = branchName.BankName
          bankAcc.BankCode = branchName.BankID
        }

        bankAcc.BankBracnchNameError = null


        break;

      case "BRANCH-NAME":
        bankAcc.BankBrachName = value
        bankAcc.BankBracnchNameError = null

        break;

      case "ACCOUNT-NUMBER":
        let accountNumber = value.replace(/[^0-9]/g, '')
        bankAcc.AccountNumber = accountNumber
        bankAcc.AccountNumberError = null
        if (bankAcc.ReAccountNumber != null && bankAcc.ReAccountNumber.length > 0) {
          bankAcc.isAccountNumberMatching = bankAcc.ReAccountNumber == bankAcc.AccountNumber
        }

        nameResponse = await fetchAccountNumber(bankAcc, null, value)

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
        let reAccountNumber = value.replace(/[^0-9]/g, '')
        bankAcc.ReAccountNumber = reAccountNumber
        bankAcc.ReAccountNumberError = null
        if (bankAcc.AccountNumber != null && bankAcc.AccountNumber.length > 0) {
          bankAcc.isAccountNumberMatching = bankAcc.ReAccountNumber == bankAcc.AccountNumber
        }

        nameResponse = await fetchAccountNumber(bankAcc, null, null, value)
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
        bankAcc.AccountHolderName = value
        bankAcc.AccountHolderNameError = null

        break;


    }


    console.log(bankAcc)
    dispatch(updateBankDetails({ index: index, data: bankAcc }))

  }


  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;


  const isValidBankAccountName = (str1, str2) => {
    console.log("======================== isValidBankAccountName ========================")
    console.log(str1)
    console.log(str2)
    const similarity = compareTwoStrings(str1.toLowerCase(), str2.toLowerCase());
    const percentage = similarity * 100;
    return percentage.toFixed(2) >= 75; // Round to 2 decimal places
  }
  const fetchAccountNumber = async (item, ifsc, accountNumberTemp, reAccountNumberTemp) => {

    const accountNumber = accountNumberTemp || item.AccountNumber
    const reAccountNumber = reAccountNumberTemp || item.ReAccountNumber
    if (item.isAccountNameVaid == true ||
      isValidIfsc(ifsc || item.IFSC) != null ||
      isValidNumberOnlyField(accountNumber) != null ||
      isValidNumberOnlyField(reAccountNumber) != null ||
      accountNumber != reAccountNumber
    ) {
      return
    }
    setLoading(true)
    const verificationResponse = await VerifyBankAccount(item.AccountNumber, item.IFSC)
    setLoading(false)
    setNewErrorScreen(null)
    if (verificationResponse.status == STATUS.ERROR) {

      if (verificationResponse.message == Network_Error || verificationResponse.message != null) {
        setNewErrorScreen(verificationResponse.message)
      }
      return null
    }



    if (verificationResponse.data?.code == 200 && verificationResponse.data?.data?.account_exists == true) {
      return verificationResponse.data?.data?.name_at_bank

    }


    return null
  }

  const SendDeatilsToServer = async () => {


    let leadid = await GetLeadId()

    const apiResponse = API_RESPONSE_STATUS()
    const account = [...bankAccountSlices.data.BankList]
    console.log(leadid)

    const accounts = [...bankAccountSlices.data.BankList]
    let atleastOneValid = false
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].isAccountNameVaid == true) {
        atleastOneValid = true
        break
      }
    }

    if (atleastOneValid == false) {
      apiResponse.status = STATUS.ERROR
      apiResponse.message = "Please Provide AtLeast 1 Valid Bank Account"
      return apiResponse
    }

    let LeadStage = nextJumpTo
    if (ALL_SCREEN[nextJumpTo] == "bankDetail") {
      LeadStage = nextJumpTo + 1
    }

    for (let item of account) {

      item = { ...item, LeadId: leadid, LeadStage: LeadStage }
      console.log("saveing item", item)
      const response = await SaveBankAccountDetails(item)
      console.log(response)
      if (response.status == STATUS.ERROR) {
        apiResponse.status = STATUS.ERROR
        apiResponse.message = response.message
        return apiResponse
      }
    }

    if (ALL_SCREEN[nextJumpTo] == "bankDetail") {
      dispatch(updateJumpTo(LeadStage))
    }


    console.log("========== fetching location =================")
    await SendGeoLocation(6)
    console.log("========== fetching location =================")


    apiResponse.status = STATUS.SUCCESS

    return apiResponse
  }

  const validateBankAccounts = () => {

    const currentRequestModel = [...bankAccountSlices.data.BankList]
    for (let i = 0; i < currentRequestModel.length; i++) {
      const currentBankAccount = { ...currentRequestModel[i] }

      const ifscValidity = isValidIfsc(currentBankAccount.IFSC)
      if (ifscValidity != null) {
        currentBankAccount.IFSCError = ifscValidity
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }))
        return false;
      }

      const branchNameValidity = isValidField(currentBankAccount.BankBrachName, "Branch Name")
      if (branchNameValidity != null) {
        currentBankAccount.BankBracnchNameError = branchNameValidity
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }))

        return false;
      }

      const accountNumberValidity = isValidNumberOnlyField(currentBankAccount.AccountNumber, "Account Number")
      if (accountNumberValidity != null) {
        currentBankAccount.AccountNumberError = accountNumberValidity
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }))

        return false;
      }

      const reAccountNumberValidity = isValidNumberOnlyField(currentBankAccount.ReAccountNumber, "Account Number")
      if (reAccountNumberValidity != null) {
        currentBankAccount.ReAccountNumberError = reAccountNumberValidity
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }))

        return false;
      }

      const isAccountNumberMatchWithReaccountNumber = currentBankAccount.AccountNumber == currentBankAccount.ReAccountNumber
      if (!isAccountNumberMatchWithReaccountNumber) {
        currentBankAccount.isAccountNumberMatching = false
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }))

        return false
      }
      const accountHolderNameValidity = isValidField(currentBankAccount.AccountHolderName, "Account Holder Name")
      if (accountHolderNameValidity != null) {
        currentBankAccount.AccountHolderNameError = accountHolderNameValidity
        dispatch(updateBankDetails({ index: i, data: currentBankAccount }))

        return false;
      }
    }
    return true;
  }

  const handleBankDetailSubmit = async () => {


    if(extraSlices.isBreDone){
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

    setLoading(true)

    SendDeatilsToServer().then(response => {

      setLoading(false)
      setOtherError(null)

      if (response.status == STATUS.ERROR) {
        console.log(response)

        if (response.message == Network_Error || response.message != null) {
          setNewErrorScreen(response.message)
          return
        }

        setOtherError(response.message)

        return
      }

      // move to success screen
      console.log("========== loan eligibility reponse ====")
      console.log(response)
      navigation.navigate('loanEligibility')




    })

  }


  const BankIfscWithBankName = (account) => {
    if (account.BankName == null && account.BankBrachName == null) {
      return null
    }
    if (account.BankName != null && account.BankBrachName == null) {
      return account.BankName
    }
    if (account.BankName == null && account.BankBrachName != null) {
      return account.BankBrachName
    }
    return `${account.BankName},${account.BankBrachName}`

  }


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
              {/* <View style={styles.bottomFixed}>
         <Image source={require('../assets/images/poweredby.png')} style={styles.logo} />
      </View> */}
            </View>
          </View>
        )}
        <KeyboardAvoidingView
          style={[styles.rightCOntainer, { flex: 1 }]}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <LoadingOverlay visible={loading} />

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <View>
                <ProgressBar progress={0.2} />
                <Text
                  style={[
                    styles.headerText,
                    { fontSize: dynamicFontSize(styles.headerText.fontSize) },
                  ]}>
                  Bank Details
                </Text>
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
                {bankAccountSlices.data.BankList.map((account, index) => (
                  <View key={index} style={styles.accountContainer}>
                    {index > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={[
                            styles.headerText,
                            { fontSize: dynamicFontSize(20) },
                          ]}>
                          Bank Account {index + 1}
                        </Text>
                        <TouchableOpacity
                          onPress={() => deleteAccount(index)}
                          style={styles.deleteButton}>
                          <Text style={styles.deleteButtonText}>DELETE</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      IFSC<Text style={styles.mandatoryStar}> *</Text>
                    </Text>
                    <CustomInput
                      placeholder="Bank Branch IFSC Code"
                      value={account.IFSC}
                      error={account.IFSCError}
                      autoCapitalize="characters"
                      onChangeText={(text) =>
                        UpdateBankInfo(index, "IFSC-CODE", text)
                      }
                    />
                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      Bank Branch Name{" "}
                      <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomInput
                      placeholder="Bank Branch Name"
                      value={BankIfscWithBankName(account)}
                      error={account.BankBracnchNameError}
                      onChangeText={(text) =>
                        UpdateBankInfo(index, "BRANCH-NAME", text)
                      }
                    />
                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      Bank Account Number{" "}
                      <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomInput
                      placeholder="Bank Account Number"
                      value={account.AccountNumber}
                      onChangeText={(text) =>
                        UpdateBankInfo(index, "ACCOUNT-NUMBER", text)
                      }
                      error={account.AccountNumberError}
                      secureTextEntry
                      keyboardType="numeric"
                    />
                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      Re-enter Bank Account Number{" "}
                      <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomInput
                      placeholder="Re-enter Bank Account Number"
                      error={account.ReAccountNumberError}
                      value={account.ReAccountNumber}
                      
                      onChangeText={(text) =>
                        UpdateBankInfo(index, "RE-ACCOUNT-NUMBER", text)
                      }
                      keyboardType="numeric"
                    />
                    {account.ReAccountNumber != null &&
                      account.AccountNumber != null &&
                      account.ReAccountNumber.length >= 8 &&
                      account.AccountNumber.length >= 8 && (
                        <Text
                          style={[
                            styles.statusMessage,
                            account.isAccountNumberMatching
                              ? styles.match
                              : styles.noMatch,
                            {
                              fontSize: dynamicFontSize(
                                styles.statusMessage.fontSize
                              ),
                            },
                          ]}>
                          {account.isAccountNumberMatching
                            ? "✓ Account number match"
                            : "✗ Account number does not match"}
                        </Text>
                      )}

                    <Text
                      style={[
                        styles.label,
                        { fontSize: dynamicFontSize(styles.label.fontSize) },
                      ]}>
                      Account Holder Name{" "}
                      <Text style={styles.mandatoryStar}>*</Text>
                    </Text>
                    <CustomInput
                      placeholder="Account Holder Name"
                      error={account.AccountHolderNameError}
                      value={account.AccountHolderName}
                      onChangeText={(text) =>
                        UpdateBankInfo(index, "HOLDER-NAME", text)
                      }
                    />

                    {account.isAccountNameVaid != null && (
                      <Text
                        style={[
                          styles.statusMessage,
                          account.isAccountNameVaid
                            ? styles.match
                            : styles.noMatch,
                          {
                            fontSize: dynamicFontSize(
                              styles.statusMessage.fontSize
                            ),
                          },
                        ]}>
                        {account.isAccountNameVaid
                          ? "✓ Name is matching with account name"
                          : "✗ Name not matching with account name"}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
              <View style={styles.addAnotherBank}>
                <LinearGradient
                  colors={["#002777", "#00194C"]}
                  style={styles.addbutton}>
                  <TouchableOpacity onPress={addAccount}>
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          fontSize: dynamicFontSize(styles.buttonText.fontSize),
                        },
                      ]}>
                      ADD ANOTHER BANK ACCOUNT
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

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
                  // button Linear Gradient
                  colors={["#002777", "#00194C"]}
                  style={styles.verifyButton}>
                  <TouchableOpacity onPress={() => handleBankDetailSubmit()}>
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

export default BankDetailsScreen;
