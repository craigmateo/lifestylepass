import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getToken } from '../../utils/auth';
import { API_BASE_URL } from '../../config';

type Activity = {
  id: number;
  title: string;
  description?: string | null;
  start_time: string;
  end_time?: string | null;
};

type Params = {
  id?: string;
  name?: string;
  address?: string;
  city?: string;
  type?: string;
};

export default function VenueDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();

  const venueId = params.id ? Number(params.id) : null;

    // date = 'YYYY-MM-DD'
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(isoToday);

  // build a small 7-day range for the selector
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const label =
      i === 0
        ? 'Today'
        : d.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
    return { iso, label };
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

    useEffect(() => {
    if (!venueId) {
      setError('Missing venue id.');
      setLoading(false);
      return;
    }

    const loadActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${API_BASE_URL}/venues/${venueId}/activities?date=${selectedDate}`;
        console.log('Loading activities from:', url);

        const res = await fetch(url, {
          headers: { Accept: 'application/json' },
        });

        console.log('Activities status:', res.status);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: Activity[] = await res.json();
        setActivities(data);
      } catch (err: any) {
        console.log('Activities fetch error:', err);
        setError(err.message ?? 'Could not load activities');
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [venueId, selectedDate]);


  const handleCheckin = async () => {
    if (!venueId) {
      Alert.alert('Error', 'Missing venue id');
      return;
    }

    try {
      setCheckingIn(true);

      const token = await getToken();
      if (!token) {
        Alert.alert('Not logged in', 'Please log in to check in.');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/checkins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ venue_id: venueId }),
      });

      console.log('Detail check-in status:', res.status);

      if (!res.ok) {
        let errData: any = null;
        try {
          errData = await res.json();
        } catch (e) {}
        console.log('Detail check-in error body:', errData);

        const message =
          errData?.message || `Check-in failed with status ${res.status}`;
        throw new Error(message);
      }

      const data = await res.json();
      console.log('Detail check-in success:', data);

      Alert.alert(
        'Check-in successful',
        `You checked in at "${params.name ?? 'this venue'}".`
      );
    } catch (err: any) {
      console.log('Detail check-in exception:', err);
      Alert.alert('Check-in error', err.message ?? 'Unknown error');
    } finally {
      setCheckingIn(false);
    }
  };

  const formatDateTime = (iso: string | null | undefined) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Venue Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Venue info card */}
        <View style={styles.card}>
          <Text style={styles.venueName}>{params.name}</Text>
          {!!params.address && (
            <Text style={styles.venueAddress}>{params.address}</Text>
          )}
          {!!params.city && (
            <Text style={styles.venueCity}>{params.city}</Text>
          )}
          {!!params.type && (
            <Text style={styles.venueType}>{params.type}</Text>
          )}

          <TouchableOpacity
            style={styles.checkinButton}
            onPress={handleCheckin}
            disabled={checkingIn}
          >
            <Text style={styles.checkinButtonText}>
              {checkingIn ? 'Checking in…' : 'Check in here'}
            </Text>
          </TouchableOpacity>
        </View>

                {/* Activities */}
        <Text style={styles.sectionTitle}>Schedule</Text>

        {/* date selector like Urban Sports' date bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 8 }}
        >
          {days.map((day) => {
            const isActive = day.iso === selectedDate;
            return (
              <TouchableOpacity
                key={day.iso}
                style={[
                  styles.datePill,
                  isActive && styles.datePillActive,
                ]}
                onPress={() => setSelectedDate(day.iso)}
              >
                <Text
                  style={[
                    styles.datePillText,
                    isActive && styles.datePillTextActive,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>


        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="small" />
            <Text>Loading activities…</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && activities.length === 0 && (
          <View style={styles.center}>
            <Text>No upcoming activities for this venue.</Text>
          </View>
        )}

        {!loading &&
          !error &&
          activities.map((act) => (
            <View key={act.id} style={styles.activityCard}>
              <Text style={styles.activityTitle}>{act.title}</Text>
              {!!act.description && (
                <Text style={styles.activityDescription}>
                  {act.description}
                </Text>
              )}
              <Text style={styles.activityTime}>
                Starts: {formatDateTime(act.start_time)}
              </Text>
              {!!act.end_time && (
                <Text style={styles.activityTime}>
                  Ends: {formatDateTime(act.end_time)}
                </Text>
              )}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    margin: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  backLink: {
    color: '#007AFF',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
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
  venueName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    color: '#555',
  },
  venueCity: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 4,
  },
  venueType: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
    fontStyle: 'italic',
  },
  checkinButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  checkinButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  center: {
    alignItems: 'center',
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
    datePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  datePillActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  datePillText: {
    fontSize: 12,
    color: '#444',
  },
  datePillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

});
