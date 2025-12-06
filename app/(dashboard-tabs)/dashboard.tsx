import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function PageDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);

    try {
      // Fetch data from dashboard API
      const dashboardResponse = await fetch('http://192.168.4.20:3000/api/dashboard/today');
      const dashboardData = await dashboardResponse.json();

      console.log('Dashboard data:', dashboardData);

      setTotalRevenue(dashboardData.totalRevenue || 0);
      setCompletedCount(dashboardData.completedCount || 0);
      setActiveCount(dashboardData.activeCheckIns || 0);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

    // Refetch every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.greetingText}>Hello,</Text>
          <Text style={styles.dateText}>{getTodayDate()}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C47DE8FF" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.greetingText}>Hello,</Text>
        <Text style={styles.dateText}>{getTodayDate()}</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Today's Total Revenue */}
        <View style={styles.statCard}>
          <View style={styles.labelRow}>
            <Ionicons name="cash-outline" size={24} color="#C47DE8FF" />
            <Text style={styles.statCardLabel}>Today's Total Revenue</Text>
          </View>
          <Text style={styles.statCardValue}>${totalRevenue.toFixed(2)}</Text>
        </View>

        {/* Number of Completed Checkouts */}
        <View style={styles.statCard}>
          <View style={styles.labelRow}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#C47DE8FF" />
            <Text style={styles.statCardLabel}>Number of Completed Checkouts</Text>
          </View>
          <Text style={styles.statCardValue}>{completedCount}</Text>
        </View>

        {/* Active Check-ins */}
        <View style={styles.statCard}>
          <View style={styles.labelRow}>
            <Ionicons name="time-outline" size={24} color="#C47DE8FF" />
            <Text style={styles.statCardLabel}>Active Check-ins</Text>
          </View>
          <Text style={styles.statCardValue}>{activeCount}</Text>
        </View>
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
    borderColor: '#DEE1E6FF',
    borderBottomWidth: 2,
    paddingBottom: '5%',
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    marginTop: '5%',
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderColor: '#DEE1E6FF',
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statCardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
});
