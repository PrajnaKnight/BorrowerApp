import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import CustomInput from "../../Common/components/ControlPanel/input";
import CustomDropdown from "../../Common/components/ControlPanel/dropdownPicker";
import Layout from "../../Common/components/Layout";
import { styles } from "../../assets/style/msmeStyle";
import ButtonComponent from "../../Common/components/ControlPanel/button";
import RadioButton from "../../Common/components/ControlPanel/radioButton";
import { useNavigation } from "@react-navigation/native";
import { useProgressBar } from "../../Common/components/ControlPanel/progressContext";
import ProgressBar from "../../Common/components/ControlPanel/progressBar";
import { GoBack } from "../../PersonalLoan/services/Utils/ViewValidator";
import MultiSelectDropdown from "../../Common/components/ControlPanel/MultiSelectDropdown";

const BusinessProfileScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isRegisteredWithGSTIN, setIsRegisteredWithGSTIN] = useState(true);
  const [gstinNumbers, setGstinNumbers] = useState([""]);
  const [formData, setFormData] = useState({
    proprietorName: "Leena Lalwani",
    entityName: "Leena Bakes",
    natureOfBusiness: "Customer Service",
    businessMode: "B2B",
    companyType: "Micro",
    primaryIndustry: "10-Manufacture of Food Products",
    subSector: [],
    subClass: [],
  });

  const [subSectorSearch, setSubSectorSearch] = useState("");
  const [filteredSubSectors, setFilteredSubSectors] = useState([]);

  useEffect(() => {
    setFilteredSubSectors(
      dropdownItems.subSector.filter((item) =>
        item.label.toLowerCase().includes(subSectorSearch.toLowerCase())
      )
    );
  }, [subSectorSearch]);

  const [errors, setErrors] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const { setProgress } = useProgressBar();

  useEffect(() => {
    setProgress(0.1); // 10% complete as shown in the image
  }, []);

  // Dropdown items
  const dropdownItems = {
    natureOfBusiness: [
      { label: "Customer Service", value: "Customer Service" },
      { label: "Manufacturing", value: "Manufacturing" },
      { label: "Retail", value: "Retail" },
    ],
    companyType: [
      { label: "Micro", value: "Micro" },
      { label: "Small", value: "Small" },
      { label: "Medium", value: "Medium" },
    ],
    primaryIndustry: [
      {
        label: "10-Manufacture of Food Products",
        value: "10-Manufacture of Food Products",
      },
      {
        label: "11-Manufacture of Bakery Pro...",
        value: "11-Manufacture of Bakery Pro...",
      },
      { label: "12-Manufacture of Bread", value: "12-Manufacture of Bread" },
    ],
    subSector: [
      { label: "1071-Manufacture of Bakery Products", value: "1071" },
      { label: "1072-Manufacture of Sugar", value: "1072" },
      { label: "1073-Manufacture of Coca, Chocolate", value: "1073" },
    ],
    subClass: [
      { label: "1071-Manufacture of Bakery Products", value: "1071" },
      { label: "1072-Manufacture of Sugar", value: "1072" },
      { label: "1073-Manufacture of Coca, Chocolate", value: "1073" },
    ],
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.proprietorName)
      newErrors.proprietorName = "Proprietor Name is required";
    if (!formData.entityName)
      newErrors.entityName = "Business Name is required";
    if (!formData.natureOfBusiness)
      newErrors.natureOfBusiness = "Nature of Business is required";
    if (!formData.businessMode)
      newErrors.businessMode = "Business Mode is required";
    if (!formData.companyType)
      newErrors.companyType = "Company Type is required";
    if (!formData.primaryIndustry)
      newErrors.primaryIndustry = "Primary Industry is required";
    if (formData.subSector.length === 0)
      newErrors.subSector = "At least one Sub Sector is required";
    if (formData.subClass.length === 0)
      newErrors.subClass = "At least one Sub Class is required";
    setErrors(newErrors);
    setIsButtonDisabled(Object.keys(newErrors).length > 0);
  };

  const handleProceed = () => {
    if (!isButtonDisabled) {
      console.log("Form is valid. Proceeding...");
      navigation.navigate("BusinessTypeDetails");
    } else {
      console.log("Form has errors. Please correct them.");
    }
  };

  const renderInputField = (label, field, placeholder, readOnly = false) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <CustomInput
          placeholder={placeholder}
          value={formData[field] || ""}
          onChangeText={(text) => handleInputChange(field, text)}
          error={errors[field]}
          readOnly={readOnly}
        />
      </View>
    );
  };

  const renderDropdownField = (
    label,
    field,
    placeholder,
    multiSelect = false
  ) => {
    return (
      <View style={styles.inputContainer}>
        <CustomDropdown
          label={label}
          value={formData[field]}
          setValue={(value) => handleInputChange(field, value)}
          items={dropdownItems[field]}
          setItems={(items) => {
            /* Handle items update if needed */
          }}
          placeholder={placeholder}
          error={errors[field]}
          searchable={multiSelect}
          zIndex={1000 - Object.keys(dropdownItems).indexOf(field)} // This ensures proper layering
          onOpen={() => {
            setOpenDropdown(field);
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
          }}
          onClose={() => setOpenDropdown(null)}
        />
      </View>
    );
  };

  const handleGSTINChange = (index, value) => {
    const updatedGSTINs = [...gstinNumbers];
    updatedGSTINs[index] = value;
    setGstinNumbers(updatedGSTINs);
  };

  const addGSTINNumber = () => {
    setGstinNumbers([...gstinNumbers, ""]);
  };

  const removeGSTINNumber = (index) => {
    const updatedGSTINs = gstinNumbers.filter((_, i) => i !== index);
    setGstinNumbers(updatedGSTINs);
  };

  const renderGSTINSection = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Registered with GSTIN?</Text>
      <View style={styles.GSTradioGroup}>
        <RadioButton
          label="YES"
          isSelected={isRegisteredWithGSTIN}
          onPress={() => setIsRegisteredWithGSTIN(true)}
        />
        <RadioButton
          label="NO"
          isSelected={!isRegisteredWithGSTIN}
          onPress={() => setIsRegisteredWithGSTIN(false)}
        />
      </View>
      {isRegisteredWithGSTIN && (
        <View>
          {gstinNumbers.map((gstin, index) => (
            <View
              key={index}
              style={[
                styles.gstinInputContainer,
                index > 0 && styles.gstinInputContainerDelete,
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.label}>GSTIN Number</Text>
                {index > 0 && (
                  <TouchableOpacity
                    style={styles.gstdeleteButton}
                    onPress={() => removeGSTINNumber(index)}
                  >
                    <Text style={styles.gstdeleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
              <CustomInput
                placeholder="Enter GSTIN Number"
                value={gstin}
                onChangeText={(text) => handleGSTINChange(index, text)}
              />
            </View>
          ))}
          <TouchableOpacity
            style={styles.addGSTINButton}
            onPress={addGSTINNumber}
          >
            <Text style={styles.addGSTINButtonText}>Add GSTIN Number</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <Layout>
      <View style={{ padding: 16, backgroundColor: "#ffffff" }}>
        <ProgressBar progress={0.4} />
        <View style={styles.TOpTitleContainer}>
          <Text style={[styles.TitleText]}>Business Information</Text>
          <Text style={styles.pageIndex}>
            <Text style={styles.IndexActive}>3</Text>/4
          </Text>
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {renderInputField(
          "Proprietor Name",
          "proprietorName",
          "Proprietor Name",
          true
        )}
        {renderInputField("Business Name", "entityName", "Business Name", true)}
        {renderDropdownField(
          "Nature of Business",
          "natureOfBusiness",
          "Select Nature of Business"
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Business Mode</Text>
          <View style={styles.radioGroup}>
            {["B2B", "B2C", "B2G", "B2B2C"].map((mode) => (
              <RadioButton
                key={mode}
                label={mode}
                isSelected={formData.businessMode === mode}
                onPress={() => handleInputChange("businessMode", mode)}
              />
            ))}
          </View>
          {renderGSTINSection()}
        </View>
        {renderDropdownField(
          "Company Type",
          "companyType",
          "Select Company Type"
        )}
        {renderDropdownField(
          "Primary Industry",
          "primaryIndustry",
          "Search Primary Industry"
        )}
        <MultiSelectDropdown
          label="Sub Sector"
          items={dropdownItems.subSector}
          selectedItems={formData.subSector}
          onItemsChange={(items) => handleInputChange("subSector", items)}
          placeholder="Search Sub Sector"
          chipLabel={(item) => item}
        />
        <MultiSelectDropdown
          label="Sub Class"
          items={dropdownItems.subClass}
          selectedItems={formData.subClass}
          onItemsChange={(items) => handleInputChange("subClass", items)}
          placeholder="Search Sub Class"
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => GoBack(navigation)}
        >
          <Text style={[styles.cancelButtonText]}>Back</Text>
        </TouchableOpacity>
        <View style={styles.proceedButtonContainer}>
          <ButtonComponent
            title="PROCEED"
            onPress={handleProceed}
            disabled={isButtonDisabled}
            style={{
              button: styles.proceedButton,
            }}
            disabledStyle={{
              button: styles.disabledProceedButton,
            }}
            containerStyle={styles.proceedButtonContainer}
          />
        </View>
      </View>
    </Layout>
  );
};

export default BusinessProfileScreen;
