import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface checkInFormData {
  service: string;
  totalPrice: string;
}

interface Pet{
  petId: string;
  petName: string;
  customerId: string;
  customerName: string;
  phoneNumber?: string;
  imageKey?: string;
}

const SERVICES = [
  { label: 'Full Package', value: 'Full Package'},
  { label: 'Bath', value: 'Bath'},
  { label: 'Grooming', value: 'Grooming'},
  { label: 'Nail Trim', value: 'Nail Trim'},
] as const

export default function checkInCreatePage(){
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState<checkInFormData>({
    service: '',
    totalPrice: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Validate params
  const pet: Pet = {
    petId: params.petId as string,
    petName: params.petName as string,
    customerId: params.customerId as string,
    customerName: params.customerName as string,
    phoneNumber: params.phoneNumber as string,
    imageKey: params.imageKey as string,
  };
    const updateField = useCallback((field: keyof checkInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const isValid = formData.service && formData.totalPrice && parseFloat(formData.totalPrice) > 0;

  const handleCreate = useCallback(async () => {
    if (!isValid) {
      setError('Please fill in all fields correctly.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const requestBody = {
    petId: pet.petId,
    customerId: pet.customerId,
    petName: pet.petName,
    customerName: pet.customerName,
    phoneNumber: pet.phoneNumber,
    services: [formData.service],
    totalPrice: parseFloat(formData.totalPrice),
    imageKey: pet.imageKey || 'default',
  };
    console.log('=== Request Body ===');
    console.log(JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch('http://192.168.4.20:3000/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create check-in.');
    }

    const checkIn = await response.json();
    console.log('CheckIn response:', checkIn);
    console.log('CheckIn ID:', checkIn._id);
    // Navigate to check-in details page
    router.replace('/(dashboard-tabs)/check-in');
  } catch (err: any) {
    setError(err instanceof Error ? err.message : 'An unexpected error occurred.' );
  } finally {
    setIsSubmitting(false);
  }
  }, [isValid, pet, formData]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#fff', paddingTop: 60 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-in Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Pet Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="paw-outline" size={20} color="#C47DE8FF" />
            <Text style={styles.sectionTitle}>Pet Information</Text>
          </View>
          <Text style={styles.petName}>{pet.petName}</Text>
          <Text style={styles.ownerName}>Owner: {pet.customerName}</Text>
        </View>

        {/* Service Selection Card */}
        <View style={styles.formCard}>
  <View style={styles.sectionHeader}>
    <Ionicons name="briefcase-outline" size={20} color="#C47DE8FF" />
    <Text style={styles.sectionTitle}>Service *</Text>
  </View>
  
      <View style={styles.serviceGrid}>
        {SERVICES.map(s => (
          <TouchableOpacity
            key={s.value}
            style={[
              styles.serviceBtn,
              formData.service === s.value && styles.serviceBtnActive
            ]}
            onPress={() => updateField('service', s.value)}
            disabled={isSubmitting}
          >
            <Text style={[
              styles.serviceBtnText,
              formData.service === s.value && styles.serviceBtnTextActive
            ]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

        {/* Price Input Card */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash-outline" size={20} color="#C47DE8FF" />
            <Text style={styles.sectionTitle}>Base Price *</Text>
          </View>
          <TextInput
            style={styles.input}
            value={formData.totalPrice}
            onChangeText={(value) => updateField('totalPrice', value)}
            editable={!isSubmitting}
            keyboardType="numeric"
            placeholder="Enter price"
            placeholderTextColor="#999"
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color="#C47DE8FF" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.createButton, (!isValid || isSubmitting) && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.createButtonText}>Create Check-in</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#DEE1E6FF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
    padding: 16,
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  petName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  serviceGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
  marginTop: 8,
},
serviceBtn: {
  flex: 1,
  minWidth: '45%',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#E5E5E5',
  backgroundColor: '#F9F9F9',
  alignItems: 'center',
},
serviceBtnActive: {
  borderColor: '#C47DE8FF',
  backgroundColor: '#F3E8FAFF',
},
serviceBtnText: {
  fontSize: 14,
  color: '#666',
  fontWeight: '500',
},
serviceBtnTextActive: {
  color: '#C47DE8FF',
  fontWeight: '700',
},
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0E5F7FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: '#C47DE8FF',
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#C47DE8FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#C47DE8FF',
    opacity: 0.5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
