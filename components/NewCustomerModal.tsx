import { Ionicons } from '@expo/vector-icons';
import { Cat, Dog } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface NewCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: CustomerFormData) => void;
}

interface CustomerFormData {
  petName: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  petType: 'dog' | 'cat' | null;
}

export default function NewCustomerModal({ visible, onClose, onSave }: NewCustomerModalProps) {
  const petNameInputRef = useRef<TextInput>(null);
  const customerNameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);

  const [selectedPetType, setSelectedPetType] = useState<'dog' | 'cat' | null>(null);
  const [petName, setPetName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const handleSave = () => {
    const formData: CustomerFormData = {
      petName,
      customerName,
      phoneNumber,
      address,
      petType: selectedPetType,
    };
    
    if (onSave) {
      onSave(formData);
    }
    
    // Reset form
    setPetName('');
    setCustomerName('');
    setPhoneNumber('');
    setAddress('');
    setSelectedPetType(null);
    
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
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
              onPress={() => setSelectedPetType(selectedPetType === 'dog' ? null : 'dog')}
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
              onPress={() => setSelectedPetType(selectedPetType === 'cat' ? null : 'cat')}
            >
              <Cat size={20} color={selectedPetType === 'cat' ? '#4850E4FF' : '#323742FF'} />
              <Text style={[
                styles.petSelectionText,
                selectedPetType === 'cat' && styles.petSelectionTextActive
              ]}> Cat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pet Name Input */}
        <View style={styles.insertContainer}>
          <Text style={styles.inputLabel}>Pet Name</Text>
          <Pressable onPress={() => petNameInputRef.current?.focus()}>
            <View style={styles.inputContainer}>
              <Ionicons name='paw-outline' size={20} color="#999999" />
              <TextInput
                ref={petNameInputRef}
                style={styles.input}
                placeholder="Bella"
                placeholderTextColor="#999999"
                value={petName}
                onChangeText={setPetName}
                autoCapitalize="words"
              />
            </View>
          </Pressable>
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
                placeholder="John Doe"
                placeholderTextColor="#999999"
                value={customerName}
                onChangeText={setCustomerName}
                autoCapitalize="words"
              />
            </View>
          </Pressable>
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
                placeholder="(123) 456-7890"
                placeholderTextColor="#999999"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </Pressable>
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
                placeholder="123 Main St 92801"
                placeholderTextColor="#999999"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </Pressable>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Details</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '6%',
    paddingVertical: 60,
    paddingTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
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
