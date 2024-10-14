import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomDropdown from '../../Common/components/ControlPanel/dropdownPicker';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { GoBack } from '../../PersonalLoan/services/Utils/ViewValidator';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import Layout from '../../Common/components/Layout';
import CustomInput from '../../Common/components/ControlPanel/input';
import { LinearGradient } from 'expo-linear-gradient';
import { styles as msmeStyle } from '../../assets/style/msmeStyle';
import FileUpload from '../../Common/components/ControlPanel/FileUpload';
import applyFontFamily from '../../assets/style/applyFontFamily';
import CustomBankDropdown from '../../Common/components/ControlPanel/CustomBankDropdown';

import NACHIcon from '../../assets/images/nach.png';
import EMandateIcon from '../../assets/images/emandate.png';
import UPIIcon from '../../assets/images/upi.png';
import { LineChart } from 'lucide-react';

const MandateScreen = ({ navigation }) => {
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [bankAccounts, setBankAccounts] = useState([
      { label: 'HDFC Bank Goregaon (W)', value: '4536173526', bankName: 'HDFC Bank' },
      { label: 'State Bank of India Goregaon (W)', value: '4756173589', bankName: 'State Bank of India' },
      { label: 'Axis Bank Goregaon (W)', value: '6246173678', bankName: 'Axis Bank' },
    ]);
  
  const [ifscCode, setIfscCode] = useState('SBIN0001266');
  const [mandateType, setMandateType] = useState('');
  const [vpa, setVpa] = useState('');
  const { setProgress } = useProgressBar();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 

  useEffect(() => {
    setProgress(0.4);
  }, []);

 

  useEffect(() => {
    setIsButtonDisabled(!selectedAccount || !mandateType);
  }, [selectedAccount, mandateType]);

  const handleProceed = () => {
    navigation.navigate("BusinessTypeDetails");
    console.log("Proceeding to next step");
  };

 

  const renderInput = (value, onChange, placeholder, editable = true, readOnly) => (
    <View style={[styles.inputContainer, !editable && styles.disabledInput]}>
      <CustomInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        editable={editable}
        style={styles.input}
        readOnly={readOnly}
      />
    </View>
  );

  const renderMandateOptions = () => (
    <View style={styles.mandateOptionsContainer}>
      {[
        { type: "Physical NACH", icon: NACHIcon },
        { type: "eMandate", icon: EMandateIcon },
        { type: "UPI Mandate", icon: UPIIcon },
      ].map((option) => (
        <TouchableOpacity
          key={option.type}
          style={[
            styles.mandateOption,
            mandateType === option.type && styles.selectedMandateOption,
          ]}
          onPress={() => setMandateType(option.type)}>
          <Image source={option.icon} style={[styles.mandateIcon, mandateType === option.type && styles.selectedMandateIcon]} />
          <Text
            style={[
              styles.mandateOptionText,
              mandateType === option.type && styles.selectedMandateOptionText,
            ]}>
            {option.type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderButton = (text, onPress, isPrimary = true, icon = null) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <LinearGradient
        colors={isPrimary ? ['#002777', '#00194C'] : ['#FFFFFF', '#FFFFFF']}
        style={[styles.button, !isPrimary && styles.secondaryButton]}
      >
        <Text style={[styles.buttonText, !isPrimary && styles.secondaryButtonText]}>{text}</Text>
        {icon && <Icon name={icon} size={16} color={isPrimary ? "#FFFFFF" : "#002777"} style={styles.buttonIcon} />}
      </LinearGradient>
    </TouchableOpacity>
  );



  return (
    <Layout>
      <View style={styles.header}>
        <ProgressBar progress={0.4} />
        <Text style={styles.titleText}>Mandate</Text>
        <Text style={styles.subText}>Please sign the mandate</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <CustomBankDropdown
            value={selectedAccount}
            setValue={(val) => {
              console.log("Selected account in MandateScreen:", val);
              setSelectedAccount(val);
              const selectedBank = bankAccounts.find(
                (account) => account.value === val
              );
              if (selectedBank) {
                setIfscCode(selectedBank.ifscCode || "SBIN0001266");
              }
            }}
            items={bankAccounts}
            placeholder="Select Bank Account"
            label="Bank Account Number"
            error={null}
            zIndex={1000}
            selectedItemColor="#ffffff"
            arrowIconColor="#ff8500"
            selectedItemBackgroundColor="#758BFD"
          />

          <Text style={styles.label}>Bank Branch IFSC Code</Text>
          {renderInput(ifscCode, setIfscCode, "Enter IFSC Code", false, true)}

          <Text style={styles.label}>Select anyone</Text>
          {renderMandateOptions()}

          {mandateType === "Physical NACH" && (
            <View>
              <Text style={[styles.noteText, { fontStyle: "italic" }]}>
                <Icon name="infocirlceo" color="#FF8500" size={12} /> Download
                below NACH form & upload scanned signed form
              </Text>
              <TouchableOpacity style={styles.downloadNach}>
                <Text style={styles.downloadNachText}>Download NACH Form</Text>
              </TouchableOpacity>
              <FileUpload
                placeholder="Upload Scanned Signed Form"
                showLabel={false}
              />
              <Text style={[styles.noteText, { marginTop: 30, flex: 1 }]}>
                <Text style={{ color: "#FF8500" }}>Note:-</Text>
                {"\n"} Manual Signature required in scanned NACH form
              </Text>
            </View>
          )}

          {mandateType === "UPI Mandate" && (
            <>
              <Text style={[styles.noteText, { fontStyle: "italic" }]}>
                <Icon name="infocirlceo" color="#FF8500" size={12} /> Sign using
                your UPI id
              </Text>
              <Text style={styles.label}>
                Your Virtual Payment Address (VPA)
              </Text>
              {renderInput(vpa, setVpa, "Enter your VPA")}

              <ButtonComponent
                title="Sign UPI Mandate"
                onPress={() => {}}
                style={{ button: styles.signButton }}
              />
              <Text style={styles.noteText}>
                <Text style={{ color: "#FF8500" }}>Note:-</Text>
                {"\n"} For UPI please make sure that your EMI should not be
                greater than ₹2,00,000
              </Text>
            </>
          )}

          {mandateType === "eMandate" && (
            <>
              <Text style={[styles.noteText, { fontStyle: "italic" }]}>
                <Icon name="infocirlceo" color="#FF8500" size={12} /> Sign
                digitally using debit card or net banking
              </Text>
              <ButtonComponent
                title="Sign eMandate"
                onPress={() => {}}
                style={{ button: styles.signButton }}
              />
            </>
          )}
        </View>
      </ScrollView>
      <View style={msmeStyle.buttonContainer}>
        <TouchableOpacity
          style={msmeStyle.cancelButton}
          onPress={() => GoBack(navigation)}>
          <Text style={[msmeStyle.cancelButtonText]}>Back</Text>
        </TouchableOpacity>
        <View style={msmeStyle.proceedButtonContainer}>
          <ButtonComponent
            title="PROCEED"
            onPress={handleProceed}
            disabled={isButtonDisabled}
            style={{
              button: msmeStyle.proceedButton,
            }}
            disabledStyle={{
              button: msmeStyle.disabledProceedButton,
            }}
            containerStyle={msmeStyle.proceedButtonContainer}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = applyFontFamily({
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
  },
  titleText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#00194c',
    lineHeight:24
  },
  subText: {
    fontSize: 16,
    color: '#00194c',
    lineHeight:26,
    fontWeight:'500'
  },
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#00194C',
    marginBottom: 8,
  },
  mandateOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mandateOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor:'#E5ECFC',
    marginHorizontal: 4,
  },
  selectedMandateOption: {
    backgroundColor: '#00194C',
  },
  mandateOptionText: {
    color: '#00194C',
    fontWeight: '500',
    fontSize:12
  },
  selectedMandateOptionText: {
    color: '#ffffff',
  },
  noteText: {
    fontSize: 12,
    color: '#6E7EAA',
    marginTop: 8,
    marginBottom: 16,
    fontStyle:'italic'
  },
  signButton: {
    backgroundColor: '#002777',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    textTransform:'none'
  },
  mandateIcon: {
    width: 100,
    marginBottom: 8,  
    objectFit:'contain'
  },
  downloadNach:{
    justifyContent:'center',
    flexDirection:'row',
    fontWeight:'500',
    marginBottom:16
  },
  downloadNachText:{
    color:"#758BFD",
    fontSize:16
  },
  selectedMandateIcon:{
    backgroundColor:'#ffffff',
    borderRadius:5,
    paddingHorizontal:10,
  },
});

export default MandateScreen;