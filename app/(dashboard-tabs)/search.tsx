import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Cat, Dog } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const allPets: Pet[] = [
    { id: '1', name: 'Bella', phone: '(714) 788-7688', type: 'dog', imageKey: '13' },
    { id: '2', name: 'Max', phone: '(213) 123-4567', type: 'dog', imageKey: '14' },
    { id: '3', name: '바위', phone: '(616) 773-1234', type: 'cat', imageKey: 'bawi' },
    { id: '4', name: 'Brisket', phone: '(626) 666-6666', type: 'dog', imageKey: '14' },
    { id: '5', name: 'Bella', phone: '(714) 444-4444', type: 'cat', imageKey: 'c1' },
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

  //found SEARCH INPUT
  const hasSearchInput = searchQuery.length > 0;
  //no pets matching search
  const noPetsMatchingSearch = searchFilteredPets.length === 0;
  //no matching pet found error message
  const noMatchingPetFound = hasSearchInput&& noPetsMatchingSearch


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
          {hasSearchInput && (
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
        {/* no matching pet found message */}
        {noMatchingPetFound && (
          <View>
            <View style={styles.noResultsContainer}>
              <View style={styles.noResultsIconBackground} />
              <Image source={require('../../assets/images/nofound.png')} style={styles.noResultsIcon} />
            </View>
            <Text style={styles.noResultsMessage}>No Matching Pet Found!</Text>
            <TouchableOpacity style={styles.addNewCustomerButton} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.addNewCustomerText}>+ New Customer</Text>
            </TouchableOpacity>

            <Modal
              visible={isModalVisible}
              animationType="slide"
              onRequestClose={() => setIsModalVisible(false)}
            >
              {/* Modal content goes here */}
              <View style={styles.newPetContainer}>

                {/* Add your pet registration form components here */}
                <View style={styles.newPetHeaderContainer}>
                  <TouchableOpacity 
                    onPress={() => setIsModalVisible(false)} 
                    style={styles.backButton}
                  >
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                  </TouchableOpacity>
                  <Text style={styles.newPetHeader}>Welcome to HappyPet!</Text>
                  <View style={styles.backButtonPlaceholder} />
                </View>
                <View style={styles.newPetInfoContainer}>
                  <View style={styles.newPetSelection}>
                    <TouchableOpacity 
                      style={[
                        styles.petSelectionButton,
                        selectedPet === 'dog' && styles.newPetSelectionActive
                      ]}
                      onPress={() => setSelectedPet(selectedPet === 'dog' ? null : 'dog')}
                    >
                      <Dog size={20} color={selectedPet === 'dog' ? '#4850E4FF' : '#323742FF'} />
                      <Text style={[
                        styles.newPetSelectionText,
                        selectedPet === 'dog' && styles.newPetSelectionTextActive
                      ]}> Dog</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        styles.petSelectionButton,
                        selectedPet === 'cat' && styles.newPetSelectionActive
                      ]}
                      onPress={() => setSelectedPet(selectedPet === 'cat' ? null : 'cat')}
                    >
                      <Cat size={20} color={selectedPet === 'cat' ? '#4850E4FF' : '#323742FF'} />
                      <Text style={[
                        styles.newPetSelectionText,
                        selectedPet === 'cat' && styles.newPetSelectionTextActive
                      ]}> Cat</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Info insertion */}
                <View style={styles.newPetinsertContainer}>
                  <Text style={styles.newPetInputLabel}>Pet Name</Text>
                  <Pressable onPress={handleContainerPress}>
                    <View style={styles.newPetInputContainer}>
                      <Ionicons name='paw-outline' size={20} color="#999999" />
                      <TextInput
                        ref={inputRef}
                        style={styles.newPetInput}
                        placeholder="Bella"
                        placeholderTextColor="#999999"
                      />
                    </View>
                  </Pressable>
                </View>

                <View style={styles.newPetinsertContainer}>
                  <Text style={styles.newPetInputLabel}>Customer Name</Text>
                  <Pressable onPress={handleContainerPress}>
                    <View style={styles.newPetInputContainer}>
                      <Ionicons name='person-outline' size={20} color="#999999" />
                      <TextInput
                        ref={inputRef}
                        style={styles.newPetInput}
                        placeholder="John Doe"
                        placeholderTextColor="#999999"
                      />
                    </View>
                  </Pressable>
                </View>

                <View style={styles.newPetinsertContainer}>
                  <Text style={styles.newPetInputLabel}>Phone Number</Text>
                  <Pressable onPress={handleContainerPress}>
                    <View style={styles.newPetInputContainer}>
                      <Ionicons name='call-outline' size={20} color="#999999" />
                      <TextInput
                        ref={inputRef}
                        style={styles.newPetInput}
                        placeholder="(123) 456-7890"
                        placeholderTextColor="#999999"
                      />
                    </View>
                  </Pressable>
                </View>

                <View style={styles.newPetinsertContainer}>
                  <Text style={styles.newPetInputLabel}>Address</Text>
                  <Pressable onPress={handleContainerPress}>
                    <View style={styles.newPetInputContainer}>
                      <Ionicons name='home-outline' size={20} color="#999999" />
                      <TextInput
                        ref={inputRef}
                        style={styles.newPetInput}
                        placeholder="123 Main St 92801"
                        placeholderTextColor="#999999"
                      />
                    </View>
                  </Pressable>
                </View>

                <TouchableOpacity style={styles.newPetSaveButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.newPetSaveButtonText}>Save Details</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        )}
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

  // Pet Registration Modal Styles
  newPetContainer: {
    paddingHorizontal: '6%',
    paddingVertical: 60,
    paddingTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPetHeaderContainer: {
    width: '100%',
    borderColor: '#DEE1E6FF',
    borderBottomWidth: 2,
    paddingBottom: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  newPetHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  newPetInfoContainer: {
    marginTop: 20,
  },
  newPetSelection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    justifyContent: 'space-evenly',
  },
  newPetSelectionActive: {
    backgroundColor: '#DADFFF',
    borderWidth: 2,
  },
  newPetSelectionText: {
    color: '#323742FF',
    fontSize: 14, 
  },
  newPetSelectionTextActive: {
    color: '#4850E4FF',
    fontWeight: '600',
  },
  newPetinsertContainer: {
    flexDirection: 'column',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  newPetInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#323742FF',
  },
  newPetInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  newPetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    height: 56,
    width: '100%',
  },
  newPetSaveButton: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#4858e4ff',
    paddingHorizontal: 24,  
    paddingVertical: 16,
    borderRadius: 12,
    gap: 6,
    marginTop: 24,
  },
  newPetSaveButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});