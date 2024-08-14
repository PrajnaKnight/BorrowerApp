import React, { useState, useEffect } from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from '../../assets/style/personalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { useAppContext } from '../../Common/components/useContext';

const CustomSlider = ({ title, icon, keyboardType, min, max, steps, sliderValue, inputValue, error, onChange, isForAmount }) => {
    const { fontSize } = useAppContext();
    const dynamicFontSize = (size) => size + fontSize;
    const [internalValue, setInternalValue] = useState(sliderValue.toString());

    useEffect(() => {
        setInternalValue(sliderValue.toString());
    }, [sliderValue]);

    const handleTextInputChange = (value) => {
        if (keyboardType === 'numeric' && isNaN(Number(value))) {
            return;
        }

        if (value === '') {
            setInternalValue('');
            onChange(min, 'fromInput'); // Call onChange with the minimum value
        } else {
            const numericValue = Math.max(min, Math.min(max, Number(value)));
            setInternalValue(value);
            onChange(numericValue, 'fromInput');
        }
    };

    const handleSliderChange = (value) => {
        const numericValue = Math.max(min, Math.min(max, value));
        setInternalValue(numericValue.toString());
        onChange(numericValue, 'fromSlider');
    };

    const handleSliderComplete = (value) => {
        const numericValue = Math.max(min, Math.min(max, value));
        setInternalValue(numericValue.toString());
        onChange(numericValue, 'fromSlider');
    };

    return (
        <View style={styles.sliderContainer}>
            <View style={styles.LabelInput}>
                <Text style={[styles.label, { fontSize: dynamicFontSize(styles.label.fontSize) }]}>{title}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Icon name={icon} size={16} color="#00194c" style={{ marginHorizontal: 10 }} />
                    <TextInput
                        style={[styles.Input, { fontSize: dynamicFontSize(styles.Input.fontSize) }]}
                        onChangeText={handleTextInputChange}
                        value={internalValue}
                        keyboardType={keyboardType}
                    />
                </View>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                step={steps || 1}
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSliderComplete}
                value={internalValue === '' ? min : Number(internalValue)} // Use `min` if internalValue is empty
                minimumTrackTintColor="#0010AC"
                maximumTrackTintColor="#758BFD"
                thumbTintColor="#F38F00"
            />
            <View style={styles.sliderLabels}>
                <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>{isForAmount ? `₹${min}` : min}</Text>
                <Text style={[styles.p, { fontSize: dynamicFontSize(styles.p.fontSize) }]}>{isForAmount ? `₹${max}` : max}</Text>
            </View>
            {error && (
                <Text style={[styles.errorText, { paddingHorizontal: 15 }]}>{error}</Text>
            )}
        </View>
    );
};

export default CustomSlider;