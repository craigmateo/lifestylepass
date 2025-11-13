import React, { useEffect, useState, useCallback } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { getToken, clearToken } from '../../utils/auth';
import { API_BASE_URL } from '../../config';

type Venue = {
  id: number;
  name: string;
  address: string;
  type?: string;
  city?: string;
};

type MeResponse = {
  id: number;
  name: string;
  email: string;
};

export default function VenuesScreen() {
  const router = useRouter();

  // Auth / user
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState<boolean>(true);

  // Venues
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState<boolean>(true);
  const [venuesError, setVenuesError] = useState<string | null>(null);

  // Cities
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [detectingCity, setDetectingCity] = useState(false);

  // UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastCheckinMessage, setLastCheckinMessage] = useState<string | null>(null);

  // ---- Loaders ----
  const loadCities = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cities`);
      if (!res.ok) throw new Error(`Cities load failed ${res.status}`);
      const data = await res.json();
      setCities(data);
      if (!selectedCity && data.length > 0) {
        setSelectedCity(data[0]);
      }
    } catch (e) {
      console.warn('Failed to load cities:', e);
    }
  }, [selectedCity]);

  const loadVenues = useCallback(
    async (city?: string | null) => {
      try {
        setLoadingVenues(true);
        setVenuesError(null);

        const url = city
          ? `${API_BASE_URL}/venues?city=${encodeURIComponent(city)}`
          : `${API_BASE_URL}/venues`;

        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as Venue[];
        setVenues(data);
      } catch (err: any) {
        setVenuesError(err.message ?? 'Unknown error');
      } finally {
        setLoadingVenues(false);
      }
    },
    []
  );

  const loadMe = useCallback(async () => {
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
      if (!res.ok) {
        setMe(null);
        return;
      }
      const data = (await res.json()) as MeResponse;
      setMe(data);
    } catch {
      setMe(null);
    } finally {
      setLoadingMe(false);
    }
  }, []);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  useEffect(() => {
    loadVenues(selectedCity);
  }, [selectedCity, loadVenues]);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  // ---- Actions ----
  const handleDetectCity = async () => {
    try {
      setDetectingCity(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed to detect your city.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      const results = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const cityName = results[0]?.city || results[0]?.subregion || null;
      if (cityName) {
        if (cities.includes(cityName)) {
          setSelectedCity(cityName);
        } else {
          Alert.alert('City not found', `Detected ${cityName}, but no venues are listed for that city yet.`);
        }
      } else {
        Alert.alert('Could not detect city');
      }
    } catch (e: any) {
      Alert.alert('Location error', e.message ?? 'Unable to detect city');
    } finally {
      setDetectingCity(false);
    }
  };

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

      if (!res.ok) {
        let errData: any = null;
        try {
          errData = await res.json();
        } catch {}
        const message = errData?.message || `Check-in failed with status ${res.status}`;
        throw new Error(message);
      }

      const msg = `Checked in at "${venue.name}" (id ${venue.id})`;
      setLastCheckinMessage(msg);
      Alert.alert('Check-in successful', msg);
    } catch (err: any) {
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
    } catch {
      Alert.alert('Logout error', 'Something went wrong while logging out.');
    }
  };

  // ---- UI ----
  const renderVenue = ({ item }: { item: Venue }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.address}>
        {item.city ? `${item.city} · ${item.address}` : item.address}
      </Text>
      {!!item.type && <Text style={styles.type}>{item.type}</Text>}

      <TouchableOpacity style={styles.checkinButton} onPress={() => handleCheckin(item)}>
        <Text style={styles.checkinButtonText}>Check in</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      {/* User status */}
      <View style={styles.userRow}>
        {loadingMe ? (
          <Text style={styles.userText}>Checking login status…</Text>
        ) : me ? (
          <Text style={styles.userText}>Logged in as {me.name} ({me.email})</Text>
        ) : (
          <Text style={styles.userText}>Not logged in</Text>
        )}
      </View>

      {/* Hamburger menu */}
      {menuOpen && (
        <View style={styles.menuContainer}>
          <Text style={styles.menuItem} onPress={() => { router.replace('/'); setMenuOpen(false); }}>Venues</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/history'); setMenuOpen(false); }}>My Check-ins</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/scan'); setMenuOpen(false); }}>Scan QR</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/activities'); setMenuOpen(false); }}>Activities</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/profile'); setMenuOpen(false); }}>Profile</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/login'); setMenuOpen(false); }}>Login</Text>
<Text
  style={styles.menuItem}
  onPress={() => {
    router.replace('../map');
    setMenuOpen(false);
  }}
>
  Map
</Text>


        </View>
      )}

      {/* City selector */}
      <View style={styles.cityRow}>
        <Text style={styles.cityLabel}>City:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6 }}>
          {cities.map((c) => (
            <Text
              key={c}
              style={[styles.chip, c === selectedCity && styles.chipActive]}
              onPress={() => setSelectedCity(c)}
            >
              {c}
            </Text>
          ))}
        </ScrollView>
        <Text style={styles.detectBtn} onPress={handleDetectCity}>
          {detectingCity ? 'Detecting…' : 'Detect City'}
        </Text>
      </View>

      {/* Last check-in banner */}
      {lastCheckinMessage && (
        <View style={styles.checkinBanner}>
          <Text style={styles.checkinText}>{lastCheckinMessage}</Text>
        </View>
      )}

      {/* Content */}
      {loadingVenues ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Loading venues…</Text>
        </View>
      ) : venuesError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {venuesError}</Text>
        </View>
      ) : (
        <FlatList
          data={venues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVenue}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No venues found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 24,
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
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  cityLabel: { fontSize: 14, color: '#555' },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#007AFF20', borderColor: '#007AFF' },
  detectBtn: { marginLeft: 'auto', color: '#007AFF' },
  checkinBanner: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#e0f7e9',
    marginBottom: 10,
  },
  checkinText: { fontSize: 13, color: '#2e7d32' },
  center: { marginTop: 20, alignItems: 'center' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  address: { fontSize: 14, color: '#555' },
  type: { marginTop: 4, fontSize: 12, fontStyle: 'italic', color: '#888' },
  errorText: { color: 'red', fontSize: 14 },
  checkinButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  checkinButtonText: { color: '#ffffff', fontWeight: '600' },
});
