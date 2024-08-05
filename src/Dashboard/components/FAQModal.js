// FAQModal.js
import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import applyFontFamily from '../../assets/style/applyFontFamily';

const FAQModal = ({ visible, onClose }) => {
  const [activeSections, setActiveSections] = useState([]);

  const toggleSection = (section) => {
    setActiveSections((prevActiveSections) =>
      prevActiveSections.includes(section)
        ? prevActiveSections.filter((s) => s !== section)
        : [...prevActiveSections, section]
    );
  };

  const faqData = [
    {
      question: 'How does this app work?',
      answer: 'This app works by providing users with the ability to manage their tasks efficiently.',
    },
    {
      question: 'How can I contact support?',
      answer: 'You can contact support via email at support@example.com.',
    },
    {
        question: 'What is co-lending?',
        answer: 'Co-lending is a collaborative arrangement where banks and NBFCs come together to provide loans to borrowers, combining their resources and strengths.',
    },
    {
        question: 'How does co-lending benefit borrowers?',
        answer: 'Borrowers benefit from lower interest rates, broader credit availability, and faster processing times through the combined strengths of banks and NBFCs.',
    },
    {
        question: 'What roles do banks and NBFCs play in a co-lending model?',
        answer: 'Banks typically provide the bulk of the loan amount at lower interest rates, while NBFCs contribute a smaller portion and handle customer service and documentation',
    },
    {
        question: 'Why do banks prefer co-lending with NBFCs?',
        answer: 'Co-lending allows banks to leverage NBFCs strong customer relationships and efficient loan servicing capabilities while expanding their credit reach.',
    },
    // Add more FAQ questions and answers here
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
          <ScrollView>
            {faqData.map((faq, index) => (
              <View key={index} style={styles.faqContainer}>
                <TouchableOpacity onPress={() => toggleSection(index)} style={styles.faqQuestion}>
                  <Text style={styles.questionText}>{faq.question}</Text>
                  <Icon
                    name={activeSections.includes(index) ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#00194c"
                  />
                </TouchableOpacity>
                <Collapsible collapsed={!activeSections.includes(index)}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </Collapsible>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = applyFontFamily({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  faqContainer: {
    marginBottom: 10,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  questionText: {
    fontSize: 16,
    color: '#00194c',
  },
  answerText: {
    paddingVertical: 10,
    fontSize: 14,
    color: '#00194c',
    lineHeight:20
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#00194c',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FAQModal;
