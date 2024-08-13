import { StyleSheet, Platform, Dimensions } from "react-native";
import applyFontFamily from "./applyFontFamily";

// Get the device's width and height
const window = Dimensions.get('window');
const deviceWidth = window.width;

const { width, height } = Dimensions.get('window');


// You can create your own "media query" functions
const isSmallDevice = deviceWidth < 768;

export const styles = applyFontFamily({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#F8FAFF",
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
    marginBottom:10
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
    fontWeight: "bold",
    marginLeft: 8,
  },
  accordionContent: {
    padding: 16,
  },
  detailItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
  },
  detailLabel: {
    color: "#666",
    flex: 1,
    width: "50%",
  },
  detailValue: {
    fontWeight: "500",
    flex: 1,
    textAlign: "left",
  },
  tabBar: {
    paddingVertical: 0,
    marginBottom: 10,
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
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
    color: "#fff",
    paddingVertical: 10,
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
    justifyContent: "flex-end",
    flex: 1,
  },
  activeBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00B436",
    marginRight: 6,
  },
  activeStatus: {
    color: "#00B436",
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
    backgroundColor: "#DCE5FF",
    padding: 16,
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
  radioGroup:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // businessSummary styles ends
  //businessEligibility styles starts
  congratsText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  approvalText: {
    marginBottom: 24,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  loanIdcontainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 30,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",  
    color: '#00194c',
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
    fontSize:14,
    color: "#191C35",
  },
  infoSubtext: {
    color: '#666',
    fontSize: 8,
    lineHeight: 10,
  },
  requestMoreButton: {
    backgroundColor: '#FFF5E6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  requestMoreText: {
    color: '#FFA500',
    fontWeight: 'bold',
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
  buttonText:{
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
  Fundscontainer:{
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 20,
    shadowColor: "#E2ECFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  funds:{
    width: 150,
    height: 100,
  },
  Fundstitle:{
    fontSize: 16,
    color: "#00194C",
    fontWeight: "500",
  },
  Fundscontent:{
    width: "55%",
    marginRight: 10,  
  },
  Fundbutton:{
    backgroundColor: "#ff8500",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 5,
  },
  FundbuttonText:{
      color: "#fff",
      fontSize: 14,
      fontWeight: "500",
  },

  //BusinessELigibility ends
});