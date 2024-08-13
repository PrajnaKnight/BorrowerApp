import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Accordion from '../components/ControlPanel/accordion';
import Layout from '../components/Layout';
import applyFontFamily from '../../assets/style/applyFontFamily';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/topBar';

const FAQScreen = () => {
  const navigation = useNavigation();
  const faqData = [
    { title: "How much money do I need?",    
      content: "When you apply for a personal loan, you can choose which repayment plan works best for your income level and cash flow. Lenders will sometimes provide a discount for using autopay, lowering your APR by 0.25% or 0.50%."
    },
    { title: "Do I want to have the money sent to my bank account?", 
      content: "When you apply for a personal loan, you can choose which repayment plan works best for your income level and cash flow. Lenders will sometimes provide a discount for using autopay, lowering your APR by 0.25% or 0.50%."
    },
    { title: "How long will I have to pay it back?",
        content: "When you apply for a personal loan, you can choose which repayment plan works best for your income level and cash flow. Lenders will sometimes provide a discount for using autopay, lowering your APR by 0.25% or 0.50%."
     },
    { title: "How much interest will I pay?", 
      content: "When you apply for a personal loan, you can choose which repayment plan works best for your income level and cash flow. Lenders will sometimes provide a discount for using autopay, lowering your APR by 0.25% or 0.50%."
    },
    { 
      title: "Can I afford the monthly payments?", 
      content: "When you apply for a personal loan, you can choose which repayment plan works best for your income level and cash flow. Lenders will sometimes provide a discount for using autopay, lowering your APR by 0.25% or 0.50%."
    },
    { title: "Does the personal loan have fees?", 
      content: "When you apply for a personal loan, you can choose which repayment plan works best for your income level and cash flow. Lenders will sometimes provide a discount for using autopay, lowering your APR by 0.25% or 0.50%." },
    { title: "What other options do I have?", 
      content: "When you apply for a personal loan, you can choose which repayment plan works best for your income level and cash flow. Lenders will sometimes provide a discount for using autopay, lowering your APR by 0.25% or 0.50%." },
  ];

  return (
    <View style={{flex:1}}>
      <Header isOnFAQScreen={true} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>FAQs</Text>
            </View>
            <Accordion items={faqData} initialOpenIndex={4} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = applyFontFamily({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00246E',
  },
});

export default FAQScreen;