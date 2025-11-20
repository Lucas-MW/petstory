import { formatPhoneNumber } from '@/utils/phone';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  phoneNumber: string;
}

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
  const params = useLocalSearchParams();
  const [checkInPets, setCheckInPets] = useState<Pet[]>([]);
  const isLoading = false;

  useEffect(() => {
    console.log('useEffect triggered, params:', params);
    // Fetch or update check-in pets logic can go here
    if (params.petId) {
      console.log('Adding pet:', params.petName);
      // Example: Add pet to check-in list
      const newPet: Pet = {
        id: params.petId as string,
        name: params.petName as string,
        type: params.petType as 'dog' | 'cat',
        phoneNumber: params.phoneNumber as string,
      };
      setCheckInPets((prevPets) =>{
        const exists = prevPets.some(pet => pet.id === newPet.id);
        if (exists) return prevPets;
        return [...prevPets, newPet];
      });
    }
  }, [params.petId, params.petName, params.petType, params.phoneNumber]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Check In</Text>
      </View>

      <ScrollView
        testID="checkin-scroll"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        {/* pet info cards */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C47DE8FF" />
          </View>
        ) : checkInPets.length > 0 ? (
          checkInPets.map((pet) => (
    <View key={pet.id} style={styles.petCard}>
      <Image 
        source={getPetImage(pet.type)}
        style={styles.petImage} 
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petPhone}>{formatPhoneNumber(pet.phoneNumber)}</Text>
        
        <TouchableOpacity 
          style={styles.checkInButton}
          onPress={() => {
            console.log('Checking in:', pet.name);
          }}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.checkInText}>Confirm Check-in</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))
) : (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyStateText}>No pets selected</Text>
    <Text style={styles.emptyStateSubtext}>Select pets from the search page</Text>
  </View>
)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '6%',
    paddingVertical: 60,
    paddingTop: '20%',
  },
  headerContainer: {
    alignItems: 'center',
    borderColor: '#DEE1E6FF',
    borderBottomWidth: 2,
    paddingBottom: '5%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  petCard: {
    flexDirection: 'row',
    padding: 16,
    marginTop: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderColor: '#DEE1E6FF',
    borderWidth: 1,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  petInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  petPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#C47DE8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  checkInText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  matchingResultsContainer: {
    maxHeight: '82%',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '20%',
},
emptyStateText: {
  fontSize: 20,
  fontWeight: '600',
  color: '#323742FF',
  marginBottom: 8,
},
emptyStateSubtext: {
  fontSize: 16,
  color: '#666',
  textAlign: 'center',
  paddingHorizontal: 40,
},
});
