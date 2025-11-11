import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const DEV_TOKEN = '6|NgK47lUpVmypJlYfOviKocKkde7w88E17hTLjPUA0efdf156';

interface Venue {
  id: number;
  name: string;
  address: string;
  type: string;
}

interface Checkin {
  id: number;
  venue: Venue;
  timestamp: string;
}

export default function HistoryScreen() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCheckins = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/my-checkins`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${DEV_TOKEN}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text>Loading check-ins...</Text>
      </View>
    );
  }

  if (checkins.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No check-ins yet.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold mb-3">My Check-ins</Text>
      <FlatList
        data={checkins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-3 p-3 border border-gray-300 rounded-lg bg-white">
            <Text className="font-semibold">{item.venue.name}</Text>
            <Text>{item.venue.address}</Text>
            <Text>{item.venue.type}</Text>
            <Text className="text-gray-600">
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
