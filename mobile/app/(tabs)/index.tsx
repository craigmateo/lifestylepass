import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

// If you're running Expo web on the same machine as Laravel,
// this is fine. If you later use a physical phone, change this
// to your PC's local IP (e.g. "http://192.168.0.10:8000/api").
const API_BASE_URL = 'http://127.0.0.1:8000/api';

type Venue = {
  id: number;
  name: string;
  address: string;
  type?: string | null;
};

const HomeScreen: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/venues`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as Venue[];
        setVenues(data);
      } catch (err: any) {
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LifestylePass Venues</Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={venues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
              {!!item.type && <Text style={styles.type}>{item.type}</Text>}
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
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  center: {
    marginTop: 20,
    alignItems: 'center',
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
});
