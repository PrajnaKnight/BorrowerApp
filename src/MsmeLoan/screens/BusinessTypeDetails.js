import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import CustomInput from '../../Common/components/ControlPanel/input';
import CustomDropdown from '../../Common/components/ControlPanel/dropdownPicker';
import Layout from '../../Common/components/Layout';
import { styles } from '../../assets/style/msmeStyle';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import DatePickerComponent from '../../Common/components/ControlPanel/datePicker';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import {GoBack} from '../../PersonalLoan/services/Utils/ViewValidator';
  
const BusinessTypeDetailsScreen = () => {
  const navigation = useNavigation();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { setProgress } = useProgressBar(); 

  useEffect(() => {
    setProgress(0.6);
  }, []);

  const [formData, setFormData] = useState({
    incorporationDate: new Date('2014-12-25'),
    commencementDate: new Date('2014-12-25'),
    businessVintage: '5-10 years',
    businessPremise: 'Owned',
    officeTenure: '',
    salesTurnover: '',
    operatingIncome: '',
    businessTurnoverAnnual: '',
  
    businessRegisteredAddress: 'Techniplex-2, Goregaon (W), Mumb...',
    pinCode: '400062',
    city: 'Mumbai',
    state: 'Maharashtra'
  });

  const [errors, setErrors] = useState({});

  // Dropdown items

  const businessPremiseItems = [
    { label: 'Owned', value: 'Owned' },
    { label: 'Rented', value: 'Rented' },
  ];

  const officeTenureItems = [
    { label: 'In possession less than 6 months', value: 'In possession less than 6 months' },
    { label: 'In possession of 6 months to 2 years', value: 'In possession of 6 months to 2 years' },
    { label: 'In possession for more than 2 years', value: 'In possession for more than 2 years' },
  ];

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    // Add validation logic here if needed
    setErrors(newErrors);
    setIsButtonDisabled(Object.keys(newErrors).length > 0);
  };

  const handleProceed = () => {
    if (!isButtonDisabled) {
      console.log('Form is valid. Proceeding...');
      navigation.navigate('BusinessOwnerDetails');
      // Add your logic here to proceed
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };

  const renderInputField = (label, field, placeholder, readOnly = false) => {
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <CustomInput
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          error={errors[field]}
          readOnly={readOnly}
        />
      </View>
    );
  };

  const renderDatePicker = (label, field) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <DatePickerComponent
        onDateChange={(newDate) => handleInputChange(field, newDate)}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        initialDate={formData[field]}
      />
    </View>
  );

  const renderDropdownField = (label, field, items, placeholder) => {
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <CustomDropdown
          value={formData[field]}
          setValue={(value) => handleInputChange(field, value)}
          items={items}
          setItems={() => {}} // This is not needed if items are static
          placeholder={placeholder}
          zIndex={3000 - Object.keys(formData).indexOf(field)} // Adjust zIndex based on field order
          error={errors[field]}
        />
      </View>
    );
  };

  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#ffffff" }}>
        <ProgressBar progress={0.4} />
        <View style={styles.TOpTitleContainer}>
          <Text style={[styles.TitleText]}>Business Information</Text>
          <Text style={styles.pageIndex}>
            <Text style={styles.IndexActive}>4</Text>/4
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView>
          {renderDatePicker("Incorporation Date", "incorporationDate")}
          {renderDatePicker("Commencement Date", "commencementDate")}

          {renderInputField(
            "Business Vintage",
            "businessVintage",
            "Enter Business Vintage",
            true
          )}
          {renderInputField(
            "Sales Turnover",
            "salesTurnover",
            "Enter Sales Turnover"
          )}
          {renderInputField(
            "Operating Income",
            "operatingIncome",
            "Enter Operating Income"
          )}
          {renderInputField(
            "Business Turnover (Annual)",
            "businessTurnoverAnnual",
            "Enter Business Turnover"
          )}
          {renderDropdownField(
            "Business Premise",
            "businessPremise",
            businessPremiseItems,
            "Select Business Premise"
          )}

          <View style={{ zIndex: 1000 }}>
            {renderDropdownField(
              "Office Tenure",
              "officeTenure",
              officeTenureItems,
              "Select Office Tenure"
            )}
          </View>
          {renderInputField(
            "Business Registered Address",
            "businessRegisteredAddress",
            "Enter Business Address",
            true
          )}

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              {renderInputField("PIN Code", "pinCode", "Enter PIN Code", true)}
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              {renderInputField("City", "city", "Enter City", true)}
            </View>
          </View>

          {renderInputField("State", "state", "Enter State", true)}
        </ScrollView>
      </View>
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

export default BusinessTypeDetailsScreen;