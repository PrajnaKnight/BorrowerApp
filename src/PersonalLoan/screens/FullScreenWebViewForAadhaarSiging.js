import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../services/style/gloablStyle';
import { GoBack } from '../services/Utils/ViewValidator';
import { DownloadESigningDocument } from '../services/API/ESignDocument';
import { STATUS } from '../services/API/Constants';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';

const FullScreenWebViewForAadhaarSigning = ({ navigation, route }) => {
    const iframeRef = useRef(null);
    const [url, setUrl] = useState(null);
    const [previousFileName, setPreviousFileName] = useState(null);

    const handleDownloadAndShowPdf = (base64, fileName) => {
        try {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return url;
        } catch (e) {
            console.log(e);
            return null;
        }
    };

    const webGoBackToWebAppLogic = async () => {
        const downloadESigningDocument = await DownloadESigningDocument(route.params.TransactionId);
        if (downloadESigningDocument.status === STATUS.ERROR) {
            GoBack(navigation);
            return;
        }
        const fileName = downloadESigningDocument?.data?.FileName;
        const base64 = downloadESigningDocument?.data?.FileData;

        if (previousFileName && previousFileName === fileName) {
            console.log("---------------------- File name is same go back ----------------------")
           
            navigation.replace('ThankYou', { pdfUri: base64, fileName });
           
        } else {
            console.log("---------------------- File name is not same stay here ----------------------")
            setPreviousFileName(fileName);
        }
    };

    const downloadESigningDocument = async () => {
        const downloadESigningDocument = await DownloadESigningDocument(route.params.TransactionId);
        if (downloadESigningDocument.status === STATUS.ERROR) {
            GoBack(navigation);
            return;
        }

        if (downloadESigningDocument?.data?.FileData?.length > 0) {
            const fileName = downloadESigningDocument?.data?.FileName;
            const base64 = downloadESigningDocument?.data?.FileData;

                    
            navigation.replace('ThankYou', { pdfUri: base64,  fileName });
                   
            
        } 
    };

    useEffect(() => {
        if (url == null) {
            return;
        }

        if (url.startsWith('https://esign.authbridge.com/')) {
            if (route.params.TransactionId == null) {
                return;
            }
            downloadESigningDocument();
        }
    }, [url]);

    useEffect(() => {
        if (Platform.OS === 'web') {
            const intervalId = setInterval(() => {
                webGoBackToWebAppLogic();
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [previousFileName]);

    return (
        Platform.OS === 'web' ? (
            <iframe
                ref={iframeRef}
                srcDoc={route.params.htmlContent}
                onLoad={() => {
                    console.log('======== new page ==============');
                    const contentDocument = iframeRef.current.contentDocument;
                    console.log('Iframe document:', contentDocument);
                    const contentWindow = iframeRef.current.contentWindow;
                    console.log('Iframe contentWindow:', contentWindow);
                    console.log('======== new page ==============');
                }}
                style={styles.webView}
            />
        ) : (
            <WebView
                originWhitelist={['*']}
                source={{ html: route.params.htmlContent }}
                onNavigationStateChange={(navState) => {
                    setUrl(navState.url);
                    console.log('Current URL:', navState.url);
                }}
                style={styles.webView}
            />
        )
    );
};

export default FullScreenWebViewForAadhaarSigning;
