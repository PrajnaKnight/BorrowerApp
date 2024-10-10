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

const formatIndianCurrency = (value) => {

  console.log(value)
  if (!value || value == "Infinity") {
    return 0
  }
  const num = Math.floor(value);
  const str = num.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree
};

const EMICalculator = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('EMI Calculator');
  const [formData, setFormData] = useState({
    LoanAmount: 10000,
    InterestRate: 0,
    TenureYears: 1,
    Tenure: 0,
    StartDate: new Date()
  });
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [interesetError, setInterestError] = useState(null)

  useEffect(() => {
    calculateEMIDetails();
  }, [formData, tenureUnit]);

  useEffect(() => {
    if (tenureUnit === 'Yr') {
      handleSliderChange("TenureYears", 1)

    } else {
      handleSliderChange("Tenure", 1)
    }
  }, [tenureUnit])

  const calculateEMIDetails = () => {
    const { LoanAmount, InterestRate, TenureYears, Tenure } = formData;
    const tenureInMonths = tenureUnit === 'Yr' ? TenureYears * 12 : Tenure;
    const emi = calculateEMI(LoanAmount, InterestRate, tenureInMonths);
    const totalAmountPayable = emi * tenureInMonths;
    const totalInterestPayable = totalAmountPayable - LoanAmount;

    setEmiDetails({
      emiAmount: formatIndianCurrency(emi),
      principal: formatIndianCurrency(LoanAmount),
      interest: formatIndianCurrency(totalInterestPayable),
      totalInterestPayable: formatIndianCurrency(totalInterestPayable),
      totalAmountPayable: formatIndianCurrency(totalAmountPayable),
    });
  };

  const handleSliderChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleTenureToggle = (unit) => {
    setTenureUnit(unit);
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
    if (!formData.InterestRate) {
      setInterestError("Please provide interest rate")
      return
    }
    navigation.navigate('RepaymentSchedule', { formData });
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.StartDate;
    setShowDatePicker(false)
    setFormData({ ...formData, StartDate: currentDate });
  };
  const [sliderLayout, setSliderLayout] = useState('default');

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>EMI Calculator</Text>
          <TouchableOpacity
            onPress={toggleExpand}
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              padding: 3,
              backgroundColor: "#0d549a",
            }}>
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
                      style={
                        isExpanded ? styles.ExpandeddownArrow : styles.downArrow
                      }
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
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
                styles.emiLinkwrapper,
              ]}>
              <Text style={styles.link}>Repayment Schedule</Text>
              <TouchableOpacity style={styles.viewButton} onPress={openModal}>
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formContainer}>
            <InputSlider
              label="Loan Amount"
              value={formData.LoanAmount}
              min={20000}
              max={30000000}
              step={10000}
              onValueChange={(value) => handleSliderChange("LoanAmount", value)}
              isCurrency={true}
            />
            <InputSlider
              label="Rate of Interest (ROI)"
              value={formData.InterestRate}
              min={0}
              max={50}
              step={1}
              onValueChange={(value) => {
                setInterestError(null);
                handleSliderChange("InterestRate", value);
              }}
              suffix="%"
              isROI={true}
            />
            {interesetError && (
              <Text style={styles.errorText}>{interesetError}</Text>
            )}
            <LoanTenureSlider
              label="Loan Tenure"
              value={
                tenureUnit === "Yr" ? formData.TenureYears : formData.Tenure
              }
              onValueChange={(value) =>
                handleSliderChange(
                  tenureUnit === "Yr" ? "TenureYears" : "Tenure",
                  value
                )
              }
              toggle={tenureUnit}
              onToggle={handleTenureToggle}
              sliderLabels={tenureUnit === "Yr" ? ["1", "30"] : ["1", "360"]}
              labelValues={
                tenureUnit === "Yr"
                  ? Array.from({ length: 30 }, (_, i) => i + 1)
                  : Array.from({ length: 360 }, (_, i) => i + 1)
              }
              layout={sliderLayout}
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
                {formData.StartDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.StartDate}
                mode="date"
                display="calendar"
                onChange={onDateChange}
              />
            )}
            <ProceedButton
              onPress={handleDone}
              text="DONE"
              disabled={!formData.StartDate}
            />
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

const calculateEMI = (principal, rate, tenure) => {
  if (rate === 0) {
    // If interest rate is 0, EMI is simply the principal divided by the tenure
    return principal / tenure;
  } else {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    return emi;
  }
};

const styles = applyFontFamily({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#00194c",
    marginBottom: 10,
  },
  ExpandeddownArrow: {
    color: "#ff8500",
  },
  downArrow: {
    color: "#ffffff",
  },
  emiDetailsCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  emiLabel: {
    fontSize: 16,
    color: "#ffffff",
  },
  emiAmount: {
    fontSize: 24,
    fontWeight: "500",
    color: "#ffffff",
    marginRight: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 4,
  },
  emiDetail: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "left",
    marginBottom: 4,
    width: "32%",
  },
  link: {
    color: "#00194c",
    textAlign: "left",
  },
  emiLinkwrapper: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    paddingTop: 10,
  },
  formContainer: {
    marginBottom: 15,
  },
  TotalPaybleLabel: {
    fontSize: 12,
    color: "#00194C",
    textAlign: "center",
  },
  TotalPaybleValue: {
    fontSize: 14,
    color: "#00194C",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#00194c",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#00194c",
    marginBottom: 20,
  },
  dateText: {
    color: "#00194C",
    fontSize: 14,
    padding: 10,
    borderColor: "#B3B9E1",
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    color: "#00194C",
    fontSize: 14,
    marginBottom: 5,
  },
  datePicker: {
    width: "100%",
    marginBottom: 20,
  },
  viewButton: {
    backgroundColor: "#00194c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: 120,
  },
  viewBtnText: {
    color: "#fff",
    fontSize: 14,
    textAlign: 'center'
  },
});

export default EMICalculator;
