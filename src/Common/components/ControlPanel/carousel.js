import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Image, Dimensions, StyleSheet } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const paddingHorizontal = 20;
const adjustedWidth = windowWidth - paddingHorizontal * 2;

const CustomCarousel = ({ data }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / adjustedWidth);
    setActiveSlide(currentIndex);
  };

  useEffect(() => {
    const scrollNext = () => {
      let nextIndex = activeSlide + 1;
      if (nextIndex === data.length) {
        nextIndex = 0;
      }
      scrollViewRef.current.scrollTo({
        x: adjustedWidth * nextIndex,
        animated: true,
      });
      setActiveSlide(nextIndex);
    };

    intervalRef.current = setInterval(scrollNext, 3000);

    return () => clearInterval(intervalRef.current);
  }, [activeSlide, data.length]);

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
          >
            {activeSlide === index && <View style={styles.activeDotInner} />}
          </View>
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
          <View key={index} style={styles.slide}>
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
  slide: {
    width: adjustedWidth,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    flexDirection: 'row',
  },
  image: {
    width: adjustedWidth,
    height: 250,
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
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    borderWidth: 1,
    borderColor: 'rgb(255, 136, 0)',
    height: 12,
    width: 12,
    borderRadius: 50,
    shadowColor: '#ff8500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgb(255, 136, 0)',
  },
  inactiveDot: {
    backgroundColor: 'rgba(117, 139, 253, 0.92)',
  },
});

export default CustomCarousel;