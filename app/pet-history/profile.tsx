import { formatPhoneNumber } from '@/utils/phone';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Visit {
  date: string;
  totalPrice: number;
  tip: number;
  paymentMethod: string;
}

export default function PetHistory() {
  const { petId, petName, customerName, phoneNumber, customerAddress, customerId, petType } = useLocalSearchParams();
  const [history, setHistory] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');

  const defaultImages = {
  dog: require('../../assets/images/dog-profile.png'),
  cat: require('../../assets/images/cat-profile.png'),
};

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://192.168.4.20:3000/api/history/pet/${petId}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await fetch('http://192.168.4.20:3000/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          petId,
          petName,
          customerName,
          phoneNumber
        })
      });
      router.push({
        pathname: '/(dashboard-tabs)/check-in',
                    params: {
                      petId,
                      petName,
                      petType,
                      phoneNumber,
                      customerId,
                      customerName,
                      customerAddress,
      }
    });
  } catch (error) {
    console.error('Check-in error:', error);
  }
};
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Pet Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.headerInfoCardContainer}>
          <Ionicons name="paw-outline" size={20} color="#C47DE8FF" />
          <Text style={styles.headerInfoCard}>Basic Info</Text>
          </View>
          <View style={styles.infoContainerRow}>
            <Image source={petType === 'dog' ? defaultImages.dog : defaultImages.cat} style={styles.petImage} />
            <View style={styles.infoContainerText}>
              <Text style={styles.petName}>{petName}</Text>
              <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color="#666" />
              <Text style={styles.infoText}>{customerName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{formatPhoneNumber(String(phoneNumber))}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{customerAddress}</Text>
              </View>
            </View>
        </View>
        </View>

        {/* Grooming History */}
        <View style={styles.historySection}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name="calendar-outline" size={20} color="#C47DE8FF" />
          <Text style={styles.sectionTitle}>Grooming History</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#C47DE8FF" style={styles.loader} />
        ) : history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No visit history yet</Text>
          </View>
        ) : (
            history.slice(0, 5).map((visit, index) => (
              <View key={index} style={styles.visitCard}>
                <View style={styles.visitHeader}>
                  <Text style={styles.visitDate}>{formatDate(visit.date)}</Text>
                  <Text style={styles.visitPrice}>${visit.totalPrice.toFixed(2)}</Text>
                </View>
                {visit.tip > 0 && (
                  <Text style={styles.visitTip}>Tip: ${visit.tip.toFixed(2)}</Text>
                )}
                <Text style={styles.visitPayment}>
                  Payment: {visit.paymentMethod?.toUpperCase() || 'N/A'}
                </Text>
              </View>
            ))
        )}
        </View>

        <View style={styles.noteSection}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="clipboard-outline" size={20} color="#C47DE8FF" />
            <Text style={styles.sectionTitle}>Important Notes</Text>
          </View>
          <TextInput value={notes} onChangeText={setNotes} placeholder="Enter important notes here" multiline placeholderTextColor="#999" numberOfLines={4}
  textAlignVertical="top" style={styles.emptyNoteState}></TextInput>
        </View>

      {/* Check-in Button */}
        <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
          <Text style={styles.checkInButtonText}>Check-in {petName}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#DEE1E6FF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
    marginHorizontal: 5
  },
  headerInfoCard: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flexDirection: 'row',
  },
  headerInfoCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  petImage: {
    width: 100,
  height: 100,
  borderRadius: 60,
  marginBottom: 12,
  alignSelf: 'center'
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666'
  },
  infoContainerRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 16,
},
infoContainerText: {
  flex: 1,
  justifyContent: 'center',
},
  historySection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#DEE1E6FF',
    borderWidth: 1
  },
  checkInButton: {
    backgroundColor: '#C47DE8FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  historyScrollView: {
    maxHeight: 400,
  },
  loader: {
    marginTop: 32
  },
  emptyState: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#DEE1E6FF',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999'
  },
  visitCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  visitDate: {
    fontSize: 16,
    fontWeight: '600'
  },
  visitPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C47DE8FF'
  },
  visitTip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  visitPayment: {
    fontSize: 14,
    color: '#999'
  },
  noteSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#DEE1E6FF',
    borderWidth: 1
  },
  emptyNoteState: {
    minHeight: 100,
    padding: 12,
    textAlign: 'left',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
    color: 'black',
  },
});