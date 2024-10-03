import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../../Common/components/ControlPanel/input';
import CustomDropdown from '../../Common/components/ControlPanel/dropdownPicker';
import Layout from '../../Common/components/Layout';
import { styles } from '../../assets/style/msmeStyle';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import RadioButton from '../../Common/components/ControlPanel/radioButton';
import { useNavigation } from '@react-navigation/native';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { GoBack } from '../../PersonalLoan/services/Utils/ViewValidator';
import { Ionicons } from '@expo/vector-icons';

const BusinessOwnerDetails = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [currentApplicant, setCurrentApplicant] = useState({
    type: 'Applicant',
    isMain: applicants.length === 0,
    data: {}
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.1);
  }, []);

  const dropdownItems = {
    roleType: [
      { label: 'Applicant', value: 'Applicant' },
      { label: 'Co-applicant', value: 'Co-applicant' },
    ],
    maritalStatus: [
      { label: 'Married', value: 'Married' },
      { label: 'Single', value: 'Single' },
    ],
    qualification: [
      { label: 'Graduate', value: 'Graduate' },
      { label: 'Post Graduate', value: 'Post Graduate' },
      { label: 'Doctorate', value: 'Doctorate' },
    ],
  };

  const handleInputChange = (field, value) => {
    setCurrentApplicant(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  const addOrUpdateApplicant = () => {
    if (editingIndex !== null) {
      const updatedApplicants = [...applicants];
      updatedApplicants[editingIndex] = currentApplicant;
      setApplicants(updatedApplicants);
      setEditingIndex(null);
    } else {
      setApplicants([...applicants, currentApplicant]);
    }
    setCurrentApplicant({
      type: 'Co-applicant',
      isMain: false,
      data: {}
    });
  };

  const editApplicant = (index) => {
    setCurrentApplicant(applicants[index]);
    setEditingIndex(index);
  };

  const removeApplicant = (index) => {
    const newApplicants = applicants.filter((_, i) => i !== index);
    setApplicants(newApplicants);
  };

  const validateForm = () => {
    // Implement form validation logic here
    const isValid = Object.values(currentApplicant.data).every(value => value !== '');
    setIsButtonDisabled(!isValid);
  };

  useEffect(() => {
    validateForm();
  }, [currentApplicant]);

  const handleProceed = () => {
    if (!isButtonDisabled) {
      console.log('Form is valid. Proceeding...');
      // Navigate to the next screen
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };

  const renderInputField = (label, field, placeholder, keyboardType = 'default') => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <CustomInput
          placeholder={placeholder}
          value={currentApplicant.data[field] || ''}
          onChangeText={(text) => handleInputChange(field, text)}
          keyboardType={keyboardType}
        />
      </View>
    );
  };

  const renderDropdownField = (label, field, placeholder) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <CustomDropdown
          value={currentApplicant.data[field]}
          setValue={(value) => handleInputChange(field, value)}
          items={dropdownItems[field]}
          placeholder={placeholder}
        />
      </View>
    );
  };

  const renderApplicantCard = (applicant, index) => (
    <TouchableOpacity
      key={index}
      style={[
        cardStyles.card,
        applicant.type === 'Applicant' ? cardStyles.applicantCard : cardStyles.coApplicantCard
      ]}
      onPress={() => editApplicant(index)}
    >
      <View style={cardStyles.iconContainer}>
        <Ionicons 
          name={applicant.type === 'Applicant' ? "person" : "people"} 
          size={20} 
          color={applicant.type === 'Applicant' ? "#007AFF" : "#4CD964"}
        />
      </View>
      <Text style={cardStyles.cardText}>{applicant.type}</Text>
      {applicant.type === 'Co-applicant' && (
        <TouchableOpacity 
          style={cardStyles.removeButton}
          onPress={() => removeApplicant(index)}
        >
          <Ionicons name="close-circle" size={20} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );


  const renderAddCard = () => (
    <TouchableOpacity
      style={[cardStyles.card, cardStyles.addCard]}
      onPress={() => setCurrentApplicant({
        type: 'Co-Applicant',
        isMain: false,
        data: {}
      })}
    >
      <View style={cardStyles.iconContainer}>
        <Ionicons name="add" size={24} color="#007AFF" />
      </View>
      <Text style={cardStyles.cardText}>Add</Text>
    </TouchableOpacity>
  );


  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#ffffff", paddingBottom:0 }}>
        <ProgressBar progress={0.1} />
        <View style={styles.TOpTitleContainer}>
          <Text style={[styles.TitleText]}>Business Owner Details</Text>
          <Text style={styles.pageIndex}>
            <Text style={styles.IndexActive}>1</Text>/4
          </Text>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={[styles.container]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">

        <ScrollView horizontal style={cardStyles.cardContainer} showsHorizontalScrollIndicator={false}>
          {applicants.map(renderApplicantCard)}
          {applicants.length < 2 && renderAddCard()}
        </ScrollView>
        {renderDropdownField("Role Type", "roleType", "Select Role Type")}
        {renderInputField("PAN Number", "panNumber", "Enter PAN Number")}
        {renderInputField("Full Name", "fullName", "Enter Full Name")}
        {renderInputField("Father's Name", "fatherName", "Enter Father's Name")}
        {renderInputField("Date of Birth", "dateOfBirth", "DD/MM/YYYY")}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            {["Male", "Female", "Other"].map((gender) => (
              <RadioButton
                key={gender}
                label={gender}
                isSelected={currentApplicant.data.gender === gender}
                onPress={() => handleInputChange("gender", gender)}
              />
            ))}
          </View>
        </View>
        {renderDropdownField("Marital Status", "maritalStatus", "Select Marital Status")}
        {renderInputField("Aadhaar Number", "aadhaarNumber", "Enter Aadhaar Number (Optional)", 'numeric')}
        {renderInputField("Email ID", "emailId", "Enter Email ID", 'email-address')}
        {renderInputField("Alternate Mobile Number", "alternateMobile", "Enter Alternate Mobile Number", 'phone-pad')}
        {renderDropdownField("Qualification", "qualification", "Select Qualification")}
        
        <ButtonComponent
          title="Add Applicant"
          onPress={addOrUpdateApplicant}
          disabled={isButtonDisabled}
          style={{
            button: styles.proceedButton,
          }}
          disabledStyle={{
            button: styles.disabledProceedButton,
          }}
          containerStyle={styles.proceedButtonContainer}
        />
      </ScrollView>
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

const cardStyles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    marginBottom: 10,
  },
  card: {
    padding: 10,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    elevation: 2,
  },
  applicantCard: {
    backgroundColor: "#E5F1FF",
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  coApplicantCard: {
    backgroundColor: "#E5FFE9",
    borderColor: "#4CD964",
    borderWidth: 1,
  },
  addCard: {
    backgroundColor: "#F0F0F0",
    borderStyle: "dashed",
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 2,
  },
  cardText: {
    fontSize: 12,
    textAlign: "center",
  },
  removeButton: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});


export default BusinessOwnerDetails;