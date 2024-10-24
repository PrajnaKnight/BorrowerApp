import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Modal,
    AppState,
    Linking,
    BackHandler,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ProgressBar from '../../PersonalLoan/components/progressBar';
import { useProgressBar } from '../../PersonalLoan/components/progressContext';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../PersonalLoan/services/style/gloablStyle';

import { RequestLocationPermission, fetchCameraFromWeb } from '../../PersonalLoan/services/API/LocationApi';
import { CheckCircle2, MapPin, Lock, Building2 } from 'lucide-react';
import { PermissionPopup } from '../../PersonalLoan/components/DownloadPopup';
import { TabProvider } from '../../Dashboard/components/TabContext';
import Layout from '../../Dashboard/components/Layout';
import TopBar from '../../Dashboard/components/topBar';

let PermissionsAndroid;
if (Platform.OS === 'android') {
    PermissionsAndroid = require('react-native').PermissionsAndroid;
}

export const checkLocationPermission = async () => {
    if (Platform.OS === "android") {
        const locationGranted = await PermissionsAndroid.check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        return locationGranted
    }
    else if (Platform.OS === "web") {

        const locationGranted = await navigator.permissions.query({ name: 'geolocation' });

        return locationGranted.state === "granted"
    }
    return false
}

export const checkCameraPermission = async () => {
    if (Platform.OS === "android") {
        const cameraGranted = await PermissionsAndroid.check(PERMISSIONS.ANDROID.CAMERA);

        return cameraGranted
    }
    else if (Platform.OS === "web") {

        const cameraGranted = await navigator.permissions.query({ name: 'camera' });

        return cameraGranted.state === "granted"
    }
    return false
}


export const checkSMSPermission = async () => {
    if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
            {
                title: 'SMS Permission',
                message: 'This app needs access to your SMS to auto-fill OTP.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        return granted
    }

    return true
}



export const checkImagePermission = async () => {
    if (Platform.OS === "android") {
        const readGranted = await PermissionsAndroid.check(Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

        return readGranted
    }
    else if (Platform.OS === "web") {

        return true
    }
    return false
}

const PermissionsScreen = ({ navigation, route }) => {

    useEffect(() => {
        renderPermissionRequestView(route.params.permissionType)
    }, []);



    const [cameraPermission, setCameraPermission] = useState(RESULTS.DENIED); // null, 'granted', 'denied'
    const [filesPermission, setFilesPermission] = useState(RESULTS.DENIED); // null, 'granted', 'denied'
    const [locationPermission, setLocationPermission] = useState(RESULTS.DENIED); // null, 'granted', 'denied'
    const [refreshPermissions, setRefreshPermission] = useState(true)
    const [showPermssionModel, setShowPermssionModel] = useState(null)

    const [showPerimissionPopup, setShowPerimissionPopup] = useState(false)
    const appState = useRef(AppState.currentState);



    // const [currentPermission, setCurrentPermission] = useState('');


    const { width, height } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;


    const imageContainerStyle = isDesktop ? { width: '60%' } : { width: '100%' };

    //   const handlePermissionRequest = async (permissionType) => {
    //     let result;
    //     switch (permissionType) {
    //       case 'camera':
    //         result = await request(PERMISSIONS.ANDROID.CAMERA);
    //         setCameraPermission(result);
    //         break;
    //       case 'files':
    //         result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    //         setFilesPermission(result);
    //         break;
    //       case 'location':
    //         result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    //         setLocationPermission(result);
    //         break;
    //     }

    //     if (result === RESULTS.GRANTED) {
    //       setCurrentPermission('');
    //       setViewState('permissions');
    //     } else {
    //       setCurrentPermission('');
    //       setViewState('denied');
    //     }
    //   };

    const checkPermission = async () => {
        const locationPermission = await checkLocationPermission();
        const cameraPermission = await checkCameraPermission();
        const imagePermission = await checkImagePermission();
        return locationPermission && cameraPermission && imagePermission
    }

    const handleNextPress = async () => {
        const { GoBack } = require('../../PersonalLoan/services/Utils/ViewValidator');

        if (route.params.launchTimeAsk) {

            if (await checkPermission()) {
                route.params.onGoBack();
                return
            }

            setShowPerimissionPopup(true)
        }
        else {

            GoBack(navigation)

        }
    };



    const isPermissionGranted = async () => {

        const cameraGranted = await checkCameraPermission();
        setCameraPermission(cameraGranted ? RESULTS.GRANTED : RESULTS.DENIED)

        setFilesPermission(await checkImagePermission() ? RESULTS.GRANTED : RESULTS.DENIED)

        const locationGranted = await checkLocationPermission();
        setLocationPermission(locationGranted ? RESULTS.GRANTED : RESULTS.DENIED)

    }



    const renderPermissionsView = () => (
        <>
            <TouchableOpacity style={styles.permissionItem} onPress={() => renderPermissionRequestView('camera')}>
                <Icon name="camera-alt" size={24} color="#FF6200" />
                <View style={styles.permissionText}>
                    <Text style={styles.permissionTitle}>Camera</Text>
                    <Text style={styles.permissionDesc}>This is required to help you scan documents easily and verify your identity during KYC process</Text>
                </View>
                <Icon name="check-circle" size={24} color={cameraPermission === RESULTS.GRANTED ? 'green' : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.permissionItem} onPress={() => renderPermissionRequestView('files')}>
                <Icon name="folder" size={24} color="#FF6200" />
                <View style={styles.permissionText}>
                    <Text style={styles.permissionTitle}>Files</Text>
                    <Text style={styles.permissionDesc}> This is required so you can save and retrieve documents related to your loan application</Text>
                </View>
                <Icon name="check-circle" size={24} color={filesPermission === RESULTS.GRANTED ? 'green' : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.permissionItem} onPress={() => renderPermissionRequestView('location')}>
                <Icon name="location-on" size={24} color="#FF6200" />
                <View style={styles.permissionText}>
                    <Text style={styles.permissionTitle}>Location</Text>
                    <Text style={styles.permissionDesc}>This is required to confirm your addresses mentioned in the loan application form</Text>
                </View>
                <Icon name="check-circle" size={24} color={locationPermission === RESULTS.GRANTED ? 'green' : '#ccc'} />
            </TouchableOpacity>
        </>
    );

    const renderPermissionDeniedView = () => (
        <>
            <View style={styles.permissionAlert}>
                <Icon
                    name={
                        showPermssionModel == "camera"
                            ? 'camera-alt'
                            : showPermssionModel == "files"
                                ? 'folder'
                                : 'location-on'
                    }
                    size={64}
                    color="#FF8600"
                />
                <Text style={styles.permissionAlertText}>
                    Your {showPermssionModel} permission is {filesPermission} :(
                </Text>
                <Text style={styles.permissionAlertDesc}>
                    This app needs access to your {showPermssionModel}, which is required for its functionality.
                </Text>
            </View>
            <LinearGradient colors={['#002777', '#00194C']} style={styles.Gotobutton}>
                <TouchableOpacity onPress={() => { }}>
                    <Text style={[styles.buttonText]}>
                        GO TO SETTINGS
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </>
    );

    const handlePermissionForWeb = () => {
        if (showPermssionModel === "camera") {

            fetchCameraFromWeb()

        }
        else if (showPermssionModel === "files") {

        }
        else {
            RequestLocationPermission().finally((e) => {

                setRefreshPermission(true)
            })
        }

    }

    const ShowPermissionDialog = () => {

        return <Modal transparent={true} visible={showPermssionModel ? true : false}>
            <View style={styles.overlay}>
                <View style={styles.permissionDialog}>
                    <Icon
                        name={
                            showPermssionModel === 'camera'
                                ? 'camera-alt'
                                : showPermssionModel === 'files'
                                    ? 'folder'
                                    : 'location-on'
                        }
                        size={48}
                        color="#0056B3"
                    />
                    <Text style={styles.permissionDialogText}>
                        Allow <Text style={{ fontWeight: 'bold' }}>App</Text> to access this device's {showPermssionModel}?
                    </Text>
                    <View style={styles.dialogButtons}>
                        <TouchableOpacity onPress={() => {


                            // if (showPermssionModel === 'camera') setCameraPermission(RESULTS.DENIED);
                            // if (showPermssionModel === 'files') setFilesPermission(RESULTS.DENIED);
                            // if (showPermssionModel === 'location') setLocationPermission(RESULTS.DENIED);
                            setShowPermssionModel(null)
                        }}>
                            <Text style={styles.dialogButtonText}>Deny</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {

                            if (Platform.OS === "android") {
                                Linking.openSettings();
                            }
                            else if (Platform.OS === "web") {
                                handlePermissionForWeb()
                            }
                            setShowPermssionModel(null)
                        }


                        }>
                            <Text style={styles.dialogButtonText}>Allow</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    }

    const renderPermissionRequestView = async (type) => {

        if (!type) {
            return
        }

        if (Platform.OS === "android") {
            if (type === 'camera') {

                const locationGranted = await request(PERMISSIONS.ANDROID.CAMERA);
                if (locationGranted == 'blocked') {
                    setShowPermssionModel("camera")
                    return
                }

                // const { status } = await ImagePicker.requestCameraPermissionsAsync();
            }
            else if (type === 'files') {

                const readGranted = await request(Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                if (readGranted == 'blocked') {
                    setShowPermssionModel("files")
                    return
                }


                // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            }
            else if (type === 'location') {
                const readLocation = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                if (readLocation == 'blocked') {
                    setShowPermssionModel("location")
                    return
                }
                // await RequestLocationPermission()
            }
            setRefreshPermission(true)
        }
        else if (Platform.OS === "web") {
            if (type === 'camera') {

                if (cameraPermission != RESULTS.GRANTED) {

                    setShowPermssionModel("camera")

                }
                // const { status } = await ImagePicker.requestCameraPermissionsAsync();
            }
            else if (type === 'files') {

                if (filesPermission != RESULTS.GRANTED) {
                    setShowPermssionModel("files")

                }

                // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            }
            else if (type === 'location') {

                if (locationPermission != RESULTS.GRANTED) {
                    setShowPermssionModel("location")

                }

                // await RequestLocationPermission()
            }
        }



    }


    useEffect(() => {
        if (refreshPermissions) {
            isPermissionGranted()
            setRefreshPermission(false)
        }
    }, [refreshPermissions])





    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                setRefreshPermission(true)
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Cleanup the subscription on component unmount
        return () => {
            subscription.remove();
        };
    }, []);


    useEffect(() => {
        
        const backAction = () => {
            handleNextPress()
            return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);

      const steps = [
        { id: 1, title: 'Primary Information', subtitle: 'प्राथमिक जानकारी', icon: CheckCircle2, status: 'current' },
        { id: 2, title: 'Personal Information', subtitle: 'व्यक्तिगत जानकारी', icon: MapPin, status: 'disabled' },
        { id: 3, title: 'eKYC OTP Verification', subtitle: 'ईकेवाईसी ओटीपी सत्यापन', icon: Lock, status: 'disabled' },
        { id: 4, title: 'Address Details', subtitle: 'पते का विवरण', icon: Building2, status: 'disabled' },
      ];
    

    return (
      
      <View style={styles.mainContainer}>
        <TopBar visibleNotificationIcon={false}/>
        <View style={{ flex: 1, flexDirection: isWeb ? "row" : "column" }}>
          {isWeb && (isDesktop || (isTablet && width > height)) && (
            <View style={[styles.leftContainer, imageContainerStyle]}>
              <View style={styles.mincontainer}>
                <View style={styles.webheader}>
                  <Text style={styles.websubtitleText}>Get Your</Text>
                  <Text style={styles.WebheaderText}>Loan Approved</Text>
                </View>
                <View>
                  {steps.map((step, index) => (
                    <View key={step.id} style={styles.step}>
                      <View
                        style={[
                          styles.stepiconContainer,
                          step.status === "done" &&
                            styles.stepiconContainerDone,
                          step.status === "current" &&
                            styles.stepiconContainerCurrent,
                          step.status === "disabled" &&
                            styles.stepiconContainerDisabled,
                        ]}>
                        <step.icon
                          size={24}
                          color={
                            step.status === "disabled" ? "#A0AEC0" : "#FFFFFF"
                          }
                        />
                      </View>
                      <View style={styles.steptextContainer}>
                        <Text
                          style={[
                            styles.steptitle,
                            step.status === "disabled" &&
                              styles.steptextDisabled,
                          ]}>
                          {step.title}
                        </Text>
                        <Text
                          style={[
                            styles.stepsubtitle,
                            step.status === "disabled" &&
                              styles.steptextDisabled,
                          ]}>
                          {step.subtitle}
                        </Text>
                      </View>
                      {index < steps.length - 1 && (
                        <View style={styles.connectorContainer}>
                          {[...Array(10)].map((_, i) => (
                            <View
                              key={i}
                              style={[
                                styles.dashItem,
                                step.status === "done" && styles.dashItemDone,
                              ]}
                            />
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
                <View style={styles.bottomFixed}>
                  <Image
                    source={require("../../assets/images/poweredby.png")}
                    style={styles.logo}
                  />
                </View>
              </View>
            </View>
          )}

          <KeyboardAvoidingView
            style={[styles.rightContainer, { flex: 1 }]}
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.centerAlignedContainer}>
                <View style={styles.container}>
                  <ProgressBar progress={0.1} />
                  <Text
                    style={[
                      styles.headerText,
                      
                    ]}>
                    Permissions
                  </Text>
                  <View style={styles.permissionContainer}>
                    {renderPermissionsView()}

                    {showPermssionModel && ShowPermissionDialog()}
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.boxShadow}>
              <View
                style={[styles.actionContainer, styles.centerAlignedContainer]}>
                <TouchableOpacity
                  onPress={handleNextPress}
                  style={{ marginBottom: 10, flex:1 }}>
                  <LinearGradient
                    colors={["#002777", "#00194C"]}
                    style={[styles.Nextbutton]}>
                    <Text
                      style={[
                        styles.buttonText,
                       
                      ]}>
                      {route.params.launchTimeAsk ? "NEXT" : "BACK"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {showPerimissionPopup && (
              <PermissionPopup
                onClose={() => {
                  setShowPerimissionPopup(false);
                }}
                onExitApp={() => {
                  const { GoBack } = require("../../PersonalLoan/services/Utils/ViewValidator");
                  GoBack(navigation);
                }}
              />
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
      
    );
};

export default PermissionsScreen;