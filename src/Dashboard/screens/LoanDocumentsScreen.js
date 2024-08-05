import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTab } from '../components/TabContext';
import TabsComponent from '../components/TabsComponent';
import Layout from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../assets/style/globalStyle';

const LoanDocumentsScreen = ({ navigation }) => {
  const { state } = useTab();
  const { loanStatus } = state;
  const isClosed = loanStatus === 'Closed';

  return (
    <Layout>
      <View style={styles.container}>
        <TabsComponent />
        <ScrollView>
          <View style={styles.content}>
            <TouchableOpacity style={styles.redirectItem} onPress={() => navigation.navigate('LoanSubmittedDocuments')}>
              <Text style={styles.redirectItemText}>Submitted Documents</Text>
              <MaterialIcons name="navigate-next" size={20} color="#ff8500" style={styles.roundedBorder} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.redirectItem}  
              onPress={() => navigation.navigate('RequestDocuments', { loanStatus })}
            >
              <Text style={styles.redirectItemText}>Request Documents</Text>
              <MaterialIcons name="navigate-next" size={20} color="#ff8500" style={styles.roundedBorder} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.redirectItem} onPress={() => navigation.navigate('LoanDirectDownload')}>
              <Text style={styles.redirectItemText}>Direct Download</Text>
              <MaterialIcons name="navigate-next" size={20} color="#ff8500" style={styles.roundedBorder} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};

export default LoanDocumentsScreen;