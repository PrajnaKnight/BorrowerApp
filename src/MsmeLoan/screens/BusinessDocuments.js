import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Switch,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Layout from '../../Common/components/Layout';
import ButtonComponent from '../../Common/components/ControlPanel/button';
import { useProgressBar } from '../../Common/components/ControlPanel/progressContext';
import { GoBack } from '../../PersonalLoan/services/Utils/ViewValidator';
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../assets/style/msmeStyle';
import ProgressBar from '../../Common/components/ControlPanel/progressBar';
import UploadController from '../../Common/components/ControlPanel/UploadController';
import CustomDropdown from '../../Common/components/ControlPanel/dropdownPicker';
import FileUpload from '../../Common/components/ControlPanel/FileUpload';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 40) / 3;

const BusinessDocumentsScreen = () => {
  const navigation = useNavigation();
  const { setProgress } = useProgressBar();
  const scrollViewRef = useRef(null);

  // General state
  const [selectedDocType, setSelectedDocType] = useState('Financial Docs');
  const [selectedIDType, setSelectedIDType] = useState('Bank Statement');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [gstUserName, setgstUserName] = useState('');

  // Financial Docs state
  const [bankStatementEnabled, setBankStatementEnabled] = useState(true);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [itrEnabled, setItrEnabled] = useState(false);

  // Bank Statement state
  const [showBankStatementUploadDetails, setShowBankStatementUploadDetails] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [bankStatements, setBankStatements] = useState([]);

  // GST state
  const [showGSTUploadDetails, setShowGSTUploadDetails] = useState(false);
  const [useGSTManualUpload, setUseGSTManualUpload] = useState(false);
  const [gstNumber, setGstNumber] = useState('');
  const [gstOtp, setGstOtp] = useState('');
  const [gstDetails, setGstDetails] = useState(null);

  // ITR state
  const [showITRUploadDetails, setShowITRUploadDetails] = useState(false);
  const [useITRManualUpload, setUseITRManualUpload] = useState(false);
  const [panNumber, setPanNumber] = useState('');
  const [itrPassword, setItrPassword] = useState('');
  const [itrDetails, setItrDetails] = useState(null);

  // Update Bank Statement state
  const [bankAccounts, setBankAccounts] = useState([
    { label: 'SBI - 1234567890', value: 'sbi_1234567890' },
    { label: 'HDFC - 9876543210', value: 'hdfc_9876543210' },
    { label: 'ICICI - 1357924680', value: 'icici_1357924680' },
    { label: 'Axis - 2468013579', value: 'axis_2468013579' },
  ]);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);

  const handleBankAccountSelect = (value) => {
    console.log('Selected bank account:', value); // Add this for debugging
    setSelectedBankAccount(value);
  };

//UPdate GSTIN statement state

const [GSTIN, setGSTIN] = useState([
  {label:'27AAHCK6791L1ZS', value:'27AAHCK6791L1ZS'},
  {label:'27AAHCK6791L1ZB', value:'27AAHCK6791L1ZB'},
  {label:'27AAHCK6791L1ZC', value:'27AAHCK6791L1ZC'},
]);

const [selectedGSTIN, setselectedGSTIN] = useState(null);

 const handleGSTINSelect =(value) =>{
  setselectedGSTIN(value);
 }

 //update return form statement state
 const [returnForm, setreturnForm] = useState([
   { label: "GSTR3B", value: "GSTR3B" },
   { label: "GSTR3C", value: "GSTR3C" },
   { label: "GSTR3D", value: "GSTR3D" },
 ]);

 const [selectedReturnForm, setselectedReturnForm] = useState(null);

 const handleReturnFormSelect = (value) => {
   setselectedReturnForm(value);
 }

 //Update frequency statement state
 const [frequency, setfrequency] = useState([
   { label: "Monthly", value: "Monthly" },
   { label: "Quarterly", value: "Quarterly" },
   { label: "Semi-Annually", value: "Semi-Annually" },
   { label: "Annually", value: "Annually" },
 ]);

 const [selectedFrequency, setselectedFrequency] = useState(null);

 const handleFrequencySelect = (value) => {
   setselectedFrequency(value);
 }

 //Update financial year statement state
 const [financialYear, setfinancialYear] = useState([ 
   { label: "2023-2024", value: "2023-2024" },
   { label: "2022-2023", value: "2022-2023" },
   { label: "2021-2022", value: "2021-2022" },
 ]);

 const [selectedFinancialYear, setselectedFinancialYear] = useState(null);

 const handleFinancialYearSelect = (value) => { 
   setselectedFinancialYear(value);
 }
   

  useEffect(() => {
    setProgress(0.6);
  }, []);

  const documentTypes = ['ID Proof', 'Address Proof', 'Financial Docs'];
  const financialDocTypes = [
    { label: 'Bank Statement', icon: 'bank' },
    { label: 'GST', icon: 'file-text-o' },
    { label: 'ITR', icon: 'file-text-o' },
  ];
  
  useEffect(() => {
    // Update button disabled state based on conditions
    setIsButtonDisabled(!bankStatements.length && !gstDetails && !itrDetails);
  }, [bankStatements, gstDetails, itrDetails]);

  const handleIDTypeSelect = (index) => {
    setSelectedIDType(financialDocTypes[index].label);
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * cardWidth, animated: true });
  };

  const renderBankStatementUpload = () => {
    return (
      <View style={financialDocsStyles.uploadOptionsContainer}>
        {!showBankStatementUploadDetails ? (
          <>
             <TouchableOpacity
            style={financialDocsStyles.uploadOption}
            onPress={() => setShowBankStatementUploadDetails(true)}>
            <View style={financialDocsStyles.uploadOptionTextContainer}>
              <Icon name="upload" size={20} color="#00194c" />
              <View style={financialDocsStyles.uploadOptionTextWrapper}>
                <Text style={financialDocsStyles.uploadOptionText}>
                  Upload Bank Statements
                </Text>
                <Icon name="angle-right" size={20} color="#ff8500" />
              </View>
            </View>
            <Text style={financialDocsStyles.uploadOptionSubtext}>
              Upload last 6 months Bank Statements
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={financialDocsStyles.uploadOption}>
            <View style={financialDocsStyles.uploadOptionTextContainer}>
              <Icon name="bank" size={20} color="#00194c" />
              <View style={financialDocsStyles.uploadOptionTextWrapper}>
                <Text style={financialDocsStyles.uploadOptionText}>
                  Net Banking
                </Text>
                <Icon name="angle-right" size={20} color="#ff8500" />
                <Text style={financialDocsStyles.comingSoonText}>
                  Coming Soon
                </Text>
              </View>
            </View>
            <Text style={financialDocsStyles.uploadOptionSubtext}>
              We'll securely access only your account information
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={financialDocsStyles.uploadOption}>
            <View style={financialDocsStyles.uploadOptionTextContainer}>
              <Icon name="list" size={20} color="#00194c" />
              <View style={financialDocsStyles.uploadOptionTextWrapper}>
                <Text style={financialDocsStyles.uploadOptionText}>
                  Account Aggregator
                </Text>
                <Icon name="angle-right" size={20} color="#ff8500" />
                <Text style={financialDocsStyles.comingSoonText}>
                  Coming Soon
                </Text>
              </View>
            </View>
            <Text style={financialDocsStyles.uploadOptionSubtext}>
              We'll securely access your account information via OTP
            </Text>
          </TouchableOpacity>
          </>
        ) : (
          renderBankingDetails()
        )}
        {bankStatements.length > 0 && (
          <View style={financialDocsStyles.submittedStatementsContainer}>
            <Text style={financialDocsStyles.sectionTitle}>Uploaded Bank Statements</Text>
            {bankStatements.map((statement, index) => (
              <View key={index} style={financialDocsStyles.submittedStatement}>
                <Text> {selectedBankAccount.label}</Text>
                <Text>{statement.fromDate.toLocaleDateString()} - {statement.toDate.toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const DatePicker = ({ label, date, onDateChange }) => {
    const [show, setShow] = useState(false);
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      onDateChange(currentDate);
    };
  
    const showDatepicker = () => {
      setShow(true);
    };
  
    const handleSendOTP = () => {};
    return (
      <View style={styles.datePickerContainer}>
        <Text style={styles.dateLabel}>{label}</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
          <Icon name="calendar" size={15} color="#ff8500" />
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    );
  };

  const renderBankingDetails = () => {
    return (
      <View>
        <Text style={financialDocsStyles.sectionTitle}>Banking Details</Text>
        <View style={financialDocsStyles.dropdownContainer}>
        <CustomDropdown
            value={selectedBankAccount}
            setValue={handleBankAccountSelect}
            items={bankAccounts}
            setItems={setBankAccounts}
            placeholder="Select Banking Details"
            zIndex={9000}
            label="Select Bank Account"
          />
        </View>
        <View style={financialDocsStyles.dateContainer}>
          <DatePicker
            label="From Date"
            date={fromDate}
            onDateChange={(date) => setFromDate(date)}
          />
          <DatePicker
            label="To Date"
            date={toDate}
            onDateChange={(date) => setToDate(date)}
          />
        </View>
        {showFromDatePicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFromDatePicker(false);
              if (selectedDate) setFromDate(selectedDate);
            }}
          />
        )}
        {showToDatePicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowToDatePicker(false);
              if (selectedDate) setToDate(selectedDate);
            }}
          />
        )}
        <UploadController
          title="File Upload OR Take Photo"
          required={true}
          passwordProtected={false}
          inputEnabled={false}
        />
        <ButtonComponent
          title="Add Bank Statement"
          onPress={handleAddBank}
          disabled={!bankName || !accountNumber}
        />
      </View>
    );
  };

  const handleAddBank = () => {
    if (selectedBankAccount) {
      const newBankStatement = {
        setSelectedBankAccount,
        fromDate,
        toDate,
      };
      setBankStatements([...bankStatements, newBankStatement]);
      setSelectedBankAccount(null);
      setFromDate(new Date());
      setToDate(new Date());
      setShowBankStatementUploadDetails(false);
      setGstEnabled(true);
      setIsButtonDisabled(false);
    }
  };

  const renderGSTUpload = () => {
    return (
      <View style={financialDocsStyles.uploadOptionsContainer}>
        {!showGSTUploadDetails ? (
          <>
            <TouchableOpacity
              style={financialDocsStyles.uploadOption}
              onPress={() => {
                setShowGSTUploadDetails(true);
                setUseGSTManualUpload(false);
              }}>
              <View style={financialDocsStyles.uploadOptionTextContainer}>
                <Icon name="file-o" size={20} color="#00194c" />
                <View style={financialDocsStyles.uploadOptionTextWrapper}>
                  <Text style={financialDocsStyles.uploadOptionText}>
                    Submit GST Returns via OTP
                  </Text>
                  <Icon name="angle-right" size={20} color="#ff8500" />
                  <Text style={financialDocsStyles.comingSoonText}>
                    Recommended
                  </Text>
                </View>
              </View>
              <Text style={financialDocsStyles.uploadOptionSubtext}>
                We'll securely access only your GST information
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={financialDocsStyles.uploadOption}
              onPress={() => {
                setShowGSTUploadDetails(true);
                setUseGSTManualUpload(true);
              }}>
              <View style={financialDocsStyles.uploadOptionTextContainer}>
                <Icon name="file-text-o" size={20} color="#00194c" />
                <View style={financialDocsStyles.uploadOptionTextWrapper}>
                  <Text style={financialDocsStyles.uploadOptionText}>
                    Upload GST Manual
                  </Text>
                  <Icon name="angle-right" size={20} color="#ff8500" />
                </View>
              </View>
              <Text style={financialDocsStyles.uploadOptionSubtext}>
                Upload GST filing return as per frequency
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          renderGSTUploadDetails()
        )}
        {gstDetails && (
          <View style={financialDocsStyles.submittedGSTContainer}>
            <Text style={financialDocsStyles.sectionTitle}>
              Uploaded GST Details
            </Text>
            <Text>{gstDetails.gstNumber}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderGSTUploadDetails = () => {
    if (useGSTManualUpload) {
      return (
        <View>
          <View>
            <CustomDropdown
              value={selectedGSTIN}
              setValue={handleGSTINSelect}
              items={GSTIN}
              setItems={setGSTIN}
              placeholder="Select GSTIN Number"
              zIndex={9000}
              label="GSTIN Number"
            />
          </View>
          <View>
            <CustomDropdown
              value={selectedReturnForm}
              setValue={handleReturnFormSelect}
              items={returnForm}
              setItems={setreturnForm}
              placeholder="Select Return Form"
              zIndex={9000}
              label="Return Form"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-betweeb",
            }}>
            <View style={{ flex: 1, marginRight: 3 }}>
              <CustomDropdown
                value={selectedFrequency}
                setValue={handleFrequencySelect}
                items={frequency}
                setItems={setfrequency}
                placeholder="Frequency"
                zIndex={9000}
                label="Frequency"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 3 }}>
              <CustomDropdown
                value={selectedFinancialYear}
                setValue={handleFinancialYearSelect}
                items={financialYear}
                setItems={setfinancialYear}
                placeholder="Financial Year"
                zIndex={9000}
                label="Financial Year"
              />
            </View>
          </View>
          <View>
            <FileUpload />
          </View>
          <TouchableOpacity onPress={() => setUseGSTManualUpload(false)}>
            <Text style={financialDocsStyles.switchText}>
              Switch to GST OTP Authentication
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <CustomDropdown
            value={selectedGSTIN}
            setValue={handleGSTINSelect}
            items={GSTIN}
            setItems={setGSTIN}
            placeholder="Select GSTIN Number"
            zIndex={9000}
            label="GSTIN Number"
          />
          <Text style={styles.label}>User Name</Text>
          <TextInput
            style={financialDocsStyles.input}
            placeholder="Enter User Name"
            value={gstUserName}
            onChangeText={setgstUserName}
          />
          <Text style={styles.label}>OTP</Text>
          <Text style={financialDocsStyles.infoText}>
            Please enter the OTP sent to your mobile number +91.....1077
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={financialDocsStyles.otpButton}>
              <Text style={financialDocsStyles.otpBtnText}>Send OTP</Text>
            </TouchableOpacity>
            <TextInput
              style={[financialDocsStyles.input, { flex: 1 }]}
              placeholder="Enter OTP"
              value={gstOtp}
              onChangeText={setGstOtp}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity>
              <Text style={financialDocsStyles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
            <Text style={financialDocsStyles.timer}>2:00</Text>
          </View>
          <ButtonComponent
            title="Submit"
            onPress={handleGSTSubmit}
            disabled={!gstNumber || !gstOtp}
          />
          <TouchableOpacity onPress={() => setUseGSTManualUpload(true)}>
            <Text style={financialDocsStyles.switchText}>
              Switch to Manual Upload
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const handleGSTSubmit = () => {
    setGstDetails({ gstNumber });
    setShowGSTUploadDetails(false);
    setItrEnabled(true);
    setIsButtonDisabled(false);
  };

  const renderITRUpload = () => {
    return (
      <View style={financialDocsStyles.uploadOptionsContainer}>
        {!showITRUploadDetails ? (
          <>
            <TouchableOpacity
              style={financialDocsStyles.uploadOption}
              onPress={() => {
                setShowITRUploadDetails(true);
                setUseITRManualUpload(false);
              }}>
              <Text style={financialDocsStyles.uploadOptionText}>Submit ITR via Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={financialDocsStyles.uploadOption}
              onPress={() => {
                setShowITRUploadDetails(true);
                setUseITRManualUpload(true);
              }}>
              <Text style={financialDocsStyles.uploadOptionText}>Upload ITR Manually</Text>
            </TouchableOpacity>
          </>
        ) : (
          renderITRUploadDetails()
        )}
        {itrDetails && (
          <View style={financialDocsStyles.submittedITRContainer}>
            <Text style={financialDocsStyles.sectionTitle}>Uploaded ITR Details</Text>
            <Text>{itrDetails.panNumber}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderITRUploadDetails = () => {
    if (useITRManualUpload) {
      return (
        <View>
          <UploadController
            title="ITR"
            required={true}
            passwordProtected={false}
            inputEnabled={true}
            inputPlaceholder="Enter PAN Number"
          />
          <TouchableOpacity onPress={() => setUseITRManualUpload(false)}>
            <Text style={financialDocsStyles.switchText}>Switch to Submit via Password</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <TextInput
            style={financialDocsStyles.input}
            placeholder="Enter PAN Number"
            value={panNumber}
            onChangeText={setPanNumber}
          />
          <TextInput
            style={financialDocsStyles.input}
            placeholder="Enter Password"
            value={itrPassword}
            onChangeText={setItrPassword}
            secureTextEntry
          />
          <ButtonComponent
            title="Submit"
            onPress={handleITRSubmit}
            disabled={!panNumber || !itrPassword}
          />
          <TouchableOpacity onPress={() => setUseITRManualUpload(true)}>
            <Text style={financialDocsStyles.switchText}>Switch to Manual Upload</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const handleITRSubmit = () => {
    setItrDetails({ panNumber });
    setShowITRUploadDetails(false);
    setIsButtonDisabled(false);
  };

  // const renderFinancialDocsContent = () => {
  //   if (selectedDocType === 'Financial Docs') {
  //     if (selectedIDType === 'Bank Statement' && bankStatementEnabled) {
  //       return renderBankStatementUpload();
  //     } else if (selectedIDType === 'GST' && gstEnabled) {
  //       return renderGSTUpload();
  //     } else if (selectedIDType === 'ITR' && itrEnabled) {
  //       return renderITRUpload();
  //     }
  //   }
  //   return null;
  // };

  const renderFinancialDocsContent = () => {
    if (selectedDocType === 'Financial Docs') {
      if (selectedIDType === 'Bank Statement' && bankStatementEnabled) {
        return renderBankStatementUpload();
      } else if (selectedIDType === 'GST') {
        return renderGSTUpload();
      } else if (selectedIDType === 'ITR') {
        return renderITRUpload();
      }
    }
    return null;
  };

  const handleProceed = () => {
    navigation.navigate("BusinessLoanEligibility");
  };

  return (
    <Layout>
      <View
        style={{ backgroundColor: "#ffffff", padding: 16, paddingBottom: 0 }}>
        <ProgressBar progress={0.6} />
        <View style={styles.TOpTitleContainer}>
          <Text style={styles.TitleText}>Business Documents</Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.PDtabContainer}>
            {documentTypes.map((docType) => (
              <TouchableOpacity
                key={docType}
                style={[
                  styles.PDtab,
                  selectedDocType === docType && styles.PDselectedTab,
                ]}
                onPress={() => setSelectedDocType(docType)}>
                <Text
                  style={[
                    styles.PDtabText,
                    selectedDocType === docType && styles.PDselectedTabText,
                  ]}>
                  {docType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Select Document Type</Text>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={cardWidth}
            snapToAlignment="start"
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / cardWidth
              );
              setActiveIndex(index);
              setSelectedIDType(financialDocTypes[index].label);
            }}>
            {financialDocTypes.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.carouselItem,
                  activeIndex === index && styles.activeCarouselItem,
                ]}
                onPress={() => handleIDTypeSelect(index)}>
                <Icon
                  name={item.icon}
                  size={24}
                  color={activeIndex === index ? "#FFFFFF" : "#00194c"}
                />
                <Text
                  style={[
                    styles.carouselItemText,
                    activeIndex === index && styles.activeCarouselItemText,
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.paginationContainer}>
            {financialDocTypes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeIndex === index && styles.activePaginationDot,
                ]}
              />
            ))}
          </View>
        </View>

        {renderFinancialDocsContent()}
      </ScrollView>

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

const financialDocsStyles = StyleSheet.create({
  uploadOptionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  uploadOptionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadOptionTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadOption: {
    backgroundColor: '#F5F7FF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  uploadOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00194c',
    marginLeft: 12,
    flex: 1,
  },
  uploadOptionSubtext: {
    fontSize: 10,
    color: '#6E7EAA',
    marginLeft: 32,
    marginTop: 4,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#FF6B00',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  bankStatementUpload: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8DFF2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#D8DFF2',
    borderRadius: 5,
    padding: 10,
    width: '48%',
  },
  submittedStatementsContainer: {
    marginTop: 20,
  },
  submittedStatement: {
    backgroundColor: '#F5F7FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00194c',
    marginBottom: 12,
  },
  switchText: {
    color: '#758BFD',
    textAlign: 'center',
    marginTop: 12,
  },
  resendText:{
    color:'#758BFD',
    fontSize:10,
    marginBottom:10
  },
  timer:{
    color:'#F38F00',
    fontSize:10,
    marginLeft:5,
    marginBottom:10
  },
  submittedGSTContainer: {
    marginTop: 20,
  },
  submittedITRContainer: {
    marginTop: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  otpButton:{
    backgroundColor:'#00194c',
    marginRight:10, 
    marginBottom:10,
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
    color:'#B2C2EE'
  },
  otpBtnText:{
    color:'#ffffff',
    textTransform:'uppercase'
  },
  infoText:{
    fontSize:10,
    lineHeight:10,
    marginBottom:5,
    color:'#00194c'
  },
});

export default BusinessDocumentsScreen;