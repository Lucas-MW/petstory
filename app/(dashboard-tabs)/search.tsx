import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Cat, Dog } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Pet{
  id: string;
  name: string;
  phone: string;
  type: 'dog' | 'cat';
  imageKey: string;
}

// Image map for require() - can't use dynamic paths
const petImages: Record<string, any> = {
  '13': require('../../assets/images/13.jpg'),
  '14': require('../../assets/images/14.jpg'),
  'bawi': require('../../assets/images/bawi.jpg'),
  'c1': require('../../assets/images/c1.jpg'),
};

export default function PageSearch() {
  const inputRef = useRef<TextInput>(null);
  const [selectedPet, setSelectedPet] = useState<'dog' | 'cat' | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allPets: Pet[] = [
    { id: '1', name: 'Bella', phone: '(714) 788-7688', type: 'dog', imageKey: '13' },
    { id: '2', name: 'Max', phone: '(714) 788-7688', type: 'dog', imageKey: '14' },
    { id: '3', name: '바위', phone: '(714) 788-7688', type: 'cat', imageKey: 'bawi' },
    { id: '4', name: 'Brisket', phone: '(714) 788-7688', type: 'dog', imageKey: '14' },
    { id: '5', name: 'Luna', phone: '(714) 788-7688', type: 'cat', imageKey: 'c1' },
    // Add more pet objects as needed
  ];

  const filteredPets = selectedPet ? allPets.filter(pet => pet.type === selectedPet) : allPets;
  const searchFilteredPets = filteredPets.filter(pet => 
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pet.phone.includes(searchQuery)
  );

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Pet Search</Text>
      </View>
      <Pressable onPress={handleContainerPress}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999999" />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search by pet name or phone number..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      </Pressable>

      <View style={styles.resultsContainer}>
        <View style={styles.petSelectionContainer}>
        <TouchableOpacity 
          style={[
            styles.petSelectionButton,
            selectedPet === 'dog' && styles.petSelectionButtonActive
          ]}
          onPress={() => setSelectedPet(selectedPet === 'dog' ? null : 'dog')}
        >
              <Dog size={20} color={selectedPet === 'dog' ? '#C47DE8FF' : '#323742FF'} />
              <Text style={[
                styles.petSelectionText,
                selectedPet === 'dog' && styles.petSelectionTextActive
              ]}> Dog</Text>
            </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.petSelectionButton,
            selectedPet === 'cat' && styles.petSelectionButtonActive
          ]}
          onPress={() => setSelectedPet(selectedPet === 'cat' ? null : 'cat')}
        >
              <Cat size={20} color={selectedPet === 'cat' ? '#C47DE8FF' : '#323742FF'} />
              <Text style={[
                styles.petSelectionText,
                selectedPet === 'cat' && styles.petSelectionTextActive
              ]}> Cat</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.resultsHeaderText}>Matching Pets</Text>
        {/* pet info cards */}
        <ScrollView style={styles.matchingResultsContainer} showsVerticalScrollIndicator={false}>
          {searchFilteredPets.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              <Image 
                source={petImages[pet.imageKey]}
                style={styles.petImage} 
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petPhone}>{pet.phone}</Text>
                
                {/* Check-in Button */}
                <TouchableOpacity 
                  style={styles.checkInButton}
                  onPress={() => router.push('/(dashboard-tabs)/check-in')}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.checkInText}>Quick Check-in</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    width: '100%',
    maxWidth: 400,
    height: 48,
    backgroundColor: '#b8beca9f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 30,
  },
  resultsHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  petSelectionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    justifyContent: 'space-evenly',
  },
  petSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEE1E6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  petSelectionButtonActive: {
    backgroundColor: '#F0E5F7FF',
    borderWidth: 2,
    borderColor: '#C47DE8FF',
  },
  petSelectionText: {
    color: '#323742FF',
    fontSize: 14,
  },
  petSelectionTextActive: {
    color: '#C47DE8FF',
    fontWeight: '600',
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
});
