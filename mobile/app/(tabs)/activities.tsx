import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../../config';

type Venue = { id: number; name: string; address: string };
type Activity = {
  id: number;
  venue_id: number;
  title: string;
  description?: string | null;
  start_time: string;
  end_time?: string | null;
  capacity?: number | null;
  venue?: Venue;
};

export default function ActivitiesScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Activity[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/activities`);
        if (!res.ok) {
          const raw = await res.text();
          throw new Error(`Failed to load activities (HTTP ${res.status}): ${raw}`);
        }
        const data = await res.json();
        setItems(data);
      } catch (e: any) {
        console.error('Activities load error:', e);
        Alert.alert('Error', e.message ?? 'Unable to load activities.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const renderItem = ({ item }: { item: Activity }) => {
    const start = new Date(item.start_time);
    const end = item.end_time ? new Date(item.end_time) : null;
    const when = end
      ? `${start.toLocaleString()} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : start.toLocaleString();

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        {item.venue && (
          <Text style={styles.venue}>{item.venue.name} · {item.venue.address}</Text>
        )}
        {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
        <Text style={styles.time}>{when}</Text>
        {typeof item.capacity === 'number' && <Text style={styles.capacity}>Capacity: {item.capacity}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.menuIcon} onPress={() => setMenuOpen((p) => !p)}>☰</Text>
        <Text style={styles.headerTitle}>Activities</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Menu */}
      {menuOpen && (
        <View style={styles.menuContainer}>
          <Text style={styles.menuItem} onPress={() => { router.replace('/'); setMenuOpen(false); }}>Venues</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/history'); setMenuOpen(false); }}>My Check-ins</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/activities'); setMenuOpen(false); }}>Activities</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/profile'); setMenuOpen(false); }}>Profile</Text>
          <Text style={styles.menuItem} onPress={() => { router.replace('/login'); setMenuOpen(false); }}>Login</Text>
        </View>
      )}

      {/* List */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading activities…</Text></View>
      ) : items.length === 0 ? (
        <View style={styles.center}><Text>No upcoming activities.</Text></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(a) => a.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 32, paddingHorizontal: 24, margin: 16, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  menuIcon: { fontSize: 22, paddingRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  menuContainer: {
    backgroundColor: '#ffffff', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  menuItem: { fontSize: 16, paddingVertical: 6, color: '#333' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  title: { fontSize: 16, fontWeight: '600' },
  venue: { fontSize: 13, color: '#555', marginTop: 2 },
  desc: { fontSize: 13, color: '#444', marginTop: 6 },
  time: { fontSize: 13, color: '#333', marginTop: 6 },
  capacity: { fontSize: 12, color: '#666', marginTop: 4 },
});
