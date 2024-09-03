// LoanOverviewScreen.js
import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../../assets/style/globalStyle';
import TabsComponent from '../components/TabsComponent';
import { useTab } from '../components/TabContext';
import Layout from '../components/Layout';

const LoanOverviewScreen = ({ navigation }) => {
  const loanDetails = [
    { key: '1', label: 'Loan Type', value: 'Personal Loan' },
    { key: '2', label: 'Borrower Name', value: 'Satat Mishra' },
    { key: '3', label: 'Co-Borrower Name', value: 'NA' },
    { key: '4', label: 'Guarantor Name', value: 'NA' },
    { key: '5', label: 'Loan ID/Account', value: '24235352' },
    { key: '6', label: 'Sanctioned Loan Amount', value: '₹ 10,00,000 /-' },
    { key: '7', label: 'Disbursed Amount', value: '₹ 10,00,000 /-' },
    { key: '8', label: 'Total Outstanding', value: '₹ 9,50,000 /-' },
    { key: '9', label: 'Tenure [Loan Term]', value: '7 Years 5 Months' },
    { key: '10', label: 'Balance Tenure [Months]', value: '60 Months' },
    { key: '11', label: 'Amount Overdue', value: '0.0' },
    { key: '12', label: 'EMI Paid', value: '02 of 60' },
    { key: '13', label: 'Due on', value: '05' },
    { key: '14', label: 'Rate of Interest', value: '12%' },
    { key: '15', label: 'Interest Rate Type', value: 'Floating Rate' },
    { key: '16', label: 'Loan Purpose', value: 'Marriage' },
    { key: '17', label: 'Disbursal Date', value: '5th Sept 2022' },
    { key: '18', label: 'First Disbursal Date', value: '5th Sept 2022' },
    { key: '19', label: 'Last Disbursal Date', value: '5th Sept 2022' },
    { key: '20', label: 'Loan Maturity Date', value: '5th Sept 2022' },
    { key: '21', label: 'Installment Frequency', value: 'Monthly' },
    { key: '22', label: 'Re-Payment Mode', value: 'Auto Debit' },
    { key: '23', label: 'Re-Payment Acc No.', value: '33168181311' },
    { key: '24', label: 'Collateral', value: 'No' },
    { key: '25', label: 'Insurance', value: 'No' },
  ];

  const { activeTab, setActiveTab } = useTab();

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Loan Overview</Text>
          <View style={styles.table}>
            {loanDetails.map((detail) => (
              <View
                key={detail.key}
                style={[styles.row, detail.key % 2 !== 1 && styles.oddRow]}>
                <Text style={[styles.cell,styles.loanOverviewTableLabel]}>{detail.label}</Text>
                <Text style={[styles.cell,styles.loanOverviewTableValue]}>{detail.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default LoanOverviewScreen;
