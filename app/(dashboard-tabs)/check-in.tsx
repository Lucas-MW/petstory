import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Default images for pets
const defaultImages = {
  dog: require('../../assets/images/dog-profile.png'),
  cat: require('../../assets/images/cat-profile.png'),
};

// Get pet image with fallback to default based on pet type
const getPetImage = (petType: 'dog' | 'cat') => {
  return petType === 'dog' ? defaultImages.dog : defaultImages.cat;
};

export default function PageCheckIn() {
  const [activeCheckIns, setActiveCheckIns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveCheckIns();
  }, []);

    // Fetch or update check-in pets logic can go he
  const fetchActiveCheckIns = async () => {
    try {
      const today = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
      const response = await fetch(`${API_URL}/checkins?status=in-progress&date=${today}`);
      const data = await response.json();
      setActiveCheckIns(data);
    } catch (error) {
      console.error('Error fetching active check-ins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Active Check-ins</Text>
      
      {isLoading ? (
        <ActivityIndicator />
      ) : activeCheckIns.length > 0 ? (
        <FlatList
          data={activeCheckIns}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.checkInCard}
              onPress={() => router.push(`/check-in/${item._id}`)}
            >
              <Text style={styles.customerName}>{item.customerName}</Text>
              <Text style={styles.petsInfo}>
                {item.pets.map(p => `${p.petName} - ${p.service}`).join(', ')}
              </Text>
              <Text style={styles.totalPrice}>Total: ${item.totalPrice}</Text>
              <Text style={styles.timeInfo}>
                Checked in: {formatTime(item.checkInTime)}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text>No active check-ins</Text>
          <Text>All pets are groomed for now!</Text>
        </View>
      )}
    </View>
  );
}