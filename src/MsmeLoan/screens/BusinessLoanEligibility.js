import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Image
} from 'react-native';
import { styles } from '../../assets/style/msmeStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../Common/components/useContext';
import CustomSlider from '../../Common/components/ControlPanel/CustomSlider';
import CustomProgressChart from '../../Common/components/ControlPanel/CustomProgressChart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Layout from '../../Common/components/Layout';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import { GoBack } from '../../PersonalLoan/services/Utils/ViewValidator';

const BusinessLoanEligibilityScreen = ({ navigation }) => {
  const { fontSize } = useAppContext();
  const { width } = useWindowDimensions();

  const [loanAmount, setLoanAmount] = useState(1000000);
  const [tenure, setTenure] = useState(36);
  const [rateOfInterest, setRateOfInterest] = useState(11.45);
  const [emiAmount, setEmiAmount] = useState(10000);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.7);
  }, []);

  const dynamicFontSize = size => size + fontSize;

  const handleLoanAmountChange = (value) => {
    setLoanAmount(parseInt(value));
  };

  const handleTenureChange = (value) => {
    setTenure(parseInt(value));
  };

  const handleProceed = () => {
    if (!isButtonDisabled) {
      console.log('Form is valid. Proceeding...');
      navigation.navigate('PersonalDocuments');
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };
  const handleFunds = () => {
    console.log('Request more funds');
  };

  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#ffffff" }}>
        <ProgressBar progress={0.7} />
        <View style={styles.TOpTitleContainer}>
        <Text style={styles.TitleText}>Business Loan Eligibility</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text
            style={[
              styles.congratsText,
              { fontSize: dynamicFontSize(18), color: "#FFA500" },
            ]}>
            Congratulations! 🎉
          </Text>
          <Text
            style={[styles.approvalText, { fontSize: dynamicFontSize(16) }]}>
            Your business loan request has been approved up to <Text style={{color:'#ff8500'}}>₹10,00,000</Text>
          </Text>

          <View style={styles.chartContainer}>
            <CustomProgressChart
              loanAmount={loanAmount}
              minLoanAmount={0}
              maxLoanAmount={5000000}
            />
          </View>

          <View style={styles.loanIdcontainer}>
            <View style={styles.loanIdiconContainer}>
              <MaterialCommunityIcons
                name="hand-coin-outline"
                size={24}
                color="#ffffff"
              />
            </View>
            <Text style={styles.loanId}>
              Loan ID: <Text style={styles.loanIdValue}>ACME144567</Text>
            </Text>
          </View>

          <CustomSlider
            title="Loan Amount"
            icon="rupee"
            min={0}
            max={2000000}
            steps={10000}
            sliderValue={loanAmount}
            inputValue={loanAmount.toString()}
            onChange={handleLoanAmountChange}
            isForAmount={true}
          />

          <CustomSlider
            title="Tenure"
            icon="calendar"
            min={6}
            max={48}
            steps={1}
            sliderValue={tenure}
            inputValue={tenure.toString()}
            onChange={handleTenureChange}
            isTenure={true}
          />

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, { fontSize: dynamicFontSize(14) }]}>
                Rate of Interest
              </Text>
              <View style={[styles.infoValueContainer, { marginRight: 5 }]}>
                <Text
                  style={[styles.infoValue, { fontSize: dynamicFontSize(16) }]}>
                  {rateOfInterest}%
                </Text>
                <Text
                  style={[
                    styles.infoSubtext,
                    { fontSize: dynamicFontSize(8) },
                  ]}>
                  Reducing {'\n'}Rate
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text
                style={[styles.infoLabel, { fontSize: dynamicFontSize(14) }]}>
                EMI Amount
              </Text>
              <View style={[styles.infoValueContainer, { marginLeft: 5 }]}>
                <Text
                  style={[styles.infoValue, { fontSize: dynamicFontSize(16) }]}>
                  ₹ {emiAmount}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              handleFunds;
            }}
            style={styles.Fundscontainer}>
            <View style={styles.Fundscontent}>
              <Text style={styles.Fundstitle}>Interested for a higher amount?</Text>
              <View style={styles.Fundbutton}>
                <Text
                  style={[
                    styles.FundbuttonText,
                    { fontSize: dynamicFontSize(14) },
                  ]}>
                  Request More Funds
                </Text>
              </View>
            </View>
            <View style={styles.fundsImage}>
                <Image
                  source={require("../../assets/images/funds.png")}
                  style={styles.funds}
                />
              </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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

export default BusinessLoanEligibilityScreen;