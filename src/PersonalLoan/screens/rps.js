import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { styles } from '../services/style/gloablStyle';
import { useAppContext } from '../components/useContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgressBar } from '../components/progressContext';
import ProgressBar from '../components/progressBar';
import CustomInput from '../components/input';

const RpsScreen = ({ navigation }) => {
  const [umrn, setUmrn] = useState('');
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [showError, setShowError] = useState(false);

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;


  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.9);
  }, []);

  const DataRow = ({ label, value }) => {
    return (
      <View style={styles.tablerow}>
        <Text style={styles.tablelabel}>{label}</Text>
        <Text style={styles.tablevalue}>{value}</Text>
      </View>
    );
  };

  const FinancialDetailsTable = () => {
    return (
      <View style={styles.tablecontainer}>
        <DataRow label="Processing Fee" value="₹ 100000" />
        <DataRow label="1st EMI Date" value="Lorem Ipsum" />
        <DataRow label="EMI Amount" value="Lorem Ipsum" />
        <DataRow label="Insurance" value="Lorem Ipsum" />
        <DataRow label="Net Disbursement Amount" value="Lorem Ipsum" />
      </View>
    );
  };

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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
        <View style={styles.container}>
          <View>
            <ProgressBar progress={0.9} />
            <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>Initiate Disbursal</Text>

            <View style={styles.wrapiNput}>
              <View style={styles.Label}>
                <Text style={[styles.loanLabel, { fontSize: dynamicFontSize(styles.loanLabel.fontSize) }]}>Bank Account Number<Text style={[styles.mandatoryStar, { fontSize: dynamicFontSize(styles.mandatoryStar.fontSize) }]}>*</Text></Text>
              </View>
              <CustomInput
                value="65704123215123 - HDFC Bank Goregaon (W)"
                readOnly={true}
              />

              {showError && !value && (
                <Text style={styles.errorText}>Please select a bank account number.</Text>
              )}
            </View>
            <View style={styles.wrapiNput}>
              <View style={styles.Label}>
                <Text style={[styles.loanLabel, { fontSize: dynamicFontSize(styles.loanLabel.fontSize) }]}>eMandate UMRN<Text style={[styles.mandatoryStar, { fontSize: dynamicFontSize(styles.mandatoryStar.fontSize) }]}>*</Text></Text>
              </View>
              <View style={styles.textInputContainer}>
                <Icon name="file" size={16} color="#ffffff" style={styles.iconStyle} />
                <TextInput
                  style={styles.inputStyle}
                  keyboardType="numeric" // Use numeric keyboard for better input experience
                  placeholder="1234567890098761"
                />
              </View>
            </View>
            <View style={styles.wrapiNput}>
              <View style={styles.label}>
                <Text style={[styles.loanLabel, { fontSize: dynamicFontSize(styles.loanLabel.fontSize) }]}>Repayment Scheduled<Text style={[styles.mandatoryStar, { fontSize: dynamicFontSize(styles.mandatoryStar.fontSize) }]}>*</Text></Text>
              </View>
              <View style={styles.textInputContainer}>
                <Icon name="file" size={16} color="#ffffff" style={styles.iconStyle} />
                <TextInput
                  style={[styles.inputStyle, styles.decoration]}
                  keyboardType="url" // Use URL keyboard for better input experience
                  placeholder="https://example.com"
                  value={url}
                  onChangeText={(text) => setUrl(text)} // Update the state when the text changes

                />
              </View>


            </View>
            <View style={styles.disburseInfo}>
              <FinancialDetailsTable />
            </View>
          </View>
          <View style={styles.actionContainer}>
            <LinearGradient
              colors={['#002777', '#00194C']}
              style={[styles.agreebutton]}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('Disbursement')}

              >
                <Text style={[styles.buttonText, { fontSize: dynamicFontSize(styles.buttonText.fontSize) }]}>Disburse</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
</View>
</View>
  );
};


export default RpsScreen;
