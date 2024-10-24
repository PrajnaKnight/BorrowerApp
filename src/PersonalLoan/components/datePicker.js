import React, { forwardRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { format } from 'date-fns';
import { styles } from '../../assets/style/personalStyle';
import { useAppContext } from '../components/useContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const DatePickerComponent = ({ onDateChange, initialDate, maximumDate, minimumDate, readonly }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(initialDate);
    console.log(currentDate)
    if (onDateChange) {
      onDateChange(currentDate);
      setShow(false);
    }
  };



  const { fontSize } = useAppContext();
  const dynamicFontSize = (size) => size + fontSize;

  return (

    Platform.OS !== "web" ?
      <View>
        {/* Conditional rendering based on `readonly` prop */}
        <TouchableOpacity
          onPress={() => {
            if (!readonly) {
              setShow(true);
            }
          }}
          style={[styles.datePicker, readonly && styles.inputReadOnly]}
        >
          <Text
            style={[styles.dateText, { fontSize: dynamicFontSize(styles.backBtnText.fontSize), color: initialDate ? "black" : "gray" }]}
          >{initialDate ? format(initialDate, 'PPP') : "Date"}</Text>
          <Icon name="calendar" size={16} color={readonly ? "#cccccc" : "#00194c"} style={styles.icon} />
        </TouchableOpacity>


        {/* Only show DateTimePicker if `readonly` is false */}
        {show && !readonly && (


          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(initialDate)}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
        )}
      </View>

      :

      

      <DatePicker
        zIndex={5000}
        customInput={<ExampleCustomInput />}
        selected={new Date(initialDate)}
        maxDate={maximumDate}
        minDate={minimumDate}
        disabled={readonly}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        
        onChange={(e)=>onChange(null, format(e, 'yyyy-MM-dd'))}
        readonly = {readonly}/>

  );
};


const ExampleCustomInput = forwardRef(({ value, onClick , readonly}, ref) => (

  <View>
    {/* Conditional rendering based on `readonly` prop */}
    <TouchableOpacity
      onPress={() => {
        onClick()
      }}
      style={[styles.datePicker, readonly && styles.inputReadOnly]}
      ref={ref}
    >
      <Text
        style={[styles.dateText, { fontSize: 12, color: value ? "black" : "gray" }]}
      >{value ? format(value, 'PPP') : "Date"}</Text>
      <Icon name="calendar" size={16} color={readonly ? "#cccccc" : "#00194c"} style={styles.icon} />
    </TouchableOpacity>

  </View>
));

// export const WebCalendar = () => {
//   const [startDate, setStartDate] = useState(new Date());

//   return (
//     <DatePicker
//       zIndex={5000}
//       customInput={<ExampleCustomInput />}
//       disabledKeyboardNavigation={false}
//       selected={startDate}
//       onChange={(date) => setStartDate(date)} />
//   );
// }

export default DatePickerComponent;
