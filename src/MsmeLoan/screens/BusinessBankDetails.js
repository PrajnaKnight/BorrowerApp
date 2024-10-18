import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import CustomInput from "../../Common/components/ControlPanel/input";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../assets/style/msmeStyle";
import Layout from "../../Common/components/Layout";
import ButtonComponent from "../../Common/components/ControlPanel/button";
import { useProgressBar } from "../../Common/components/ControlPanel/progressContext";
import ProgressBar from "../../Common/components/ControlPanel/progressBar";
import { GoBack } from "../../PersonalLoan/services/Utils/ViewValidator";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { isValidField, isValidIfsc, isValidNumberOnlyField } from "../../PersonalLoan/services/Utils/FieldVerifier";
import CustomDropdown from '../../Common/components/ControlPanel/dropdownPicker';

const BusinessBankDetails = ({ navigation }) => {
  const [bankAccounts, setBankAccounts] = useState([
    {
      accountType: "Current",
      IFSC: "",
      BankName: "",
      BankBrachName: "",
      AccountNumber: "",
      ReAccountNumber: "",
      AccountHolderName: "",
      IFSCError: null,
      BankBracnchNameError: null,
      AccountNumberError: null,
      ReAccountNumberError: null,
      AccountHolderNameError: null,
      isAccountNumberMatching: null,
      isAccountNameValid: null,
    },
  ]);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0);
  const [showAddAnotherBank, setShowAddAnotherBank] = useState(false);
  const { setProgress } = useProgressBar();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setProgress(0.8);
  }, []);

  useEffect(() => {
    const firstAccount = bankAccounts[0];
    const isFirstAccountFilled = 
      firstAccount.IFSC &&
      firstAccount.BankBrachName &&
      firstAccount.AccountNumber &&
      firstAccount.ReAccountNumber &&
      firstAccount.AccountHolderName &&
      firstAccount.isAccountNumberMatching;

    setShowAddAnotherBank(isFirstAccountFilled && bankAccounts.length < 3);
    setIsButtonDisabled(!isFirstAccountFilled);
  }, [bankAccounts]);

  const scrollViewRef = useRef();

  const UpdateBankInfo = (index, key, value) => {
    const updatedAccounts = [...bankAccounts];
    const account = { ...updatedAccounts[index] };

    switch (key) {
      case "IFSC-CODE":
        account.IFSC = value;
        account.IFSCError = null;
        break;
      case "BRANCH-NAME":
        account.BankBrachName = value;
        account.BankBracnchNameError = null;
        break;
      case "ACCOUNT-NUMBER":
        account.AccountNumber = value.replace(/[^0-9]/g, "");
        account.AccountNumberError = null;
        account.isAccountNumberMatching =
          account.ReAccountNumber === account.AccountNumber;
        break;
      case "RE-ACCOUNT-NUMBER":
        account.ReAccountNumber = value.replace(/[^0-9]/g, "");
        account.ReAccountNumberError = null;
        account.isAccountNumberMatching =
          account.ReAccountNumber === account.AccountNumber;
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
    if (bankAccounts.length < 3) {
      setBankAccounts(prevAccounts => [
        ...prevAccounts,
        {
          accountType: "Current",
          IFSC: "",
          BankName: "",
          BankBrachName: "",
          AccountNumber: "",
          ReAccountNumber: "",
          AccountHolderName: "",
          IFSCError: null,
          BankBracnchNameError: null,
          AccountNumberError: null,
          ReAccountNumberError: null,
          AccountHolderNameError: null,
          isAccountNumberMatching: null,
          isAccountNameValid: null,
        },
      ]);
      setSelectedAccountIndex(prevIndex => prevIndex + 1 );
      setShowAddAnotherBank(false);
    }
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

  const updateCurrentAccount = (key, value) => {
    setCurrentAccount(prev => ({ ...prev, [key]: value }));
  };

  const deleteAccount = (index) => {
    if (bankAccounts.length > 1) {
      const updatedAccounts = bankAccounts.filter((_, i) => i !== index);
      setBankAccounts(updatedAccounts);
      setSelectedAccountIndex(Math.min(index, updatedAccounts.length - 1));
      setShowAddAnotherBank(updatedAccounts.length < 3);
    }
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

  const validateBankAccounts = () => {
    for (let i = 0; i < bankAccounts.length; i++) {
      const currentBankAccount = { ...bankAccounts[i] };
      if (isValidIfsc(currentBankAccount.IFSC) != null ||
          isValidField(currentBankAccount.BankBrachName, "Branch Name") != null ||
          isValidNumberOnlyField(currentBankAccount.AccountNumber, "Account Number") != null ||
          isValidNumberOnlyField(currentBankAccount.ReAccountNumber, "Account Number") != null ||
          currentBankAccount.AccountNumber !== currentBankAccount.ReAccountNumber ||
          isValidField(currentBankAccount.AccountHolderName, "Account Holder Name") != null) {
        return false;
      }
    }
    return true;
  };

  const handleProceed = () => {
    if (!validateBankAccounts()) {
      console.log("Form is valid. Proceeding...");
      navigation.navigate("BusinessLoanEligibility");
    } 
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View style={{ padding: 16, backgroundColor: "#fffff" }}>
          <ProgressBar progress={0.8} />
          <View style={styles.TOpTitleContainer}>
            <Text style={[styles.TitleText]}>Bank Details</Text>
          </View>
          {bankAccounts.length > 1 && (
          <View style={styles.accountIconsContainer}>
            {bankAccounts.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedAccountIndex(index)}
                style={[
                  styles.accountIcon,
                  selectedAccountIndex === index && styles.selectedAccountIcon,
                ]}>
                <FontAwesome
                  name="bank"
                  size={18}
                  color={selectedAccountIndex === index ? "#000565" : "#ccc"}
                />
                {index > 0 && (
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => confirmDeleteAccount(index)}>
                    <AntDesign name="closecircleo" size={16} color="red" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
            {bankAccounts.length < 3 && (
              <TouchableOpacity
                onPress={addAccount}
                style={styles.addAccountIcon}>
                <AntDesign name="plus" size={18} color="#ffffff" />
                <Text style={{color:'#fff'}}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
          )}
        </View>
        <ScrollView ref={scrollViewRef}>
          <View style={{ flex: 1 }}>
            <View style={[styles.accountContainer, styles.container]}>
            <CustomDropdown
                label="Account Type"
                value={bankAccounts[selectedAccountIndex].accountType}
                onValueChange={(value) => updateCurrentAccount("accountType", value)}
                items={[
                  { label: "Current", value: "Current" },
                  { label: "Savings", value: "Savings" },
                ]}
              />

              <Text style={styles.label}>
              Bank Branch IFSC<Text style={styles.mandatoryStar}> *</Text>
              </Text>
              <CustomInput
                placeholder="Bank Branch IFSC Code"
                value={bankAccounts[selectedAccountIndex].IFSC}
                error={bankAccounts[selectedAccountIndex].IFSCError}
                autoCapitalize="characters"
                onChangeText={(text) =>
                  UpdateBankInfo(selectedAccountIndex, "IFSC-CODE", text)
                }
              />
              <Text style={styles.label}>
                Bank Branch Name <Text style={styles.mandatoryStar}>*</Text>
              </Text>
              <CustomInput
                placeholder="Bank Branch Name"
                value={BankIfscWithBankName(bankAccounts[selectedAccountIndex])}
                error={bankAccounts[selectedAccountIndex].BankBracnchNameError}
                onChangeText={(text) =>
                  UpdateBankInfo(selectedAccountIndex, "BRANCH-NAME", text)
                }
              />

              <Text style={styles.label}>
                Bank Account Number <Text style={styles.mandatoryStar}>*</Text>
              </Text>
              <CustomInput
                placeholder="Bank Account Number"
                value={bankAccounts[selectedAccountIndex].AccountNumber}
                onChangeText={(text) =>
                  UpdateBankInfo(selectedAccountIndex, "ACCOUNT-NUMBER", text)
                }
                error={bankAccounts[selectedAccountIndex].AccountNumberError}
                secureTextEntry
                keyboardType="numeric"
              />

              <Text style={styles.label}>
                Re-enter Bank Account Number{" "}
                <Text style={styles.mandatoryStar}>*</Text>
              </Text>
              <CustomInput
                placeholder="Re-enter Bank Account Number"
                error={bankAccounts[selectedAccountIndex].ReAccountNumberError}
                value={bankAccounts[selectedAccountIndex].ReAccountNumber}
                onChangeText={(text) =>
                  UpdateBankInfo(
                    selectedAccountIndex,
                    "RE-ACCOUNT-NUMBER",
                    text
                  )
                }
                keyboardType="numeric"
              />

              {bankAccounts[selectedAccountIndex].ReAccountNumber != null &&
                bankAccounts[selectedAccountIndex].AccountNumber != null &&
                bankAccounts[selectedAccountIndex].ReAccountNumber.length >=
                  8 &&
                bankAccounts[selectedAccountIndex].AccountNumber.length >=
                  8 && (
                  <Text
                    style={[
                      styles.statusMessage,
                      bankAccounts[selectedAccountIndex].isAccountNumberMatching
                        ? styles.match
                        : styles.noMatch,
                    ]}>
                    {bankAccounts[selectedAccountIndex].isAccountNumberMatching
                      ? "✓ Account number match"
                      : "✗ Account number does not match"}
                  </Text>
                )}

              <Text style={styles.label}>
                Account Holder Name <Text style={styles.mandatoryStar}>*</Text>
              </Text>
              <CustomInput
                placeholder="Account Holder Name"
                error={
                  bankAccounts[selectedAccountIndex].AccountHolderNameError
                }
                value={bankAccounts[selectedAccountIndex].AccountHolderName}
                onChangeText={(text) =>
                  UpdateBankInfo(selectedAccountIndex, "HOLDER-NAME", text)
                }
              />

              {bankAccounts[selectedAccountIndex].isAccountNameValid !=
                null && (
                <Text
                  style={[
                    styles.statusMessage,
                    bankAccounts[selectedAccountIndex].isAccountNameValid
                      ? styles.match
                      : styles.noMatch,
                  ]}>
                  {bankAccounts[selectedAccountIndex].isAccountNameValid
                    ? "✓ Name is matching with account name"
                    : "✗ Name not matching with account name"}
                </Text>
              )}
            </View>
            {showAddAnotherBank && (
              <View style={[styles.addAnotherBank, { paddingHorizontal: 16 }]}>
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
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => GoBack(navigation)}>
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