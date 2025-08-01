// ZanzibarWaterPlans.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const projects = [
  {
    id: 1,
    title: 'Boresha Mfumo wa Maji',
    description: 'Ujenzi wa mabomba mapya ya maji kwa ajili ya usambazaji bora',
    location: 'Unguja',
    image: require('../assets/pro.jpg'),
  },
  {
    id: 2,
    title: 'Kituo cha Usafi wa Maji',
    description: 'Uboreshaji wa vituo vya kusafisha maji kwa teknolojia mpya',
    location: 'Pemba',
    image: require('../assets/asset.jpg'),
  },
  {
    id: 3,
    title: 'Miradi ya Kijijini',
    description: 'Kuleta maji salama vijijini kwa kutumia mifumo ya kisasa',
    location: 'Kaskazini A',
    image: require('../assets/source.jpg'),
  },
];

const MarqueeText = ({ text, style }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const textWidth = text.length * 10;
    if (textWidth > screenWidth * 0.8) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: -textWidth,
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: screenWidth * 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [text]);

  return (
    <View style={styles.marqueeContainer}>
      <Animated.Text 
        style={[style, { transform: [{ translateX }] }]}
        numberOfLines={1}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const ZanzibarWaterPlans = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % projects.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Miradi Yetu ya Maji</Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        scrollEventThrottle={16}
        onScroll={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setCurrentIndex(index);
        }}
      >
        {projects.map((project) => (
          <View key={project.id} style={styles.carouselItem}>
            <Image source={project.image} style={styles.carouselImage} />
            <View style={styles.carouselCaption}>
              <Text style={styles.carouselTitle}>{project.title}</Text>
              <MarqueeText 
                text={project.description} 
                style={styles.carouselDesc} 
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {projects.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.dot, 
              i === currentIndex ? styles.activeDot : null
            ]} 
          />
        ))}
      </View>

      {/* Fixed Cards Section */}
      <View style={styles.cardsContainer}>
        {projects.map((project) => (
          <View key={project.id} style={styles.card}>
            <Image source={project.image} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{project.title}</Text>
              <Text style={styles.cardText}>{project.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.location}>
                  <Icon name="map-marker" size={16} color="#6c757d" style={{ marginRight: 5 }} />
                  <Text style={styles.locationText}>{project.location}</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Soma Zaidi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#212529',
  },
  carousel: {
    marginBottom: 20,
  },
  carouselItem: {
    width: screenWidth,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: 200,
  },
  carouselCaption: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
    borderRadius: 5,
    maxWidth: '80%',
  },
  carouselTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  carouselDesc: {
    color: '#ddd',
    fontSize: 14,
  },
  cardsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardBody: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212529',
  },
  cardText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#6c757d',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  marqueeContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0d6efd',
  },
});

export default ZanzibarWaterPlans;