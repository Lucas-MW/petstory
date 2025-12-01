import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface CheckInDetail {
  petId: string;
  petName: string;
  customerName: string;
  phoneNumber: string;
  imageKey: string;
  services: string[];
  totalPrice: number;
  tipPrice: number;
  additionalCharges: number;
  paymentMethod: string | null;
  status: string;
  checkInTime: string;
}

const PAYMENT_METHODS = [
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Zelle', value: 'zelle' },
  { label: 'Venmo', value: 'venmo' },
  { label: 'Apple Pay', value: 'applepay' },
  { label: 'Other', value: 'other' },
];

export default function CheckInDetailPage() {
  const { id } = useLocalSearchParams();
  const [checkIn, setCheckIn] = useState<CheckInDetail | null>(null);
  const [tipPrice, setTipPrice] = useState('0');
  const [additionalCharges, setAdditionalCharges] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = useMemo(() => {
    if (!checkIn) return 0;
    return (
      checkIn.totalPrice +
      parseFloat(tipPrice || '0') +
      parseFloat(additionalCharges || '0')
    );
  }, [checkIn, tipPrice, additionalCharges]);

  const selectedPaymentLabel = PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label || 'Select payment method';

  useEffect(() => {
    fetchCheckIn();
  }, [id]);

  const fetchCheckIn = async () => {
    try {
      const response = await fetch(`http://192.168.4.20:3000/api/checkins/${id}`);
      const data = await response.json();
      setCheckIn(data);
      setTipPrice(data.tipPrice.toString());
      setAdditionalCharges(data.additionalCharges.toString());
      setPaymentMethod(data.paymentMethod || '');
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!paymentMethod) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://192.168.4.20:3000/api/checkins/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipPrice: parseFloat(tipPrice),
          totalPrice: totalPrice,
          paymentMethod: paymentMethod,
        }),
      });

      if (response.ok) {
        router.back();
      }
    } catch (error) {
      console.error('Complete error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#C47DE8" />
      </View>
    );
  }

  if (!checkIn) return null;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Check-in</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.customerName}>{checkIn.customerName}</Text>
          <Text style={styles.info}>📞 {checkIn.phoneNumber}</Text>
          <Text style={styles.info}>🕐 Checked in: {new Date(checkIn.checkInTime).toLocaleTimeString()}</Text>
        </View>

        {/* Pet Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Pet Name</Text>
          <Text style={styles.petName}>🐕 {checkIn.petName}</Text>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.label}>Services</Text>
          {(checkIn.services || []).map((service, index) => (
            <Text key={index} style={styles.service}>✓ {service}</Text>
          ))}
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Pricing</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Price</Text>
            <Text style={styles.priceValue}>{(checkIn.totalPrice || 0).toFixed(2)}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tip</Text>
            <TextInput
              style={styles.input}
              value={tipPrice}
              onChangeText={setTipPrice}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Charges</Text>
            <TextInput
              style={styles.input}
              value={additionalCharges}
              onChangeText={setAdditionalCharges}
              keyboardType="numeric"
              placeholder="0.00"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>£{totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Method</Text>
          
          <TouchableOpacity 
            style={styles.dropdownTrigger}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={[styles.dropdownText, !paymentMethod && styles.placeholder]}>
              {selectedPaymentLabel}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.completeButton,
              (!paymentMethod || isSubmitting) && styles.completeButtonDisabled
            ]}
            onPress={handleComplete}
            disabled={!paymentMethod || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.completeButtonText}>Mark Complete</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={PAYMENT_METHODS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPaymentMethod(item.value);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                  {paymentMethod === item.value && (
                    <Ionicons name="checkmark" size={20} color="#C47DE8" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  petName: {
    fontSize: 18,
    fontWeight: '500',
  },
  service: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C47DE8',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  completeButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#C47DE8',
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});