import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ImageBackground, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import InputSlider from '../components/InputSlider';
import LoanTenureSlider from '../components/LoanTenureSlider';
import ProceedButton from '../components/ProceedButton';
import Layout from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import applyFontFamily from '../../assets/style/applyFontFamily';

const EMICalculator = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('EMI Calculator');
  const [formData, setFormData] = useState({
    loanAmount: 500000,
    interestRate: 10,
    loanTenure: 60,
  });
  const [tenureRange, setTenureRange] = useState({ min: 1, max: 30 });
  const [tenureUnit, setTenureUnit] = useState('Yr');
  const [emiDetails, setEmiDetails] = useState({
    emiAmount: 0,
    principal: 0,
    interest: 0,
    totalInterestPayable: 0,
    totalAmountPayable: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    updateTenureRange();
  }, [tenureUnit]);

  useEffect(() => {
    calculateEMIDetails();
  }, [formData, tenureUnit]);

  const updateTenureRange = () => {
    if (tenureUnit === 'Yr') {
      setTenureRange({ min: 1, max: 30 });
    } else {
      setTenureRange({ min: 1, max: 360 });
    }
  };

  const calculateEMIDetails = () => {
    const { loanAmount, interestRate, loanTenure } = formData;
    const tenureInMonths = tenureUnit === 'Yr' ? loanTenure * 12 : loanTenure;
    const emi = calculateEMI(loanAmount, interestRate, tenureInMonths);
    const totalAmountPayable = emi * tenureInMonths;
    const totalInterestPayable = totalAmountPayable - loanAmount;

    setEmiDetails({
      emiAmount: emi.toFixed(),
      principal: loanAmount,
      interest: totalInterestPayable.toFixed(),
      totalInterestPayable: totalInterestPayable.toFixed(),
      totalAmountPayable: totalAmountPayable.toFixed(),
    });
  };

  const handleSliderChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleTenureToggle = (unit) => {
    setTenureUnit(unit);
    updateTenureRange();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleDone = () => {
    closeModal();
    navigation.navigate('RepaymentSchedule', { startDate, emiDetails });
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>EMI Calculator</Text>
          <TouchableOpacity onPress={toggleExpand}>
            <ImageBackground
              source={require("../../assets/images/emicalculatorbanner.png")}
              style={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: 15,
              }}
              resizeMode="cover">
              <View style={{ minHeight: 80 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}>
                  <Text style={styles.emiLabel}>Your EMI is</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.emiAmount}>
                      ₹ {emiDetails.emiAmount}
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={24}
                      color="#ff8500"
                    />
                  </View>
                </View>
                {isExpanded && (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <Text style={styles.detailLabel}>Principal</Text>
                      <Text style={styles.emiDetail}>
                        ₹ {emiDetails.principal}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                      <Text style={styles.detailLabel}>Interest</Text>
                      <Text style={styles.emiDetail}>
                        ₹ {emiDetails.interest}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.emiDetailsCard}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={styles.emiTotalDetail}>
                <Text style={styles.TotalPaybleLabel}>
                  {" "}
                  Total Interest Payable
                </Text>
                <Text style={styles.TotalPaybleValue}>
                  ₹ {emiDetails.totalInterestPayable}
                </Text>
              </View>
              <View style={styles.emiTotalDetail}>
                <Text style={styles.TotalPaybleLabel}>
                  {" "}
                  Total Amount Payable
                </Text>
                <Text style={styles.TotalPaybleValue}>
                  {" "}
                  ₹ {emiDetails.totalAmountPayable}
                </Text>
              </View>
            </View>
            <View
              style={[{ flexDirection: "row", justifyContent: "space-between", alignItems:"center" }, styles.emiLinkwrapper]}>
              <Text style={styles.link} >
                Repayment Schedule
              </Text>
              <TouchableOpacity style={styles.viewButton}
                onPress={openModal}>
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formContainer}>
            <InputSlider
              label="Loan Amount"
              value={formData.loanAmount}
              min={10000}
              max={10000000}
              step={10000}
              onValueChange={(value) => handleSliderChange("loanAmount", value)}
              isCurrency={true}
            />
            <InputSlider
              label="Rate of Interest (ROI)"
              value={formData.interestRate}
              min={0}
              max={50}
              step={1}
              onValueChange={(value) =>
                handleSliderChange("interestRate", value)
              }
              suffix="%"
            />
            <LoanTenureSlider
              label="Loan Tenure"
              value={formData.loanTenure}
              min={tenureRange.min}
              max={tenureRange.max}
              step={1}
              onValueChange={(value) => handleSliderChange("loanTenure", value)}
              toggle={tenureUnit}
              onToggle={handleTenureToggle}
            />
          </View>
          {/* <ProceedButton onPress={() => {}} text="CALCULATE" /> */}
        </View>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Repayment Schedule</Text>
            <Text style={styles.modalSubtitle}>
              Enter a start date to know your loan repayment schedule
            </Text>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>
                {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="calendar"
                onChange={onDateChange}
              />
            )}
            <ProceedButton
              onPress={handleDone}
              text="DONE"
              disabled={!startDate}
            />
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return emi;
};

const styles = applyFontFamily({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00194c',
    marginBottom: 10,
  },
  emiDetailsCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  emiLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emiAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  emiDetail: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'left',
    marginBottom: 4,
    width: '32%',
  },
  link: {
    color: '#758BFD',
    textDecorationLine: 'underline',
    textAlign: 'left',
  },
  emiLinkwrapper:{
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 10,
  },
  formContainer: {
    marginBottom: 15,
  },
  TotalPaybleLabel: {
    fontSize: 12,
    color: '#00194C',
    textAlign: 'center',
  },
  TotalPaybleValue: {
    fontSize: 14,
    color: '#00194C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00194c',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#00194c',
    marginBottom: 20,
  },
  dateText: {
    color: '#00194C',
    fontSize: 14,
    padding: 10,
    borderColor: '#B3B9E1',
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    color: '#00194C',
    fontSize: 14,
    marginBottom: 5,
  },
  datePicker: {
    width: '100%',
    marginBottom: 20,
  },
  viewButton:{
    backgroundColor:'#00194c',
    paddingVertical:8,
    paddingHorizontal:16,
    borderRadius:10
  },
  viewBtnText:{
    color:'#fff',
    fontSize:14
  },
});

export default EMICalculator;
