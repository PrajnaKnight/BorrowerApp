import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomCheckBox from '../components/CustomCheckBox'; 
import Layout from '../components/Layout';
import { styles as globalStyles } from '../../assets/style/globalStyle';

const RepaymentScreen = ({ navigation, route }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [customAmountValue, setCustomAmountValue] = useState('');
  const [isCustomAmountFocused, setIsCustomAmountFocused] = useState(false);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handleCustomAmountChange = (text) => {
    const cleanedText = text.replace(/₹\s?/, '');
    setCustomAmountValue(`₹ ${cleanedText}`);
  };

  const { isOverdue } = route.params || {};

  return (
    <Layout>
      <SafeAreaView style={globalStyles.safeArea}>
        <KeyboardAvoidingView
          style={globalStyles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}>
          <ScrollView
            style={globalStyles.scrollView}
            contentContainerStyle={globalStyles.scrollViewContent}>
            <View style={globalStyles.content}>
              <Text style={globalStyles.repaymentheader}>
                You have chosen to make the following Loan Payment
              </Text>
              <Text style={globalStyles.repaymentloanId}>Loan ID•••••5123</Text>

              {/* Current Outstanding */}
              <View style={globalStyles.repaymentsection}>
                <TouchableOpacity
                  onPress={() => handleSelectOption("currentOutstanding")}
                  style={globalStyles.spaceBetween}>
                  <View style={globalStyles.flexDirectionRow}>
                    <CustomCheckBox  style={globalStyles.checkboxRepaymentWrapper}
                      isChecked={selectedOption === "currentOutstanding"}
                      onPress={() => handleSelectOption("currentOutstanding")}
                      label="Current Outstanding"
                    />
                    {isOverdue && (
                      <Text style={globalStyles.overdueText}>Overdue</Text>
                    )}
                  </View>
                  <MaterialIcons
                    name={
                      selectedOption === "currentOutstanding"
                        ? "keyboard-arrow-up"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color="#00194c"
                  />
                </TouchableOpacity>
                <View style={globalStyles.paymentdetails}>
                  {selectedOption === "currentOutstanding" && (
                    <View style={globalStyles.repaymentsectionContent}>
                      <View style={globalStyles.repaymentdetailText}>
                        <Text style={globalStyles.repaymentTextdetail}>
                          Principal
                        </Text>
                        <Text style={globalStyles.repaymentTextdetail}>
                          ₹ 12,224
                        </Text>
                      </View>
                      <View style={globalStyles.repaymentdetailText}>
                        <Text style={globalStyles.repaymentTextdetail}>
                          Interest
                        </Text>
                        <Text style={globalStyles.repaymentTextdetail}>
                          ₹ 10,000
                        </Text>
                      </View>
                      {isOverdue && (
                        <>
                          <View style={globalStyles.repaymentdetailText}>
                            <Text style={globalStyles.repaymentTextdetail}>
                              Overdue Period(DPD)
                            </Text>
                            <Text style={globalStyles.repaymentTextdetail}>
                              2 Days
                            </Text>
                          </View>
                          <View style={globalStyles.repaymentdetailText}>
                            <Text style={globalStyles.repaymentTextdetail}>
                              Overdue Charges @ 2%
                            </Text>
                            <Text style={globalStyles.repaymentTextdetail}>
                              ₹ 244.48
                            </Text>
                          </View>
                          <View style={globalStyles.repaymentdetailText}>
                            <Text style={globalStyles.repaymentTextdetail}>
                              Bounce Charges
                            </Text>
                            <Text style={globalStyles.repaymentTextdetail}>
                              ₹ 531
                            </Text>
                          </View>
                          <View style={globalStyles.repaymentdetailText}>
                            <Text style={globalStyles.repaymentTextdetail}>
                              Late Payment Charges
                            </Text>
                            <Text style={globalStyles.repaymentTextdetail}>
                              ₹ 444.44
                            </Text>
                          </View>
                          <View style={globalStyles.repaymentdetailText}>
                            <Text style={globalStyles.repaymentTextdetail}>
                              GST (18%)
                            </Text>
                            <Text style={globalStyles.repaymentTextdetail}>
                              ₹ 95.58
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  )}
                  <TextInput
                    style={globalStyles.repaymentamountInput}
                    value="₹ 23,826.02"
                    editable={false}
                  />
                </View>
              </View>

              {/* Total Outstanding */}
              <View style={globalStyles.repaymentsection}>
                <TouchableOpacity
                  onPress={() => handleSelectOption("totalOutstanding")}
                  style={globalStyles.spaceBetween}>
                  <CustomCheckBox
                    isChecked={selectedOption === "totalOutstanding"}
                    onPress={() => handleSelectOption("totalOutstanding")}
                    label="Total Outstanding"
                  />
                  <MaterialIcons
                    name={
                      selectedOption === "totalOutstanding"
                        ? "keyboard-arrow-up"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color="#00194c"
                  />
                </TouchableOpacity>
                <View style={globalStyles.paymentdetails}>
                  {selectedOption === "totalOutstanding" && (
                    <View style={globalStyles.repaymentsectionContent}>
                      <View style={globalStyles.repaymentdetailText}>
                        <Text style={globalStyles.repaymentTextdetail}>
                          Principal
                        </Text>
                        <Text style={globalStyles.repaymentTextdetail}>
                          ₹ 10,00,000
                        </Text>
                      </View>
                      <View style={globalStyles.repaymentdetailText}>
                        <Text style={globalStyles.repaymentTextdetail}>
                          Interest
                        </Text>
                        <Text style={globalStyles.repaymentTextdetail}>
                          ₹ 10,000
                        </Text>
                      </View>
                    </View>
                  )}
                  <TextInput
                    style={globalStyles.repaymentamountInput}
                    value="₹ 10,10,000"
                    editable={false}
                  />
                </View>
              </View>

              {/* Custom Amount */}
              <View style={globalStyles.repaymentsection}>
                <TouchableOpacity
                  onPress={() => handleSelectOption("customAmount")}
                  style={globalStyles.spaceBetween}>
                  <CustomCheckBox
                    isChecked={selectedOption === "customAmount"}
                    onPress={() => handleSelectOption("customAmount")}
                    label="Custom Amount"
                  />
                </TouchableOpacity>
                <View style={globalStyles.paymentdetails}>
                  <TextInput
                    style={[
                      globalStyles.repaymentcustomamountInput,
                      isCustomAmountFocused &&
                        globalStyles.repaymentcustomamountInputFocused,
                    ]}
                    placeholder="₹ Enter Custom Amount"
                    value={customAmountValue}
                    onChangeText={handleCustomAmountChange}
                    onFocus={() => setIsCustomAmountFocused(true)}
                    onBlur={() => setIsCustomAmountFocused(false)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Pay Button */}
          <View style={globalStyles.RepaymentApplybuttonWrapper}>
            <TouchableOpacity
              style={globalStyles.RepaymentapplyNowButton}
              onPress={() => navigation.navigate("Payment")}>
              <Text style={globalStyles.RepaymentapplyNowButtonText}>PAY</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Layout>
  );
};

export default RepaymentScreen;