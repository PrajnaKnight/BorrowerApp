import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { styles } from '../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default App = ({ path, onClose }) => {

    // const openFile = () => {
    //     // Replace with the path to your file or URL
    //     let fileUrl = `${path}`;
    //     if(!fileUrl.startsWith("file://")){
    //         fileUrl = `file://${fileUrl}`
    //     }
    //     Linking.openURL(fileUrl).catch(err => console.error('An error occurred', err));
    //   };

    const openFile = async () => {
        const filePath = path;

        try {
            // Check if the file exists
            const fileExists = await RNFS.exists(filePath);
            if (fileExists) {
                // Open the file using FileViewer
                FileViewer.open(filePath)
                    .then(() => {
                        console.log('File opened successfully');
                        onClose()
                    })
                    .catch(error => {
                        console.error('Error opening file:', error);
                    });
            } else {
                Alert.alert('File not found', 'The file does not exist.');
            }
        } catch (error) {
            console.error('Error checking file existence:', error);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={path != null}
            onRequestClose={() => {
                onClose()
            }}>

            <View style={styles.overlay}>
                <View style={styles.permissionDialog}>
                    <Icon
                        name={'folder'}
                        size={48}
                        color="#0056B3"
                    />
                    <Text style={styles.permissionDialogText}>
                        <Text style={{ fontWeight: 'bold' }}>{path?.split('/').pop()}</Text> is downloaded successfully to the download folder on the device. If you want to see this, click on the open button.
                    </Text>
                    <View style={styles.dialogButtons}>
                        <TouchableOpacity onPress={() => {
                            onClose()
                        }}>
                            <Text style={styles.dialogButtonText}>Deny</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {

                            openFile()
                        }


                        }>
                            <Text style={styles.dialogButtonText}>Open</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


        </Modal>

    );
}

