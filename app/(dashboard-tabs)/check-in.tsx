import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const defaultImages = {
  dog: require('../../assets/images/dog-profile.png'),
  cat: require('../../assets/images/cat-profile.png'),
};

interface CheckInDetail {
  _id: string;
  petId: string;
  petName: string;
  customerName: string;
  phoneNumber: string;
  imageKey: string;
  petType?: 'dog' | 'cat';
  services: string[];
  totalPrice: number;
  tipPrice: number;
  additionalCharges: number;
  paymentMethod: string | null;
  status: string;
  checkInTime: string;
}

const PAYMENT_METHODS = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Card', value: 'Card' },
  { label: 'Zelle', value: 'Zelle' },
  { label: 'Venmo', value: 'Venmo' },
  { label: 'Other', value: 'Other' },
];

export default function CheckInDetailPage() {
  const [checkIn, setCheckIn] = useState<CheckInDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckInDetail | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
    fetchCheckIn();
  }, []);

  const fetchCheckIn = async () => {
    try {
      const response = await fetch(`http://192.168.4.20:3000/api/checkin/`);
      const data = await response.json();
      console.log('CheckIn response:', data);
      setCheckIn(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCheckIn = (petId: string, field: keyof CheckInDetail, value: any) => {
    setCheckIn((prev) =>
      prev.map((item) =>
        item.petId === petId ? { ...item, [field]: value } : item
      )
    );
    
    // Also update selectedCheckIn if it's the same item
    if (selectedCheckIn && selectedCheckIn.petId === petId) {
      setSelectedCheckIn((prev) => prev ? { ...prev, [field]: value } : null);
    }
  }

  const handleTapCard = (checkInItem: CheckInDetail) => {
    setSelectedCheckIn(checkInItem);
    setIsModalVisible(true);
  }

const handleCancel = async (checkInItem: CheckInDetail) => {
  const performCancel = async (checkInItem: CheckInDetail) => {
    try {
      const response = await fetch(`http://192.168.4.20:3000/api/checkin/${checkInItem._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Remove from list
        setCheckIn((prev) => prev.filter(item => item._id !== checkInItem._id));
      } else {
        alert('Failed to cancel check-in. Please try again.');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Network error. Please check your connection.');
    }
  };

  Alert.alert(
    'Confirm Cancellation',
    `Are you sure you want to cancel check-in for ${checkInItem.petName}?`,
    [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => performCancel(checkInItem) }
    ]
  );
};

  const handleComplete = async (checkInItem: CheckInDetail) => {
    if (!checkInItem?.paymentMethod) {
      alert('Please select a payment method before complete.');
      return;
    }

    try {
      
      const finalTotal = checkInItem.totalPrice + (checkInItem.tipPrice || 0) + (checkInItem.additionalCharges || 0);

      const response = await fetch(`http://192.168.4.20:3000/api/checkin/${checkInItem._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipPrice: checkInItem.tipPrice || 0,
          additionalCharges: checkInItem.additionalCharges || 0,
          totalPrice: finalTotal,
          paymentMethod: checkInItem.paymentMethod,
          status: 'Completed',
        }),
      });

      if (response.ok) {
        setCheckIn((prev) => prev.filter(item => item._id === checkInItem._id ? { ...item, status: 'Completed' } : item));
        setIsModalVisible(false);
        setSelectedCheckIn(null);
        alert(`${checkInItem.petName}, ${checkInItem.phoneNumber} marked as completed.`);
        
      }
    } catch (error) {
      console.error('Complete error:', error);
    }
  };

    if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Active Check-ins</Text>
        </View>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#C47DE8" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Check-ins</Text>
      </View>

      <ScrollView style={styles.content}>
        {checkIn.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No active check-ins</Text>
          </View>
        ) : (
          checkIn.map((checkIn) => {
            const finalTotal = 
              checkIn.totalPrice + 
              (checkIn.tipPrice || 0) + 
              (checkIn.additionalCharges || 0);
            
            const hasImage = checkIn.imageKey && checkIn.imageKey !== 'default';
            const imageSource = hasImage 
              ? { uri: `http://192.168.4.20:3000/uploads/${checkIn.imageKey}` }
              : defaultImages[checkIn.petType || 'dog'];

            return (
              <Pressable key={checkIn._id} onPress={() => handleTapCard(checkIn)}>
              <View style={styles.checkInCard}>
                {/* Header with Image */}
                <View style={styles.cardHeader}>
                  <Image
                    source={imageSource}
                    style={styles.petImage}
                  />
                  <View style={styles.headerContent}>
                    <View style={styles.nameAndStatus}>
                      <Text style={styles.petName}>{checkIn.petName}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{checkIn.status}</Text>
                      </View>
                    </View>
                    
                    {/* Customer */}
                    <View style={styles.infoRow}>
                      <Ionicons name="person-outline" size={16} color="#666" />
                      <Text style={styles.customerName}>{checkIn.customerName}</Text>
                    </View>
                    
                    {/* Phone */}
                    <View style={styles.infoRow}>
                      <Ionicons name="call-outline" size={16} color="#666" />
                      <Text style={styles.phone}>{checkIn.phoneNumber}</Text>
                    </View>

                    {/* Check-in Time */}
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={16} color="#666" />
                      <Text style={styles.time}>
                        Checked In: {new Date(checkIn.checkInTime).toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })}
                      </Text>
                    </View>

                    {/* Services */}
                    <View style={styles.infoRow}>
                      <Ionicons name="cut-outline" size={16} color="#C47DE8" />
                      <Text style={styles.serviceText}>
                        {(checkIn.services || []).join(', ')}
                      </Text>
                    </View>
                </View>
              </View>
              
              {/* Cancel appointment - bottom right */}
              <View style={styles.cancelButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancel(checkIn)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
              </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {/* Modal for Check-in Details */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {selectedCheckIn && (
              <ScrollView keyboardShouldPersistTaps="handled">
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{`Check out ${selectedCheckIn.petName}`}</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Ionicons name="close" size={28} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Pricing */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Pricing</Text>
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Base Price</Text>
                    <Text style={styles.priceValue}>${selectedCheckIn.totalPrice.toFixed(2)}</Text>
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Tip</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedCheckIn.tipPrice?.toString() || '0'}
                      onChangeText={(text) => updateCheckIn(selectedCheckIn.petId, 'tipPrice', parseFloat(text) || 0)}
                      keyboardType="numeric"
                      placeholder="0.00"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Additional</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedCheckIn.additionalCharges?.toString() || '0'}
                      onChangeText={(text) => updateCheckIn(selectedCheckIn.petId, 'additionalCharges', parseFloat(text) || 0)}
                      keyboardType="numeric"
                      placeholder="0.00"
                    />
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      ${(selectedCheckIn.totalPrice + (selectedCheckIn.tipPrice || 0) + (selectedCheckIn.additionalCharges || 0)).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Payment Method</Text>
                  <View style={styles.paymentButtons}>
                    {PAYMENT_METHODS.map((method) => (
                      <TouchableOpacity
                        key={method.value}
                        style={[
                          styles.paymentButton,
                          selectedCheckIn.paymentMethod === method.value && styles.paymentButtonActive
                        ]}
                        onPress={() => updateCheckIn(selectedCheckIn.petId, 'paymentMethod', method.value)}
                      >
                        <Text style={[
                          styles.paymentButtonText,
                          selectedCheckIn.paymentMethod === method.value && styles.paymentButtonTextActive
                        ]}>
                          {method.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.completeButton,
                      !selectedCheckIn.paymentMethod && styles.completeButtonDisabled
                    ]}
                    onPress={() => handleComplete(selectedCheckIn)}
                    disabled={!selectedCheckIn.paymentMethod}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.completeButtonText}>Mark Complete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
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
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 2,
    borderBottomColor: '#DEE1E6FF',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  checkInCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  petImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#E0E0E0',
  },
  headerContent: {
    flex: 1,
  },
  nameAndStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
    textTransform: 'capitalize',
  },
  customerName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  phone: {
    fontSize: 13,
    color: '#666',
  },
  section: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#DEE1E6FF',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  servicesSection: {
    marginTop: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  service: {
    fontSize: 13,
    color: '#333',
  },
  serviceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C47DE8',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 13,
    color: '#666',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    width: 80,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#DEE1E6FF',
    marginVertical: 8,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C47DE8',
  },
  paymentButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentButton: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  paymentButtonActive: {
    borderColor: '#C47DE8',
    backgroundColor: '#F3E8FA',
  },
  paymentButtonText: {
    fontSize: 12,
    color: '#666',
  },
  paymentButtonTextActive: {
    color: '#C47DE8',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  cancelButton: {
    backgroundColor: '#4850E4FF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#C47DE8',
    borderRadius: 8,
  },
  completeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
},
modalContent: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  maxHeight: '80%',
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#000',
},
});