import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../components/Layout';
import applyFontFamily from '../../assets/style/applyFontFamily';

const PreDisbursalChargesScreen = () => {
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
          <View style={styles.table} >
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.chargeTypeHeader]}>Charge Type</Text>
            <Text style={[styles.tableHeaderText, styles.amountHeader]}>Amount (₹)</Text>
            <Text style={[styles.tableHeaderText, styles.paymentTypeHeader]}>Payment Type</Text>
            <Text style={[styles.tableHeaderText, styles.statusHeader, styles.noBorderRight]}>Payment Status</Text>
          </View>
          {charges.map((charge, index) => (
            <View key={index}>
              <TouchableOpacity
                style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
                onPress={() => charge.expandable && toggleExpand(index)}>
                <View style={[styles.cell, styles.chargeTypeCell]}>
                  <Text style={styles.cellText}>{charge.type}</Text>
                  {charge.expandable && (
                    <MaterialIcons
                      name={expandedItems[index] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                      size={20}
                      color={expandedItems[index] ? "#ff8500" : "#00194c"}
                    />
                  )}
                </View>
                <Text style={[styles.cell, styles.amountCell]}>{charge.amount}</Text>
                <Text style={[styles.cell, styles.paymentTypeCell]}>{charge.paymentType}</Text>
                <Text style={[
                  styles.cell,
                  styles.statusCell,
                  styles.noBorderRight,
                  charge.status === "Paid" ? styles.paidStatus : styles.notApplicableStatus,
                ]}>
                  {charge.status}
                </Text>
              </TouchableOpacity>
              {expandedItems[index] && charge.expandable && (
                <View style={styles.expandedContent}>
                  {charge.details.map((detail, detailIndex) => (
                    <View key={detailIndex} style={styles.detailRow}>
                      <Text style={[styles.detailCell, styles.detailType]}>{detail.type}</Text>
                      <Text style={[styles.detailCell, styles.detailAmount]}>{detail.amount}</Text>
                      <Text style={[styles.detailCell, styles.detailPaymentType]}></Text>
                      <Text style={[styles.detailCell, styles.detailStatus, styles.noBorderRight]}></Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          </View>
          <View style={styles.note}>
            <Text style={styles.noteText}>
              <Text style={styles.noteHighlight}>Note: </Text>
              Above Pre-disbursal charges are included/excluded from the loan amount
            </Text>
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
    padding: 16,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  table:{ 
    backgroundColor: '#fff',
    borderRightWidth:1,
    borderLeftWidth:1,
    borderColor: '#e0e0e0',
    bordeRadius: 10,
  },
  headerTitle: {
    color: '#00194c',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#00194c',
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#ffffff50',
    textAlign:'center'
  },
  chargeTypeHeader: {
    flex: 1.5,
  },
  amountHeader: {
    flex: 1,
  },
  paymentTypeHeader: {
    flex: 1.5,
  },
  statusHeader: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f7f9ff',
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    justifyContent: 'center',
    fontSize:12,
    color:'#00194c'
  },
  chargeTypeCell: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountCell: {
    flex: 1,
    textAlign:'right'
  },
  paymentTypeCell: {
    flex: 1.5,
  },
  statusCell: {
    flex: 1,
  },
  cellText: {
    color: '#00194c',
    fontSize: 12,
    widdth:'80%'
  },
  noBorderRight: {
    borderRightWidth: 0,
  },
  paidStatus: {
    color: 'green',
  },
  notApplicableStatus: {
    color: '#888',
  },
  expandedContent: {
    backgroundColor: '#f7f9ff',
  },
  detailRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  detailCell: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#00194c',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  detailType: {
    flex: 1.5,
  },
  detailAmount: {
    flex: 1,
    textAlign:'right'
  },
  detailPaymentType: {
    flex: 1.5,
  },
  detailStatus: {
    flex: 1,
  },
  note: {
    padding: 16,
  },
  noteText: {
    color: '#00194c',
    fontSize: 12,
  },
  noteHighlight: {
    color: '#ff8500',
    fontWeight: '500',
  },
});

export default PreDisbursalChargesScreen;