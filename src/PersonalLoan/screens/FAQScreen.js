import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import applyFontFamily from '../services/style/applyFontFamily';

const FAQScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedFaqId, setSelectedFaqId] = useState(null);

  const [faqs, setFaqs] = useState([
    { id: '1', question: 'How much money do I need?', answer: 'The smallest personal loans begin at around $500, but most lenders have a minimum of between $1,000 to $2,000. If you need less than $500, it might be easier to save up or borrow from a friend or family member.' },
    { id: '2', question: 'Do I want to have the money sent to my bank account?', answer: 'This depends on your preference and the lenders options. Direct deposit to your bank account is often the quickest and most convenient method.' },
    { id: '3', question: 'How long will I have to pay it back?', answer: 'Loan terms vary by lender and loan amount. Personal loans typically range from 1 to 5 years, but some can be as short as a few months or as long as 7 years.' },
    { id: '4', question: 'How much interest will I pay?', answer: 'Interest rates vary based on your credit score, income, and the lender. They can range from around 6% to 36% APR. Better credit scores usually qualify for lower rates.' },
    { id: '5', question: 'Can I afford the monthly payments?', answer: 'Its important to calculate the monthly payments and ensure they fit within your budget. Most lenders provide a loan calculator on their websites to help you estimate payments.' },
    { id: '6', question: 'Does the personal loan have fees?', answer: 'Some loans come with origination fees, late payment fees, or prepayment penalties. Always read the loan terms carefully to understand all potential fees.' },
    { id: '7', question: 'What other options do I have?', answer: 'Depending on your needs, you might consider credit cards, a line of credit, borrowing from friends or family, or exploring government assistance programs.' },
  ]);

  const [filteredFaqs, setFilteredFaqs] = useState(faqs);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filteredData = faqs.filter((faq) =>
        faq.question.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFaqs(filteredData);
    } else {
      setFilteredFaqs(faqs);
    }
  };

  const toggleFaq = (id) => {
    setSelectedFaqId(selectedFaqId === id ? null : id);
  };

  const renderFaqItem = ({ item }) => {
    const isOpen = selectedFaqId === item.id;
    return (
      <View style={styles.faqItem}>
        <TouchableOpacity onPress={() => toggleFaq(item.id)} style={styles.faqQuestion}>
          <Text style={[
            styles.questionText,
            isOpen && styles.questionTextExpanded
          ]}>
            {item.question}
          </Text>
          <Icon name={isOpen ? 'minus' : 'plus'} size={16} color="#FFA500" />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.faqAnswerContainer}>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FAQs</Text>
      </View>
      
      <TextInput
        style={styles.searchBar}
        placeholder="Search FAQs"
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredFaqs}
        keyExtractor={(item) => item.id}
        renderItem={renderFaqItem}
        contentContainerStyle={styles.faqList}
      />
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00194c',
  },
  searchBar: {
    marginVertical: 16,
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderTopWidth:1,
    borderTopColor:'#0039AD29'
  },
  questionText: {
    fontSize: 16,
    color: '#00194c',
    flex: 1,
    fontWeight:'bold'
  },
  questionTextExpanded: {
    color: '#ff8500',
    fontWeight:'bold'
  },
  faqAnswerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#00194c',
  },
});

export default FAQScreen;