import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getToken } from '../../utils/auth';

// IMPORTANT: make this match index.tsx exactly
const API_BASE_URL = 'http://192.168.80.1:8000/api';

type MeResponse = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
};

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const token = await getToken();
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Profile /me status:', res.status);

        if (!res.ok) {
          // Treat any non-OK as "no profile" for now
          setUser(null);
          return;
        }

        const data = (await res.json()) as MeResponse;
        console.log('Profile /me data:', data);
        setUser(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        Alert.alert('Error', err.message || 'Unable to load profile');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  let body: React.ReactNode;

  if (loading) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  } else if (!user) {
    body = (
      <View style={styles.center}>
        <Text style={styles.infoText}>
          Please log in to view your profile.
        </Text>
      </View>
    );
  } else {
    const memberSince = user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : 'N/A';

    body = (
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>Member since</Text>
          <Text style={styles.value}>{memberSince}</Text>

          <Text style={styles.label}>Plan</Text>
          <Text style={styles.value}>Lifestyle Pass (placeholder)</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with hamburger + title */}
      <View style={styles.headerRow}>
        <Text style={styles.menuIcon} onPress={() => setMenuOpen((prev) => !prev)}>
          ☰
        </Text>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 40 }} /> {/* spacer to balance header */}
      </View>

      {/* Dropdown menu when hamburger is open */}
      {menuOpen && (
        <View style={styles.menuContainer}>
          <Text
            style={styles.menuItem}
            onPress={() => {
              router.replace('/');
              setMenuOpen(false);
            }}
          >
            Venues
          </Text>
          <Text
            style={styles.menuItem}
            onPress={() => {
              router.replace('/history');
              setMenuOpen(false);
            }}
          >
            My Check-ins
          </Text>
          <Text
            style={styles.menuItem}
            onPress={() => {
              router.replace('/profile');
              setMenuOpen(false);
            }}
          >
            Profile
          </Text>
          <Text
            style={styles.menuItem}
            onPress={() => {
              router.replace('/login');
              setMenuOpen(false);
            }}
          >
            Login
          </Text>
        </View>
      )}

      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuIcon: {
    fontSize: 22,
    paddingRight: 8,
    marginLeft: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 6,
    color: '#333',
  },
  body: {
    flex: 1,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#444',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: '#777',
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
});
