// PreDisbursalChargesScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles } from '../../assets/style/globalStyle';
import TabsComponent from '../components/TabsComponent';
import { useTab } from '../components/TabContext';
import Layout from '../components/Layout';

const ClosedPreDisbursalChargesScreen = ({ navigation }) => {
  const { activeTab, setActiveTab } = useTab();

  const tableData = [
    {
      charge: 'Processing Fee',
      amount: '10000.00',
      totalGst: '1800.00',
      total: '11800.00',
      status: 'Paid',
      statusColor: 'green',
    },
    {
      charge: 'Insurance Amount',
      amount: '10000.00',
      totalGst: '0.00',
      total: '10000.00',
      status: 'Paid',
      statusColor: 'green',
    },
    {
      charge: 'Stamp Duty',
      amount: '200.00',
      totalGst: '0.00',
      total: '200.00',
      status: 'Paid',
      statusColor: 'green',
    },
    {
      charge: 'Document Charge',
      amount: '0.00',
      totalGst: '0.00',
      total: '0.00',
      status: '-',
      statusColor: 'black',
    },
    {
      charge: 'Broken Period Interest',
      amount: '0.00',
      totalGst: '0.00',
      total: '0.00',
      status: '-',
      statusColor: 'black',
    },
  ];

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Pre-Disbursal Charges</Text>
          <View style={styles.pdctable}>
            <View style={styles.pdctableHeader}>
              <Text style={styles.pdctableHeaderText}>Charge</Text>
              <Text style={styles.pdctableHeaderText}>Amount</Text>
              <Text style={styles.pdctableHeaderText}>Total GST</Text>
              <Text style={styles.pdctableHeaderText}>Total</Text>
              <Text style={styles.pdctableHeaderText}>Status</Text>
            </View>
            {tableData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.pdctableRow,
                  { backgroundColor: index % 2 === 0 ? '#D2DEF7' : '#ffffff' },
                ]}
              >
                <Text style={[styles.pdctableCell, styles.textLeft]}>{item.charge}</Text>
                <Text style={styles.pdctableCell}>{item.amount}</Text>
                <Text style={styles.pdctableCell}>{item.totalGst}</Text>
                <Text style={styles.pdctableCell}>{item.total}</Text>
                <Text style={[styles.pdctableCell, { color: item.statusColor }]}>
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default ClosedPreDisbursalChargesScreen;