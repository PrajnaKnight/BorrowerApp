import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../../Common/components/ControlPanel/input';
import Layout from '../../Common/components/Layout';
import { styles } from '../../assets/style/msmeStyle';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import RadioButton from '../../Common/components/ControlPanel/radioButton';
import { useNavigation } from '@react-navigation/native';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { GoBack } from '../../PersonalLoan/services/Utils/ViewValidator';

const BusinessOwnerAddress = () => {
  const navigation = useNavigation();
  const { setProgress } = useProgressBar();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [activeOwner, setActiveOwner] = useState('Leela Lalwani');
  const [activeTab, setActiveTab] = useState('permanent');
  const [addressType, setAddressType] = useState('Same as Permanent Address');
  const [addressData, setAddressData] = useState({
    'Leela Lalwani': {
      permanent: {
        addressLine1: 'Techniplex-2, Goregaon (W),',
        addressLine2: 'Liliya Nagar',
        pincode: '400062',
        city: 'Mumbai',
        landmark: 'Near Witty International School',
        state: 'Maharashtra'
      },
      current: {},
      mailing: {}
    },
    'Co-Applicant Name': {
      permanent: {},
      current: {},
      mailing: {}
    }
  });

  useEffect(() => {
    setProgress(0.1); // 10% progress
  }, []);

  const handleInputChange = (field, value) => {
    setAddressData(prev => ({
      ...prev,
      [activeOwner]: {
        ...prev[activeOwner],
        [activeTab]: {
          ...prev[activeOwner][activeTab],
          [field]: value
        }
      }
    }));
  };

  const handleProceed = () => {
    console.log('Proceeding with address:', addressData);
    navigation.navigate('BusinessBankDetails');
  };

  const validateForm = () => {
    const isValid = Object.values(addressData[activeOwner][activeTab]).every(value => value !== '');
    setIsButtonDisabled(!isValid);
  };

  useEffect(() => {
    validateForm();
  }, [addressData, activeOwner, activeTab]);

  const renderAddressForm = () => (
    <View style={styles.addressForm}>
      <CustomInput
        placeholder="Address line 1"
        value={addressData[activeOwner][activeTab].addressLine1 || ""}
        onChangeText={(text) => handleInputChange("addressLine1", text)}
      />
      <CustomInput
        placeholder="Address line 2"
        value={addressData[activeOwner][activeTab].addressLine2 || ""}
        onChangeText={(text) => handleInputChange("addressLine2", text)}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <CustomInput
            placeholder="PIN Code"
            value={addressData[activeOwner][activeTab].pincode || ""}
            onChangeText={(text) => handleInputChange("pincode", text)}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <CustomInput
            placeholder="City"
            value={addressData[activeOwner][activeTab].city || ""}
            onChangeText={(text) => handleInputChange("city", text)}
          />
        </View>
      </View>
      <CustomInput
        placeholder="Landmark"
        value={addressData[activeOwner][activeTab].landmark || ""}
        onChangeText={(text) => handleInputChange("landmark", text)}
      />
      <CustomInput
        placeholder="State"
        value={addressData[activeOwner][activeTab].state || ""}
        onChangeText={(text) => handleInputChange("state", text)}
      />
    </View>
  );

  const renderRadioButtons = () => {
    if (activeTab === 'permanent') return null;
    return (
      <>
        <RadioButton
          style={{ marginBottom: 5 }}
          label="Same as Permanent Address"
          isSelected={addressType === "Same as Permanent Address"}
          onPress={() => setAddressType("Same as Permanent Address")}
        />
        {activeTab === 'mailing' && (
          <RadioButton
            style={{ marginBottom: 5 }}
            label="Same as Current Address"
            isSelected={addressType === "Same as Current Address"}
            onPress={() => setAddressType("Same as Current Address")}
          />
        )}
      </>
    );
  };

  return (
    <Layout>
      <View style={styles.container}>
        <ProgressBar progress={0.1} />
        <View style={styles.TOpTitleContainer}>
          <Text style={[styles.TitleText]}>Business Owner Address</Text>
          <Text style={styles.pageIndex}>
            <Text style={styles.IndexActive}>2</Text>/2
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {Object.keys(addressData).map((owner) => (
            <TouchableOpacity
              key={owner}
              style={[
                styles.ownerTab,
                activeOwner === owner && styles.activeOwnerTab
              ]}
              onPress={() => setActiveOwner(owner)}
            >
              <Text style={[
                styles.ownerName,
                activeOwner === owner && styles.activeOwnerName
              ]}>
                {owner}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContainer}>
          {['permanent', 'current', 'mailing'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.Addresstab,
                activeTab === tab && styles.AddressActivetab,
                { marginLeft: tab === 'permanent' ? 0 : undefined, marginRight: tab === 'mailing' ? 0 : undefined },
              ]}
              onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.AdresstabText,
                  activeTab === tab && styles.AdressActivetabText,
                ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderRadioButtons()}

        <ScrollView style={styles.formContainer}>
          {renderAddressForm()}
        </ScrollView>

        <Text style={styles.noteText}>
          <Text style={{ color: "#ff8500" }}>Note:</Text> Data has been
          prefilled. Kindly confirm to proceed
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => GoBack(navigation)}>
          <Text style={[styles.cancelButtonText]}>Back</Text>
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

export default BusinessOwnerAddress;