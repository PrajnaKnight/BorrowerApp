import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomDropdown from '../components/Dropdown';
import Layout from '../components/Layout';
import CustomSwitch from '../components/customSwitch';
import { styles } from '../../assets/style/globalStyle';

const GeneralSettingScreen = () => {
  const [language, setLanguage] = useState('');
  const [theme, setTheme] = useState('');
  const [screenLock, setScreenLock] = useState(false);

  const languageOptions = [
    { label: 'मराठी', value: 'Marathi' },
    { label: 'English', value: 'English' },
    { label: 'हिंदी', value: 'Hindi' },
    { label: 'ಕನ್ನಡ', value: 'Kannada' },
    { label: 'ગુજરાતી', value: 'Gujarati' },
    { label: 'తెలుగు', value: 'Telugu' },
  ];

  const themeOptions = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System Default', value: 'system' },
  ];

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.Personaltitle}>General Setting</Text>
          <View style={styles.settingRow}>
            <Text style={styles.ScreenLocklabel}>Screen Lock</Text>
            <CustomSwitch
              value={screenLock}
              onValueChange={(value) => setScreenLock(value)}
            />
          </View>
          <Text style={styles.drpdownlabel}>Languages</Text>
          <CustomDropdown
            label="Languages"
            options={languageOptions}
            selectedValue={language}
            onValueChange={setLanguage}
          />
           <Text style={styles.drpdownlabel}>Theme</Text>
          <CustomDropdown
            label="Theme"
            options={themeOptions}
            selectedValue={theme}
            onValueChange={setTheme}
          />
        </View>
      </ScrollView>
    </Layout>
  );
};


export default GeneralSettingScreen;
