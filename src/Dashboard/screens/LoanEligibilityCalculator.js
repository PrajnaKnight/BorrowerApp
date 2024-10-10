import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import LoanDetailsCard from '../components/LoanDetailsCard';
import InputSlider from '../components/InputSlider';
import LoanTenureSlider from '../components/LoanTenureSlider';
import RadioButtonGroup from '../components/RadioButtonGroup';
import ProceedButton from '../components/ProceedButton';
import Layout from '../components/Layout';
import { styles as globalStyles } from '../../assets/style/globalStyle';
import EmiInputSlider from '../components/EmiInputSlider';

const LoanEligibilityCalculator = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Personal Loan');
  const [loanDetails, setLoanDetails] = useState({});
  const [formData, setFormData] = useState({
    employmentStatus: 'Salaried',
    age: 0,
    creditScore: 0,
    loanTenure: 0,
    grossSalary: 0,
    otherEMI: 0,
    deductions: 0,
  });
  const [tenureRange, setTenureRange] = useState({ min: 12, max: 60 });
  const [isApplyButtonEnabled, setIsApplyButtonEnabled] = useState(false);
  const [tenureUnit, setTenureUnit] = useState('Mo');
  const [errorMessage, setErrorMessage] = useState('');

  const loanDefaults = {
    'Home Loan': {
      loanDetails: {
        loanAmount: '20,38,340',
        emiAmount: '19,000',
        tenure: 240,
        interestRate: 9.50,
      },
      formDefaults: {
        employmentStatus: 'Salaried',
        age: 30,
        creditScore: 750,
        loanTenure: 240,
        grossSalary: 40000,
        otherEMI: 0,
        deductions: 5000,
      },
      tenureRange: {
        Mo: { min: 12, max: 240 },
        Yr: { min: 1, max: 30 },
      },
    },
    'Personal Loan': {
      loanDetails: {
        loanAmount: '9,00,000',
        emiAmount: '11,158',
        tenure: 60,
        interestRate: 14.00,
      },
      formDefaults: {
        employmentStatus: 'Salaried',
        age: 30,
        creditScore: 750,
        loanTenure: 60,
        grossSalary: 50000,
        otherEMI: 5000,
        deductions: 0,
      },
      tenureRange: {
        Mo: { min: 12, max: 60 },
        Yr: { min: 1, max: 5 },
      },
    },
    'Vehicle Loan': {
      loanDetails: {
        loanAmount: '10,00,000',
        emiAmount: '15,158',
        tenure: 84,
        interestRate: 14.00,
      },
      formDefaults: {
        employmentStatus: 'Salaried',
        age: 30,
        creditScore: 750,
        loanTenure: 84,
        grossSalary: 50000,
        otherEMI: 5000,
        deductions: 0,
      },
      tenureRange: {
        Mo: { min: 12, max: 120 },
        Yr: { min: 1, max: 12 },
      },
    },
  };

  useEffect(() => {
    updateLoanDetails(activeTab, tenureUnit);
  }, [activeTab]);

  const updateLoanDetails = (tab, unit) => {
    console.log(`Updating loan details for ${tab} with unit ${unit}`);
    const { loanDetails, formDefaults, tenureRange } = loanDefaults[tab];
    setLoanDetails(loanDetails);
    
    const newRange = tenureRange[unit];
    if (!newRange) {
      console.error(`Invalid tenure range for ${tab} and ${unit}`);
      return;
    }
    
    setTenureRange(newRange);
    
    const adjustedTenure = unit === 'Yr' 
      ? Math.min(Math.max(Math.floor(formDefaults.loanTenure / 12), newRange.min), newRange.max)
      : Math.min(Math.max(formDefaults.loanTenure, newRange.min), newRange.max);
    
    setFormData({
      ...formDefaults,
      loanTenure: adjustedTenure
    });
  };

  useEffect(() => {
    const isValidInput = validateForm(formData, tenureRange);
    setIsApplyButtonEnabled(isValidInput);
    setErrorMessage(isValidInput ? '' : getErrorMessage(formData, tenureRange));
  }, [formData, tenureRange]);

  const validateForm = (data, range) => {
    if (!range || typeof range.min === 'undefined' || typeof range.max === 'undefined') {
      console.error('Invalid tenure range:', range);
      return false;
    }
    const { age, creditScore, loanTenure, grossSalary, otherEMI, deductions } = data;
    return (
      age >= 18 &&
      creditScore > 0 &&
      loanTenure >= range.min &&
      loanTenure <= range.max &&
      grossSalary > 0 &&
      otherEMI >= 0 &&
      deductions >= 0
    );
  };

  const getErrorMessage = (data, range) => {
    if (!range || typeof range.min === 'undefined' || typeof range.max === 'undefined') {
      return 'Invalid tenure range';
    }
    const allFieldsZero = Object.values(data).every((value) => value === 0);
    if (allFieldsZero) {
      return 'Please re-check your input details';
    }
    if (data.loanTenure < range.min) {
      return `Please enter Tenure greater than or equal to ${range.min} ${tenureUnit === 'Mo' ? 'months' : 'years'}`;
    }
    if (data.loanTenure > range.max) {
      return `Please enter Tenure less than or equal to ${range.max} ${tenureUnit === 'Mo' ? 'months' : 'years'}`;
    }
    return 'Please re-check your input details';
  };

  const handleTabPress = (tab) => setActiveTab(tab);

  const handleSliderChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: roundOff(Number(value)) }));

  const handleInputChange = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleProceed = () => {
    if (isApplyButtonEnabled) {
      console.log('Proceed with:', formData);
    }
  };

  const roundOff = (value) => Math.round(value);

  const handleTenureUnitToggle = (unit) => {
    console.log(`Toggling tenure unit to ${unit}`);
    setTenureUnit(unit);
    updateLoanDetails(activeTab, unit);
  };
  return (
    <Layout>
      <ScrollView style={globalStyles.container}>
        <Header activeTab={activeTab} onTabPress={handleTabPress} />
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText,{fontFamily:"Poppins_400Regular"}]}>{errorMessage}</Text>
          </View>
        )}
        <View style={globalStyles.content}>
          <Text style={globalStyles.sectionTitle}>
            Loan Eligibility Calculator
          </Text>
          <LoanDetailsCard {...loanDetails} />
          <View style={globalStyles.formContainer}>
            <RadioButtonGroup
              options={["Salaried", "Self Employed"]}
              selected={formData.employmentStatus}
              onSelect={(option) =>
                handleInputChange("employmentStatus", option)
              }
            />
            <InputSlider
              label="Age (Years)"
              value={formData.age}
              min={18}
              max={60}
              step={1}
              onValueChange={(value) => handleSliderChange("age", value)}
            />
            <InputSlider
              label="Credit Score"
              value={formData.creditScore}
              min={300}
              max={900}
              step={1}
              onValueChange={(value) =>
                handleSliderChange("creditScore", value)
              }
            />
            <LoanTenureSlider
              label="Loan Tenure"
              value={formData.loanTenure}
              min={tenureRange.min}
              max={tenureRange.max}
              step={1}
              onValueChange={(value) => handleSliderChange("loanTenure", value)}
              toggle={tenureUnit}
              onToggle={handleTenureUnitToggle}
              sliderLabels={[tenureRange.min.toString(), tenureRange.max.toString()]}
            />
            <InputSlider
              label={
                formData.employmentStatus === "Salaried"
                  ? "Gross Salary (Monthly)"
                  : "Gross Income (Monthly)"
              }
              value={formData.grossSalary}
              min={10000}
              max={10000000}
              step={1000}
              onValueChange={(value) =>
                handleSliderChange("grossSalary", value)
              }
              isCurrency={true}
            />
            <InputSlider
              label="Other EMI (Monthly)"
              value={formData.otherEMI}
              min={0}
              max={100000}
              step={100}
              onValueChange={(value) => handleSliderChange("otherEMI", value)}
              isCurrency={true}
            />
            <InputSlider
              label={
                formData.employmentStatus === "Salaried"
                  ? "Any Deductions (PPF, NPS, etc.)"
                  : "Any Deductions (Tax, etc.)"
              }
              value={formData.deductions}
              min={0}
              max={100000}
              step={100}
              onValueChange={(value) => handleSliderChange("deductions", value)}
              isCurrency={true}
            />
          </View>
          <ProceedButton
            onPress={handleProceed}
            disabled={!isApplyButtonEnabled}
            text="Proceed"
          />
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: 'red',
    padding: 5,
  },
  errorText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
});

export default LoanEligibilityCalculator;