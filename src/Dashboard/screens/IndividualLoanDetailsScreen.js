import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../assets/style/globalStyle';
import TabsComponent from '../components/TabsComponent';
import { useTab } from '../components/TabContext';
import Layout from '../components/Layout';

const LoanDetailsScreen = ({ navigation, route }) => {
  const { state, dispatch } = useTab();
  const { isOverdue, loanStatus: routeLoanStatus, loanId } = route.params || {};
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Set the active tab to "Loan Details" when the component mounts
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'Loan Details' });

    if (routeLoanStatus) {
      dispatch({ type: 'SET_LOAN_STATUS', payload: routeLoanStatus });
      setIsClosed(routeLoanStatus === 'Closed');
    }
  }, [routeLoanStatus, dispatch]);

  useEffect(() => {
    if (state.activeTab === 'Transaction Details') {
      navigation.navigate('TransactionDetails', { loanId, isClosed });
    } else if (state.activeTab === 'Loan Documents') {
      navigation.navigate('LoanDocuments', { loanId, isClosed });
    }
  }, [state.activeTab, navigation, loanId, isClosed]);

  const activeRedirectItems = [
    { key: '1', label: 'Loan Overview', target: 'LoanOverview' },
    { key: '2', label: 'Pre-Disbursement Charges', target: 'PreDisbursalCharges' },
    { key: '3', label: 'Re-payment Info', target: 'Charges', isOverdue },
    { key: '4', label: 'Repayment Schedule (RPS)', target: 'LoanRPS' },
  ];

  const closedRedirectItems = [
    { key: '1', label: 'Loan Overview', target: 'ClosedLoanOverview' },
    { key: '2', label: 'Pre-Disbursement Charges', target: 'ClosedPreDisbursalCharges' },
    { key: '3', label: 'Repayment Schedule (RPS)', target: 'ClosedLoanRPS' },
  ];

  const redirectItems = isClosed ? closedRedirectItems : activeRedirectItems;

  return (
    <Layout>
      <View style={styles.container}>
        <TabsComponent />
        <ScrollView>
          <View style={styles.content}>
            {redirectItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.redirectItem}
                onPress={() => {
                  if (item.target) {
                    navigation.navigate(item.target, { 
                      loanId,
                      isOverdue: item.isOverdue,
                      isClosed
                    });
                  }
                }}
              >
                <Text style={[
                  styles.redirectItemText,
                  item.isOverdue && { color: 'red' }
                ]}>
                  {item.label}
                </Text>
                <View style={styles.CircleRight}>
                  <MaterialIcons 
                    name={item.target.includes('Letter') ? "file-download" : "navigate-next"} 
                    size={15} 
                    color="#ff8500" 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};

export default LoanDetailsScreen;