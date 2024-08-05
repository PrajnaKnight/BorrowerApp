import { StyleSheet, Platform, ImageBackgroundComponent, Dimensions,  } from "react-native";
import applyFontFamily from "./applyFontFamily";

const { width, height } = Dimensions.get('window');

const deviceWidth = window.width;


// You can create your own "media query" functions
const isSmallDevice = deviceWidth < 768;

export const styles = applyFontFamily({
  // home screen style starts
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor:'#fff'
  },
  userInfo: {
    flex: 1,
  },
  welcome: {
    fontSize: 12,
    color: '#00194C',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00194C',
  },
  cibilScore: {
    alignItems: 'center',
  },
  cibilScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00194C',
  },
  cibilLabel: {
    fontSize: 12,
    color: '#00A2D1',
    fontWeight: 'bold',
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  OngoingButton: {
    backgroundColor: '#2FC603',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
  OngoingText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize:14,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginTop: -10,
  },
  linearGradient: {
    padding: 16,
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    margin: 16,
    marginBottom: 0,
  },
  offerDetails:{
    backgroundColor:'#1849B01A',
    padding:16,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  detailText:{
    color:'#00194c',
    fontSize:14
  },
  flexDetails:{
   flexDirection:'row',
   alignItems:'center'
  },
  orangeText:{
    color:'#ff8500',
    fontWeight:'bold',
    marginRight:5,
  },
  boxShadow:{
    borderWidth: 1,
    borderColor: '#add0ff', 
    shadowColor: '#00274F', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
    backgroundColor:'#ffffff',
    borderRadius:10,
  },
  SpecialofferBadge:{
      backgroundColor:'#FF0000',
      padding:5,
      color:'#fff',
      borderRadius:5,
      textAlign:'center',
      marginBottom:10
  },
  Offertitle:{
    fontSize:14,
    color:'#00194c',
    fontWeight:'bold',
    marginBottom:5,
  },
  specialOfferText:{
    fontSize:14,
    color:'#00194c'
  },
  offerWrapper:{
    padding:16,
    width:'70%',
    minHeight:165,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 8,
  },
  loanOutstanding: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  loanAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 0,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
  },
  emiDetails: {
    fontSize: 12,
    color: '#00194c',
  },
  emiAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    color: '#00194c',
  },
  emiDate: {
    fontSize: 14,
    color: '#00194c',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  payNowButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0010AC',
    borderRadius: 4,
  },
  payNowText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  features: {
    paddingTop: 16,
    marginHorizontal:16
  },
  cardfeature: {
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    minHeight: 150,
    padding: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  Imageicon:{
    width:25,
    height:25,
    marginRight:5
  },
  title: {
    fontSize: 12,
    color: '#000',
    textAlign: 'left',
  },
  bannerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginVertical:20
  },
  bannerImage: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerContent: {
    borderRadius: 8,
    minHeight:150,

  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F00', // Adjust color to match your design
    fontFamily: 'Poppins_700Bold',
  },
  bannerRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00', // Adjust color to match your design
    marginVertical: 8,
    fontFamily: 'Poppins_700Bold',
  },
  bannerSubText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 8,
  },
   availNowButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#0010AC',
    borderRadius: 4,
  },
  avaialNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  applyNowButton: {
    marginTop: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: '#00194c',
    borderRadius: 8,
    position:'absolute',
    left:10,
    bottom:15
  },
  applyNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    fontSize:12
  },
  flexFeature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    position:'relative',
  },
  
  offerBadge: {
    backgroundColor: 'red',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    width: '68%',
  },
  offerText: {
    color: 'white',
    fontSize: 8,
    lineHeight: 16
  },
  imageGalleryContainer: {
    flexDirection: 'row',
    paddingBottom:20,
    marginHorizontal:16,
    borderRadius:10,
    shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  },
  videoContainer: {
    width: width * 0.8,
    height: width * 0.5,
    marginRight: 10,
    overflow: 'hidden',
    borderRadius:10,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius:10
  },
  loanOutstandingDetails: {
    marginTop: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 25,
    borderRadius: 7.5,
  },
  background: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    zIndex: 2,
    justifyContent: 'center',
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'center',
    zIndex: -1
  },
  Featurebackground: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  cardContainer: {
    marginHorizontal: 5,
    marginBottom:5,
    borderRadius:10
  },
  featureBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    height: 150, 
  },
  imageStyle: {
    borderRadius: 10,
  },
  cardFeature: {
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    padding: 10,
    width: '100%',
    height: '100%',
  },
  flexFeature: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  offerBadge: {
    backgroundColor: '#FF0000',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    width:'70%',
  },
  offerText: {
    color: '#fff',
    fontSize: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00194c',
    marginTop: 10,
    fontFamily: 'Poppins_700Bold',
  },
  QucikCardcontainer:{
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Add elevation for Android
    elevation: 5,
  },
  applicationProgressCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth:1,
    borderColor:'#ccc'
  },
  applicationProgressTitle: {
    paddingTop:16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00194c',
    marginBottom: 10,
    textAlign:'center'
  },
  progressStepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    position: 'relative',
    flexGrow:1,
    marginTop:15
  },
  progressStep: {
    alignItems: 'center',
    width: '25%',
    zIndex: 10,
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D0E4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    zIndex:10
  },
  completedStepIcon: {
    backgroundColor: '#4CAF50',
  },
  stepLabel: {
    fontSize: 12,
    color: '#00194c',
    textAlign: 'center',
  },
  stepConnector: {
    height: 2,
    flex: 1,
    position: 'absolute',
    top: 11,
    left: '11%',
    right: '11%',
    zIndex:-1,
    backgroundColor: '#D0E4FE',
  },
  // completedConnector: {
  //   backgroundColor: '#32CD32',
  // },
  // pendingConnector: {
  //   backgroundColor: '#00187A29',
  // },
  loanDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#1849B01A',
    padding:16,
  },
  loanDetailLabel: {
    fontSize: 12,
    color: '#00194c',
  },
  loanDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00194c',
  },
  PLImage:{
    position:'absolute',
    width:160,
    height:180,
    right:-110
  },
  // home screen style ends
  //LoanDetails Screen Style starts
  loanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#3C5078',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  flexContainer:{
    backgroundColor:'#ffffff'
  },
  loanDetails: {
    flex: 1,
  },
  loanType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins_700Bold',
  },
  loanSubText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
  loanAccount: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 4,
    marginBottom: 8,
  },
  StageloanAmount: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 4,
  },
  loanMeta: {
    alignItems: 'flex-start',
  },
  loanDuration: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 8,
  },
  loanDurationValue: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
  },
  statusButton: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  statusButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  loanList: {
    paddingBottom: 16,
  },
  emptyTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  emptyTabText: {
    fontSize: 16,
    color: '#FAFAFA',
  },
  tabBar: {
    backgroundColor: '#00194C',
  },
  indicator: {
    backgroundColor: '#FF8800',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform:"capitalize",
    fontFamily: 'Poppins_700Bold',
  },
  //LoanDetails Screen Style ends
  // LoanStage screen style starts
  content: {
    padding: 16,
    backgroundColor:'#ffffff',
  },
  congratulations: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00194C',
    marginBottom: 2,
    fontFamily: 'Poppins_700Bold',
  },
  BriefsubText: {
    fontSize: 14,
    color: '#00236D',
    marginBottom: 20,
  },
  LoanStageloanInfo: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  loanStagebackground:{
    width: 'auto',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    zIndex: 2,
    justifyContent: 'center',
    padding:10
  },
  LoanStageloanAmount: {
    fontSize: 14,
    color: '#00194C',
  },
  LoanStageamount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00194C',
    fontFamily: 'Poppins_700Bold',
    marginTop: 4,
  },
  roi: {
    backgroundColor: '#00194C',
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
    width: 100,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    textAlign: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    color: '#00194C',
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#00274F',
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#ABBDD8',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
    height:'51%',
    marginBottom:10
  
  },
  stageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stageIconContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  stageIcon: {
    marginRight: 16,
    marginBottom:16
  },
  LoanStageverticalLine: {
    width: 2,
    height: 42,
    backgroundColor: '#D3D3D3',
    opacity:0.7,
    position: 'absolute',
    top: 23,
    left: 9,
  },
  stageDetails: {
    flex: 1,
    marginLeft: 5,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    color: '#00194C',
  },
  stageDescription: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  stageDate: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  continueButton: {
    backgroundColor: '#00194C',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  ContinuebuttonWrapper: {
    padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  //Loanstage screen style ends
  // Individual loan details style starts
  redirectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#ffffff', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd', 
    shadowColor: '#00000029', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
  },
  redirectItemText: {
    fontSize: 16,
    fontWeight: 'bold', 
    color: '#002B5B',
    fontFamily: 'Poppins_700Bold',
  },
  IndividualtabBar: {
    flexDirection: 'row',
    paddingHorizontal:16,
    backgroundColor:'#00194c',
    justifyContent:'space-between',
    flex:1,
    width:'100%'
  },
  activeTab: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ff8500', 
    paddingVertical: 15,
    textTransform:"capitalize"
  },
  tab: {
    fontSize: 16,
    color: '#888', 
    paddingVertical: 15,
    textTransform:"capitalize"
  },
  marginRight:{
    marginRight:15
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal:5,
    marginVertical: 5,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  transactionSuffix: {
    fontSize: 12,
    color: '#66C03D',
  },
  formattedAmount:{
    marginRight:10
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00236D', 
    fontFamily: 'Poppins_700Bold',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#8796B7',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionBalanceContainer:{
    flexDirection:'row',
    alignItems:'baseline'
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00194C',
  },
  creditAmount: {
    color: '#2FC603',
  },
  debitAmount: {
    color: '#DD0000',
  },
  transactionBalance: {
    fontSize: 14,
    color: '#8796B7', 
  },
  transactionType:{
    fontSize:14,
    fontWeight:"bold",
    marginLeft:2,
    fontFamily: 'Poppins_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    padding:16
    
  },
  TransactionCloseModal:{
    flexDirection:'row',
    display:'flex',
    justifyContent:'flex-end',
    marginBottom:10
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopEndRadius:10,
    borderTopStartRadius:10
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  modalBody: {
    borderWidth: 1,
    borderColor: '#D0E4FE', 
    shadowColor: '#D0E4FE', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
    backgroundColor:'#ffffff',
    borderBottomEndRadius:10,
    borderBottomStartRadius:10,
    padding:16
  },
  modalDate: {
    fontSize: 14,
    color: '#fff',
  },
  modalTitle: {
    fontSize: 12,
    color: '#00236D',
    marginBottom: 5,
  },
  modalText: {
    fontSize: 14,
    color: '#00236D',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  modalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00236D',
    fontFamily: 'Poppins_700Bold',
  },
  modalTitleTransactionDetails:{
    fontSize: 12,
    color: '#00236D',
    marginBottom:10
  },
  modalTextTransanctionId:{
    fontSize:12,
    color:'#8796B7',
    marginBottom:10
  },
  downArrow:{
    width:24,
    height:24,
    borderWidth:1,
    borderColor:'#2FC603',
    borderRadius:100,
    textAlign:'center',
    marginRight:10,
    paddingTop:3
  },
  upArrow:{
    width:24,
    height:24,
    borderWidth:1,
    borderColor:'#DD0000',
    borderRadius:100,
    textAlign:'center',
    marginRight:10,
    paddingTop:3
  },
  TrasactionBriefDetails:{
    display:'flex',
    justifyContent:'space-between',
    flexDirection:'row',
    alignItems:'flex-end',
    borderBottomWidth:1,
    borderColor:'#00000029',
    paddingVertical:5,
    marginBottom:10
  },
  CreditedDetails:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-end',
    marginTop:4
  },
  modalTextBankName:{
    fontSize:9,
    color:'#8796B7',
  },
  bankIcon:{
    marginRight:5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00194C',
    marginBottom: 15,
    fontFamily: 'Poppins_700Bold',
  },
  DownloadDocWrapper:{
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#B3B9E1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 10,
    padding:16,
    backgroundColor:'#ffffff'
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical:10
  },
  documentItemText: {
    fontSize: 16,
    color: '#002B5B',
  },
  downloadMessage: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadMessageText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
//Individual loan details screen style ends
//Loan Overview screen style starts

table: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: '#fff',
  borderBottomWidth:0,
  borderLeftWidth:0,
},
row: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#D2DEF7',
},
cell: {
  flex: 1,
  fontSize: 14,
  color: '#00194c',
  borderLeftWidth:1,
  borderColor:'#D2DEF7',
  paddingVertical: 10,
  paddingHorizontal: 15,
},
oddRow:{
  backgroundColor:'#EFF4FF'
},
searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 16,
  paddingBottom:0,
  marginTop:10
},
searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth:1,
  borderColor:'#B3B9E1',
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 0,
  flex: 1,
  marginRight: 10,
},
searchInput: {
  flex: 1,
  padding: 5,
  fontSize: 14,
  color: '#808499',
},
filterButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#E0E7FF',
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 8,
},
filterButtonText: {
  fontSize: 16,
  color: '#00194C',
  marginRight: 5,
},
loanOverviewTableLabel:{
  fontWeight:'600',
  textAlign:'left',
  paddingHorizontal:20,
  fontWeight:'bold'
},
loanOverviewTableValue:{
  textAlign:'left',
  paddingHorizontal:20
},
RepaymentApplybuttonWrapper: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  padding: 16,
  backgroundColor: 'white', // or any color that matches your design
},
RepaymentapplyNowButton: {
  backgroundColor: '#00194C',
  padding: 15,
  borderRadius: 5,
  alignItems: 'center',
},
RepaymentapplyNowButtonText: {
  fontSize: 16,
  color: '#fff',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
safeArea: {
  flex: 1,
  backgroundColor:'#fff'
},
keyboardAvoidingView: {
  flex: 1,
  backgroundColor:'#fff'
},
scrollView: {
  flex: 1,
},
scrollViewContent: {
  flexGrow: 1,
  paddingBottom: 80, // Add padding to account for the fixed button
},
//Loan Overview screen style ends
//Pre-disbursal screen style starts
Chargescard: {
  padding: 20,
  backgroundColor: '#fff',
  borderBottomStartRadius: 10,
  borderBottomEndRadius:10,
  elevation: 3,
},
Chargesheader: {
  alignItems: 'center',
  marginBottom: 20,

},
overdueCard:{
  padding:20,
  borderTopStartRadius: 10,
  borderTopEndRadius:10,
},
redOverdueCard:{
  backgroundColor:'#DD0000',
},
blueOverdueCard:{
  backgroundColor:'#00194c'
},
ChargesoverdueAmount: {
  fontSize: 14,
  color: '#fff',
},
Chargesamount: {
  fontSize: 24,
  color: '#ffffff',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
ChargesrepaymentDateWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth:1,
  borderColor:'#ffffff',
  borderRadius: 5,
  width:'auto',
  margin:'auto'
},
ChargesrepaymentDateLabel: {
  color: '#ffffff',
  fontSize: 14,
  borderRightWidth:1,
  borderColor:'#fff',
  padding: 10,
},
ChargesrepaymentDate: {
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  padding: 10,
},
Chargesdetails: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
},
ChargesdetailText: {
  fontSize: 14,
  color: '#00194c',
},
ChargesdetailValue: {
  fontSize: 14,
  color: '#00194c',
  fontWeight: 'bold',
},
Chargesdivider: {
  height: 1,
  backgroundColor: '#ccc',
  marginVertical: 10,
},
ChargestotalWrapper: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
ChargestotalLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
blueText:{
  color: '#00194c',
},
redText:{
  color: '#DD0000',
},
ChargestotalAmount: {
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  color: '#DD0000',
},
//Pre-disbursal screen style ends
//Loan repayment screen style starts
repaymentFlex:{
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'space-between'
},
DownloadButton:{
  backgroundColor:'#0010AC',
  paddingVertical:5,
  paddingHorizontal:15,
  borderRadius:10,
  marginBottom:15   
},
downloanButtonText:{
  fontSize:12,
  color:'#ffffff'
}, 
tableHeader: {
  flexDirection: 'row',
  backgroundColor: '#00194C',
  padding: 10,
},
headerCell: {
  flex: 1,
  color: '#fff',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  textAlign: 'center',
  paddingVertical:8,
},
tableRow: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#B3B9E1',
},
cell: {
  flex: 1,
  textAlign: 'center',
  color: '#00194c',
  paddingVertical:8,
  borderLeftWidth:1,
  borderLeftColor:'#B3B9E1',
},
statusPaid: {
  color: '#2FC603',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
statusOverdue: {
  color: '#DD0000',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
statusDue: {
  color: '#FCAC00',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
statusUpcoming: {
  color: '#1E90FF',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
statusPending: {
  color: '#00194c',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
//loan repayment screen style ends
//Request Document screen style starts
RDcard:{
  marginVertical: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
},
documentRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#EFF5FF',
},
documentInfo: {
  flex: 1,
},
documentName: {
  fontSize: 14,
  color: '#00194c',
},
documentNote: {
  fontSize: 12,
  color: '#DD0000',
},
documentStatus: {
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  textDecorationLine:'underline'
},
//Request Document screen style ends
//Profile screen style starts
infoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
},
Personallabel: {
  fontWeight:'600',
  color: '#00194C',
},
Personalvalue: {
  color: '#00194C',
},
Personaltitle:{
  color:'#00194C',
  fontSize:18,
  fontWeight:'bold',
  paddingVertical:10,
  borderBottomWidth:1,
  borderColor:'#EFF5FF',
  marginBottom:15
},
perasonalCard:{
  padding:20
},
//Profile screen style ends
//General screen style starts
settingRow:{
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'space-between',
  marginBottom:15,
},
ScreenLocklabel:{
  color:'#00194C',
  fontWeight:'bold',
  fontFamily: 'Poppins_700Bold',
  fontSize:16
},
//General screen style ends
//About us screen style starts
section: {
  marginBottom: 20,
},
Sectiontitle: {
  fontSize: 20,
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  marginBottom: 10,
  color: '#00194c',
},
Sectioncard: {
  backgroundColor: '#ffffff',
  padding: 15,
  borderRadius: 10,
  elevation: 2,
},
description: {
  fontSize: 14,
  color: '#333',
  lineHeight: 23,
},
SecinfoRow: {
  marginBottom: 10,
},
SecinfoLabel: {
  fontSize: 14,
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  color: '#00194c',
},
SecinfoValue: {
  fontSize: 14,
  color: '#666',
},
socialMediaContainer: {
  flexDirection: 'row',
  marginTop: 10,
},
socialIcon: {
  marginRight: 15,
},
secInput:{
  borderBottomWidth:1,
  borderColor:'#EFF5FF',
  paddingVertical:10
},
//About us screen style ends
//Notification screen style starts
Notificationtab: {
  flex: 1,
  padding: 15,
  alignItems: 'center',
},
NotificationactiveTab: {
  borderBottomWidth: 2,
  borderBottomColor: '#ff8500',
},
NotificationtabText: {
  fontSize: 16,
  color: '#aaa',
},
NotificationactiveTabText: {
  color: '#ffffff',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
notificationCard: {
  flexDirection: 'row',
  backgroundColor: '#ffffff',
  padding: 15,
  marginVertical: 5,
  marginHorizontal: 5,
  borderRadius: 10,
  elevation: 2,
},
notificationImage: {
  width: 50,
  height: 50,
  marginRight: 10,
},
notificationContent: {
  flex: 1,
},
notificationMessage: {
  fontSize: 14,
  color: '#00194c',
  fontWeight:'600',
},
notificationAction: {
  fontSize: 14,
  color: '#758BFD',
  textDecorationLine:'underline',
  fontWeight:'600'
},
notificationDate: {
  fontSize: 12,
  color: '#A2ACC6',
  marginTop: 5,
},
noNotificationsContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
noNotificationsIcon: {
  marginBottom: 20,
},
noNotificationsText: {
  fontSize: 18,
  color: '#00194c',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
//Notification screen style ends
//repayment screen style starts
repaymentheader: {
  fontSize: 14,
  marginBottom: 10,
  color: '#00194C',
},
repaymentloanId: {
  fontSize: 14,
  color: '#00194C',
  fontWeight:'bold',
  marginBottom: 20,
},
repaymentsection: {
  marginBottom: 20,
},
repaymentsectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 10,
},
repaymentsectionTitle: {
  fontSize: 16,
  color: '#00194C',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
repaymentsectionContent: {
  paddingVertical: 10,
  borderRadius: 5,
},
repaymentdetailText: {
  flexDirection:'row',
  justifyContent:'space-between'
},
repaymentTextdetail:{
  fontSize: 14,
  color: '#333',
  marginBottom: 5,
},
repaymentamountInput: {
  backgroundColor: '#C8CEEB',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
  fontSize: 16,
  color: '#808499',
},
payButton: {
  backgroundColor: '#00194C',
  padding: 15,
  borderRadius: 5,
  alignItems: 'center',
},
payButtonText: {
  fontSize: 16,
  color: '#fff',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
spaceBetween:{
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center'
},
paymentdetails:{
  width:'92%',
  marginLeft:'auto'
},
repaymentcustomamountInput:{
  backgroundColor:'#FAFAFA',
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
  fontSize: 16,
  color: '#00194c',
  borderWidth:1,
  borderColor:'#B3B9E1'
},
buttonWrapper: {
 flex:1,
 justifyContent:'flex-end',
 width:'90%',
 marginHorizontal:'auto',
 marginVertical:15
},

Viewflex: {
  flex: 1,
  backgroundColor:'#ffffff'
},
repaymentcustomamountInputFocused: {
  borderColor: '#FF8500', // highlight color
},
flexDirectionRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
overdueText: {
  color: 'red',
  fontSize: 14,
  marginLeft: 5,
  fontStyle:'italic',
},
//repayment screen style ends
//payment method screen style starts
gatewayOption: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},
gatewayLogo: {
  marginLeft: 10,
  height: 24,
  resizeMode: 'contain',
},
payButtonActive: {
  backgroundColor: '#00194C',
},
payButtonInactive: {
  backgroundColor: '#BDCEF0',
},
smallheader: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 10,
  fontFamily: 'Poppins_700Bold',
  color: '#00194C',
},
//payment method scree style ends
//No loan screen style starts
noLoansContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 16,
  backgroundColor:'#ffffff',
},
noLoansImage: {
  width:300,
  height: 200,
  marginVertical: 20,
},
noLoansTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  marginBottom: 10,
  textAlign: 'center',
  fontWeight:'bold',
  color:'#00194C'
},
noLoansSubtitle: {
  fontSize: 12,
  textAlign: 'center',
  marginBottom: 20,
  color:'#00194C',
  lineHeight:20
},
noLoanapplyNowButton: {
  backgroundColor: '#00194C',
  paddingVertical: 10,
  borderRadius: 5,
},
noLoanapplyNowButtonText: {
  color: '#fff',
  fontSize: 16,
  textAlign:'center'
},
CircleRight:{
  width:20,
  height:20,
  borderWidth:1,
  borderColor:'#ff8500',
  borderRadius:100,
  flexDirection:'column',
  alignItems:"center",
  justifyContent:'center',
  textAlign:'center',
},
//No loan screen style ends
//Loan Eligibility Calculator screen style starts

//Loan Eligibility Calculator screen style ends
//Amortization Schedule screen style starts
AmortizationScheduleheader: {
  paddingTop: 20,
  paddingHorizontal: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
AmortizationScheduleheaderTitle: {
  color: '#00194c',
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
},
tableHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#00194c',
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: '#00194c',
},
tableHeaderText: {
  color: '#fff',
  fontSize: 14,
  width: '20%',
  textAlign: 'center',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  paddingVertical: 10,
  borderRightWidth: 1,
  borderRightColor: '#00194c',
},
AmortizationSchedulecell: {
  fontSize: 14,
  color: '#00194c',
  width: '20%',
  textAlign: 'center',
  paddingVertical: 10,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderBottomColor: '#B3B9E1',
  borderRightColor: '#B3B9E1',
},
firstCell: {
  borderLeftWidth: 1,
  borderLeftColor: '#B3B9E1',
},
lastCell: {
  borderRightWidth: 1,
  borderRightColor: '#B3B9E1',
},
noborderRight:{
  borderRightWidth:0
},

//Amortization schedule screen style ends
//LOan Pre disbursal charges screen style starts
pdctable: {
  marginVertical: 10,
  borderWidth: 0.1,
  borderColor: '#ccc',
  borderRadius: 5,
},
pdctableHeader: {
  flexDirection: 'row',
  backgroundColor: '#00194c',
  borderTopLeftRadius: 5,
  borderTopRightRadius: 5,
},
pdctableHeaderText: {
  flex: 1,
  color: '#fff',
  fontWeight: 'bold',
  fontFamily: 'Poppins_700Bold',
  textAlign: 'center',
  fontSize: 14,
  paddingVertical: 10,
  paddingHorizontal: 5,
  borderWidth: 0.6,
  borderColor: '#ccc',
},
pdctableRow: {
  flexDirection: 'row',
},
pdctableCell: {
  flex: 1,
  fontSize: 12,
  paddingVertical: 10,
  paddingHorizontal: 5,
  textAlign: 'center',
  borderTopWidth: 0,
  borderLeftWidth: 0.6,
  borderRightWidth: 0.6,
  borderBottomWidth: 0.6,
  borderColor: '#ccc',
},
textLeft: {
  textAlign: 'left',
},
errorContainer: {
  backgroundColor: 'red',
  padding: 10,
},
errorText: {
  color: 'white',
  textAlign: 'center',
},
drpdownlabel:{
  color:'#00194C',
  fontSize:14,
  fontWeight:'bold',
  marginBottom:5
},
roundedBorder:{
  borderWidth:1,
  borderColor:'#ff8500',
  borderRadius:100,
  width:20,
  height:20,
  flexDirection:'column',
  alignItems:'center',
  justifyContent:'center',
  textAlign:'center'
},
messageContainer: {
  padding: 10,
  marginBottom: 10,
},
messageText: {
  color: '#fff',
  textAlign: 'center',
},
//LOan pre disbursal charges screen style ends
});