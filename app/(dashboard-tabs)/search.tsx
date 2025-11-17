import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Cat, Dog } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import NewCustomerModal from '../../components/NewCustomerModal';

interface CustomerFormData {
  petName: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  petType: 'dog' | 'cat' | null;
}

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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [results, setResults] = useState<Pet[]>([]);
  // for api call
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const allPets: Pet[] = [
    { id: '1', name: 'Bella', phone: '(714) 788-7688', type: 'dog', imageKey: '13' },
    { id: '2', name: 'Max', phone: '(213) 123-4567', type: 'dog', imageKey: '14' },
    { id: '3', name: '바위', phone: '(616) 773-1234', type: 'cat', imageKey: 'bawi' },
    { id: '4', name: 'Brisket', phone: '(626) 666-6666', type: 'dog', imageKey: '14' },
    { id: '5', name: 'Bella', phone: '(714) 444-4444', type: 'cat', imageKey: 'c1' },
    // Add more pet objects as needed
  ];

const trimmedSearchQuery = searchQuery.trim();

// const handleClear = () => {
//   setSearchQuery('');
//   setIsLoading(false);
// };

//found SEARCH INPUT
const hasSearchInput = trimmedSearchQuery.length > 0;
//no matching pet found error message
const noMatchingPetFound = hasSearchInput && results.length === 0 && !isLoading ;


const handleContainerPress = () => {
  inputRef.current?.focus();
};

const handleSearch = () => {
  const cleanQuery = searchQuery
  .trim()  //remove leading/trailing spaces
  .replace(/\s+/g, ""); //remove all spaces

  if(!cleanQuery){ 
    return;
  }
  console.log('Searching for:', cleanQuery);
};

useEffect(() => {
  if (!trimmedSearchQuery) {
    setDebouncedQuery('');
    setResults([]);
    setIsLoading(false);
    return;
  }

  const timeout = setTimeout(() => {  
    setDebouncedQuery(trimmedSearchQuery);
}, 300);

return () => clearTimeout(timeout);

}, [trimmedSearchQuery]);

useEffect(() => {
    const fetchPets = async () => {
      if (!debouncedQuery) return;
      setIsLoading(true);
  
      try{
        const filtered = selectedPet ? allPets.filter(pet => pet.type === selectedPet) : allPets.filter(pet => {
          const normalizedQuery = debouncedQuery.toLowerCase().replace(/\s+/g, '');
          const normalizedPetName = pet.name.toLowerCase().replace(/\s+/g, '');
          const normalizedPhone = pet.phone.replace(/\s+/g, '');
          
          return normalizedPetName.includes(normalizedQuery) || normalizedPhone.includes(normalizedQuery);
        });
        setResults(filtered);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPets();
  }, [debouncedQuery, selectedPet]);

return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Search</Text>
      </View>

      {/* keyboard dismiss area */}
      <ScrollView
      testID="search-scroll"
      keyboardDismissMode="on-drag"
      onScrollBeginDrag={Keyboard.dismiss}
      >

      <Pressable onPress={handleContainerPress}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999999" />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search by pet name or phone number"
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            //handle enter key / search button
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
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

        {/* Initial empty state - no search input */}
        {!hasSearchInput ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconBackground}>
              <Image source={require('../../assets/images/search-for-a-pet.png')} style={styles.emptyStateIcon} />
            </View>
            <Text style={styles.emptyStateTitle}>Search for a Pet</Text>
            <Text style={styles.emptyStateMessage}>Enter a pet name or phone number to look them up</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsHeaderText}>Matching Pets</Text>
            {/* pet info cards */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C47DE8FF" />
              </View>
            ) : (
              <ScrollView style={styles.matchingResultsContainer} showsVerticalScrollIndicator={false}>
                {results.map((pet) => (
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
        )}
        {/* no matching pet found message */}
        {noMatchingPetFound && (
          <View>
            <View style={styles.noResultsContainer}>
              <View style={styles.noResultsIconBackground} />
              <Image source={require('../../assets/images/no-result.png')} style={styles.noResultsIcon} />
            </View>
            <Text style={styles.noResultsMessage}>Try adjusting your search</Text>
            <TouchableOpacity style={styles.addNewCustomerButton} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.addNewCustomerText}>+ New Customer</Text>
            </TouchableOpacity>
          </View>
        )}
          </>
        )}
        <NewCustomerModal
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
              onSave={(data: CustomerFormData) => {
                console.log('New customer data:', data);
                // TODO: Send data to backend API
              }}
        />
      </View>
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20%',
    position: 'relative',
  },
  noResultsIcon: { 
    width: 180,
    height: 180,
    borderRadius: 9999,
    position: 'absolute',
  },
  noResultsIconBackground: {
    width: 200,
    height: 200,
    backgroundColor: '#ECE5FAFF',
    borderRadius: 9999,
  },
  noResultsMessage: {
    marginTop: '10%',
    fontSize: 21,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '600',
  },
  addNewCustomerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#B093ECFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 16,
  },
  addNewCustomerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '20%',
  },
  emptyStateIconBackground: {
    width: 200,
    height: 200,
    backgroundColor: '#ECE5FAFF',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    width: 180,
    height: 180,
    borderRadius: 9999,
  },
  emptyStateTitle: {
    marginTop: '10%',
    fontSize: 24,
    fontWeight: '700',
    color: '#323742FF',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});