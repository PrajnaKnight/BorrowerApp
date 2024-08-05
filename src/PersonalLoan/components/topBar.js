import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image,Modal,TextInput,FlatList } from 'react-native';
import { useAppContext } from '../components/useContext'; 
import { styles } from '../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomDropdown from './customDropdown';

const TopBarComponent = () => {
  const { handleFontSize } = useAppContext();
  // Separate states for each button color
  const [increaseButtonColor, setIncreaseButtonColor] = useState('#E6EDFF');
  const [decreaseButtonColor, setDecreaseButtonColor] = useState('#E6EDFF');

  // Handlers for increase button
  const onIncreasePressIn = () => setIncreaseButtonColor('#FF9D36');
  const onIncreasePressOut = () => {
    setIncreaseButtonColor('#E6EDFF');
    handleFontSize();
  };

  // Handlers for decrease button


  const languageOptions = [
    { label: 'EN', value: 'en' },
    { label: 'हिं', value: 'hi' },
  ];

  const [isFaqModalVisible, setFaqModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFaqId, setSelectedFaqId] = useState(null);

   // FAQ data and the search handler
  const [faqs, setFaqs] = useState([
    // Replace with your actual FAQ data
    { id: '1', question: 'Lorem Ipsum is simply dummy text?', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '2', question: 'Lorem Ipsum is simply dummy text?', answer: 'Y can be found at...' },
    // ... more FAQs
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
      <View>
        <TouchableOpacity style={styles.faqItem} onPress={() => toggleFaq(item.id)}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
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
    <View style={styles.TopBar}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/your-logo.png')} style={styles.logo} />
      </View>
      <View style={styles.iconRow}>
      <TouchableOpacity
          onPressIn={onIncreasePressIn}
          onPressOut={onIncreasePressOut}
          style={[styles.iconButton, { backgroundColor: increaseButtonColor }]}
        >
          <Text style={styles.iconText}>A</Text>
        </TouchableOpacity>
        
   
        <View style={styles.drpDownWrapper}>
          <CustomDropdown
            options={languageOptions}
            onSelect={(value) => {
              // Update the context or state as needed
            }}
          />
        </View>
        
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="bell" size={16} color="#00194c" style={styles.bellIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={() => setFaqModalVisible(true)}>
          <Icon name="info" size={14} color="#00194c" style={styles.infoIcon} />
        </TouchableOpacity>
        {/* FAQ Modal */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={isFaqModalVisible}
          onRequestClose={() => setFaqModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                {/* Logo */}
                <Image source={require('../../assets/images/poweredby.png')} style={styles.logo} />
              </View>
              <View>
                {/* Title */}
                <Text style={styles.faqsTitle}>FAQs</Text>
              </View>
              <View style={styles.faqClose}>
                {/* Close button */}
                <TouchableOpacity onPress={() => setFaqModalVisible(false)}>
                  <Icon name="times" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

            </View>

            {/* Search Bar */}
            <TextInput
              style={styles.searchBar}
              placeholder="Search FAQs"
              value={searchText}
              onChangeText={handleSearch}
            />

            {/* FAQ List */}
            <FlatList
              data={faqs}
              keyExtractor={(item) => item.id}
              renderItem={renderFaqItem}
              contentContainerStyle={styles.faqList}
            />
          </View>
        </Modal>
      </View>

    </View>
  );
};

export default TopBarComponent;
