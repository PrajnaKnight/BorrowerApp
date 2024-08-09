import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Image, Dimensions, StyleSheet } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const paddingHorizontal = 20;
const adjustedWidth = windowWidth - paddingHorizontal * 2;

const CustomCarousel = ({ data }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);

  // Function to calculate the active slide index
  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / adjustedWidth);
    setActiveSlide(currentIndex);
  };

  // Auto-scroll functionality
  useEffect(() => {
    const scrollNext = () => {
      let nextIndex = activeSlide + 1;
      if (nextIndex === data.length) {
        nextIndex = 0; // Loop back to the start
      }
      scrollViewRef.current?.scrollTo({
        x: adjustedWidth * nextIndex,
        animated: true,
      });
      setActiveSlide(nextIndex); // Ensure the active slide index is updated
    };

    intervalRef.current = setInterval(scrollNext, 3000); // Adjust scroll interval as needed

    return () => clearInterval(intervalRef.current); // Clear interval on component unmount
  }, [activeSlide, data.length]); // Re-run effect if activeSlide or data length changes

  // Render pagination dots
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeSlide === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
      >
        {data.map((item, index) => (
          <View key={index} style={{ width: adjustedWidth, alignItems: 'center', justifyContent: 'center', height:300,  flexDirection:'row' }}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.text}</Text>
          </View>
        ))}
      </ScrollView>
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: adjustedWidth,
    height: 250, // Adjust height as needed
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom:20
  },
  dot: {
    width: 15,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'rgba(255, 136, 0, 1)',
  },
  inactiveDot: {
    backgroundColor: 'rgba(117, 139, 253, 0.92)',
  },
});

export default CustomCarousel;
