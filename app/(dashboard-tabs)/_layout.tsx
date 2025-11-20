import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import * as React from 'react';

export default function LayoutDashboardTabs() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#C47DE8FF',     // Active tab color (purple)
      tabBarInactiveTintColor: '#000000',     // Inactive tab color (gray)
      tabBarStyle: {
        paddingHorizontal: 10,
        justifyContent: 'space-evenly',
      },
      tabBarItemStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabBarLabelStyle: {
        fontWeight: 400,
      }
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="search"
        options={{ 
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="check-in"
        options={{ 
          title: 'Check In',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-check-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{ 
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
