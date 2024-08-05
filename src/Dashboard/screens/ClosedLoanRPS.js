import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../../assets/style/globalStyle";
import TabsComponent from "../components/TabsComponent";
import { useTab } from "../components/TabContext";
import Layout from "../components/Layout";

const repaymentData = [
  { dueDate: "05/01/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/02/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/03/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/04/2023", emi: "23,826", balance: "2456", status: "Paid" },
  { dueDate: "05/05/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/06/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/07/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/08/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/09/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/10/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/11/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/12/2023", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/01/2024", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/02/2024", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/03/2024", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/04/2024", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/05/2024", emi: "22,224", balance: "2456", status: "Paid" },
  { dueDate: "05/06/2024", emi: "22,224", balance: "2456", status: "Paid" },
];

const ClosedLoanRPS = ({navigation}) => {
  //maintain state of tabs
  const { activeTab, setActiveTab } = useTab();

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
        <View style={styles.content}>
          <View style={styles.repaymentFlex}>
            <Text style={styles.sectionTitle}>Loan Repayment Schedule</Text>
            <TouchableOpacity style={styles.DownloadButton}>
              <Text style={styles.downloanButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Due Date</Text>
              <Text style={styles.headerCell}>EMI{'\n'}(₹)</Text>
              <Text style={styles.headerCell}>Balance{'\n'}(₹)</Text>
              <Text style={styles.headerCell}>Status</Text>
            </View>
            {repaymentData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.row,
                  index % 2 !== 0 && styles.oddRow,
                  styles.tableRow,
                ]}>
                <Text style={styles.cell}>{item.dueDate}</Text>
                <Text style={styles.cell}>{item.emi}</Text>
                <Text style={styles.cell}>{item.balance}</Text>
                <Text style={[styles.cell, getStatusStyle(item.status)]}>
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return styles.statusPaid;
      default:
        return styles.statusPaid;
    }
  };

export default ClosedLoanRPS;
