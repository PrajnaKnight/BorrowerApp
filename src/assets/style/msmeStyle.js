import { StyleSheet, Platform, Dimensions } from "react-native";
import applyFontFamily from "./applyFontFamily";
import { PositionError } from "react-native-geolocation-service";
import { colors } from "react-native-swiper-flatlist/src/themes";

// Get the device's width and height
const window = Dimensions.get('window');
const deviceWidth = window.width;

const { width, height } = Dimensions.get('window');
const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 40) / 3; 


// You can create your own "media query" functions
const isSmallDevice = deviceWidth < 768;

export const styles = applyFontFamily({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#ffffff",
  },
  TitleText: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "500",
    color: "#00194C",
  },
  subText: {
    lineHeight: 20,
    fontSize: 16,
    color: "#00194c",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#00194c",
    marginBottom: 10,
  },
  businessTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  businessTypeButton: {
    borderWidth: 1,
    borderColor: "#E5ECFC",
    backgroundColor: "#E5ECFC",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 6,
  },
  businessTypeButtonActive: {
    backgroundColor: "#2B478B",
  },
  businessTypeText: {
    textAlign: "center",
    color: "#B2C2EE",
    fontSize: 12,
  },
  businessTypeTextActive: {
    color: "#fff",
  },
  requiredStar: {
    color: "red",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#758BFD",
    borderRadius: 5,
    paddingVertical: 10,
    width: "48%",
  },
  proceedButtonContainer: {
    width: "48%",
  },
  cancelButtonText: {
    color: "#758BFD",
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // businessSummary styles starts
  sceneContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  accordionContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#fff",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#DCE5FF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#B3B9E1",
    paddingVertical: 16,
  },
  accordionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  primaryText: {
    color: "#00B436",
    marginHorizontal: 8,
    fontWeight: "bold",
  },
  gstinContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  gstinText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
    color: "#00194c",
  },
  accordionContent: {
    padding: 16,
  },
  gstinDetailsContainer: {
    borderWidth: 1,
    borderColor: "#B3B9E1",
    borderRadius: 5,
    marginTop: 10,
    overflow: "hidden",
  },

  detailItem: {
    flexDirection: "row",
    paddingHorizontal: 6,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#B3B9E1",
  },
  firstDetailItem: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  lastDetailItem: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomWidth: 0,
  },
  detailLabel: {
    color: "#00194C",
    flex: 1,
    width: "50%",
    fontSize: 12,
    fontWeight: "500",
    paddingVertical: 6,
  },
  detailValue: {
    flex: 1,
    textAlign: "left",
    fontSize: 12,
    paddingVertical: 6,
    color: "#00194C",
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#B3B9E1",
  },
  evenItem: {
    backgroundColor: "#ffffff",
  },
  oddItem: {
    backgroundColor: "#D2DEF7",
  },
  tabBar: {
    paddingVertical: 0,
    marginBottom: 10,
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    borderBottomColor: "transparent",
  },
  tabIndicator: {
    backgroundColor: "#FF8600",
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  agreementText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: "#00194c",
  },
  accodionRightIcon: {
    backgroundColor: "#ff8500",
    padding: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 8,
  },
  setPrimaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  setPrimaryText: {
    fontSize: 16,
    color: "#00194C",
  },
  activeStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: "#B3B9E1",
    paddingLeft: 10,
  },
  activeBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00B436",
    marginRight: 5,
  },
  activeStatus: {
    color: "#00B436",
    paddingLeft: 0,
    borderLeftWidth: 0,
  },
  multilineValue: {
    textAlign: "left",
  },
  gstinValue: {
    color: "#FF8500",
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00B436",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#00B436",
  },
  setPrimaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  primaryText: {
    color: "#00B436",
    fontSize: 12,
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  udyamContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#fff",
  },
  udyamText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00194c",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  udyamDetailsContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#00194c",
    fontWeight: "500",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  // businessSummary styles ends
  //businessEligibility styles starts
  congratsText: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  approvalText: {
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: "center",
  },
  loanIdcontainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#A2ACC6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#A2ACC6",

  },
  loanIdiconContainer: {
    backgroundColor: "#FF9800",
    padding: 10,
    marginRight: 8,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  loanIdicon: {
    fontSize: 18,
  },
  loanId: {
    fontSize: 14,
    color: "#00194c",
    fontWeight: "bold",
  },
  loanIdValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff8500",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#00194c",
    marginBottom: 4,
  },
  infoValueContainer: {
    borderWidth: 1,
    borderColor: "#00194C",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoValue: {
    fontSize: 14,
    color: "#191C35",
  },
  infoSubtext: {
    color: "#666",
    fontSize: 8,
    lineHeight: 10,
  },
  requestMoreButton: {
    backgroundColor: "#FFF5E6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  requestMoreText: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  addAnotherBank: {
    flex: 1,
    justifyContent: "flex-end",
  },
  addbutton: {
    //backgroundColor: '#00194c',
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  mandatoryStar: {
    color: "red",
    fontSize: 14,
  },
  deleteButtonText: {
    color: "#ff8500",
    fontSize: 14,
    fontWeight: "bold",
  },
  Fundscontainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  funds: {
    width: 150,
    height: 100,
  },
  Fundstitle: {
    fontSize: 16,
    color: "#00194C",
    fontWeight: "500",
  },
  Fundscontent: {
    width: "55%",
    marginRight: 10,
  },
  Fundbutton: {
    backgroundColor: "#ff8500",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 5,
  },
  FundbuttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  //BusinessELigibility ends
  TOpTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageIndex: {
    fontSize: 16,
    color: "#D8DFF2",
    fontWeight: "500",
  },
  IndexActive: {
    color: "#ff8500",
  },
  tableContainer: {
    marginBottom: 20,
    marginHorizontal: 16,
  },
  tableWrapper: {
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#B3B9E1",
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 6,
    color: "#00194C",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#00246E",
  },
  tableHeaderText: {
    fontWeight: "500",
    color: "#ffffff",
    padding: 6,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  evenRow: {
    backgroundColor: "#FFFFFF",
  },
  oddRow: {
    backgroundColor: "#F0F4FF",
  },
  tableCell: {
    fontSize: 12,
    color: "#00194c",
    alignItems: "center",
    padding: 6,
  },
  nicColumn: {
    width: 50,
  },
  descriptionColumn: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: "#B3B9E1",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  noDataText: {
    fontSize: 24,
    color: "#00194C",
    marginTop: 10,
  },
  oddRowTable: {
    backgroundColor: "#ffffff",
  },
  optionalLabel: {
    fontSize: 10,
    color: "#FF8500",
    marginLeft: 5,
    fontStyle: "italic",
    marginBottom: 8,
    lineHeight: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 15,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#00194C",
    marginVertical: 10,
    backgroundColor: "#ffffff",
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    marginRight:10,
  },

  activeOwnerName:{
    color:"#FF8500",
    fontWeight:'500',
  },
  //Tabs styles
  tabContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  Addresstab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#E5ECFC",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  AddressActivetab: {
    backgroundColor: "#002777",
  },
  AdresstabText: {
    fontSize: 16,
    color: "#B2C2EE",
  },
  AdressActivetabText: {
    color: "#ffffff",
  },
  formContainer: {
    flex: 1,
  },
  addressForm: {
    marginTop: 15,
  },
  accountIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  accountIcon: {
    height: 50,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedAccountIcon: {
    borderColor: "#000565",
  },
  deleteIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 10,
  },
  addAccountIcon: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#2B478B",
    justifyContent: "center",
    alignItems: "center",
  },
  PDtabContainer:{
    flexDirection: 'row',
    marginBottom: 16,
  },
  PDtab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 8,
  },
  PDselectedTab: {
    backgroundColor: '#000565',
  },
  PDtabText: {
    color: '#000565',
    fontWeight: '500',
  },
  PDselectedTabText: {
    color: '#FFFFFF',
  },
  idTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  idTypeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8DFF2',
    width: '30%',
  },
  selectedIdType: {
    backgroundColor: '#000565',
  },
  idTypeText: {
    marginTop: 4,
    color: '#000565',
    fontSize: 12,
  },
  selectedIdTypeText: {
    color: '#FFFFFF',
  },
  gstinInputContainer: {
    marginBottom: 10, 
  },
  gstinInputContainerDelete:{
    backgroundColor:'#fffaf5',
    padding:16,
    borderRadius:8,
  },
  gstdeleteButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  gstdeleteButtonText: {
    color: '#ff8500',
  },
  addGSTINButton: {
    alignItems: 'center',
    marginBottom:16
  },
  addGSTINButtonText: {
    color: '#758BFD',
    fontSize: 14,
    fontWeight:'500'
  },
  GSTradioGroup:{
    flexDirection:'row',  
    alignItems:'center',
    marginBottom:16
  },
  match:{
    color:'#00B436'
  },
  noMatch:{
    color:'red'
  },
  statusMessage:{
   fontSize:12,
   marginBottom:10,
  
  },
  // personal documents styles statrs
  applicantTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  applicantTab: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor:'#000',
    shadowOffset:{width:0,height:2},  
    shadowOpacity:0.25,
    shadowRadius:3.84,  
    elevation:5,
  },
  applicantTabText: {
    color: '#000080',
    fontWeight: 'bold',
  },
  selectedApplicantTabText: {
    color: '#ff8500',
  },
  PDtabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  PDtab: {
    flex: 1,
    padding: 10,
    backgroundColor: '#E5ECFC',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  PDselectedTab: {
    backgroundColor: '#2B478B',
  },
  PDtabText: {
    color: '#000080',
    fontWeight: 'bold',
  },
  PDselectedTabText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 10,
    color:'#00194c',
    fontWeight:'500'
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
  carouselItem: {
    width: cardWidth - 10,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeCarouselItem: {
    backgroundColor: '#00194c',
  },
  carouselItemText: {
    marginTop: 5,
    fontSize: 12,
    color: '#00194c',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeCarouselItemText: {
    color: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 3,
  },
  activePaginationDot: {
    backgroundColor: '#FF8800',
    width: 16,
    borderRadius: 8,
  },
  // personal documents styles ends
  datePickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 14,
    color: '#00194c',
    marginBottom: 5,
    fontWeight:'500',
  },
  dateButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 15,
    color: '#1F2937',
  },
});