import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import { useAppContext } from '../components/useContext';
import DropDownPicker from 'react-native-dropdown-picker';
import MaskInput from 'react-native-mask-input';
import { FlatList } from 'react-native';
import { ListViewBase } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { isValidField } from '../services/Utils/FieldVerifier';

const CustomInput = ({ style, onFocusChange, placeholder, keyboardType, secureTextEntry, onChangeText, maxLength, readOnly, value, cityOrState = false, error, autoCapitalize, onEndEditing, widthPercentage = "100%" }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle focus only if not read-only
  const handleFocus = () => {
    if (!readOnly) {
      setIsFocused(true);
      if (onFocusChange) onFocusChange(true);
    }
  };

  // Handle blur only if not read-only
  const handleBlur = () => {
    if (!readOnly) {
      setIsFocused(false);
      if (onFocusChange) onFocusChange(false);
    }
  };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;


  return (
    <View style={{ width: widthPercentage }}>
      <View>

        {!readOnly && isValidField(value) != null &&

          <Text style={styles.inputPlaceholder}>
            {placeholder}
          </Text>
        }
        <TextInput

          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            (readOnly) && styles.inputReadOnly, // Apply read-only style if readOnly is true
            { fontSize: dynamicFontSize(styles.input.fontSize) }
          ]}
          onEndEditing={(e) => { onEndEditing != null ? onEndEditing(e) : null }}
          onChangeText={readOnly ? null : onChangeText} // Disable onChangeText if readOnly
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value || ""}
          editable={!readOnly} // Make input non-editable if readOnly is true
        />

        {readOnly && isValidField(value) != null &&

          <Text style={styles.inputPlaceholder}>
            {placeholder}
          </Text>
        }
      </View>

      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>
      )}
    </View>

  );
};



export const CustomInputFieldWithSuggestion = ({
  value,
  error,
  style,
  listOfData,
  onChangeText,
  placeholder,
  onFocusChange,
  keyboardType,
  secureTextEntry,
  maxLength,
  readOnly,
  cityOrState,
  autoCapitalize,
  onEndEditing
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const [suggestionList, setSuggestionList] = useState(listOfData);
  const [showList, setShowList] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;
  // Handle focus only if not read-only
  const handleFocus = () => {
    if (!readOnly) {
      setIsFocused(true);
      if (onFocusChange) onFocusChange(true);
    }
  };

  // Handle blur only if not read-only
  const handleBlur = () => {
    if (!readOnly) {
      setIsFocused(false);
      if (onFocusChange) onFocusChange(false);
    }
  };



  const CompanyItem = ({ item, onPress, isSelected }) => (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: isSelected ? "#758BFD" : 'transparent',
      }}
    >
      <Text style={{
        color: isSelected ? '#FFFFFF' : '#333',
        fontSize: dynamicFontSize(14),
        fontFamily: 'Poppins_400Regular',

      }}>{item.Value}</Text>

    </TouchableOpacity>
  );

  const handleItemClick = (item) => {
    setInputValue(item.Value);
    onChangeText(item.Value);
    setShowList(false);
  };

  const handleInputChange = (text) => {
    setInputValue(text);
    onChangeText(text);

    if (text.length > 0) {
      const filteredList = listOfData?.filter(item =>
        item.Value.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestionList(filteredList);
      setShowList(true);
    } else {
      setShowList(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        {!readOnly && isValidField(value) != null &&

          <Text style={styles.inputPlaceholder}>
            {placeholder}
          </Text>
        }
        <TextInput
          onTouchEndCapture={() => !readOnly && setShowList(!showList)}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            (readOnly || cityOrState) && styles.inputReadOnly,
            style,
            { fontSize: dynamicFontSize(styles.input.fontSize) }
          ]}
          secureTextEntry={secureTextEntry}
          onChangeText={handleInputChange}
          onEndEditing={onEndEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={inputValue}
          editable={!readOnly}
        />
        {readOnly && isValidField(value) != null &&

          <Text style={styles.inputPlaceholder}>
            {placeholder}
          </Text>
        }
      </View>

      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>
      )}

      {showList && !readOnly && (
        <FlatList
          data={suggestionList}
          nestedScrollEnabled={true}
          style={{
            width: "100%",
            maxHeight: 200,
            borderWidth: 1,
            borderColor: '#D7DDEB',
            borderRadius: 5,
            marginTop: -10,
            backgroundColor: '#FFFFFF',
            zIndex: 100,
          }}
          renderItem={({ item }) => (
            <CompanyItem
              item={item}
              onPress={handleItemClick}
              isSelected={item.Value === inputValue}
            />
          )}

          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>

  );
};


export const AadharMaskedCustomInput = ({ style, onFocusChange, placeholder, keyboardType, onChangeText, maxLength, readOnly, value, error, autoCapitalize, onEndEditing }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle focus only if not read-only
  const handleFocus = () => {
    if (!readOnly) {
      setIsFocused(true);
      if (onFocusChange) onFocusChange(true);
    }
  };

  // Handle blur only if not read-only
  const handleBlur = () => {
    if (!readOnly) {
      setIsFocused(false);
      if (onFocusChange) onFocusChange(false);
    }
  };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  return (
    <View style={{ flex: 1 }}>
      <View>

        {!readOnly && isValidField(value) != null &&

          <Text style={styles.inputPlaceholder}>
            {placeholder}
          </Text>
        }
        <MaskInput

          style={[
            styles.input,
            isFocused && styles.inputFocused,
            readOnly && styles.inputReadOnly, // Apply read-only style if readOnly is true
            style, { fontSize: dynamicFontSize(styles.input.fontSize) }
          ]}
          showObfuscatedValue
          obfuscationCharacter="X"
          onChangeText={readOnly ? null : onChangeText} // Disable onChangeText if readOnly
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value}
          editable={!readOnly} // Make input non-editable if readOnly is true
          mask={isValidField(value) == null && [[/\d/], [/\d/], [/\d/], [/\d/], [/\d/], [/\d/], [/\d/], [/\d/], /\d/, /\d/, /\d/, /\d/]}

        />

        {readOnly && isValidField(value) != null &&

          <Text style={styles.inputPlaceholder}>
            {placeholder}
          </Text>
        }
      </View>

      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>
      )}
    </View>

  );
};


export const DateOfJoiningMaskedCustomInput = ({
  style, error, onDateChange, initialDate, placeholder = "DD/MM/YYYY" }) => {

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;
  const [value, setValue] = useState(initialDate)

  function reverseDateFormat() {
    // Check if the date string contains a "-" character
    if (!value?.includes("-")) {
      return value; // Return the original string if the format is not as expected
    }

    const dateParts = value.split("-");
    if (dateParts.length === 3) {
      // Reverse the array and join with "/"
      return dateParts.reverse().join("/");
    }

    return value; // Return the original string if the format is not as expected

  }

  useEffect(() => {

    console.log("reloading")
    // setValue(reverseDateFormat())

  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View >

        {isValidField(initialDate) &&
          <Text style={styles.inputPlaceholder}>
            {placeholder}
          </Text>
        }
        <MaskInput

          style={[
            styles.input,
            style, { fontSize: dynamicFontSize(styles.input.fontSize) }
          ]}

          onChangeText={onDateChange} // Disable onChangeText if readOnly
          keyboardType={"numeric"}
          value={initialDate?.includes("-") ? reverseDateFormat(initialDate) : initialDate}
          mask={!isValidField(initialDate) && [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}

        />
      </View>

      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>
      )}
    </View>

  );
};



export const CustomDropDownWithSearch = ({ value, error, style, listOfData, onChangeText, placeholder }) => {


  const [isFocused, setIsFocused] = useState(false);


  const [suggestionList, setSuggestionList] = useState(listOfData);
  const [showList, setShowList] = useState(false);


  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;



  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const CompanyItem = ({ item, onPress, isSelected }) => (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: isSelected ? "#758BFD" : 'transparent',
      }}
    >
      <Text style={{
        color: isSelected ? '#FFFFFF' : '#333',
        fontSize: dynamicFontSize(14),
        fontFamily: 'Poppins_400Regular',
      }}>{item.value}</Text>

    </TouchableOpacity>
  );

  const handleItemClick = (item) => {
    onChangeText(item);
    setShowList(false);
  };

  const handleInputChange = (text) => {
    onChangeText(text);
    const filteredList = listOfData?.filter(item =>
      item.value.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestionList(filteredList);
    setShowList(true);
  };


  useEffect(() => {
    if (showList) {
      setSuggestionList(listOfData)
    }
    else {
      setSuggestionList([])
    }
  }, [showList])

  return (
    <View style={{ flex: 1 }}>

      <View >
        {isValidField(value) &&

          <Text style={styles.inputPlaceholder}>
            {placeholder}
          </Text>
        }
        <TextInput
          onTouchEndCapture={() => setShowList(!showList)}
          style={[
            styles.input,
          ]}
          onChangeText={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}


          value={value}
        />


      </View>



      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(12) }]}>{error}</Text>
      )}

      {showList && (<FlatList
        data={suggestionList}
        nestedScrollEnabled={true}
        style={{
          width: "100%",
          maxHeight: 200,
          borderWidth: 1,
          borderColor: '#D7DDEB',
          borderRadius: 5,
          marginTop: -10,
          backgroundColor: '#FFFFFF',
          zIndex: 100,
        }}
        renderItem={({ item }) => (
          <CompanyItem
            item={item}
            onPress={(e) => handleItemClick(e.value)}
            isSelected={item.value === value}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      )}


    </View>

  );
}

export default CustomInput;
