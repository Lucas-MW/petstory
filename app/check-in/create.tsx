import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface checkInFormData {
  service: string;
  totalPrice: string;
}

interface Pet{
  petId: string;
  petName: string;
  customerId: string;
  customerName: string;
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

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: pet.customerId,
          pets: [{
            petId: pet.petId,
            service: formData.service,
            totalPrice: parseFloat(formData.totalPrice),
          }],
        }),
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create check-in.');
    }

    const checkIn = await response.json();
    // Navigate to check-in details page
    router.replace(`/check-in/${checkIn._id}` as any);
  } catch (err: any) {
    setError(err instanceof Error ? err.message : 'An unexpected error occurred.' );
  } finally {
    setIsSubmitting(false);
  }
  }, [isValid, pet, formData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-in {pet.petName}</Text>
      <Text style={styles.subtitle}>Owner: {pet.customerName}</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Service *</Text>
        <Picker
          selectedValue={formData.service}
          onValueChange={(value) => updateField('service', value)}
          enabled={!isSubmitting}
        >
          <Picker.Item label="Select service..." value="" />
          {SERVICES.map(s => (
            <Picker.Item key={s.value} label={s.label} value={s.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Base Price *</Text>
        <TextInput
          style={styles.input}
          value={formData.totalPrice}
          onChangeText={(value) => updateField('totalPrice', value)}
          editable={!isSubmitting}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
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
          <Text style={styles.createButtonText}>Create Check-in</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 },
  errorContainer: { backgroundColor: '#fee', padding: 10, borderRadius: 4, marginBottom: 16 },
  errorText: { color: '#c00' },
  createButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 4, alignItems: 'center' },
  createButtonDisabled: { backgroundColor: '#ccc' },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
