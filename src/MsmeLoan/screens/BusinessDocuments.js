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
  ActivityIndicator,
  Alert,
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
import applyFontFamily from '../../assets/style/applyFontFamily';
import { colors } from 'react-native-swiper-flatlist/src/themes';

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
  const [isLoading, setIsLoading] = useState(false);

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
  const [otpTimer, setOtpTimer] = useState(120);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // ITR state
  const [showITRUploadDetails, setShowITRUploadDetails] = useState(false);
  const [useITRManualUpload, setUseITRManualUpload] = useState(false);
  const [panNumber, setPanNumber] = useState('');
  const [itrPassword, setItrPassword] = useState('');
  const [itrDetails, setItrDetails] = useState(null);
  const [additr, setAddItr] = useState(false);

  // ID Proof state
  const [idProofType, setIdProofType] = useState('');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [idProofFile, setIdProofFile] = useState(null);

  // Address Proof state
  const [addressProofType, setAddressProofType] = useState('');
  const [addressProofNumber, setAddressProofNumber] = useState('');
  const [addressProofFile, setAddressProofFile] = useState(null);
  const [showOTPSuccessModal, setShowOTPSuccessModal] = useState(false);
  const [itrPasswordProtected, setItrPasswordProtected] = useState(false);
  const [gstFiles, setGstFiles] = useState([]);

  // Update Bank Statement state
  const [bankAccounts, setBankAccounts] = useState([
    { label: 'SBI - 1234567890', value: 'sbi_1234567890' },
    { label: 'HDFC - 9876543210', value: 'hdfc_9876543210' },
    { label: 'ICICI - 1357924680', value: 'icici_1357924680' },
    { label: 'Axis - 2468013579', value: 'axis_2468013579' },
  ]);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);

  const handleBankAccountSelect = (value) => {
    console.log('Selected bank account:', value);
    setSelectedBankAccount(value);
  };

  // Update GSTIN statement state
  const [GSTIN, setGSTIN] = useState([
    {label:'27AAHCK6791L1ZS', value:'27AAHCK6791L1ZS'},
    {label:'27AAHCK6791L1ZB', value:'27AAHCK6791L1ZB'},
    {label:'27AAHCK6791L1ZC', value:'27AAHCK6791L1ZC'},
  ]);

  const [selectedGSTIN, setselectedGSTIN] = useState(null);

  const handleGSTINSelect = (value) => {
    setselectedGSTIN(value);
  }

  // Update return form statement state
  const [returnForm, setreturnForm] = useState([
    { label: "GSTR3B", value: "GSTR3B" },
    { label: "GSTR3C", value: "GSTR3C" },
    { label: "GSTR3D", value: "GSTR3D" },
  ]);

  const [selectedReturnForm, setselectedReturnForm] = useState(null);

  const handleReturnFormSelect = (value) => {
    setselectedReturnForm(value);
  }

  // Update frequency statement state
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

  // Update financial year statement state
  const [financialYear, setfinancialYear] = useState([ 
    { label: "2023-2024", value: "2023-2024" },
    { label: "2022-2023", value: "2022-2023" },
    { label: "2021-2022", value: "2021-2022" },
  ]);

  const [selectedFinancialYear, setselectedFinancialYear] = useState(null);

  const handleFinancialYearSelect = (value) => { 
    setselectedFinancialYear(value);
  }
   
  // Update ITR type statement state
  const [itrType, setitrType] = useState([
    { label: "ITR Type 1", value: "ITR-Type-1" },
    { label: "ITR Type 2", value: "ITR-Type-2" },
    { label: "ITR Type 3", value: "ITR-Type-3" },
  ]);
 
  const [selectedITRType, setselectedITRType] = useState(null);
 
  const handleITRTypeSelect = (value) => {
    setselectedITRType(value);
  }

  // Update ITR Financial Year statement state
  const [ItrfinancialYear, setitrfinancialYear] = useState([ 
    { label: "2023-2024", value: "2023-2024" },
    { label: "2022-2023", value: "2022-2023" },
    { label: "2021-2022", value: "2021-2022" },
  ]);  

  const [selectedItrFinancialYear, setselectedItrFinancialYear] = useState(null);

  const handleItrFinancialYearSelect = (value) => { 
    setselectedItrFinancialYear(value);
  }

  useEffect(() => {
    setProgress(0.6);
  }, []);

  useEffect(() => {
    let interval;
    if (isOtpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsOtpSent(false);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, otpTimer]);

  const documentTypes = ['ID Proof', 'Address Proof', 'Financial Docs'];
  const financialDocTypes = [
    { label: 'Bank Statement', icon: 'bank' },
    { label: 'GST', icon: 'file-text-o' },
    { label: 'ITR', icon: 'file-text-o' },
  ];
  
  useEffect(() => {
    // Update button disabled state based on conditions
    setIsButtonDisabled(!bankStatements.length && !gstDetails && !itrDetails && !idProofFile && !addressProofFile);
  }, [bankStatements, gstDetails, itrDetails, idProofFile, addressProofFile]);

  const handleIDTypeSelect = (index) => {
    setSelectedIDType(financialDocTypes[index].label);
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * cardWidth, animated: true });
  };

  const handleDeleteGSTFile = (index) => {
    const updatedFiles = [...gstFiles];
    updatedFiles.splice(index, 1);
    setGstFiles(updatedFiles);
  };

  const handleAddGSTFile = (file) => {
    setGstFiles([...gstFiles, file]);
  };

  const handleAddAnotherGSTIN = () => {
    // Implement the logic to add another GSTIN
    // This might involve clearing the current GST form and allowing the user to enter new details
    setSelectedGSTIN(null);
    setSelectedReturnForm(null);
    setSelectedFrequency(null);
    setSelectedFinancialYear(null);
    setGstFiles([]);
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
                <Text style={{color:'#00194c'}}>{statement.bankName}</Text>
                <Text style={{color:'#00194c'}}>{statement.fromDate.toLocaleDateString()} - {statement.toDate.toLocaleDateString()}</Text>
                <TouchableOpacity onPress={() => handleRemoveBankStatement(index)}>
                  <Text style={financialDocsStyles.removeText}>Remove</Text>
                </TouchableOpacity>
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
            label="Select Bank Account"/>
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
            <UploadController
              title="File Upload OR Take Photo"
              required={true}
              passwordProtected={false}
              inputEnabled={false}
              onFileSelect={(file) => console.log("File selected:", file)}
            />
            <ButtonComponent
              title="Add Bank Statement"
              onPress={handleAddBank}
              disabled={!selectedBankAccount || !fromDate || !toDate}
            />
          </View>
        );
      };
    
      const handleAddBank = () => {
        if (selectedBankAccount) {
          const newBankStatement = {
            bankName: selectedBankAccount,
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
    
      const handleRemoveBankStatement = (index) => {
        const updatedStatements = [...bankStatements];
        updatedStatements.splice(index, 1);
        setBankStatements(updatedStatements);
        if (updatedStatements.length === 0) {
          setIsButtonDisabled(true);
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
                <TouchableOpacity onPress={() => setGstDetails(null)}>
                  <Text style={financialDocsStyles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      };
    
      const renderGSTUploadDetails = () => {
        if (useGSTManualUpload) {
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
              <CustomDropdown
                value={selectedReturnForm}
                setValue={handleReturnFormSelect}
                items={returnForm}
                setItems={setreturnForm}
                placeholder="Select Return Form"
                zIndex={8000}
                label="Return Form"
              />
              <View style={financialDocsStyles.rowContainer}>
                <View style={financialDocsStyles.halfWidth}>
                  <CustomDropdown
                    value={selectedFrequency}
                    setValue={handleFrequencySelect}
                    items={frequency}
                    setItems={setfrequency}
                    placeholder="Frequency"
                    zIndex={7000}
                    label="Frequency"
                  />
                </View>
                <View style={financialDocsStyles.halfWidth}>
                  <CustomDropdown
                    value={selectedFinancialYear}
                    setValue={handleFinancialYearSelect}
                    items={financialYear}
                    setItems={setfinancialYear}
                    placeholder="Financial Year"
                    zIndex={7000}
                    label="Financial Year"
                  />
                </View>
              </View>
              <View>
                {gstFiles.map((file, index) => (
                  <View key={index} style={financialDocsStyles.fileItem}>
                    <Text>{file.name}</Text>
                    <TouchableOpacity onPress={() => handleDeleteGSTFile(index)}>
                      <Text style={financialDocsStyles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <FileUpload onFileSelect={handleAddGSTFile} />
              </View>
              <ButtonComponent
                title="Add Another GSTIN"
                onPress={handleAddAnotherGSTIN}
              />
              <TouchableOpacity onPress={() => setUseGSTManualUpload(false)}>
                <Text style={financialDocsStyles.switchText}>Switch to GST OTP Authentication</Text>
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
              <View style={financialDocsStyles.rowContainer}>
                <TouchableOpacity 
                  style={financialDocsStyles.otpButton}
                  onPress={handleSendOTP}
                  disabled={isOtpSent}
                >
                  <Text style={financialDocsStyles.otpBtnText}>
                    {isOtpSent ? 'OTP Sent' : 'Send OTP'}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={[financialDocsStyles.input, financialDocsStyles.otpInput]}
                  placeholder="Enter OTP"
                  value={gstOtp}
                  onChangeText={setGstOtp}
                  keyboardType="numeric"
                />
              </View>
              <ButtonComponent
                title="Submit"
                onPress={handleGSTSubmit}
                disabled={!selectedGSTIN || !gstUserName || !gstOtp}
              />
              <TouchableOpacity onPress={() => setUseGSTManualUpload(true)}>
                <Text style={financialDocsStyles.switchText}>Switch to Manual Upload</Text>
              </TouchableOpacity>
            </View>
          );
        }
      };
      
    
      const handleSendOTP = () => {
        // Simulate OTP sending
        setIsOtpSent(true);
        setOtpTimer(120);
        // Here you would typically make an API call to send the OTP
        Alert.alert("OTP Sent", "An OTP has been sent to your registered mobile number.");
      };
    
      const handleResendOTP = () => {
        if (!isOtpSent) {
          handleSendOTP();
        }
      };
    
      const handleGSTSubmit = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          setGstDetails({ gstNumber: selectedGSTIN });
          setShowGSTUploadDetails(false);
          setItrEnabled(true);
          setIsButtonDisabled(false);
          setIsLoading(false);
          setShowOTPSuccessModal(true);
        }, 2000);
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
                  <View style={financialDocsStyles.uploadOptionTextContainer}>
                    <Icon name="file-text-o" size={20} color="#00194c" />
                    <View style={financialDocsStyles.uploadOptionTextWrapper}>
                      <Text style={financialDocsStyles.uploadOptionText}>
                        Submit ITR via Password
                      </Text>
                      <Icon name="angle-right" size={20} color="#ff8500" />
                      <Text style={financialDocsStyles.comingSoonText}>
                        Recommended
                      </Text>
                    </View>
                  </View>
                  <Text style={financialDocsStyles.uploadOptionSubtext}>
                    We'll securely access only your ITR information
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={financialDocsStyles.uploadOption}
                  onPress={() => {
                    setShowITRUploadDetails(true);
                    setUseITRManualUpload(true);
                  }}>
                  <View style={financialDocsStyles.uploadOptionTextContainer}>
                    <Icon name="file-text-o" size={20} color="#00194c" />
                    <View style={financialDocsStyles.uploadOptionTextWrapper}>
                      <Text style={financialDocsStyles.uploadOptionText}>
                        Upload ITR Details
                      </Text>
                      <Icon name="angle-right" size={20} color="#ff8500" />
                    </View>
                  </View>
                  <Text style={financialDocsStyles.uploadOptionSubtext}>
                    Upload ITR
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              renderITRUploadDetails()
            )}
            {itrDetails && (
              <View style={financialDocsStyles.submittedITRContainer}>
                <Text style={financialDocsStyles.sectionTitle}>Uploaded ITR Details</Text>
                <Text>{itrDetails.panNumber}</Text>
                <TouchableOpacity onPress={() => setItrDetails(null)}>
                  <Text style={financialDocsStyles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      };
    
      const renderITRUploadDetails = () => {
        if (useITRManualUpload) {
          return (
            <View>
              <View style={financialDocsStyles.rowContainer}>
                <View style={financialDocsStyles.halfWidth}>
                  <CustomDropdown
                    value={selectedITRType}
                    setValue={handleITRTypeSelect}
                    items={itrType}
                    setItems={setitrType}
                    placeholder="ITR Type"
                    zIndex={9000}
                    label="ITR Type"
                  />
                </View>
                <View style={financialDocsStyles.halfWidth}>
                  <CustomDropdown
                    value={selectedItrFinancialYear}
                    setValue={handleItrFinancialYearSelect}
                    items={ItrfinancialYear}
                    setItems={setitrfinancialYear}
                    placeholder="Financial Year"
                    zIndex={9000}
                    label="Financial Year"
                  />
                </View>
              </View>
              <FileUpload
                onFileSelect={(file) => console.log("ITR file selected:", file)}
              />
              <View style={financialDocsStyles.switchContainer}>
                <Text>Password Protection</Text>
                <Switch
                  value={itrPasswordProtected}
                  onValueChange={setItrPasswordProtected}
                />
              </View>
              {itrPasswordProtected && (
                <TextInput
                  style={financialDocsStyles.input}
                  placeholder="Enter Password"
                  value={itrPassword}
                  onChangeText={setItrPassword}
                  secureTextEntry
                />
              )}
              <ButtonComponent
                title="Add ITR"
                onPress={handleAddITR}
                disabled={!selectedITRType || !selectedItrFinancialYear}
              />
              <TouchableOpacity onPress={() => setUseITRManualUpload(false)}>
                <Text style={financialDocsStyles.switchText}>
                  Switch to ITR Authentication
                </Text>
              </TouchableOpacity>
              <Text style={financialDocsStyles.noteText}>
                Note: Upload ITR so as to avail more funds
              </Text>
            </View>
          );
        } else {
          return (
            <View>
              <Text style={styles.label}>PAN Number</Text>
              <TextInput
                style={financialDocsStyles.input}
                placeholder="Enter PAN Number"
                value={panNumber}
                onChangeText={setPanNumber}
              />
              <Text style={styles.label}>Password</Text>
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
    
      const handleAddITR = () => {
        setItrDetails({
          itrType: selectedITRType,
          financialYear: selectedItrFinancialYear,
        });
        setShowITRUploadDetails(false);
        setIsButtonDisabled(false);
      };
    
      const handleITRSubmit = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          setItrDetails({ panNumber });
          setShowITRUploadDetails(false);
          setIsButtonDisabled(false);
          setIsLoading(false);
        }, 2000);
      };
    
      const renderIDProof = () => {
        return (
          <View style={financialDocsStyles.uploadOptionsContainer}>
            <Text style={financialDocsStyles.sectionTitle}>ID Proof</Text>
            <CustomDropdown
              value={idProofType}
              setValue={setIdProofType}
              items={[
                { label: "Aadhaar Card", value: "aadhaar" },
                { label: "PAN Card", value: "pan" },
                { label: "Voter ID", value: "voter" },
                { label: "Driving License", value: "driving_license" },
              ]}
              placeholder="Select ID Proof Type"
              zIndex={9000}
              label="ID Proof Type"
            />
            <TextInput
              style={financialDocsStyles.input}
              placeholder="Enter ID Number"
              value={idProofNumber}
              onChangeText={setIdProofNumber}
            />
            <FileUpload 
              onFileSelect={(file) => {
                console.log("ID Proof file selected:", file);
                setIdProofFile(file);
              }}
            />
            {idProofFile && (
              <View style={financialDocsStyles.uploadedFileContainer}>
                <Text style={financialDocsStyles.uploadedFileName}>{idProofFile.name}</Text>
                <TouchableOpacity onPress={() => setIdProofFile(null)}>
                  <Text style={financialDocsStyles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      };
    
      const renderAddressProof = () => {
        return (
          <View style={financialDocsStyles.uploadOptionsContainer}>
            <Text style={financialDocsStyles.sectionTitle}>Address Proof</Text>
            <CustomDropdown
              value={addressProofType}
              setValue={setAddressProofType}
              items={[
                { label: "Utility Bill", value: "utility_bill" },
                { label: "Rental Agreement", value: "rental_agreement" },
                { label: "Bank Statement", value: "bank_statement" },
                { label: "Passport", value: "passport" },
              ]}
              placeholder="Select Address Proof Type"
              zIndex={9000}
              label="Address Proof Type"
            />
            <TextInput
              style={financialDocsStyles.input}
              placeholder="Enter Document Number"
              value={addressProofNumber}
              onChangeText={setAddressProofNumber}
            />
            <FileUpload 
              onFileSelect={(file) => {
                console.log("Address Proof file selected:", file);
                setAddressProofFile(file);
              }}
            />
            {addressProofFile && (
              <View style={financialDocsStyles.uploadedFileContainer}>
                <Text style={financialDocsStyles.uploadedFileName}>{addressProofFile.name}</Text>
                <TouchableOpacity onPress={() => setAddressProofFile(null)}>
                  <Text style={financialDocsStyles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      };
    
      const renderFinancialDocsContent = () => {
        if (selectedDocType === 'Financial Docs') {
          if (selectedIDType === 'Bank Statement' && bankStatementEnabled) {
            return renderBankStatementUpload();
          } else if (selectedIDType === 'GST') {
            return renderGSTUpload();
          } else if (selectedIDType === 'ITR') {
            return renderITRUpload();
          }
        } else if (selectedDocType === 'ID Proof') {
          return renderIDProof();
        } else if (selectedDocType === 'Address Proof') {
          return renderAddressProof();
        }
        return null;
      };
    
      const handleProceed = () => {
        if (isButtonDisabled) {
          Alert.alert("Incomplete Information", "Please fill in all required fields before proceeding.");
          return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate("BusinessLoanEligibility");
        }, 2000);
      };
    
      return (
        <Layout>
          <View
            style={{
              backgroundColor: "#ffffff",
              padding: 16,
              paddingBottom: 0,
            }}>
            <ProgressBar progress={0.6} />
            <View style={styles.TOpTitleContainer}>
              <Text style={styles.TitleText}>Business Documents</Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
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
            {selectedDocType === "Financial Docs" && (
              <>
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
                            activeIndex === index &&
                              styles.activeCarouselItemText,
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
              </>
            )}

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

          {isLoading && (
            <View style={financialDocsStyles.loadingOverlay}>
              <ActivityIndicator size="large" color="#00194c" />
            </View>
          )}
          {showOTPSuccessModal && (
            <Modal
              visible={showOTPSuccessModal}
              transparent={true}
              animationType="fade">
              <View style={financialDocsStyles.modalContainer}>
                <View style={financialDocsStyles.modalContent}>
                  <Icon name="check-circle" size={50} color="green" />
                  <Text style={financialDocsStyles.modalTitle}>
                    OTP Verify Successfully
                  </Text>
                  <Text style={financialDocsStyles.modalSubtitle}>
                    Thank you for Authentication. Your GST filing returns are
                    been fetched. Kindly hold for 1 minute
                  </Text>
                  <ButtonComponent
                    title="OK"
                    onPress={() => setShowOTPSuccessModal(false)}
                  />
                </View>
              </View>
            </Modal>
          )}
        </Layout>
      );
    };
    
    const financialDocsStyles = applyFontFamily({
      uploadOptionsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
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
        fontSize: 14,
        fontWeight: '500',
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
      resendText: {
        color: '#758BFD',
        fontSize: 10,
        marginBottom: 10,
      },
      disabledText: {
        color: '#B2C2EE',
      },
      timer: {
        color: '#F38F00',
        fontSize: 10,
        marginLeft: 5,
        marginBottom: 10,
      },
      submittedGSTContainer: {
        marginTop: 20,
      },
      submittedITRContainer: {
        marginTop: 20,
      },
      otpButton: {
        backgroundColor: '#00194c',
        marginRight: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      otpBtnText: {
        color: '#ffffff',
        textTransform: 'uppercase',
      },
      infoText: {
        fontSize: 10,
        lineHeight: 10,
        marginBottom: 5,
        color: '#00194c',
      },
      rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      halfWidth: {
        width: '48%',
      },
      removeText: {
        color: '#FF6B00',
        fontSize: 12,
        marginTop: 5,
      },
      otpInput: {
        flex: 1,
      },
      uploadedFileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F7FF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      },
      uploadedFileName: {
        color: '#00194c',
        fontSize: 12,
      },
      loadingOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      noteText: {
        fontSize: 12,
        color: '#6E7EAA',
        marginTop: 10,
        fontStyle: 'italic',
      },
      fileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      deleteText: {
        color: 'red',
        fontSize: 14,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
      },
      modalSubtitle: {
        textAlign: 'center',
        marginBottom: 20,
      },
    });
    
    export default BusinessDocumentsScreen;