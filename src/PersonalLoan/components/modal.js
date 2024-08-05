// ReusableModal.js
import React from 'react';
import { Modal, View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import applyFontFamily from '../../assets/style/applyFontFamily';

const ReusableModal = ({ modalVisible, setModalVisible, modalContent }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {modalContent}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}
          >
             <Icon name="close" size={16} color="#ffffff" style={styles.CloseIcon} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = applyFontFamily({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    ...Platform.select({
      web: {
        width:'70%'
      },
    }),
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height:"75%"
  },
  button: {
    borderRadius: 20,
    padding: 0,
    elevation: 2,
    marginTop: 15, // Add some space above the button
    position:'absolute',
    right:10,
    width:25,
    height:25,
    display:'flex',
    alignItems:'center',
    justifyContent:"center"
  },
  buttonClose: {
    backgroundColor: "#758BFD",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default ReusableModal;
