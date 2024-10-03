import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../components/Layout';
import applyFontFamily from '../../assets/style/applyFontFamily';

const PreDisbursementChargesScreen = () => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({...prev, [index]: !prev[index]}));
  };

  const charges = [
    {
      type: 'Processing Fee',
      amount: '11800.00',
      paymentType: 'Deduct from disbursal',
      status: 'Paid',
      expandable: true,
      details: [
        { type: 'Amount', amount: '10000.00' },
        { type: 'GST', amount: '1800.00' },
        { type: 'Total', amount: '11800.00' },
        { type: 'Waiver', amount: '00.00' },
      ]
    },
    {
      type: 'Insurance Amount',
      amount: '10000.00',
      paymentType: 'Add to Disbursal',
      status: 'Paid',
      expandable: true,
      details: [
        { type: 'Amount', amount: '10000.00' },
        { type: 'GST', amount: '00.00' },
        { type: 'Total', amount: '10000.00' },
        { type: 'Waiver', amount: '00.00' },
      ]
    },
    {
      type: 'Stamp Duty',
      amount: '200.00',
      paymentType: 'Advance Payment',
      status: 'Paid',
      expandable: true,
      details: [
        { type: 'Amount', amount: '200.00' },
        { type: 'GST', amount: '00.00' },
        { type: 'Total', amount: '200.00' },
        { type: 'Waiver', amount: '00.00' },
      ]
    },
    {
      type: 'Document Charge',
      amount: '00.00',
      paymentType: 'Deduct from disbursal',
      status: 'Not applicable',
      expandable: true,
      details: [
        { type: 'Amount', amount: '00.00' },
        { type: 'GST', amount: '00.00' },
        { type: 'Total', amount: '00.00' },
        { type: 'Waiver', amount: '00.00' },
      ]
    },
    {
      type: 'Broken Period Interest',
      amount: '00.00',
      paymentType: 'Deduct from disbursal',
      status: 'Not applicable',
      expandable: true,
      details: [
        { type: 'Amount', amount: '00.00' },
        { type: 'GST', amount: '00.00' },
        { type: 'Total', amount: '00.00' },
        { type: 'Waiver', amount: '00.00' },
      ]
    },
  ];

 
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pre Disbursement Charges</Text>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Charge{"\n"}Type</Text>
            <Text style={styles.tableHeaderText}>Amount{"\n"}(₹)</Text>
            <Text style={styles.tableHeaderText}>Payment{"\n"}Type</Text>
            <Text style={[styles.tableHeaderText, styles.noBorderRight]}>
              Payment{"\n"}Statuss
            </Text>
          </View>
          {charges.map((charge, index) => (
            <View key={index}>
              <TouchableOpacity
                style={[
                  styles.row,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
                onPress={() => charge.expandable && toggleExpand(index)}>
                <View style={styles.cell}>
                  <Text
                    style={styles.cellText}>
                    {charge.type}
                  </Text>
                  {charge.expandable && (
                    <MaterialIcons
                      name={
                        expandedItems[index]
                          ? "keyboard-arrow-up"
                          : "keyboard-arrow-down"
                      }
                      size={24}
                      color={expandedItems[index] ? "#ff8500" : "#00194c"}
                    />
                  )}
                </View>
                <Text style={[styles.cell, styles.amountText]}>
                  {charge.amount}
                </Text>
                <Text style={styles.cell}>{charge.paymentType}</Text>
                <Text
                  style={[
                    styles.cell,
                    styles.textCenter,
                    styles.noBorderRight,
                    charge.status === "Paid" ? styles.paidStatus : {},
                  ]}>
                  {charge.status}
                </Text>
              </TouchableOpacity>
              {expandedItems[index] && charge.expandable && (
                <View style={styles.expandedContent}>
                  {charge.details.map((detail, detailIndex) => (
                    <View key={detailIndex} style={styles.detailRow}>
                      <Text style={styles.detailType}>{detail.type}</Text>
                      <Text style={styles.detailAmount}>{detail.amount}</Text>
                      <Text style={styles.emptyCell}></Text>
                      <Text style={styles.emptyCell}></Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          <Text style={styles.note}>
            Note: Above Pre-disbursal charges are included/excluded from the
            loan amount
          </Text>
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = applyFontFamily({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  header: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00194c',
  },
  headerTitle: {
    color: '#00194c',
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#00194c',
    paddingVertical: 10,
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#ffffff50',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  evenRow: {
    backgroundColor: '#f7f9ff',
  },
  oddRow: {
    backgroundColor: '#f7f9ff',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  cellText: {
    color: '#00194c',
    fontSize: 14,
    flex: 1, 
  },
  amountText: {
    textAlign: 'right',
  },
  noBorderRight: {
    borderRightWidth: 0,
  },
  paidStatus: {
    color: 'green',
  },
  note: {
    marginTop: 10,
    marginBottom: 20,
    color: '#ff8500',
    fontSize: 12,
  },
  expandedContent: {
    backgroundColor: '#fcfdff',
    paddingVertical: 5,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailType: {
    color: '#00194c',
    fontSize: 12,
    flex: 1,
  },
  detailAmount: {
    color: '#00194c',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  emptyCell: {
    flex: 1,
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default PreDisbursementChargesScreen;