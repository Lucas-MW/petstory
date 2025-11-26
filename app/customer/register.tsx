import { formatPhoneNumber, normalizePhone } from '@/app/utils/phone.js';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Cat, Dog } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface CustomerFormData {
  petName: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  petType: 'dog' | 'cat' | null;
}

export default function RegisterCustomer() {
  const petNameInputRef = useRef<TextInput>(null);
  const customerNameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);

  const [selectedPetType, setSelectedPetType] = useState<'dog' | 'cat' | null>(null);
  const [petName, setPetName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
  petName: '',
  customerName: '',
  phoneNumber: '',
  address: '',
  petType: ''
});

const validateForm = (): boolean => {
  const newErrors = {
    petName: '',
    customerName: '',
    phoneNumber: '',
    address: '',
    petType: ''
  };

  if (!petName.trim()) {
    newErrors.petName = '* Pet name is required';
  }

  if (!customerName.trim()) {
    newErrors.customerName = '* Customer name is required';
  }

  if (phoneNumber.length !== 10) {
    newErrors.phoneNumber = '* Phone number must be 10 digits';
  }

  if (!address.trim()) {
    newErrors.address = '* Address is required';
  }

  if (!selectedPetType) {
    newErrors.petType = '* Please select Dog or Cat';
  }

  setErrors(newErrors);
  return !Object.values(newErrors).some(error => error !== '');
};

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!selectedPetType) {
      return;
    }

    setIsSubmitting(true);
    
    const data: CustomerFormData = {
    petName: petName.trim(),
    customerName: customerName.trim(),
    phoneNumber,
    address: address.trim(),
    petType: selectedPetType,
};

    try {
      const response = await fetch('http://192.168.4.20:3000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if(!response.ok){
        throw new Error('Failed to create new customer');
      }

      const result = await response.json();
      console.log('New customer created:', result);
      

      //show success
      Alert.alert('Success!', `${data.petName} have been registered.`,
      [{ 
        text: 'OK', 
        onPress: () => {
          // Reset form
          setPetName('');
          setCustomerName('');
          setPhoneNumber('');
          setAddress('');
          setSelectedPetType(null);
          setErrors({ petName: '', customerName: '', phoneNumber: '', address: '', petType: '' });
          
          router.back();
        }
      }]
    );
    
  } catch (error) {
    console.error('Error saving new customer:', error);
    Alert.alert('Error', 'Failed to create customer. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.header}>Welcome to HappyPet!</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {/* Pet Type Selection */}
        <View style={styles.infoContainer}>
          <View style={styles.petSelection}>
            <TouchableOpacity 
              style={[
                styles.petSelectionButton,
                selectedPetType === 'dog' && styles.petSelectionActive
              ]}
              onPress={() => {
                setSelectedPetType(selectedPetType === 'dog' ? null : 'dog');
                if (errors.petType) {
                  setErrors({ ...errors, petType: '' });
                }
              }}
            >
              <Dog size={20} color={selectedPetType === 'dog' ? '#4850E4FF' : '#323742FF'} />
              <Text style={[
                styles.petSelectionText,
                selectedPetType === 'dog' && styles.petSelectionTextActive
              ]}> Dog</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.petSelectionButton,
                selectedPetType === 'cat' && styles.petSelectionActive
              ]}
              onPress={() => {
                setSelectedPetType(selectedPetType === 'cat' ? null : 'cat');
                if (errors.petType) {
                  setErrors({ ...errors, petType: '' });
                }
              }}
            >
              <Cat size={20} color={selectedPetType === 'cat' ? '#4850E4FF' : '#323742FF'} />
              <Text style={[
                styles.petSelectionText,
                selectedPetType === 'cat' && styles.petSelectionTextActive
              ]}> Cat</Text>
            </TouchableOpacity>
          </View>
          {errors.petType && (
          <Text style={styles.errorText}>{errors.petType}</Text>
        )}
        </View>

        {/* Pet Name Input */}
        <View style={styles.insertContainer}>
          <Text style={styles.inputLabel}>Pet Name</Text>
          <Pressable onPress={() => {
            petNameInputRef.current?.focus();
          }}>
            <View style={styles.inputContainer}>
              <Ionicons name='paw-outline' size={20} color="#999999" />
              <TextInput
                ref={petNameInputRef}
                style={styles.input}
                placeholderTextColor="#999999"
                placeholder="Bella"
                value={petName}
                onChangeText={(text) => {
                  setPetName(text);
                  if (errors.petName) {
                    setErrors({ ...errors, petName: '' });
                  }
                }}
                autoCapitalize="words"
              />
            </View>
          </Pressable>
          {errors.petName && (
            <Text style={styles.errorText}>{errors.petName}</Text>
          )}
        </View>

        {/* Customer Name Input */}
        <View style={styles.insertContainer}>
          <Text style={styles.inputLabel}>Customer Name</Text>
          <Pressable onPress={() => customerNameInputRef.current?.focus()}>
            <View style={styles.inputContainer}>
              <Ionicons name='person-outline' size={20} color="#999999" />
              <TextInput
                ref={customerNameInputRef}
                style={styles.input}
                placeholderTextColor="#999999"
                placeholder='John Doe'
                value={customerName}
                onChangeText={(text) => {
                  setCustomerName(text);
                  if (errors.customerName) {
                    setErrors({ ...errors, customerName: '' });
                  }
                }}
                autoCapitalize="words"
              />
            </View>
          </Pressable>
          {errors.customerName && (
            <Text style={styles.errorText}>{errors.customerName}</Text>
          )}
        </View>

        {/* Phone Number Input */}
        <View style={styles.insertContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <Pressable onPress={() => phoneInputRef.current?.focus()}>
            <View style={styles.inputContainer}>
              <Ionicons name='call-outline' size={20} color="#999999" />
              <TextInput
                ref={phoneInputRef}
                style={styles.input}
                placeholderTextColor="#999999"
                value={formatPhoneNumber(phoneNumber)}
                placeholder='Digits only'
                onChangeText={(text) => {
                  const digits = normalizePhone(text);
                  if (digits.length <= 10) setPhoneNumber(digits)
                    if (errors.phoneNumber) {
                      setErrors({ ...errors, phoneNumber: '' });
                    }
                }}
                keyboardType="phone-pad"
                maxLength={14}
              />
            </View>
          </Pressable>
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
        </View>

        {/* Address Input */}
        <View style={styles.insertContainer}>
          <Text style={styles.inputLabel}>Address</Text>
          <Pressable onPress={() => addressInputRef.current?.focus()}>
            <View style={styles.inputContainer}>
              <Ionicons name='home-outline' size={20} color="#999999" />
              <TextInput
                ref={addressInputRef}
                style={styles.input}
                placeholderTextColor="#999999"
                placeholder="123 Main St 92801"
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (errors.address) {
                    setErrors({ ...errors, address: '' });
                  }
                }}
              />
            </View>
          </Pressable>
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={[styles.saveButton, isSubmitting && { backgroundColor: '#D1D5DB' }]} onPress={handleSave} disabled={isSubmitting}>
          <Text style={styles.saveButtonText}>{isSubmitting ? 'Creating...' : 'Save Details'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: '6%',
    paddingVertical: 60,
    paddingTop: '20%',
  },
  headerContainer: {
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 20,
  },
  petSelection: {
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
  petSelectionActive: {
    backgroundColor: '#DADFFF',
    borderWidth: 2,
    borderColor: '#4850E4FF',
  },
  petSelectionText: {
    color: '#323742FF',
    fontSize: 14, 
  },
  petSelectionTextActive: {
    color: '#4850E4FF',
    fontWeight: '600',
  },
inputContainerError: {
  borderColor: '#ef4444',
  borderWidth: 2,
},
errorText: {
  color: '#ef4444',
  fontSize: 14,
  marginTop: 8,
  fontWeight: '500',
  width: '100%',
  maxWidth: 400,
},
  insertContainer: {
    flexDirection: 'column',
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#323742FF',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  inputContainer: {
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
  saveButton: {
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
  saveButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
