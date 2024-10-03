import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '../../Common/components/Layout';
import CustomSlider from '../../Common/components/ControlPanel/CustomSlider';
import CustomDropdown from '../../Common/components/ControlPanel/dropdownPicker'; 
import { useAppContext } from '../../Common/components/useContext';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import { styles } from '../../assets/style/msmeStyle';
import { useNavigation } from '@react-navigation/native';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { GoBack } from '../../PersonalLoan/services/Utils/ViewValidator';


const LoanDetailsScreen = () => {
  const [businessType, setBusinessType] = useState('Proprietorship');
  const [loanAmount, setLoanAmount] = useState(200000);
  const [tenure, setTenure] = useState(36);
  const [purpose, setPurpose] = useState(null);
  const [selectedLoanType, setSelectedLoanType] = useState(null);  // State for selected loan type
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [purposeItems, setPurposeItems] = useState([
    { label: 'Working Capital', value: 'working_capital' },
    { label: 'Business Expansion', value: 'business_expansion' },
    { label: 'Equipment Purchase', value: 'equipment_purchase' },
    { label: 'Debt Consolidation', value: 'debt_consolidation' },
    { label: 'Other', value: 'other' },
  ]);
  const [LoanTypes, setLoanTypes] = useState([
    { label: 'Business Loan', value: 'business_Loan' },
    { label: 'Business Expansion', value: 'business_expansion' },
    { label: 'Equipment Purchase', value: 'equipment_purchase' },
    { label: 'Debt Consolidation', value: 'debt_consolidation' },
    { label: 'Other', value: 'other' },
  ]);
  const { fontSize } = useAppContext();
  const navigation = useNavigation();

  const businessTypes = [
    'Proprietorship', 'Partnership', 'Private Limited',
    'Public Limited', 'One Person Company (OPC)',
    'Limited Liability Partnership (LLP)', '+'
  ];

  const dynamicFontSize = (size) => size + fontSize;

  const handleProceed = () => {
    navigation.navigate("BusinessInfo");
    console.log('Proceed button clicked');
  };
  
  useEffect(() => {
    setIsButtonDisabled(!businessType || !loanAmount || !tenure || !purpose);
  }, [businessType, loanAmount, tenure, purpose]);

  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.1);
  }, []);
  useEffect(() => {
    console.log("Current selectedLoanType: ", selectedLoanType); // Monitor selectedLoanType
  }, [selectedLoanType]);
 

  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#ffffff" }}>
        <ProgressBar progress={0.1} />
        <Text style={[styles.TitleText, { fontSize: dynamicFontSize(24) }]}>
          Welcome,
        </Text>
        <Text style={[styles.subText, { fontSize: dynamicFontSize(16) }]}>
          Please select the loan details you require
        </Text>
      </View>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View>
            <Text
              style={[styles.sectionTitle, { fontSize: dynamicFontSize(16) }]}>
              Loan type
            </Text>
            <CustomDropdown
              onSelectItem={(item) => setValue(item.value)}
              value={selectedLoanType} // Pass the selected loan type state
              setValue={setSelectedLoanType} // Update the selected loan type state
              items={LoanTypes}
              placeholder="Select Loan Type"
              containerStyle={{ marginBottom: 20 }}
              zIndex={9000}
            />
          </View>
          <Text
            style={[styles.sectionTitle, { fontSize: dynamicFontSize(16) }]}>
            Your Business Registration as...
          </Text>
          <View style={styles.businessTypeContainer}>
            {businessTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.businessTypeButton,
                  businessType === type && styles.businessTypeButtonActive,
                ]}
                onPress={() => setBusinessType(type)}>
                <Text
                  style={[
                    styles.businessTypeText,
                    businessType === type && styles.businessTypeTextActive,
                    { fontSize: dynamicFontSize(12) },
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomSlider
            title="Loan Amount"
            icon="rupee"
            keyboardType="numeric"
            min={5000}
            max={100000}
            steps={1000}
            sliderValue={loanAmount}
            onChange={(value) => setLoanAmount(value)}
            isForAmount={true}
          />

          <CustomSlider
            title="Tenure"
            icon="calendar"
            keyboardType="numeric"
            min={6}
            max={72}
            steps={1}
            sliderValue={tenure}
            onChange={(value) => setTenure(value)}
            isTenure={true}
          />

          <Text style={[styles.label, { fontSize: dynamicFontSize(14) }]}>
            Purpose of Loan<Text style={styles.requiredStar}>*</Text>
          </Text>
          <CustomDropdown
            value={purpose}
            setValue={(val) => {
              setPurpose(val);
              setIsButtonDisabled(!val);
            }}
            items={purposeItems}
            setItems={setPurposeItems}
            placeholder="Select purpose"
            searchable={true}
            containerStyle={{ marginBottom: 20 }}
            zIndex={9000}
          />
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <View style={[styles.proceedButtonContainer, { width: "100%" }]}>
          <ButtonComponent
            title="Submit"
            onPress={handleProceed}
            disabled={isButtonDisabled}
            style={{
              button: styles.proceedButton,
            }}
            disabledStyle={{
              button: styles.disabledProceedButton,
            }}
            textStyle={{
              buttonText: { fontSize: dynamicFontSize(14) },
            }}
            containerStyle={styles.proceedButtonContainer}
          />
        </View>
      </View>
    </Layout>
  );
};


export default LoanDetailsScreen;