import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { getToken, clearToken } from '../../utils/auth';

import { API_BASE_URL } from '../../config';

type Venue = {
  id: number;
  name: string;
  address: string;
  type?: string | null;
};

type MeResponse = {
  id: number;
  name: string;
  email: string;
};

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState<boolean>(true);
  const [venuesError, setVenuesError] = useState<string | null>(null);

  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState<boolean>(true);

  const [lastCheckinMessage, setLastCheckinMessage] = useState<string | null>(
    null
  );

  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoadingVenues(true);
        setVenuesError(null);

        const res = await fetch(`${API_BASE_URL}/venues`);
        console.log('Venues response status:', res.status);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as Venue[];
        console.log('Venues data from API:', data);
        setVenues(data);
      } catch (err: any) {
        console.log('Venues fetch error:', err);
        setVenuesError(err.message ?? 'Unknown error');
      } finally {
        setLoadingVenues(false);
      }
    };

    loadVenues();
  }, []);

  useEffect(() => {
    const loadMe = async () => {
      try {
        setLoadingMe(true);
        const token = await getToken();
        if (!token) {
          setMe(null);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        console.log('Me status:', res.status);

        if (!res.ok) {
          setMe(null);
          return;
        }

        const data = (await res.json()) as MeResponse;
        setMe(data);
      } catch (err) {
        console.log('Error loading /me:', err);
        setMe(null);
      } finally {
        setLoadingMe(false);
      }
    };

    loadMe();
  }, []);

  const handleCheckin = async (venue: Venue) => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Not logged in', 'Please log in to check in at a venue.');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/checkins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ venue_id: venue.id }),
      });

      console.log('Check-in status:', res.status);

      if (!res.ok) {
        let errData: any = null;
        try {
          errData = await res.json();
        } catch (e) {}
        console.log('Check-in error body:', errData);

        const message =
          errData?.message || `Check-in failed with status ${res.status}`;
        throw new Error(message);
      }

      const data = await res.json();
      console.log('Check-in success body:', data);

      const msg = `Checked in at "${venue.name}" (id ${venue.id})`;
      setLastCheckinMessage(msg);
      Alert.alert('Check-in successful', msg);
    } catch (err: any) {
      console.log('Check-in exception:', err);
      Alert.alert('Check-in error', err.message ?? 'Unknown error');
    }
  };

  const handleLogout = async () => {
    try {
      await clearToken();
      setMe(null);
      setLastCheckinMessage(null);
      Alert.alert('Logged out', 'You have been logged out.');
      router.replace('/login');
    } catch (err) {
      console.log('Logout error:', err);
      Alert.alert('Logout error', 'Something went wrong while logging out.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with title + login/logout */}
      <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => setMenuOpen((prev) => !prev)}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Lifestyle Pass Venues</Text>

      {me ? (
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutLink}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <Link href="/login" style={styles.loginLink}>
          Login
        </Link>
      )}
    </View>

      {/* User info row */}
      <View style={styles.userRow}>
        {loadingMe ? (
          <Text style={styles.userText}>Checking login status…</Text>
        ) : me ? (
          <Text style={styles.userText}>
            Logged in as {me.name} ({me.email})
          </Text>
        ) : (
          <Text style={styles.userText}>Not logged in</Text>
        )}
      </View>

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

    {/* ✅ New item for QR scanner */}
    <Text
      style={styles.menuItem}
      onPress={() => {
        router.replace('/scan');
        setMenuOpen(false);
      }}
    >
      Scan QR
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

      {/* Last check-in banner */}
      {lastCheckinMessage && (
        <View style={styles.checkinBanner}>
          <Text style={styles.checkinText}>{lastCheckinMessage}</Text>
        </View>
      )}

      {/* Loading / error / list */}
      {loadingVenues && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Loading venues…</Text>
        </View>
      )}

      {!loadingVenues && venuesError && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {venuesError}</Text>
        </View>
      )}

      {!loadingVenues && !venuesError && (
        <FlatList
          data={venues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
              {!!item.type && <Text style={styles.type}>{item.type}</Text>}

              <TouchableOpacity
                style={styles.checkinButton}
                onPress={() => handleCheckin(item)}
              >
                <Text style={styles.checkinButtonText}>Check in</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No venues found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,        // a bit more top padding
    paddingHorizontal: 24, // more space from left/right edges
    margin: 16,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    margin: 12,
  },
  loginLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    margin: 10,
  },
  logoutLink: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
    marginRight: 16,
  },
  userRow: {
    marginBottom: 8,
  },
  userText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 16,
  },
  checkinBanner: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#e0f7e9',
    marginBottom: 10,
  },
  checkinText: {
    fontSize: 13,
    color: '#2e7d32',
  },
  center: {
    marginTop: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,           // more inner padding inside each card
    marginBottom: 16,      // more space between cards
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  type: {
    marginTop: 4,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  checkinButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  checkinButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  menuIcon: {
  fontSize: 22,
  paddingRight: 12,
  marginLeft: 6,
},

menuContainer: {
  backgroundColor: '#ffffff',
  borderRadius: 8,
  paddingVertical: 8,
  margin: 12,
  paddingHorizontal: 12,
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

});
