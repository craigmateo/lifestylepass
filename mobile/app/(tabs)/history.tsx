import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getToken } from '../../utils/auth';

// IMPORTANT: make sure this matches exactly what you use in index.tsx
const API_BASE_URL = 'http://192.168.80.1:8000/api';

interface Venue {
  id: number;
  name: string;
  address: string;
  type?: string | null;
}

interface Checkin {
  id: number;
  venue: Venue;
  timestamp: string;
}

export default function HistoryScreen() {
  const router = useRouter();

  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadCheckins = async () => {
      try {
        setLoading(true);
        setNotLoggedIn(false);

        const token = await getToken();
        if (!token) {
          setNotLoggedIn(true);
          setCheckins([]);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/my-checkins`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setNotLoggedIn(true);
            setCheckins([]);
            return;
          }

          const errData = await res.json().catch(() => null);
          const message =
            errData?.message || `Failed with status ${res.status}`;
          throw new Error(message);
        }

        const data = await res.json();
        setCheckins(data);
      } catch (err: any) {
        console.error('Error fetching checkins:', err);
        Alert.alert('Error', err.message || 'Unable to fetch check-ins');
      } finally {
        setLoading(false);
      }
    };

    loadCheckins();
  }, []);

  let content: React.ReactNode;

  if (loading) {
    content = (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading check-ins...</Text>
      </View>
    );
  } else if (notLoggedIn) {
    content = (
      <View style={styles.center}>
        <Text style={styles.infoText}>
          Please log in to view your check-ins.
        </Text>
      </View>
    );
  } else if (checkins.length === 0) {
    content = (
      <View style={styles.center}>
        <Text>No check-ins yet.</Text>
      </View>
    );
  } else {
    content = (
      <View style={styles.listWrapper}>
        <FlatList
          data={checkins}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.venueName}>{item.venue.name}</Text>
              <Text style={styles.venueAddress}>{item.venue.address}</Text>
              {!!item.venue.type && (
                <Text style={styles.venueType}>{item.venue.type}</Text>
              )}
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          )}
        />
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
        <Text style={styles.title}>My Check-ins</Text>
        <View style={{ width: 40 }} />{/* spacer to balance header */}
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


      {content}
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
    margin: 12,
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
  listWrapper: {
    flex: 1,
    paddingBottom: 24,
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
  },
  venueAddress: {
    fontSize: 13,
    color: '#555',
  },
  venueType: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
});
