import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TabsComponent from '../components/TabsComponent';
import { useTab } from '../components/TabContext';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';

const TransactionDetailsScreen = ({ navigation }) => {
  const { activeTab, setActiveTab } = useTab();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (activeTab === 'Loan Details') {
      navigation.navigate('IndividualLoanDetails');
    } else if (activeTab === 'Loan Documents') {
      navigation.navigate('LoanDocuments');
    }
  }, [activeTab]);

  const transactions = [
    { date: "20th Dec 2023", description: "Excess Balance Refund",iconRupees:"₹", amount: "6000", type: "Cr",balanceTitle:"Bal: ₹", balance: "00.00", details: { paymentFrom: "Your NBFC", amount: "₹6000.00", transactionID: "17483733872827287288", creditedTo: "HDFC Bank Goregaon (W)", account: "****5123" }, isCredit: true },
    { date: "13th Dec 2023", description: "Loan Foreclosed", iconRupees:"₹", amount: "884307", type: "Dr", balanceTitle:"Bal: ₹", balance: "00.00", details: { paymentFrom: "Your NBFC", amount: "₹884307.00", transactionID: "17483733872827287288", creditedTo: "HDFC Bank Goregaon (W)", account: "****5123" }, isCredit: false },
    { date: "10th Dec 2023", description: "Foreclosure Charges", iconRupees:"₹", amount: "8993", type: "Dr", balanceTitle:"Bal: ₹", balance: "890307", details: { paymentFrom: "Your NBFC", amount: "₹8993.00", transactionID: "17483733872827287288", creditedTo: "HDFC Bank Goregaon (W)", account: "****5123" }, isCredit: false },
    { date: "10th Dec 2023", description: "Late Fee", iconRupees:"₹", amount: "700", type: "Dr", balanceTitle:"Bal: ₹", balance: "890300", details: { paymentFrom: "Your NBFC", amount: "₹700.00", transactionID: "17483733872827287288", creditedTo: "HDFC Bank Goregaon (W)", account: "****5123" }, isCredit: false },
  ];

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TransactionItem = ({ date, description, amount, type, balance,iconRupees,balanceTitle, onPress }) => {
    const isCredit = type === "Cr";
    return (
      <TouchableOpacity style={styles.transactionItem} onPress={onPress}>
        {isCredit ? (
          <MaterialIcons name="keyboard-double-arrow-down" size={24} color="#2FC603" />
        ) : (
          <MaterialIcons name="keyboard-double-arrow-up" size={24} color="#DD0000" />
        )}
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDate}>{date}</Text>
          <Text style={styles.transactionDescription}>{description}</Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          <View style={styles.transactionBalanceContainer}>
          <Text style={styles.transactionAmount}>
            {iconRupees} {amount}
          </Text>
          <Text style={[styles.transactionType, , isCredit ? styles.creditAmount : styles.debitAmount]}>{type}</Text>
          </View>
          <Text style={styles.transactionBalance}>{balanceTitle} {balance}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  return (
    <Layout>
      <View style={styles.container}>
        <TabsComponent />
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <MaterialIcons name="search" size={24} color="#808499" />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Filters</Text>
            <MaterialIcons name="filter-list" size={20} color="#00194C" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.content}>
            {filteredTransactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                date={transaction.date}
                description={transaction.description}
                iconRupees={transaction.iconRupees}
                amount={transaction.amount}
                type={transaction.type}
                balanceTitle={transaction.balanceTitle}
                balance={transaction.balance}
                onPress={() =>
                  setSelectedTransaction({
                    ...transaction.details,
                    date: transaction.date,
                    type: transaction.type,
                    isCredit: transaction.isCredit,
                  })
                }
              />
            ))}
          </View>
        </ScrollView>

        {selectedTransaction && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={!!selectedTransaction}
            onRequestClose={closeModal}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.TransactionCloseModal}>
                <TouchableOpacity onPress={closeModal}>
                  <MaterialIcons
                    name="highlight-off"
                    size={24}
                    style={[
                      {
                        color: selectedTransaction.isCredit
                          ? "#2FC603"
                          : "#DD0000",
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.modalHeader,
                  {
                    backgroundColor: selectedTransaction.isCredit
                      ? "#2FC603"
                      : "#DD0000",
                  },
                ]}>
                <Text style={styles.modalHeaderText}>Transaction Details</Text>
                <Text style={styles.modalDate}>{selectedTransaction.date}</Text>
              </View>
              <View style={styles.modalBody}>
                <View style={styles.TrasactionBriefDetails}>
                  <View>
                    <Text style={styles.modalTitle}>
                      Payment {selectedTransaction.isCredit ? "from" : "To"}
                    </Text>
                    <Text style={styles.modalText}>
                      {selectedTransaction.paymentFrom}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.modalAmount}>
                      {selectedTransaction.amount}
                    </Text>
                  </View>
                </View>
                <Text style={styles.modalTitleTransactionDetails}>
                  Transaction Details
                </Text>
                <Text style={styles.modalText}>Transaction ID</Text>
                <Text style={styles.modalTextTransanctionId}>
                  {selectedTransaction.transactionID}
                </Text>
                <Text style={styles.modalText}>Credited to</Text>
                <View style={styles.CreditedDetails}>
                  <View style={styles.flex}>
                    <View>
                      <MaterialIcons
                        name="business"
                        style={styles.bankIcon}
                        size={30}
                        color={"#ff8500"}
                      />
                    </View>
                    <View>
                      <Text style={styles.modalText}>
                        {selectedTransaction.account}
                      </Text>
                      <Text style={styles.modalTextBankName}>
                        {selectedTransaction.creditedTo}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.modalAmount}>
                      {selectedTransaction.amount}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Layout>
  );
};


export default TransactionDetailsScreen;
