import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../../Common/components/ControlPanel/input';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../assets/style/msmeStyle';
import Layout from '../../Common/components/Layout';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import {GoBack} from '../../PersonalLoan/services/Utils/ViewValidator';

const BusinessBankDetails = ({ navigation }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([
    {
      IFSC: '',
      BankName: '',
      BankBrachName: '',
      AccountNumber: '',
      ReAccountNumber: '',
      AccountHolderName: '',
      IFSCError: null,
      BankBracnchNameError: null,
      AccountNumberError: null,
      ReAccountNumberError: null,
      AccountHolderNameError: null,
      isAccountNumberMatching: null,
      isAccountNameValid: null,
    }
  ]);
  const { setProgress } = useProgressBar(); 

  useEffect(() => {
    setProgress(0.8);
  }, []);

  const scrollViewRef = useRef();

  const UpdateBankInfo = (index, key, value) => {
    const updatedAccounts = [...bankAccounts];
    const account = { ...updatedAccounts[index] };

    switch (key) {
      case "IFSC-CODE":
        account.IFSC = value;
        account.IFSCError = null;
        // Here you would typically call the API to get bank details based on IFSC
        break;
      case "BRANCH-NAME":
        account.BankBrachName = value;
        account.BankBracnchNameError = null;
        break;
      case "ACCOUNT-NUMBER":
        account.AccountNumber = value.replace(/[^0-9]/g, '');
        account.AccountNumberError = null;
        account.isAccountNumberMatching = account.ReAccountNumber === account.AccountNumber;
        break;
      case "RE-ACCOUNT-NUMBER":
        account.ReAccountNumber = value.replace(/[^0-9]/g, '');
        account.ReAccountNumberError = null;
        account.isAccountNumberMatching = account.ReAccountNumber === account.AccountNumber;
        break;
      case "HOLDER-NAME":
        account.AccountHolderName = value;
        account.AccountHolderNameError = null;
        break;
    }

    updatedAccounts[index] = account;
    setBankAccounts(updatedAccounts);
  };

  const addAccount = () => {
    setBankAccounts([...bankAccounts, {
      IFSC: '',
      BankName: '',
      BankBrachName: '',
      AccountNumber: '',
      ReAccountNumber: '',
      AccountHolderName: '',
      IFSCError: null,
      BankBracnchNameError: null,
      AccountNumberError: null,
      ReAccountNumberError: null,
      AccountHolderNameError: null,
      isAccountNumberMatching: null,
      isAccountNameValid: null,
    }]);

    // Scroll to the bottom after adding a new account
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const deleteAccount = (index) => {
    const updatedAccounts = bankAccounts.filter((_, i) => i !== index);
    setBankAccounts(updatedAccounts);
  };

  const BankIfscWithBankName = (account) => {
    if (!account.BankName && !account.BankBrachName) {
      return null;
    }
    if (account.BankName && !account.BankBrachName) {
      return account.BankName;
    }
    if (!account.BankName && account.BankBrachName) {
      return account.BankBrachName;
    }
    return `${account.BankName} - ${account.BankBrachName}`;
  };

  const handleProceed = () => {
    if (!isButtonDisabled) {
      console.log('Form is valid. Proceeding...');
      navigation.navigate('LoanDetails');
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
        <View style={{ padding: 16}}>
          <ProgressBar progress={0.8} />
          <Text style={styles.TitleText}>
            Bank Details{" "}
            <Text style={{ fontSize: 14, fontFamily: "100" }}>
              (current account)
            </Text>
          </Text>
        </View>
        <View>
          <ScrollView ref={scrollViewRef}>
            <View style={{ flex: 1 }}>
              {bankAccounts.map((account, index) => (
                <View
                  key={index}
                  style={[
                    styles.accountContainer,
                    styles.container,
                    index % 2 !== 0 && { backgroundColor: "#fffaf5" },
                  ]}>
                  {index > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}>
                      <TouchableOpacity
                        onPress={() => deleteAccount(index)}
                        style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>DELETE</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <Text style={styles.label}>
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

                  <Text style={styles.label}>
                    Bank Branch Name <Text style={styles.mandatoryStar}>*</Text>
                  </Text>
                  <CustomInput
                    placeholder="Bank Branch Name"
                    value={BankIfscWithBankName(account)}
                    error={account.BankBracnchNameError}
                    onChangeText={(text) =>
                      UpdateBankInfo(index, "BRANCH-NAME", text)
                    }
                  />

                  <Text style={styles.label}>
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

                  <Text style={styles.label}>
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
                        ]}>
                        {account.isAccountNumberMatching
                          ? "✓ Account number match"
                          : "✗ Account number does not match"}
                      </Text>
                    )}

                  <Text style={styles.label}>
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

                  {account.isAccountNameValid != null && (
                    <Text
                      style={[
                        styles.statusMessage,
                        account.isAccountNameValid
                          ? styles.match
                          : styles.noMatch,
                      ]}>
                      {account.isAccountNameValid
                        ? "✓ Name is matching with account name"
                        : "✗ Name not matching with account name"}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            <View
              style={[
                styles.addAnotherBank,
                { paddingHorizontal: 16, marginBottom: 100 },
              ]}>
              <LinearGradient
                colors={["#002777", "#2B478B"]}
                style={styles.addbutton}>
                <TouchableOpacity onPress={addAccount}>
                  <Text style={styles.buttonText}>
                    ADD ANOTHER BANK ACCOUNT
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}  onPress={() => GoBack(navigation)}> 
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.proceedButtonContainer}>
          <ButtonComponent
            title="PROCEED"
            onPress={handleProceed}
            disabled={isButtonDisabled}
            style={{
              button: styles.proceedButton,
            }}
            disabledStyle={{
              button: styles.disabledProceedButton,
            }}
            containerStyle={styles.proceedButtonContainer}
          />
        </View>
      </View>
    </Layout>
  );
};

export default BusinessBankDetails;