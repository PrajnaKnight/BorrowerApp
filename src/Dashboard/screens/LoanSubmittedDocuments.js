import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { styles } from '../../assets/style/globalStyle';
import TabsComponent from '../components/TabsComponent';
import { useTab } from '../components/TabContext';
import Layout from '../components/Layout';

const LoanSubmiitedDocumentsScreen = ({ navigation }) => {
  const { activeTab, setActiveTab } = useTab();
  const [downloadMessage, setDownloadMessage] = useState(null);

  useEffect(() => {
    if (activeTab === 'Loan Details') {
      navigation.navigate('IndividualLoanDetails');
    } else if (activeTab === 'Transaction Details') {
      navigation.navigate('TransactionDetails');
    }
  }, [activeTab]);

  const documents = [
    { title: 'Aadhaar Card' },
    { title: 'PAN Card' },
    { title: 'Voter Card' },
    { title: 'Driving License' },
  ];

  const handleDownload = (title) => {
    // Simulate a download success or failure
    const isSuccess = Math.random() > 0.5;
    setDownloadMessage(isSuccess ? 'Download Successfully' : 'Download Failed');
    setTimeout(() => setDownloadMessage(null), 2000); // Hide message after 2 seconds
  };

  const DocumentItem = ({ title, onPress }) => (
    <TouchableOpacity style={styles.documentItem} onPress={onPress}>
      <Text style={styles.documentItemText}>{title}</Text>
      <AntDesign name="download" size={24} color="#ff8500" />
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <TabsComponent />
        <ScrollView>
          {/* Download Message */}
          {downloadMessage && (
            <View
              style={[
                styles.downloadMessage,
                {
                  backgroundColor:
                    downloadMessage === "Download Successfully"
                      ? "#2FC603"
                      : "#DD0000",
                },
              ]}>
              <Text style={styles.downloadMessageText}>{downloadMessage}</Text>
            </View>
          )}
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Submitted Documents</Text>
            <View style={styles.DownloadDocWrapper}>
              {documents.map((doc, index) => (
                <DocumentItem
                  key={index}
                  title={doc.title}
                  onPress={() => handleDownload(doc.title)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};

export default LoanSubmiitedDocumentsScreen;
