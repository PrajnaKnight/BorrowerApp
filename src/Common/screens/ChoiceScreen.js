import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
// Assuming you have actions to set the user's choice
import { setUserChoice } from '../../PersonalLoan/store/actions/userActions';

const ChoiceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
  };

  const handleContinue = () => {
    if (!selectedChoice) {
      Alert.alert('Selection Required', 'Please select an option to continue.');
      return;
    }

    dispatch(setUserChoice(selectedChoice));

    if (selectedChoice === 'dashboard') {
      navigation.navigate('Dashboard');
    } else if (selectedChoice === 'personalLoan') {
      navigation.navigate('PersonalLoan');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome! Where would you like to go?</Text>
        
        <TouchableOpacity
          style={[
            styles.choiceButton,
            selectedChoice === 'dashboard' && styles.selectedChoice,
          ]}
          onPress={() => handleChoice('dashboard')}
        >
          <Text style={styles.choiceText}>Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.choiceButton,
            selectedChoice === 'personalLoan' && styles.selectedChoice,
          ]}
          onPress={() => handleChoice('personalLoan')}
        >
          <Text style={styles.choiceText}>Personal Loan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  choiceButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedChoice: {
    backgroundColor: '#e0f0ff',
    borderColor: '#007bff',
    borderWidth: 2,
  },
  choiceText: {
    fontSize: 18,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  continueText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChoiceScreen;