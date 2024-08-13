import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../assets/style/personalStyle';
import { useAppContext } from '../../Common/components/useContext';
import RadioButton from '../components/radioButton';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({ title, children, expanded, setExpanded }) => {
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded();
  };

  const isExpanded = expanded;

  const { fontSize } = useAppContext(); 
  const dynamicFontSize = (size) => size + fontSize;

  return (
    <View>
      <TouchableOpacity style={styles.accordion} onPress={toggleExpand}>
        <Text style={[styles.Accordiontitle,{ fontSize: dynamicFontSize(styles.Accordiontitle.fontSize) }]}>{title} <Text style={styles.mandatoryStar}>*</Text></Text>
        <Icon
          name={isExpanded ? 'minus' : 'plus'}
          size={24}
          color="#ff8500"
          style={{fontWeight:'bold'}}
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.child}>{children}</View>}
    </View>
  );
};



export default Accordion;
