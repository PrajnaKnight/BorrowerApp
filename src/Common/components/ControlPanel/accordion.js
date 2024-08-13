import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import applyFontFamily from '../../../assets/style/applyFontFamily';

const AccordionItem = ({ title, content, isOpen, onToggle }) => (
  <View style={[styles.item, { backgroundColor: isOpen ? '#fff' : '#E6EBF8' }]}>
    <TouchableOpacity style={styles.header} onPress={onToggle}>
      <Text style={styles.title}>{title}</Text>
      <Icon
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={20}
        color={isOpen ? '#ff8500' : '#00194c'}
      />
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.content}>
        <Text style={styles.contentText}>{content}</Text>
      </View>
    )}
  </View>
);

const Accordion = ({ items, initialOpenIndex = -1 }) => {
  const [openIndex, setOpenIndex] = useState(initialOpenIndex);

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={index === openIndex}
          onToggle={() => setOpenIndex(index === openIndex ? -1 : index)}
        />
      ))}
    </View>
  );
};

const styles = applyFontFamily({
  container: {
    overflow: 'hidden',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#00194C',
    fontSize: 16,
  },  
  content: {
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  contentText: {
    color: '#00194C',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default Accordion;