import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ReportsData {
  totalRevenue: number;
  paymentMethod: {
    cash: number;
    card: number;
    zelle: number;
    venmo: number;
    other: number;
  };
}

export default function PageReports() {
  const [reportsData, setReportsData] = React.useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedPeriod, setSelectedPeriod] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getDropdownOptions = () => {
    const year = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => ({
      label: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'long' }),
      value: `month-${i}`
    }));
    return [
      { label: 'This Year', value: 'year' },
      ...months
    ];
  };



  const getDateRange = (period: string) => {
    if (period === 'year') {
      const year = new Date().getFullYear();
      return `${year} Full Year`;
    }
    if (period.startsWith('month-')) {
      const monthIndex = parseInt(period.split('-')[1]);
      const date = new Date(new Date().getFullYear(), monthIndex, 1);
      return formatDate(date);
    }
    return 'Select Period';
  };

  const fetchReportsData = async (period: string) => {
    setIsLoading(true);
    setSelectedPeriod(period);

    const now = new Date();
    let start: Date;
    let end: Date;

    if (period === 'year') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
      const monthIndex = parseInt(period.split('-')[1]);
      start = new Date(now.getFullYear(), monthIndex, 1);
      end = new Date(now.getFullYear(), monthIndex + 1, 0, 23, 59, 59, 999);
    }

    try {
      const response = await fetch(
        `http://192.168.4.20:3000/api/reports?` +
        `startDate=${start.toISOString()}&endDate=${end.toISOString()}`
      );
      const data = await response.json();
      console.log('Reports data:', data);
      setReportsData(data);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    fetchReportsData(`month-${currentMonth}`);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
      <Text style={styles.title}>Revenue Report</Text>
      </View>

      {/* period scroll selector component can go here */}
      <TouchableOpacity 
  style={styles.dropdownButton}
  onPress={() => setShowDropdown(!showDropdown)}
>
  <Ionicons name="calendar-outline" size={20} color="#666" />
  <Text style={styles.dropdownButtonText}>
    {selectedPeriod ? getDateRange(selectedPeriod) : 'Current'}
  </Text>
  <Ionicons name="chevron-down" size={20} color="#666" />
</TouchableOpacity>

{showDropdown && (
  <ScrollView style={styles.dropdownList} nestedScrollEnabled>
    {getDropdownOptions().map((option) => (
      <TouchableOpacity
        key={option.value}
        style={styles.dropdownItem}
        onPress={() => {
          fetchReportsData(option.value);
          setShowDropdown(false);
        }}
      >
        <Text style={[
          styles.dropdownItemText,
          option.value === 'year' && styles.yearOption
        ]}>{option.label}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
)}

        {/* total revenue display */}
        <View style={styles.revenueDisplay}>
          <Text style={styles.revenueLabel}>Total Revenue</Text>
          <Text style={styles.revenueNumber}>
            {reportsData ? `$${reportsData.totalRevenue.toFixed(2)}` : '$0.00'}
          </Text>
        </View>

      {/* break down by payment method */}
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.paymentMethodTitle}>Breakdown by Payment Method</Text>
        
        <View style={styles.paymentMethodsList}>
          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethodInfo}>
              <Ionicons name="cash-outline" size={24} color="#4CAF50" />
              <Text style={styles.paymentMethodName}>Cash</Text>
            </View>
            <Text style={styles.paymentMethodAmount}>
              {reportsData?.paymentMethod?.cash !== undefined ? `$${reportsData.paymentMethod.cash.toFixed(2)}` : '$0.00'}
            </Text>
          </View>

          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethodInfo}>
              <Ionicons name="card-outline" size={24} color="#2196F3" />
              <Text style={styles.paymentMethodName}>Card</Text>
            </View>
            <Text style={styles.paymentMethodAmount}>
              {reportsData?.paymentMethod?.card !== undefined ? `$${reportsData.paymentMethod.card.toFixed(2)}` : '$0.00'}
            </Text>
          </View>

          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethodInfo}>
              <Ionicons name="phone-portrait-outline" size={24} color="#9C27B0" />
              <Text style={styles.paymentMethodName}>Zelle</Text>
            </View>
            <Text style={styles.paymentMethodAmount}>
              {reportsData?.paymentMethod?.zelle !== undefined ? `$${reportsData.paymentMethod.zelle.toFixed(2)}` : '$0.00'}
            </Text>
          </View>

          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethodInfo}>
              <Ionicons name="logo-venmo" size={24} color="#3D95CE" />
              <Text style={styles.paymentMethodName}>Venmo</Text>
            </View>
            <Text style={styles.paymentMethodAmount}>
              {reportsData?.paymentMethod?.venmo !== undefined ? `$${reportsData.paymentMethod.venmo.toFixed(2)}` : '$0.00'}
            </Text>
          </View>

          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethodInfo}>
              <Ionicons name="ellipsis-horizontal-outline" size={24} color="#FF9800" />
              <Text style={styles.paymentMethodName}>Other</Text>
            </View>
            <Text style={styles.paymentMethodAmount}>
              {reportsData?.paymentMethod?.other !== undefined ? `$${reportsData.paymentMethod.other.toFixed(2)}` : '$0.00'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
    marginTop: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#323742FF',
    fontWeight: '500',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE1E6FF',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#323742FF',
  },
  yearOption: {
    fontWeight: 'bold',
    color: '#FF0000',
  },
  revenueDisplay: {
    marginTop: 20,
    borderColor: '#DEE1E6FF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  revenueNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#C47DE8FF',
  },
  paymentMethodContainer: {
    marginTop: 20,
    borderColor: '#DEE1E6FF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#323742FF',
  },
  paymentMethodsList: {
    gap: 12,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE1E6FF',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#323742FF',
  },
  paymentMethodAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C47DE8FF',
  },
});
