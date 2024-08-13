import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import { useAppContext } from '../components/useContext';
import MaskInput from 'react-native-mask-input';
import { FlatList } from 'react-native';
import { ListViewBase } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 

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
    <View style={{width:widthPercentage}}>
      <View >
        <TextInput

          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            (readOnly || cityOrState) && styles.inputReadOnly, // Apply read-only style if readOnly is true
            style, { fontSize: dynamicFontSize(styles.input.fontSize) }
          ]}
          onEndEditing={(e) => { onEndEditing != null ? onEndEditing(e) : null }}
          onChangeText={readOnly ? null : onChangeText} // Disable onChangeText if readOnly
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          placeholderTextColor="gray"
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value || ""}
          editable={!readOnly} // Make input non-editable if readOnly is true
        />
      </View>

      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>
      )}
    </View>

  );
};



export const CustomInputFieldWithSuggestion = ({ style, onFocusChange, placeholder, keyboardType, secureTextEntry, onChangeText, maxLength, readOnly, value, cityOrState = false, error, autoCapitalize, onEndEditing, listOfData }) => {
  const [isFocused, setIsFocused] = useState(false);

  const [isLastSelected, setIsLastSelected] = useState(false)

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



  const CompanyItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item)} style={{ paddingHorizontal: 4, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "black" }}>

      <Text>{item.Value}</Text>

    </TouchableOpacity>
  );

  const handleItemClick = (item) => {
    console.log("Item clicked:", item.Value);
    onChangeText(item.Value)
    setIsLastSelected(true)
    // You can perform any action here when an item is clicked
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <TextInput

          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            readOnly || cityOrState && styles.inputReadOnly, // Apply read-only style if readOnly is true
            style, { fontSize: dynamicFontSize(styles.input.fontSize) }
          ]}
          onEndEditing={(e) => { onEndEditing != null ? onEndEditing(e) : null }}
          onChangeText={(e) => {
            if (readOnly == true) {
              return null
            }

            if (isLastSelected == false) {
              onChangeText(e)
            }
            else {
              setIsLastSelected(false)
            }

          }} // Disable onChangeText if readOnly
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          placeholderTextColor="gray"
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value}
          editable={!readOnly} // Make input non-editable if readOnly is true
        />
      </View>

      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>
      )}

      {!isLastSelected  && listOfData != null && listOfData.length > 0 && value != null && value.length>0 &&
        <FlatList
          data={listOfData}
          nestedScrollEnabled={true}
          style={{
            width: "100%", maxHeight: 400, borderWidth: 1, borderColor: "black", borderRadius: 10, zIndex: 100
          }
          }
          renderItem={({ item }) => <CompanyItem item={item} onPress={handleItemClick} />}
          keyExtractor={(item, index) => index.toString()}
        />
      }
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
          placeholder={placeholder}
          placeholderTextColor="gray"
          keyboardType={keyboardType}
          maxLength={maxLength}
          value={value}
          editable={!readOnly} // Make input non-editable if readOnly is true
          mask={[[/\d/], [/\d/], [/\d/], [/\d/], [/\d/], [/\d/], [/\d/], [/\d/], /\d/, /\d/, /\d/, /\d/]}

        />
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
        <MaskInput

          style={[
            styles.input,
            style, { fontSize: dynamicFontSize(styles.input.fontSize) }
          ]}

          onChangeText={onDateChange} // Disable onChangeText if readOnly
          placeholder={placeholder}
          placeholderTextColor="gray"
          keyboardType={"numeric"}
          value={initialDate?.includes("-") ? reverseDateFormat(initialDate) : initialDate}
          mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}

        />
      </View>

      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>
      )}
    </View>

  );
};



export const CustomInputFieldWithSearchSuggestionForEmplymentDetails = ({value, error, style, listOfData, onChangeText, placeholder}) =>{


  const [isFocused, setIsFocused] = useState(false);


  const [suggestionList, setSuggestionList] = useState(listOfData)

  const [showList, setShowList] = useState(false)


  // Handle focus only if not read-only
  const handleFocus = () => {
    
      setIsFocused(true);
    
  };



  // Handle blur only if not read-only
  const handleBlur = () => {
    
      setIsFocused(false);
    
  };

  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;



  const CompanyItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item)} style={{ paddingHorizontal: 4, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "black" }}>

      <Text>{item.value}</Text>

    </TouchableOpacity>
  );

  const handleItemClick = (item, isLastSearch) => {
    console.log("Item clicked:", item);
    onChangeText(item)

   
    let listOfCompany = []
    listOfData?.forEach(element => {
      console.log(element)
      if(element.value.includes(item)){
        listOfCompany.push(element)
      }
    });
  
    console.log(listOfCompany)
    setSuggestionList(listOfCompany)
    
    if(!isLastSearch){
      setShowList(false)
    }
    


    // You can perform any action here when an item is clicked
  };


  useEffect(()=>{
    if(showList){
      setSuggestionList(listOfData)
    }
    else{
      setSuggestionList([])
    }
  },[showList])

  return (
    <View style={{ flex: 1 }}>

      <View >
      <TextInput  
          onTouchEndCapture={()=>{setShowList(!showList)}}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            style, { fontSize: dynamicFontSize(styles.input.fontSize) }
          ]}
          onChangeText={(e) => {
           
              handleItemClick(e, true)
        

          }} // Disable onChangeText if readOnly
          onFocus={handleFocus}
          onBlur={handleBlur}
          
          placeholder={placeholder}
          placeholderTextColor="gray"
          
    
          value={value}
        />


      </View>
        
      

      {error && (
        <Text style={[styles.errorText, { fontSize: dynamicFontSize(styles.errorText.fontSize) }]}>{error}</Text>
      )}

      {showList &&
        <FlatList
          data={suggestionList}
          nestedScrollEnabled={true}
          style={{
            width: "100%", maxHeight: 400, borderWidth: 1, borderColor: "black", borderRadius: 10, zIndex: 100
          }
          }
          renderItem={({ item }) => <CompanyItem item={item} onPress={(e)=>handleItemClick(e.value, false)} />}
          keyExtractor={(item, index) => index.toString()}
        />
      }

    </View>

  );
}

export default CustomInput;
