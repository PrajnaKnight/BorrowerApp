import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NetInfo, { fetch } from "@react-native-community/netinfo";
import { useAppContext } from '../components/useContext';
import { Network_Error } from '../services/Utils/Constants';
import applyFontFamily from '../services/style/applyFontFamily';

export const useErrorEffect = (onTryAgainClick) => {
    const [errorScreen, setErrorScreen] = useState({ type: null, onCancelClick: () => { setErrorScreen({ ...errorScreen, type: null }) } });
    const customStateRef = useRef(errorScreen);

    const setNewErrorScreen = (errorType) => {
        setErrorScreen({ ...errorScreen, type: errorType });
    };

    useEffect(() => {
        const unSubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                if (customStateRef.current?.type == Network_Error) {
                    setErrorScreen({ ...errorScreen, type: null });
                    onTryAgainClick();
                }
            } else {
                setErrorScreen({ ...errorScreen, type: Network_Error });
            }
        });

        return () => {
            console.log("==== unsubscribed ====");
            unSubscribe();
        };
    }, []);

    useEffect(() => {
        customStateRef.current = errorScreen;
    }, [errorScreen]);

    return { errorScreen, setNewErrorScreen };
};

const ScreenError = ({ errorObject, onTryAgainClick, setNewErrorScreen }) => {
    const { fontSize } = useAppContext();
    const dynamicFontSize = (size) => size + fontSize;

    const onTryAgainClickAction = () => {
        fetch().then(state => {
            if (state.isConnected) {
                setNewErrorScreen(null);
                onTryAgainClick();
            } else {
                setNewErrorScreen(Network_Error);
            }
        });
    };

    const getMessage = (errorObject) => {
        if(errorObject.startsWith("Error")){
            return errorObject
        }
        return "Error : "+errorObject
    }
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.iconClose}>
                        {errorObject.type !== Network_Error && (
                            <Icon name="times" onPress={() => { errorObject.onCancelClick(); }} size={20} style={styles.closeIcon} />
                        )}
                    </View>
                </View>
                <View style={styles.content}>
                    <Icon style={styles.icon} name={errorObject.type === Network_Error ? 'wifi' : 'chain-broken'} size={80} />
                    <Text style={styles.title}>{errorObject.type === Network_Error ? "No Internet Connection" : getMessage(errorObject.type)}</Text>
                    <TouchableOpacity style={styles.tryAgainButton} onPress={onTryAgainClickAction}>
                        <Text style={[styles.tryAgainButtonText, { fontSize: dynamicFontSize(styles.tryAgainButtonText.fontSize) }]}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = applyFontFamily({
    overlay: {
        flex: 1,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent background
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: '#FFFFFF', // white background
        borderRadius: 10, // corner radius
        padding: 20, // padding around the content
        shadowColor: '#000', // shadow properties for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // shadow properties for Android
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    iconClose: {
        borderWidth:1,
        height:20,
        width:20,
        borderRadius:100,
        borderColor: '#888', 
        
    },
    closeIcon: {
        color: '#888',
        fontSize:14,
        textAlign:'center',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        lineHeight:15
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: 'red', 
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00194c', 
        textAlign: 'center',
        marginBottom: 20,
    },
    tryAgainButton: {
        width: '100%',
        backgroundColor: '#758BFD', 
        borderRadius: 5, 
        paddingVertical: 12, 
        alignItems: 'center', 
    },
    tryAgainButtonText: {
        fontSize: 16,
        color: '#FFFFFF', 
        fontWeight: 'bold',
    },
});

export default ScreenError;
