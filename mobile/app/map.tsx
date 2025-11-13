import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import { API_BASE_URL } from '../config';

type Venue = {
  id: number;
  name: string;
  address: string;
  city?: string;
  type?: string;
};

export default function MapScreen() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/venues`, {
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: Venue[] = await res.json();
        setVenues(data);
      } catch (err: any) {
        setError(err?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.infoText}>Loading venues…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Error loading venues: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Map coming soon</Text>
        <Text style={styles.bannerText}>
          This screen will eventually show venues on an interactive map.
          For now, here’s a list of all venues and their locations.
        </Text>
      </View>

      <FlatList
        data={venues}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
            {!!item.city && (
              <Text style={styles.city}>
                {item.city}
              </Text>
            )}
            {!!item.type && (
              <Text style={styles.type}>{item.type}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.infoText}>No venues found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  banner: {
    margin: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#e3f2fd',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 13,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  address: {
    fontSize: 13,
    color: '#555',
  },
  city: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
  type: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
  },
});
