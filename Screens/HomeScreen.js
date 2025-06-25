import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, Dimensions, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const waterConservationTips = [
  "Turn off taps while brushing to save liters daily.",
  "Collect rainwater for garden use and cleaning.",
  "Fix leaking pipes quickly to avoid wasting water.",
  "Use water-saving appliances to reduce consumption.",
  "Protect and clean nearby water sources regularly.",
];

const zanzibarWaterSources = [
  "Mtoni Spring (Urban West)",
  "Chunga Source (North Unguja)",
  "Mwera Dam (South Unguja)",
  "Kidoti Borehole (North Unguja)",
  "Pemba Groundwater Reservoirs",
];

const HomeScreenWaterAwareness = () => (
  <SafeAreaView style={styles.root}>
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1050&q=80' }}
      style={styles.background}
      blurRadius={1.5}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>💧 Water Conservation & Zanzibar Sources 💧</Text>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1580566911702-c6c429bf3c94?auto=format&fit=crop&w=1050&q=80' }}
          style={styles.bannerImage}
        />

        <Text style={styles.subTitle}>🌍 Why Conserve Water?</Text>
        {waterConservationTips.map((tip, idx) => (
          <View key={idx} style={styles.tipBox}>
            <MaterialCommunityIcons name="water-outline" size={28} color="#0277bd" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}

        <Text style={styles.subTitle}>🗺 Zanzibar's Water Sources</Text>
        {zanzibarWaterSources.map((src, idx) => (
          <View key={idx} style={styles.tipBox}>
            <MaterialCommunityIcons name="map-marker-radius" size={28} color="#009688" />
            <Text style={styles.tipText}>{src}</Text>
          </View>
        ))}

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1521208912307-1e03c0aaa6a5?auto=format&fit=crop&w=1050&q=80' }}
          style={styles.footerImage}
        />
      </ScrollView>
    </ImageBackground>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#e1f5fe' },
  background: { flex: 1 },
  container: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.93)',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#01579b',
    textAlign: 'center',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#006064',
    marginVertical: 15,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1f5fe',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#004d40',
  },
  footerImage: {
    width: '100%',
    height: 180,
    marginTop: 30,
    borderRadius: 12,
  },
});

export default HomeScreenWaterAwareness;
