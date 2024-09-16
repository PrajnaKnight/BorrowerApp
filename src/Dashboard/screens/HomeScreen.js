import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Dimensions, Image, ImageBackground, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import moment from 'moment';
import Layout from '../components/Layout';
import { styles } from '../../assets/style/globalStyle';
import { API_RESPONSE_STATUS, STATUS } from '../../PersonalLoan/services/API/Constants';
import GetLookUp from '../../PersonalLoan/services/API/GetLookUp';
import { useDispatch } from 'react-redux';
import { updateBreStatus } from '../../PersonalLoan/services/Utils/Redux/ExtraSlices';
import { updateJumpTo } from '../../PersonalLoan/services/Utils/Redux/LeadStageSlices';
import { GetLeadId, StoreApplicantId, StoreLeadId } from '../../PersonalLoan/services/LOCAL/AsyncStroage';

const { width } = Dimensions.get('window');


const data = [
  {
    id: '1',
    title: 'Prepay',
    offer: 'Special Offer 10% Off',
    ImageSrc: require('../../assets/images/prepay.png'),
    backgroundColor: '#E0F2FF',
    backgroundImage: require('../../assets/images/prepayBg.png'),
  },
  {
    id: '2',
    title: 'EMI Calculator',
    ImageSrc: require('../../assets/images/emicalc.png'),
    backgroundColor: '#FFE9CF',
    backgroundImage: require('../../assets/images/loanCalcBg.png'),
  },
  {
    id: '3',
    title: 'Credit Score',
    ImageSrc: require('../../assets/images/creditscore.png'),
    backgroundColor: '#E0F2FF',
    backgroundImage: require('../../assets/images/creditscoreBg.png'),
  },
  {
    id: '4',
    title: 'Apply Loan',
    ImageSrc: require('../../assets/images/ApplyLoan.png'),
    backgroundColor: '#FFE9CF',
    backgroundImage: require('../../assets/images/applyloanBg.png'),
  },
  {
    id: '5',
    title: 'Loan Eligibility',
    ImageSrc: require('../../assets/images/LoanEligibility.png'),
    backgroundColor: '#E0F2FF',
    backgroundImage: require('../../assets/images/loanEligibilityBg.png'),
  },
];

const loanData = [
  {
    key: '1',
    title: 'Personal Loan',
    subtitle: '****1234',
    loanAmount: '₹ 10,00,000',
    emiAmount: '₹ 56,786',
    nextEmiDate: '05 Sep 2025',
  },
  {
    key: '2',
    title: 'Car Loan',
    subtitle: '****9876',
    loanAmount: '₹ 5,00,000',
    emiAmount: '₹ 28,893',
    nextEmiDate: '12 Oct 2023',
  },
  {
    key: '3',
    title: 'Instant Personal Loan',
    offerBadge: '10% off on processing fees',
    details: [
      { label: 'Flexible Rates' },
      { label: 'Borrow upto', value: 'Rs.20 Lakhs' },
    ],
    buttonLabel: 'Avail Now',
    specialOffer: 'Get your money in 10min into bank account'
  },
  {
    key: '4',
    title: 'Personal Loan',
    type: 'applicationProgress',
    loanAmount: '₹50,000',
    tenure: '12 Months',
    steps: [
      { label: 'Personal Details', status: 'completed' },
      { label: 'Employment', status: 'inprocess' },
      { label: 'Document', status: 'pending' },
      { label: 'Loan Agreement', status: 'pending' },
    ],
    buttonLabel: 'Continue'
  }
];

const banners = [
  {
    id: '1',
    imageSource: require('../../assets/images/Apply-Now-01.png'),
    buttonText: 'Apply Now',
  },
  {
    id: '2',
    imageSource: require('../../assets/images/Apply-Now-02.png'),
    buttonText: 'Apply Now',
  },
  // Add more banner items if necessary
];

const videoIframes = [
  '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/PpRbUGHdebg?si=AlzDEEoEXF5uyEHR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
  '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/g9-Kfj0rYds?si=0mdiGptkLR4RTlwv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
  '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/AgIr7YNoUN8?si=kay-5LPHAlBPPSnS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
  '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/Bbka0BSUQlc?si=i5beb6f5m9rTZqHD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
];

const ImageGallery = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGalleryContainer}>
      {videoIframes.map((iframe, index) => (
        <View key={index} style={styles.videoContainer}>
          {Platform.OS === 'web' ? (
            <div dangerouslySetInnerHTML={{ __html: iframe }} style={styles.video} />
          ) : (
            <WebView
              style={styles.video}
              source={{ html: iframe }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const LoanSliderItem = ({ item, navigation }) => {
  const dispatch = useDispatch()

  const currentDate = moment();
  const nextEmiDate = moment(item.nextEmiDate, 'DD MMM YYYY');
  const isOverdue = nextEmiDate.isBefore(currentDate);

  const handleContinue = async () => {

    let response = API_RESPONSE_STATUS()
    let userAvailable = await GetLookUp()

    console.log("------------------------- get look up response ---------------------------")
    console.log(userAvailable)
    console.log("------------------------- get look up response ---------------------------")



    response.status = STATUS.ERROR
    response.message = userAvailable.message
    response.data = { jumpTo: null, isSelfEmployed: true }

    if (userAvailable.status == STATUS.ERROR) {
      return response
    }



    response.data.jumpTo = 0

    if (userAvailable.data != null && userAvailable.data.IsLeadExisted) {

      const jumpTo = parseInt(userAvailable.data.LeadStage) || 0
      response.data.jumpTo = jumpTo
      response.data.isSelfEmployed = userAvailable.data.EmploymentType == "Self-Employed"
      dispatch(updateBreStatus(userAvailable.data.IsBREcompleted))

    }

    navigation.navigate("PersonalLoan")

  };


  const stageStatusStyles = {
    'completed': { backgroundColor: '#32CD32' },
    'inprocess': { backgroundColor: '#FF8800' },
    'pending': { backgroundColor: '#D0E4FE' },
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FontAwesome name="check" size={12} color="#fff" />;
      case 'inprocess':
        return <FontAwesome name="check" size={12} color="#fff" />;
      default:
        return null;
    }
  };
 
  const handlePress = () => {
    navigation.navigate('Loans', {
      screen: 'IndividualLoanDetails',
      params: { isOverdue },
    });
  };

  const handlePayNow = () => {
    navigation.navigate('Loans', {
      screen: 'Repayment',
      params: { isOverdue },
    });
  };

  if (item.type === 'applicationProgress') {
    return (
      <View
        style={[
          styles.applicationProgressCard,
          {
            width: width * 0.9,
            marginHorizontal: width * 0.05,
            marginBottom: 16,
          },
        ]}>
        <Text style={styles.applicationProgressTitle}>{item.title}</Text>
        <View style={styles.progressStepsContainer}>
          {item.steps.map((step, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <View
                  style={[
                    styles.stepConnector,
                    item.steps[index - 1].status === "completed"
                      ? styles.completedConnector
                      : styles.pendingConnector,
                  ]}
                />
              )}
              <View style={styles.progressStep}>
                <View style={[styles.stepIcon, stageStatusStyles[step.status]]}>
                  {getStepIcon(step.status)}
                </View>
                <Text style={styles.stepLabel}>{step.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
        <View style={styles.loanDetailsRow}>
          <View>
            <Text style={styles.loanDetailLabel}>Loan Amount</Text>
            <Text style={styles.loanDetailValue}>{item.loanAmount}</Text>
          </View>
          <View>
            <Text style={styles.loanDetailLabel}>Tenure</Text>
            <Text style={styles.loanDetailValue}>{item.tenure}</Text>
          </View>
          <TouchableOpacity
            style={styles.availNowButton}
            onPress={handleContinue}>
            <Text style={styles.avaialNowText}>{item.buttonLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (item.details) {
    return (
      <View
        style={{
          width: width * 0.9,
          marginHorizontal: width * 0.05,
          marginBottom: 16,
        }}>
        <View style={styles.boxShadow}>
          <View style={{flexDirection:'row'}}>
            <View style={styles.offerWrapper}>
              <Text style={styles.SpecialofferBadge}>{item.offerBadge}</Text>
              <Text style={styles.Offertitle}>{item.title}</Text>
              <Text style={styles.specialOfferText}>{item.specialOffer}</Text>
            </View>
            <View>
              <Image source={require("../../assets/images/instantPL.png")} style={styles.PLImage} resizeMode='contain' />
            </View>
          </View>
          <View style={styles.offerDetails}>
            <View>
              {item.details.map((detail, index) => (
                <View style={styles.flexDetails} key={index}>
                  <Text style={styles.orangeText}>-</Text>
                  <Text style={styles.detailText}>
                    {detail.label} {detail.value}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.availNowButton}
              onPress={() => navigation.navigate("NoLoans")}>
              <Text style={styles.avaialNowText}>{item.buttonLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  return (
    <View
      style={[{
        width: width * 0.9,
        marginHorizontal: width * 0.05,
        marginBottom: 16,
      }]}>
      <TouchableOpacity onPress={handlePress}>
        <ImageBackground
          source={require("../../assets/images/repaymentInfo-bg.png")}
          style={styles.background}
          resizeMode="cover">
          <LinearGradient
            colors={isOverdue ? ["#DD0000", "#720000"] : ["#002674", "#00194C"]}
            style={styles.linearGradient}>
            <View style={styles.flex}>
              <View style={styles.personalInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              <TouchableOpacity style={styles.OngoingButton}>
                <Text style={styles.OngoingText}>Ongoing</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.loanOutstandingDetails}>
              <Text style={styles.loanOutstanding}>Loan Outstanding</Text>
              <Text
                style={[
                  styles.loanAmount,
                  { color: isOverdue ? "#ffffff" : "#758BFD" },
                ]}>
                {item.loanAmount}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.card}>
        <View style={styles.flex}>
          <View>
            <Text style={styles.emiDetails}>EMI Amount</Text>
            <Text style={styles.emiAmount}>{item.emiAmount}</Text>
          </View>
          <View>
            <Text style={[styles.emiDetails, isOverdue && styles.redText]}>
              {isOverdue ? "Overdue From" : "Next EMI Date"}
            </Text>
            <Text style={[styles.emiDate, isOverdue && styles.redTextBold]}>{item.nextEmiDate}</Text>
          </View>
          <TouchableOpacity
            style={styles.payNowButton}
            onPress={handlePayNow}>
            <Text style={styles.payNowText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Dots = ({ index, total }) => {
  return (
    <View style={styles.dotContainer}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === index && styles.activeDot,
            { backgroundColor: i === index ? '#ff8500' : '#758BFD' }
          ]}
        />
      ))}
    </View>
  );
};

const Card = ({ title, offer, ImageSrc, backgroundImage, backgroundColor, navigation, totalItems, index }) => {
  const itemWidth = totalItems > 3 ? width * 0.25 : width / totalItems;
  const isOdd = index % 2 !== 0;
  const borderColor = isOdd ? "#ff8500" : "#add0ff";
  const shadowColor = isOdd ? "#ff8500" : "#add0ff";

  const dispatch = useDispatch()

  const handleContinue = async () => {

    let response = API_RESPONSE_STATUS()
    let userAvailable = await GetLookUp()

    console.log("------------------------- get look up response ---------------------------")
    console.log(userAvailable)
    console.log("------------------------- get look up response ---------------------------")



    response.status = STATUS.ERROR
    response.message = userAvailable.message
    response.data = { jumpTo: null, isSelfEmployed: true }

    if (userAvailable.status == STATUS.ERROR) {
      return response
    }



    response.data.jumpTo = 0

    if (userAvailable.data != null && userAvailable.data.IsLeadExisted) {

      const jumpTo = parseInt(userAvailable.data.LeadStage) || 0
      response.data.jumpTo = jumpTo
      response.data.isSelfEmployed = userAvailable.data.EmploymentType == "Self-Employed"
      dispatch(updateBreStatus(userAvailable.data.IsBREcompleted))

    }

    navigation.navigate("PersonalLoan")

  };

  const handlePress = () => {
    switch (title) {
      case 'Prepay':
        navigation.navigate('Repayment');
        break;
      case 'EMI Calculator':
        navigation.navigate('EMICalculator');
        break;
      case 'Credit Score':
        navigation.navigate('CreditScorePage');
        break;
      case 'Apply Loan':
        handleContinue()
        break;
      case 'Loan Eligibility':
        navigation.navigate('LoanEligibilityCalculator');
        break;
        case 'Pre Disbursement':
          navigation.navigate('PreDisbursementScreen');
          break;
      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.cardContainer,
        { 
          width: itemWidth, 
          borderColor: borderColor,
          shadowColor: shadowColor,
        },
        Platform.OS === "ios"
          ? {
              shadowColor: shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.35,
              shadowRadius: 5,
            }
          : {
              elevation: 5,
                shadowColor: shadowColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 3,
            },
      ]}
    >
      <ImageBackground
        source={backgroundImage}
        style={[styles.featureBackground, { backgroundColor }]}
        imageStyle={styles.imageStyle}>
        <View style={styles.cardFeature}>
          <View style={styles.flexFeature}>
            <Image
              style={styles.Imageicon}
              source={ImageSrc}
              resizeMode="contain"
              onError={(e) =>
                console.log("Image failed to load:", e.nativeEvent.error)
              }
            />
            {offer && (
              <View style={styles.offerBadge}>
                <Text style={styles.offerText}>{offer}</Text>
              </View>
            )}
          </View>
          <Text style={styles.quickCardTitle}>{title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};


const BannerItem = ({ item }) => (
  <View style={[{
    width: width * 0.92,
    marginRight: width * 0.03,
  },styles.bannerContainer]}>
    <ImageBackground source={item.imageSource} style={styles.bannerImage} resizeMode="contain">
      <View style={styles.bannerContent}>
        <TouchableOpacity style={styles.applyNowButton}>
          <Text style={styles.applyNowText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </View>
);


const HomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewRef = React.useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <Layout>
      <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.welcome}>Welcome,</Text>
            <Text style={styles.username}>Satat Mishra</Text>
          </View>
          <View style={styles.cibilScore}>
            <Text style={styles.cibilScoreText}>790</Text>
            <Text style={styles.cibilLabel}>Score</Text>
          </View>
        </View>
      <ScrollView style={styles.container}>
        

        <View>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={loanData}
            renderItem={({ item }) => (
              <LoanSliderItem item={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.key}
            onScrollToIndexFailed={() => {}} // This function can be used to handle errors if scrollToIndex fails
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
          <Dots index={currentIndex} total={loanData.length} />
        </View>

        <View style={styles.features}>
          <FlatList
            horizontal
            data={data}
            renderItem={({ item, index }) => (
              <Card
                title={item.title}
                offer={item.offer}
                ImageSrc={item.ImageSrc}
                backgroundImage={item.backgroundImage}
                backgroundColor={item.backgroundColor}
                navigation={navigation} // pass navigation prop
                totalItems={data.length} // pass total items count
                index={index}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.featureListContainer}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={{marginHorizontal:16}}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={banners}
            renderItem={({ item }) => <BannerItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.Imagecontainer}>
          <ImageGallery />
        </View>
      </ScrollView>
    </Layout>
  );
};

export default HomeScreen;