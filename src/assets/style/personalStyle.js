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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F8FAFF",
    ...Platform.select({
      web: {
        width: "100%",
        alignSelf: "center",
      },
    }),
  },

  finalResultConatiner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F8FAFF",
    ...Platform.select({
      web: {
        marginTop: 40,
      },
    }),
  },
  dropdownBorder: {
    borderColor: "#ccc",
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 0,
    borderColor: "transparent",
    color: "#00194c",
    fontSize: 14,
    backgroundColor: "#fff",
    zIndex: 9000,
  },
  TopBar: {
    ...Platform.select({
      web: {
        zIndex: 100,
      },
    }),
  },
  logoContainer: {
    alignItems: "start",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      web: {
        marginVertical: 0,
        alignItems: "center",
      },
    }),
  },
  goBackButton: {
    marginRight: 10,
  },
  logo: {
    width: 130, // Set the width of your logo
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "left",
    color: "#00194c",
    lineHeight: 24,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    height: 40,
    borderRadius: 5,
    flexDirection: "row",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#00194c",
  },
  proceedButtonContainer: {
    marginTop: 20,
  },
  TopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 5000,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...Platform.select({
      // Additional, web-specific styles
      web: {
        paddingHorizontal: 20,
        backgroundColor: "#00194c",
        width: "100%",
        margin: "auto",
        right: 0,
        left: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
      },
    }),
  },
  boldText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00194C",
  },
  LinearGradient: {
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    ...Platform.select({
      web: {
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: "#0056b3",
        },
      },
    }),
  },
  addbutton: {
    //backgroundColor: '#00194c',
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  text: {
    color: "#FFFFFF", // Text color
    fontSize: 16, // Text size
  },
  proceedButtonContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: "#ffffff",
    // ...Platform.select({
    //   web: {
    //     position: 'fixed',
    //     bottom: '10px',
    //     left: 0,
    //     right: 0,
    //     boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    //     maxWidth: '1200px',
    //     width: '100%',
    //     margin:'auto',
    //     paddingHorizontal:20,
    //     paddingVertical:10
    //   },
    // }),
  },
  LabelInput: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Input: {
    width: 150,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "transparent",
    backgroundColor: "#EBEFFF",
    color: "#000000",
    fontSize: 16,
    textAlign: "center",
    ...Platform.select({
      web: {
        outline: "none",
        "&:focus": {
          borderColor: "#0056b3",
        },
      },
    }),
  },
  inputFocused: {
    borderColor: "#00194C",
  },
  listItemLabel: {
    color: "#2E2E22", // Example color
  },

  listItemContainer: {
    // Style for the container of each option
    padding: 10, // Example padding
    backgroundColor: "#fffffff",
    opacity: 1,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D8DFF2",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontWeight:"400",
    fontSize: 14,
    color: "#00194C",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  carouselItem: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    height: 250,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  Carouselimage: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  link: {
    color: "#758BFD",
    textDecorationLine: "underline",
    fontWeight: "bold",
    fontSize: 14,
  },
  checkbox: {
    marginRight: 10,
    borderColor: "#00194C99",
    borderRadius: 5,
    borderWidth: 1,
  },
  tc: {
    marginTop: 20,
    width: "90%",
    marginLeft: 10,
  },
  p: {
    fontSize: 12,
    color: "#00194c",
    marginBottom: 10,
    lineHeight: 22,
  },
  modalp: {
    fontSize: 12,
    color: "#00194C",
    marginBottom: 10,
    lineHeight: 20,
  },
  modalH: {
    color: "#00194c",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalH2: {
    color: "#00194c",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  subpoints: {
    marginLeft: 10,
  },
  Modaltitle: {
    color: "#00194c",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  accepBtn: {
    paddingHorizontal: 20,
  },
  acceptBtnWrapper: {
    display: "flex",
    marginTop: 30,
    marginBottom: 20,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 14,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  buttonEnabled: {
    backgroundColor: "#002777",
    opacity: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#EDF1FE",
    borderColor: "#EDF1FE",
    color: "#BED3FF",
    opacity: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonEnabledText: {
    color: "#ffffff",
  },
  buttonDisabledText: {
    color: "#BED3FF",
  },
  flexContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00194C",
  },
  WebheaderText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    marginBottom: 15,
  },

  phoneNumber: {
    fontSize: 16,
    marginBottom: 10,
    color: "#00194c",
    fontWeight: "bold",
  },
  timer: {
    fontSize: 16,
    color: "#FF8600",
    marginLeft:10
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    ...Platform.select({
      web: {
        justifyContent: "flex-start",
      },
    }),
  },
  otpInput: {
    width: 60,
    height: 50,
    borderColor: "#A2ACC6",
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 5,
    fontSize: 14,
    ...Platform.select({
      web: {
        marginRight: 5,
      },
    }),
  },
  resendText: {
    marginVertical: 10,
    color: "#00194C",
    fontSize: 16,
  },
  resendButtonText: {
    color: "#758BFD",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  addAnotherBank: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#758BFD",
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  skipbuttonpress: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  backBtnText: {
    color: "#758BFD",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  verifyButton: {
    backgroundColor: "#2B478B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#2B478B",
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  proceedbutton: {
    backgroundColor: "#00194c",
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: "#00194c",
    borderRadius: 5,
  },
  progressBarBackground: {
    height: 5,
    width: "100%",
    backgroundColor: "#E2ECFF",
    borderRadius: 5,
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#213ACE",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  errorMessageStyle: { textAlign: "center", color: "red" },
  errorBorder: {
    borderColor: "red",
  },
  header: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  customBtn: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#FF8600",
    borderRadius: 5,
    width: "48.5%",
  },
  customBtnText: {
    color: "#ff8500",
    textAlign: "center",
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  orWrapper: {
    position: "relative",
    borderColor: "#DDE5FF",
    borderBottomWidth: 1,
    borderRadius: 0,
    marginVertical: 30,
    zIndex: 9,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  or: {
    position: "absolute",
    left: "45%",
    backgroundColor: "#DDE5FF",
    color: "#00194c",
    textAlign: "center",
    marginVertical: 0,
    marginHorizontal: "auto",
    zIndex: 99,
    borderRadius: 100,
    width: 35,
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 14,
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingBottom: 60,
    ...Platform.select({
      web: {
        paddingBottom: 100,
      },
    }),
  },
  circle: {
    height: 23,
    width: 23,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00194C99",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedCircle: {
    height: 23,
    width: 23,
    borderRadius: 20,
    borderColor: "#ff8500",
    backgroundColor: "#ff8500",
  },
  InlineGender: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  outerCircle: {
    height: 23,
    width: 23,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#A2ACC6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedOuterCircle: {
    borderColor: "#A2ACC6",
  },
  selectedInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#ff8500",
  },
  radioLabel: {
    fontSize: 16,
    color: "#00194C",
  },
  datePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
  },
  icon: {
    fontSize:14,
  },
  flexContentTime: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  accordion: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#CCCCCC",
    flexDirection: "row", // Align title and icon horizontally
    justifyContent: "space-between", // Space between title and icon
    alignItems: "center", // Center items vertically
  },
  Accordiontitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00194C",
  },
  child: {
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  InlineInput: {
    width: "49%",
  },
  formEmp: {
    zIndex: 1000,
    marginBottom: 20,
  },
  frmOccupation: {
    zIndex: 900,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    color: "#00194C",
    fontWeight: "bold",
    marginBottom: 20,
  },
  employmentWrapper: {
    paddingBottom: 60,
  },
  deleteButtonText: {
    color: "#758BFD",
    fontSize: 16,
  },
  deleteButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
  },
  statusMessage: {
    fontSize: 14,
    marginTop: 0,
    marginBottom: 10,
  },
  match: {
    color: "green",
  },
  noMatch: {
    color: "red",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#00194C",
  },
  descriptionAmt: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ff8500",
  },
  marginBtm: {
    marginBottom: 10,
  },
  loanId: {
    fontSize: 16,
    lineHeight: 24,
    color: "#00194C",
    fontWeight: "bold",
    marginVertical: 10,
  },
  readonly: {
    backgroundColor: "#00194C1A",
    color: "#00194C",
  },
  detailContainer: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#D5E3FF",
    borderRadius: 5,
  },
  detailRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
    borderBottomColor: "#D5E3FF",
  },
  detailLabel: {
    fontSize: 14,
    color: "#00194C",
    backgroundColor: "#f8f9ff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: "50%",
    textTransform: "capitalize",
  },
  detailValue: {
    fontSize: 14,
    color: "#00194C",
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "left",
  },
  downloadButton: {
    backgroundColor: "#00194c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  documentSection: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    padding: 16,
    paddingBottom: 30,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 5,
    color: "#00194c",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#ffffff",
    zIndex: 3000,
    position: "relative",
    ...Platform.select({
      web: {
        padding: 10,
        backgroundColor: "#ffffff",
      },
    }),
  },
  pickerContainerDrpdwn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
    width: "100%",
    zIndex: 4000,
    backgroundColor: "#ffffff",
    position: "relative",
    ...Platform.select({
      web: {
        padding: 10,
        backgroundColor: "#ffffff",
        zIndex: 4000,
      },
    }),
  },
  picker: {
    width: "100%",
    fontSize: 14,
    ...Platform.select({
      web: {
        borderWidth: 0,
        backgroundColor: "transparent",
      },
    }),
  },
  carouselContainer: {
    ...Platform.select({
      web: {
        bakgroundSize: "auto",
      },
    }),
  },
  ScrollImage: {
    ...Platform.select({
      web: {
        bakgroundSize: "auto",
      },
    }),
  },
  uploadButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  fileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addButtonContainer: {
    marginTop: 20,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  downloadSamplebutton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
  downloadSamplebuttonText: {
    color: "#758BFD",
    padding: 10,
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  signbuttonText: {
    color: "#ffffff",
  },
  uploadButtonNach: {
    borderWidth: 1,
    borderColor: "#FFBB70",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  uploadButtonNachText: {
    fontSize: 16,
    color: "#FF8600",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
  },
  checkboxLabel: {
    flex: 1,
    color: "#00194c",
    fontSize: 14,
    lineHeight: 20,
  },
  ImageContainer: {
    width: "100%",
    marginVertical: 10,
  },
  agreebutton: {
    padding: 10,
    backgroundColor: "#00194c",
    width: "100%",
    borderRadius: 5,
  },
  finalContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "65%",
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  accountContainer: {
    paddingBottom: 20,
  },
  loanLabel: {
    color: "#00194c",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resendButtonDisabled: {
    color: "#D1D9EF",
    opacity: 0.5,
  },
  inputReadOnly: {
    backgroundColor: "#E5ECFC",
    color: "#00194c",
    borderColor: "#D8DFF2",
  },
  paddingBottom: {
    paddingBottom: 20,
  },
  webViewContainer: {
    height: 480, // Adjust the height as needed
    width: "100%",
    marginBottom: 10,
  },
  webView: {
    flex: 1,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  iconButton: {
    width: 25,
    height: 25,
    borderRadius: 4,
    marginEnd: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 14,
    color: "#00194c",
    fontWeight: "normal",
  },
  bellIcon: {
    color: "#00194c",
    ...Platform.select({
      web: {
        color: "#ffffff",
      },
    }),
  },
  infoIcon: {
    color: "#00194c",
    ...Platform.select({
      web: {
        color: "#ffffff",
      },
    }),
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  drpDownWrapper: {
    marginLeft: 5,
  },
  center: {
    textAlign: "center",
  },
  mandatoryStar: {
    color: "red",
    fontSize: 14,
  },
  focusedInput: {
    borderColor: "#00194c",
    borderWidth: 1,
  },
  downloadIcon: {
    borderWidth: 1,
    borderRadius: 5,
    height: 25,
    borderColor: "#ff8500",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    textAlign: "center",
    padding: 5,
    marginRight: 10,
  },
  deleteIcon: {
    borderWidth: 1,
    borderRadius: 5,
    height: 25,
    borderColor: "red",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    textAlign: "center",
    padding: 5,
  },
  RadioWrapper: {
    marginBottom: 20,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF1FE",
    borderRadius: 5,
  },
  iconStyle: {
    marginRight: 5,
    backgroundColor: "#758BFD",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  inputStyle: {
    fontSize: 14,
  },
  wrapiNput: {
    marginBottom: 10,
  },
  decoration: {
    color: "#758BFD",
    textDecorationLine: "underline",
    textDecorationColor: "#758BFD",
  },
  agreeButtonDisabled: {
    opacity: 0.5,
  },
  disursecontent: {
    backgroundColor: "#EDF1FE",
    borderRadius: 8,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusIcon: {
    marginTop: -50,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  bannerImage: {
    flex: 1,
    justifyContent: "flex-end",
    marginVertical: 50,
  },
  banner: {
    width: "100%",
    margin: "auto",
  },
  disburseamount: {
    fontSize: 46,
    color: "#00194c",
    fontWeight: "bold",
    marginVertical: 10,
  },
  disburseSentence: {
    fontSize: 16,
    color: "#00194c",
    marginTop: 10,
  },
  disbuseItemDetails: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF1FE",
  },
  disbuseItem: {
    color: "#00194C",
    fontSize: 16,
    paddingVertical: 10,
  },
  mandate: {
    color: "#758BFD",
    fontSize: 14,
    textDecorationLine: "underline",
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 10,
  },
  transerfferedDetails: {
    borderWidth: 1,
    borderColor: "#00194C66",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    color: "#00194C",
    fontSize: 16,
    padding: 5,
    marginBottom: 10,
  },
  transferDetails: {
    color: "#00194C",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  transferInfo: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  LAproceedButtonContainer: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
  },
  optional: {
    fontSize: 12,
    color: "#ff8500",
    fontStyle: "italic",
  },
  tablecontainer: {
    borderWidth: 1,
    borderColor: "#D5E3FF",
    borderBottomWidth: 0,
    borderRadius: 5,
    marginVertical: 20,
  },
  tablerow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D5E3FF",
  },
  tablelabel: {
    backgroundColor: "#EDF1FE",
    padding: 10,
    color: "#00194C",
    width: "50%",
  },
  tablevalue: {
    padding: 10,
    color: "#00194C",
  },
  Note: {
    fontSize: 14,
    color: "#00194C",
    lineHeight: 20,
    textAlign: "center",
    marginVertical: 10,
  },
  infoIcon: {
    borderWidth: 1,
    borderColor: "#00194C",
    borderRadius: 50,
    width: 25,
    height: 25,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    lineHeight: 25,
    ...Platform.select({
      web: {
        padding: 9,
        color: "#ffffff",
        borderColor: "#ffffff",
      },
    }),
  },
  modalView: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: "#fff",
  },
  modalHeader: {
    backgroundColor: "#00194c",
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  faqsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  faqClose: {
    width: 70,
    display: "flex",
    alignItems: "flex-end",
    marginRight: 15,
  },
  searchBar: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 8,
    paddingLeft: 10,
    marginHorizontal: 10,
    marginVertical: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  faqQuestion: {
    fontWeight: "bold",
  },
  faqAnswerContainer: {
    padding: 20,
  },
  faqAnswer: {
    color: "#333",
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#FF6347",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  leftContainer: {
    ...Platform.select({
      web: {
        // backgroundColor:'#c9d9fa',
        backgroundColor: "#000565",
      },
    }),
  },
  rightCOntainer: {
    ...Platform.select({
      web: {
        backgroundColor: "#ffffff",
      },
    }),
  },
  mainContainer: {
    ...Platform.select({
      web: {
        width: "85%",
        marginHorizontal: "auto",
        backgroundColor: "#f1f1f1",
        flex: 1,
        alignSelf: "center",
        paddingTop: 70,
        paddingBottom: 10,
        flexDirection: "column",
      },
    }),
    ...(isSmallDevice && {
      width: "100%",
      paddingTop: 0,
      paddingBottom: 0,
    }),
  },
  webheader: {
    alignItems: "center",
    marginBottom: 20,
  },
  websubtitleText: {
    fontSize: 16,
    color: "#fff",
  },
  webinterestButton: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  webinterestText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  webfeaturesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  webfeature: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0F158D",
    borderRadius: 5,
    padding: 15,
    width: "32.33%",
  },
  webfeatureIcon: {
    fontSize: 40,
    marginBottom: 5,
    display: "flex",
    color: "#fff",
  },
  webfeatureText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 12,
  },
  webdescription: {
    alignItems: "center",
    paddingTop: 20,
  },
  webdescriptionText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  weblinkText: {
    color: "#758BFD",
    textDecorationLine: "underline",
  },
  mincontainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  featureIcon: {
    color: "#ffffff",
  },
  bottomFixed: {
    position: "absolute",
    bottom: 10,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
  },
  interestButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  interestText: {
    color: "#fff",
    textAlign: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  feature: {
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 24,
    color: "#0056B3",
  },
  featureText: {
    textAlign: "center",
    color: "#666",
  },
  // description: {
  //   fontSize: 16,
  //   marginVertical: 20,
  //   paddingHorizontal: 20,
  // },
  descriptionText: {
    textAlign: "center",
    color: "#666",
  },
  linkText: {
    color: "#0056B3",
    textAlign: "center",
    marginTop: 10,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#DDE5FF",
  },
  permissionText: {
    flex: 1,
    marginLeft: 10,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00194C",
  },
  permissionDesc: {
    fontSize: 12,
    color: "#00194C",
  },
  permissionAlert: {
    alignItems: "center",
    marginVertical: 20,
  },
  permissionAlertText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#FF6200",
  },
  permissionAlertDesc: {
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
  },
  Nextbutton: {
    backgroundColor: "#0056B3",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop: "auto",
  },
  permissionContainer: {
    flex: 1,
  },
  permissionDialog: {
    backgroundColor: "#f1f1f1",
    padding: 20,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  permissionDialogText: {
    fontSize: 16,
    marginVertical: 10,
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  dialogButtonText: {
    fontSize: 16,
    color: "#0056B3",
  },
  permissionAlert: {
    alignItems: "center",
    marginVertical: 20,
  },
  permissionAlertText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#FF6200",
  },
  permissionAlertDesc: {
    textAlign: "center",
    color: "#666",
    marginVertical: 10,
  },
  Gotobutton: {
    backgroundColor: "#0056B3",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginTop: "auto",
  },

  permissionDialog: {
    backgroundColor: "#f1f1f1",
    padding: 20,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    zIndex: 1,
    ...Platform.select({
      web: {
        width: "50%",
        alignItems: "center",
        position: "absolute",
        top: null,
        left: null,
        right: null,
      },
    }),
  },
  permissionDialogText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 10,
  },
  dialogButtonText: {
    fontSize: 16,
    color: "#0056B3",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 1,
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D5E3FF",
  },
  tableHeader: {
    fontSize: 14,
    color: "#00194c",
    backgroundColor: "#EDF1FE",
    padding: 10,
    width: "60%",
  },
  firstChild: {
    borderTopLeftRadius: 10,
  },
  lastChild: {
    borderBottomLeftRadius: 10,
  },
  tableData: {
    fontSize: 14,
    color: "#00194c",
    padding: 10,
  },
  initiateButton: {
    display: "flex",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignItems: "center",
  },
  inputIcon: {
    backgroundColor: "#758BFD",
    marginBottom: 10,
    padding: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  urlText: {
    color: "#758BFD",
    textDecorationLine: "underline",
    textDecorationColor: "#758BFD",
  },
  webViewContainer: {
    height: "70vh",
    width: "100%",
    marginBottom: 20,
  },

  webViewContainerMobile: {
    height: "50vh",
    width: "100%",
    marginBottom: 20,
  },
  IconClose: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#00194c",
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
  },
  wifiIcon: {
    color: "red",
  },
  CloseIcon: {
    color: "#00194c",
  },
  webViewWrapper: {
    height: height * 0.6, // 60% of total screen height
    width: width * 0.9, // 90% of total screen width
    borderWidth: 1,
    borderColor: "#00194c",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    ...Platform.select({
      web: {
        width: "100%",
      },
    }),
  },

  webViewContent: {
    flex: 1,
    ...Platform.select({
      web: {
        width: "100%",
        height: "100%",
      },
    }),
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "relative",
  },
  stepHeaderText: {
    flex: 1,
    marginLeft: 10,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00194c",
  },
  stepContent: {
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  verticalLine: {
    position: "absolute",
    left: 7,
    top: 35,
    bottom: -25,
    width: 2,
    zIndex: -4,
  },
  stepIcon: {
    zIndex: 1,
    position: "relative",
  },
  downloadButton: {
    backgroundColor: "#00194c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#00194c",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  DownloadBtnWrapper: {
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,
    marginBottom: 15,
  },
  signMandate: {
    marginTop: 10,
  },
  uploadedDocName: {
    marginVertical: 10,
    alignItems: "center",
  },
  uploadedDoc: {
    fontSize: 14,
    color: "#00194C",
  },
  // new css after merge
  gradientButton:{
    shadowColor: "#8AADE2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor:'#2B478B'
  },
  GrayBorder: {
    borderColor: "#E5ECFC",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#E5ECFC'
  },
  BlueBorder: {
    borderColor: "#2B478B",
    borderWidth: 1,
     borderRadius: 8,
  },
  buttonDisabledText: {
    color: "#B2C2EE",
  },
  buttonEnabledText: {
    color: "#FFF",
  },
  boxShadow: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
    padding: 16,
  },
  //new css after merge
});
