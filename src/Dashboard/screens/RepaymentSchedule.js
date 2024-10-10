import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, FlatList, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Layout from '../components/Layout';
import applyFontFamily from '../../assets/style/applyFontFamily';
import { GetRepaymentSchedule } from '../services/API/RepaymentSchedule';
import { STATUS } from '../../Common/Utils/Constant';

const RepaymentSchedule = ({ navigation, route }) => {
  const { formData } = route.params;
  const [startDate, setStartDate] = useState(formData.StartDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedYear, setExpandedYear] = useState(null);
  const [chart, setChart] = useState([])
  useEffect(() => {

    // Convert to UTC format

    const year = startDate.getUTCFullYear();
    const month = String(startDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(startDate.getUTCDate()).padStart(2, '0');

    let requestModel = { ...formData, StartDate: `${year}-${month}-${day}` }
    GetRepaymentSchedule(requestModel).then((response) => {

      console.log(response)
      if (response.status == STATUS.ERROR) {
        return
      }
      console.log(response.data.ScheduleByYear)
      setChart(response.data.ScheduleByYear)
    })
  }, [startDate])
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const toggleExpandYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };




  const renderItem = ({ item, index }) => {
    const isExpanded = expandedYear === item.Year;
    const rowBackgroundColor = index % 2 === 0 ? '#FFFFFF' : '#EFF4FF';

    return (
      <View>
        <TouchableOpacity onPress={() => toggleExpandYear(item.Year)}>
          <View style={[styles.row, { backgroundColor: rowBackgroundColor }]}>
            <View style={[styles.cell, styles.yearCell]}>
              <Text style={styles.cellText}>{item.Year}</Text>
              <MaterialIcons
                name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color="#00194c"
              />
            </View>
            <Text style={styles.cell}>{item.TotalTotalPayment.toFixed(2)}</Text>
            <Text style={styles.cell}>{item.TotalPrincipalPayment.toFixed(2)}</Text>
            <Text style={styles.cell}>{item.TotalInterestPayment.toFixed(2)}</Text>
            <Text style={[styles.cell, styles.noBorderRight]}>{item.RemainingBalanceAtEnd.toFixed(2)}</Text>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View>
            {item.Months.map((detail, detailIndex) => (
              <View key={detailIndex} style={[styles.detailRow, { backgroundColor: detailIndex % 2 === 0 ? '#FFFFFF' : '#F7F9FF' }]}>
                <Text style={styles.detailCell}>{detail.PaymentDate}</Text>
                <Text style={styles.detailCell}>{detail.TotalPayment.toFixed(2)}</Text>
                <Text style={styles.detailCell}>{detail.PrincipalPayment.toFixed(2)}</Text>
                <Text style={styles.detailCell}>{detail.InterestPayment.toFixed(2)}</Text>
                <Text style={[styles.detailCell, styles.noBorderRight]}>{detail.RemainingBalance.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Sample data for the repayment schedule
  const repaymentData = [
    {
      Year: "2024",
      TotalTotalPayment: "2,35,417",
      principal: "1,47,327",
      interest: "88,090",
      balance: "12,37,673",
      details: [
        { date: "05/05/2024", emi: "29,427", principal: "17,885", interest: "11,542", balance: "13,67,115" },
        { date: "05/06/2024", emi: "29,427", principal: "18,035", interest: "11,393", balance: "13,49,080" },
        { date: "05/07/2024", emi: "29,427", principal: "18,185", interest: "11,242", balance: "13,30,895" },
        { date: "05/08/2024", emi: "29,427", principal: "18,336", interest: "11,091", balance: "13,12,559" },
        { date: "05/09/2024", emi: "29,427", principal: "18,489", interest: "10,938", balance: "12,94,070" },
        { date: "05/10/2024", emi: "29,427", principal: "18,643", interest: "10,784", balance: "12,75,426" },
        { date: "05/11/2024", emi: "29,427", principal: "18,799", interest: "10,629", balance: "12,56,628" },
        { date: "05/12/2024", emi: "29,427", principal: "10,472", interest: "10,472", balance: "12,37,673" },
        // More monthly details...
      ],
    },
    {
      Year: "2025",
      TotalTotalPayment: "3,53,126",
      principal: "2,40,168",
      interest: "1,12,957",
      balance: "9,97,504",
      details: [
        { date: "05/05/2023", emi: "29,427", principal: "17,885", interest: "11,542", balance: "13,67,115" },
        { date: "05/06/2023", emi: "29,427", principal: "18,035", interest: "11,393", balance: "13,49,080" },
        // More monthly details...
      ],
    },
    {
      Year: "2026",
      TotalTotalPayment: "3,53,126",
      principal: "2,65,317",
      interest: "87,809",
      balance: "7,32,187",
      details: [
        { date: "05/05/2023", emi: "29,427", principal: "17,885", interest: "11,542", balance: "13,67,115" },
        { date: "05/06/2023", emi: "29,427", principal: "18,035", interest: "11,393", balance: "13,49,080" },
        // More monthly details...
      ],
    },
    {
      Year: "2027",
      TotalTotalPayment: "3,53,126",
      principal: "2,93,099",
      interest: "60,026",
      balance: "4,39,087",
      details: [
        { date: "05/05/2023", emi: "29,427", principal: "17,885", interest: "11,542", balance: "13,67,115" },
        { date: "05/06/2023", emi: "29,427", principal: "18,035", interest: "11,393", balance: "13,49,080" },
        // More monthly details...
      ],
    },
    {
      Year: "2028",
      TotalTotalPayment: "3,53,126",
      principal: "3,23,791",
      interest: "29,335",
      balance: "1,15,297",
      details: [
        { date: "05/05/2023", emi: "29,427", principal: "17,885", interest: "11,542", balance: "13,67,115" },
        { date: "05/06/2023", emi: "29,427", principal: "18,035", interest: "11,393", balance: "13,49,080" },
        // More monthly details...
      ],
    },
    {
      Year: "2029",
      TotalTotalPayment: "1,17,709",
      principal: "1,15,297",
      interest: "2,412",
      balance: "0",
      details: [

      ],
    }
  ];

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.RepaymentScheduleheader}>
          <Text style={styles.RepaymentScheduleheaderTitle}>
            Repayment Schedule
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Feather
              name="download"
              size={24}
              color="#ff8500"
              style={{ marginRight: 10 }}
            />
            <Ionicons name="share-social" size={24} color="#00194c" />
          </View>
        </View>
        <ScrollView style={{ marginBottom: 10 }}>
          <View style={styles.content}>
            <Text style={styles.RepaymentSchedulesubtitle}>
              Enter a start date to know your loan repayment schedule
            </Text>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={startDate.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Year</Text>
              <Text style={styles.tableHeaderText}>EMI{"\n"}(A+B)</Text>
              <Text style={styles.tableHeaderText}>Principal{"\n"}(A)</Text>
              <Text style={styles.tableHeaderText}>Interest{"\n"}(B)</Text>
              <Text style={[styles.tableHeaderText, styles.noBorder]}>
                Balance
              </Text>
            </View>
            <FlatList
              data={chart}
              renderItem={renderItem}
              keyExtractor={(item) => item.Year}
            />
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = applyFontFamily({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cellText: {
    fontWeight: '400',
  },
  RepaymentScheduleheader: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  RepaymentScheduleheaderTitle: {
    color: '#00194c',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 16,
  },
  RepaymentSchedulesubtitle: {
    fontSize: 14,
    color: '#00194c',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#00194c',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00194c',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#00194c',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#00194c',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 14,
    width: '20%',
    textAlign: 'center',
    fontWeight: '500',
    borderRightWidth: 1,
    borderRightColor: '#B3B9E1',
    paddingVertical: 10,
  },
  noBorder: {
    borderRightWidth: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yearCell: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#B3B9E1',
    paddingVertical: 10,
  },
  cell: {
    fontSize: 14,
    color: '#00194c',
    width: '20%',
    textAlign: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#B3B9E1',
    paddingVertical: 10,
  },
  noBorderRight: {
    borderRightWidth: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCell: {
    fontSize: 12,
    color: '#00194c',
    width: '20%',
    textAlign: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#B3B9E1',
    paddingVertical: 5,
  },
});

export default RepaymentSchedule;