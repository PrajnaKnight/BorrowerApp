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
      { label: 'Divorced', value: 'Divorced' },
      { label: 'Widowed', value: 'Widowed' },
      { label: 'Separated', value: 'Separated' },
    ],
    qualification: [
      { label: 'Undergraduate', value: 'Undergraduate' },
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
     navigation.navigate('BusinessOwnerAddress');
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };

  const renderInputField = (label, field, placeholder, readOnly = false, keyboardType = 'default', optional = false, icon = null) => {
    return (
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {optional && <Text style={styles.optionalLabel}> Optional</Text>}
        </View>
        <CustomInput
          placeholder={placeholder}
          value={currentApplicant.data[field] || ''}
          onChangeText={(text) => handleInputChange(field, text)}
          readOnly={readOnly}
          keyboardType={keyboardType}
          style={styles.input}
          icon={icon}
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
          size={18} 
          color={applicant.type === 'Applicant' ? "#2B478B" : "#2B478B"}
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
        <Ionicons name="add" size={18} color="#ffffff" />
      </View>
      <Text style={[cardStyles.cardText, { color: "#ffffff" }]}>Add</Text>
    </TouchableOpacity>
  );


  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#ffffff", paddingBottom:0 }}>
        <ProgressBar progress={0.1} />
        <View style={styles.TOpTitleContainer}>
          <Text style={[styles.TitleText]}>Business Owner Details</Text>
          <Text style={styles.pageIndex}>
            <Text style={styles.IndexActive}>1</Text>/2
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
          {applicants.length > 0  && renderAddCard()}
        </ScrollView>
        {renderDropdownField("Role Type", "roleType", "Select Role Type")}
        {renderInputField("PAN Number", "panNumber", "Enter PAN Number", true)}
        {renderInputField("Full Name", "fullName", "Enter Full Name")}
        {renderInputField("Father's Name", "fatherName", "Enter Father's Name")}
        {renderInputField(
          "Date of Birth", 
          "dateOfBirth", 
          "DD/MM/YYYY", 
          true, 
          null, 
          false, 
          <Ionicons name="calendar-outline" size={18} color="#ff8500" />
        )}
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
        {renderInputField("Aadhaar Number", "aadhaarNumber", "Enter Aadhaar Number", false, 'numeric', true)}
        {renderInputField("Email ID", "emailId", "Enter Email ID",false,'email-address' )}
        {renderInputField("Alternate Mobile Number", "alternateMobile", "Enter Alternate Mobile Number", false,'phone-pad')}
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
        <View height={10} />
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
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    elevation: 2,

  },
  applicantCard: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coApplicantCard: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addCard: {
    backgroundColor: "#2B478B",
    borderStyle: "solid",
    borderColor: "#2B478B",
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 2,
  },
  cardText: {
    fontSize: 10,
    textAlign: "center",
    color:'#2B478B'
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