import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import CustomInput from '../../Common/components/ControlPanel/input';
import CustomDropdown from '../../Common/components/ControlPanel/dropdownPicker';
import Layout from '../../Common/components/Layout';
import { styles } from '../../assets/style/msmeStyle';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import RadioButton from '../../Common/components/ControlPanel/radioButton';
import { useNavigation } from '@react-navigation/native';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import {GoBack} from '../../PersonalLoan/services/Utils/ViewValidator';

const BusinessProfileScreen = () => {
  const navigation = useNavigation();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [formData, setFormData] = useState({
    entityPAN: 'ABIB0012E',
    entityName: 'Knight Fintech',
    proprietorName: 'ABC',
    natureOfBusiness: '',
    industryType: '',
    industrySubType: '',
    businessMode: 'B2B',
  });

  const [errors, setErrors] = useState({});
  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.5);
  }, []);

  // Dropdown items
  const [natureOfBusinessItems, setNatureOfBusinessItems] = useState([
    { label: 'Customer Service', value: 'Customer Service' },
    { label: 'Manufacturing', value: 'Manufacturing' },
    { label: 'Retail', value: 'Retail' },
  ]);
  const [industryTypeItems, setIndustryTypeItems] = useState([
    { label: 'Food & Beverages', value: 'Food & Beverages' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Healthcare', value: 'Healthcare' },
  ]);
  const [industrySubTypeItems, setIndustrySubTypeItems] = useState([
    { label: 'Bakery Industry', value: 'Bakery Industry' },
    { label: 'Restaurant', value: 'Restaurant' },
    { label: 'Catering', value: 'Catering' },
  ]);

  // Selected items for dropdowns
  const [selectedNatureOfBusiness, setSelectedNatureOfBusiness] = useState(null);
  const [selectedIndustryType, setSelectedIndustryType] = useState(null);
  const [selectedIndustrySubType, setSelectedIndustrySubType] = useState(null);

  useEffect(() => {
    validateForm();
  }, [formData]);

  useEffect(() => {
    // Set initial selected items based on formData
    setSelectedNatureOfBusiness(formData.natureOfBusiness);
    setSelectedIndustryType(formData.industryType);
    setSelectedIndustrySubType(formData.industrySubType);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value || ''
    }));

    // Update selected items for dropdowns
    if (field === 'natureOfBusiness') setSelectedNatureOfBusiness(value);
    if (field === 'industryType') setSelectedIndustryType(value);
    if (field === 'industrySubType') setSelectedIndustrySubType(value);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.entityPAN) newErrors.entityPAN = 'Entity PAN is required';
    if (!formData.entityName) newErrors.entityName = 'Entity Name is required';
    if (!formData.proprietorName) newErrors.proprietorName = 'Proprietor Name is required';
    if (!formData.natureOfBusiness) newErrors.natureOfBusiness = 'Nature of Business is required';
    if (!formData.industryType) newErrors.industryType = 'Industry Type is required';
    if (!formData.industrySubType) newErrors.industrySubType = 'Industry Sub Type is required';
    setErrors(newErrors);
    setIsButtonDisabled(Object.keys(newErrors).length > 0);
  };

  const handleProceed = () => {
    if (!isButtonDisabled) {
      console.log('Form is valid. Proceeding...');
     navigation.navigate('BusinessTypeDetails');
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
          value={formData[field] || ''}
          onChangeText={(text) => handleInputChange(field, text)}
          error={errors[field]}
          readOnly={readOnly}
        />
      </View>
    );
  };

  const renderDropdownField = (label, field, items, setItems, placeholder, zIndex, selectedValue, setSelectedValue, error) => {
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <CustomDropdown
          value={selectedValue}
          setValue={(value) => {
            setSelectedValue(value);
            handleInputChange(field, value);
          }}
          items={items}
          setItems={setItems}
          placeholder={placeholder}
          zIndex={zIndex}
          error={error}
        />
      </View>
    );
  };

  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#F8FAFF" }}>
        <ProgressBar progress={0.5} />
        <Text style={styles.TitleText}>Business Profile</Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          {renderInputField("Entity PAN", "entityPAN", "Entity PAN", true)}
          {renderInputField("Entity Name", "entityName", "Entity Name", true)}
          {renderInputField(
            "Proprietor Name",
            "proprietorName",
            "Proprietor Name",
            true
          )}
          {renderDropdownField(
            "Nature of Business",
            "natureOfBusiness",
            natureOfBusinessItems,
            setNatureOfBusinessItems,
            "Select Nature of Business",
            3000,
            selectedNatureOfBusiness,
            setSelectedNatureOfBusiness
          )}
          {renderDropdownField(
            "Industry Type",
            "industryType",
            industryTypeItems,
            setIndustryTypeItems,
            "Select Industry Type",
            2000,
            selectedIndustryType,
            setSelectedIndustryType
          )}
          {renderDropdownField(
            "Industry Sub Type",
            "industrySubType",
            industrySubTypeItems,
            setIndustrySubTypeItems,
            "Select Industry Sub Type",
            1000,
            selectedIndustrySubType,
            setSelectedIndustrySubType
          )}

          <Text style={styles.label}>Business Mode</Text>
          <View style={styles.radioGroup}>
            {["B2B", "B2C", "B2G"].map((mode) => (
              <RadioButton
                key={mode}
                label={mode}
                isSelected={formData.businessMode === mode}
                onPress={() => handleInputChange("businessMode", mode)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
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

export default BusinessProfileScreen;