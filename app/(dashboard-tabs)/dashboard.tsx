import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PageDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
          <Text style={styles.headerText}>Dashboard</Text>
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
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.dashboardCard}>
          <Text style={styles.title}>Today's Summary</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <View style={styles.iconCircle}>
                <Ionicons name="cash-outline" size={24} color="#C47DE8FF" />
              </View>
              <Text style={styles.statValue}>${totalRevenue.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            
            <View style={styles.stat}>
              <View style={styles.iconCircle}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#C47DE8FF" />
              </View>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={styles.stat}>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={24} color="#C47DE8FF" />
              </View>
              <Text style={styles.statValue}>{activeCount}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
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
  contentContainer: {
    marginTop: '5%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderColor: '#DEE1E6FF',
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#323742FF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  stat: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#DEE1E6FF',
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E5F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#323742FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
