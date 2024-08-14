import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView,KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../../assets/style/personalStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../Common/components/useContext';
import LoadingOverlay from '../components/FullScreenLoader';

const data = [
    { title: 'Primary Information', description: 'Details about primary information', isCompleted: true },
    { title: 'Personal Information', description: 'Details about personal information', isCompleted: true },
    { title: 'Address Details', description: 'Details about address', isCompleted: true },
    { title: 'Employment Details', description: 'Details about employment', isCompleted: true },
    { title: 'Bank Details', description: 'Details about bank', isCompleted: true },
    { title: 'Loan Eligibility', description: 'Details about loan eligibility', isCompleted: true },
    { title: 'Sanction Letter', description: 'Details about sanction letter', isCompleted: true },
    { title: 'Document Upload', description: 'Details about document upload', isCompleted: true },
    { title: 'eMandate', description: 'Details about eMandate', isCompleted: true },
    { title: 'Loan Agreement', description: 'Details about loan agreement', isCompleted: false },
];

const Step = ({ item, index, onToggle, isActive }) => {
    const lineStyle = item.isCompleted ? { backgroundColor: 'green' } : { backgroundColor: 'grey' };
    const fontColor = item.isCompleted ? { color: 'black' } : { color: 'grey' };

    return (
        <View>
            <TouchableOpacity onPress={() => onToggle(index)} style={styles.stepHeader}>
                <View style={styles.stepIcon}>
                    <Icon name={item.isCompleted ? "check-circle" : "circle"} size={20} color={item.isCompleted ? "green" : "grey"} />
                </View>
                <View style={styles.stepHeaderText}>
                    <Text style={[styles.stepTitle, fontColor]}>{item.title}</Text>
                </View>
                <Icon name={isActive ? "chevron-up" : "chevron-down"} size={20} color="grey" />
                {index < data.length - 1 && <View style={[styles.verticalLine, lineStyle]} />}
            </TouchableOpacity>
                <Collapsible collapsed={!isActive}>
                    <View style={styles.stepContent}>
                        <Text>{item.description}</Text>
                    </View>
                </Collapsible>
        </View>
    );
};

const Preview = () => {
    const [activeSections, setActiveSections] = useState([]);
    const { fontSize } = useAppContext();
    const dynamicFontSize = (size) => size + fontSize;
    const [loading, setLoading] = useState(false);

    
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // Definitions for "mobile", "tablet", and "desktop" based on width
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024; // Tablet range, including iPad portrait
  const isDesktop = width >= 1024; // Desktop and iPad landscape


  const containerStyle = isDesktop ? styles.desktopContainer : isMobile ? styles.mobileContainer : styles.tabletContainer;
  const imageContainerStyle = isDesktop ? { width: '50%' } : { width: '100%' };


    const toggleSection = (index) => {
        setActiveSections((prevActiveSections) =>
            prevActiveSections.includes(index)
                ? prevActiveSections.filter((section) => section !== index)
                : [...prevActiveSections, index]
        );
    };

    return (
        <View style={styles.mainContainer}>
      <View style={{ flex: 1, flexDirection: isWeb ? 'row' : 'column' }}>
      {isWeb && (isDesktop || (isTablet && width > height)) && (
          <View style={[styles.leftContainer, imageContainerStyle]}>
            <View style={styles.mincontainer}>
              <View style={styles.webheader}>
                <Text style={styles.WebheaderText}>Personal Loan</Text>
                <Text style={styles.websubtitleText}>Move Into Your Dreams!</Text>
              </View>
              <LinearGradient
                // button Linear Gradient
                colors={['#000565', '#111791', '#000565']}
                style={styles.webinterestButton}
              >
                <TouchableOpacity >
                  <Text style={styles.webinterestText}>Interest starting from 8.4%*</Text>
                </TouchableOpacity>

              </LinearGradient>

              <View style={styles.webfeaturesContainer}>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5, }]}>%</Text>
                  <Text style={styles.webfeatureText}>Nil processing fee*</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>3</Text>
                  <Text style={styles.webfeatureText}>3-Step Instant approval in 30 minutes</Text>
                </View>
                <View style={styles.webfeature}>
                  <Text style={[styles.webfeatureIcon, { fontSize: 30, marginBottom: 5 }]}>⏳</Text>
                  <Text style={styles.webfeatureText}>Longer Tenure</Text>
                </View>
              </View>

              <View style={styles.webdescription}>
                <Text style={styles.webdescriptionText}>
                  There's more! Complete the entire process in just 3-steps that isn't any more than 30 minutes.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.weblinkText}>To know more about product features & benefits, please click here</Text>
                </TouchableOpacity>
              </View>
              {/* <View style={styles.bottomFixed}>
         <Image source={require('../assets/images/poweredby.png')} style={styles.logo} />
      </View> */}
            </View>
          </View>
        )}
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <LoadingOverlay visible={loading} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <Text style={[styles.headerText, { fontSize: dynamicFontSize(styles.headerText.fontSize) }]}>Preview</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <Step
                            item={item}
                            index={index}
                            onToggle={toggleSection}
                            isActive={activeSections.includes(index)}
                        />
                    )}
                />
                <View style={styles.actionContainer}>
                    <LinearGradient colors={['#002777', '#00194C']} style={styles.downloadButton}>
                        <TouchableOpacity>
                            <Text style={[styles.downloadButtonText, { fontSize: dynamicFontSize(styles.downloadButtonText.fontSize) }]}>
                                DOWNLOAD PDF
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
        </View>
        </View>
    );
};

export default Preview;
