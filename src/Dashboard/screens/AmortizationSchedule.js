import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';

const AmortizationSchedule = ({ navigation }) => {
  // Sample data for the amortization schedule
  const amortizationData = Array.from({ length: 30 }, (_, index) => ({
    year: (index + 1).toString(),
    emi: "22,224",
    principal: "2,456",
    interest: "1,000",
    balance: "100,000",
  }));

  const renderItem = ({ item, index }) => {
    const rowBackgroundColor = index % 2 === 0 ? '#EFF4FF' : '#FFFFFF';

    return (
      <View style={[styles.row, { backgroundColor: rowBackgroundColor }]}>
        <Text style={[styles.AmortizationSchedulecell, styles.firstCell]}>{item.year}</Text>
        <Text style={styles.AmortizationSchedulecell}>{item.emi}</Text>
        <Text style={styles.AmortizationSchedulecell}>{item.principal}</Text>
        <Text style={styles.AmortizationSchedulecell}>{item.interest}</Text>
        <Text style={[styles.AmortizationSchedulecell, styles.lastCell]}>{item.balance}</Text>
      </View>
    );
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.AmortizationScheduleheader}>
          <Text style={styles.AmortizationScheduleheaderTitle}>Amortization Schedule</Text>
          <View style={{ flexDirection: 'row' }}>
            <Feather name="download" size={24} color="#ff8500" style={{ marginRight: 10 }}  />
            <Ionicons name="share-social" size={24} color="#00194c" />
          </View>
        </View>
        <View style={styles.content }>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText]}>Year</Text>
            <Text style={styles.tableHeaderText}>EMI {'\n'} (A+B)</Text>
            <Text style={styles.tableHeaderText}>Principal  {'\n'} (A)</Text>
            <Text style={styles.tableHeaderText}>Interest  {'\n'} (B)</Text>
            <Text style={[styles.tableHeaderText, styles.noborderRight]}>Balance</Text>
          </View>
          <FlatList
            data={amortizationData}
            renderItem={renderItem}
            keyExtractor={(item) => item.year}
            style={{marginBottom:100}}
          />
        </View>
      </View>
    </Layout>
  );
};


export default AmortizationSchedule;
