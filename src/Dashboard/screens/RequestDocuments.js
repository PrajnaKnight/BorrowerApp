import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTab } from '../components/TabContext';
import TabsComponent from '../components/TabsComponent';
import { styles } from '../../assets/style/globalStyle';
import Layout from '../components/Layout';
import { AntDesign, Ionicons } from '@expo/vector-icons';

const RequestDocuments = ({ navigation }) => {
  const { activeTab } = useTab();
  const [downloadMessage, setDownloadMessage] = useState(null);
  const { state } = useTab();
  const { loanStatus } = state;
  const isClosed = loanStatus === 'Closed';

  const documents = [
    { name: 'SOA', status: 'Generate', statusColor: '#758BFD' },
    { name: 'Loan Agreement', status: 'Generate', statusColor: '#758BFD' },
    { name: 'Sanction Letter', status: 'Generate', statusColor: '#758BFD' },
    // { name: 'Insurance Policy Document', status: 'Ready for Download', statusColor: '#ff8500' },
    { name: 'NOC', status: isClosed ? 'Ready for Download' : 'Raise Request', statusColor: isClosed ? '#ff8500' : '#d3d3d3' },
    { name: 'Foreclosure/Closure Letter', status: 'Raise Request', statusColor: '#d3d3d3', note: '(Applicable in Foreclosure Cases)' },
    { name: 'Closure Letter', status: isClosed ? 'Ready for Download' : 'Raise Request', statusColor: isClosed ? '#ff8500' : '#d3d3d3', note: '(Applicable in closure cases)' },
    { name: 'Settlement Letter', status: isClosed ? 'Ready for Download' : 'Raise Request', statusColor: isClosed ? '#ff8500' : '#d3d3d3', note: '(Applicable in Writeoff Cases)' },
  ];

  useEffect(() => {
    if (activeTab === 'Loan Details') {
      navigation.navigate('IndividualLoanDetails');
    } else if (activeTab === 'Transaction Details') {
      navigation.navigate('TransactionDetails');
    }
  }, [activeTab]);

  const handleDownload = (title) => {
    // Simulate a download success or failure
    const isSuccess = Math.random() > 0.5;
    setDownloadMessage(isSuccess ? `${title} Downloaded Successfully` : `Download Failed for ${title}`);
    setTimeout(() => setDownloadMessage(null), 2000); // Hide message after 2 seconds
  };

  const handleDocumentStatus = (doc) => {
    switch (doc.status) {
      case 'Generate':
        // Simulate generating document...
        setDownloadMessage(`Generating ${doc.name}...`);
        setTimeout(() => setDownloadMessage(null), 2000); // Hide message after 2 seconds
        break;
      case 'Ready for Download':
        handleDownload(doc.name);
        break;
      case 'Raise Request':
        // Simulate raising request...
        setDownloadMessage(`Raising request for ${doc.name}...`);
        setTimeout(() => setDownloadMessage(null), 2000); // Hide message after 2 seconds
        break;
      default:
        setDownloadMessage('Status not recognized');
        setTimeout(() => setDownloadMessage(null), 2000); // Hide message after 2 seconds
    }
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <TabsComponent />
        {downloadMessage && (
          <View
            style={[
              styles.messageContainer,
              {
                backgroundColor:
                  downloadMessage.includes('Downloaded Successfully')
                    ? '#2FC603'
                    : downloadMessage.includes('Download Failed')
                    ? '#DD0000'
                    : downloadMessage.includes('Generating')
                    ? '#FFD700'
                    : '#FF0000',
              },
            ]}
          >
            <Text style={styles.messageText}>{downloadMessage}</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Request Documents</Text>
         
          <View style={styles.RDcard}>
            {documents.map((doc, index) => (
              <View key={index} style={styles.documentRow}>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{doc.name}</Text>
                  {doc.note && (
                    <Text style={styles.documentNote}>{doc.note}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleDocumentStatus(doc)}
                  disabled={doc.status === 'Raise Request'}
                >
                  {doc.status === 'Ready for Download' ? (
                     <AntDesign name="download" size={24} color={doc.statusColor} />
                  ) : doc.status === 'Generate' ? (
                    <Ionicons name="refresh" size={24} color={doc.statusColor} />
                  ) : (
                    <AntDesign name="download" size={24} color={doc.statusColor} />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default RequestDocuments;