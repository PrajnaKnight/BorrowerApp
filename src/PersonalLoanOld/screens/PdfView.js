
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';
import FileViewer from "react-native-file-viewer";

import * as Print from 'expo-print';


export default PDFViewer = ({ navigation, route }) => {


    // const source = { uri: `data:application/pdf;base64,${route.params.base64}` };
    const downloadSectionLetter = async(uri) =>{
        
        // const { uri } = await Print.printToFileAsync({ html: sanctionWebView });
        // console.log(uri)
        const a = await Print.printAsync({ uri });
        
    }
    useEffect(() => {
        // downloadSectionLetter("file:///data/user/0/com.loanapp/cache/Print/efea1e0d-1afa-4796-824b-658c98f73717.pdf")
        downloadSectionLetter("file:///data/user/0/com.loanapp/files/SANCTIONLETTER_1714550591003.pdf") // absolute-path-to-my-local-file.
        
    }, [])
    return (
        <View style={styles.container}>

            {/* <Pdf
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf} /> */}

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});