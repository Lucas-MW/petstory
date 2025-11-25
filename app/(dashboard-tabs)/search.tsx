import { formatPhoneNumber } from '@/utils/phone';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Cat, Dog } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import NewCustomerModal, { CustomerFormData } from '../../components/NewCustomerModal';

interface Pet{
  id: string;
  name: string;
  phoneNumber: string;
  type: 'dog' | 'cat';
  imageKey: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
}

// Image map for require() - can't use dynamic paths
const defaultImages = {
  dog: require('../../assets/images/dog-profile.png'),
  cat: require('../../assets/images/cat-profile.png'),
};

const getPetImage = (petType: 'dog' | 'cat') => {
  return petType === 'dog' ? defaultImages.dog : defaultImages.cat;
}

export default function PageSearch() {
  const inputRef = useRef<TextInput>(null);
  const [selectedPet, setSelectedPet] = useState<'dog' | 'cat' | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [results, setResults] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const trimmedSearchQuery = searchQuery.trim();
  const hasSearchInput = trimmedSearchQuery.length > 0;
  const noMatchingPetFound = hasSearchInput && results.length === 0 && !isLoading;

  // Backend handles both search and pet type filtering
  useEffect(() => {
    if (!trimmedSearchQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ query: trimmedSearchQuery });
        if (selectedPet) {
          params.append('type', selectedPet);
        }
        
        const response = await fetch(`http://192.168.4.20:3000/api/customers/search?${params}`);
        const data = await response.json();
        setResults(data);
        console.log('Search results:', data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [trimmedSearchQuery, selectedPet]);

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const handleSearch = () => {
    const cleanQuery = searchQuery.trim().replace(/\s+/g, "");
    if (!cleanQuery) return;
    console.log('Searching for:', cleanQuery);
  };

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
              <TouchableOpacity onPress={() => router.push({pathname: '/pet-history/profile',
              params: { 
                petId: pet.id, 
                petName: pet.name, 
                petType: pet.type, 
                phoneNumber: pet.phoneNumber, 
                customerId: pet.customerId, 
                customerName: pet.customerName, 
                customerAddress: pet.customerAddress, 
                imageKey: pet.imageKey
                }})} key={pet.id} style={styles.petCard}>
                <Image 
                  source={getPetImage(pet.type)}
                style={styles.petImage} 
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petPhone}>{formatPhoneNumber(pet.phoneNumber)}</Text>
                
                {/* Check-in Button */}
                <TouchableOpacity 
                  style={styles.checkInButton}
                  onPress={() => router.push({
                    pathname: '/(dashboard-tabs)/check-in',
                    params: {
                      petId: pet.id,
                      petName: pet.name,
                      petType: pet.type,
                      phoneNumber: pet.phoneNumber,
                      customerId: pet.customerId,
                      customerName: pet.customerName,
                      customerAddress: pet.customerAddress,
                    }
                  })}
                >
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.checkInText}>Quick Check-in</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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