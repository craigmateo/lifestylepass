import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import { getToken } from '../../utils/auth';
import { API_BASE_URL } from '../../config';

export default function ScanScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const parseVenueId = (data: string): number | null => {
    // MVP formats you can support:
    // 1) plain venue id like "3"
    // 2) prefixed scheme like "lp:venue:3"
    if (/^\d+$/.test(data)) return Number(data);
    const m = data.match(/^lp:venue:(\d+)$/i);
    if (m) return Number(m[1]);
    return null;
  };

  const onScan = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const venueId = parseVenueId(data);
      if (!venueId) {
        throw new Error('Invalid QR format. Expected "lp:venue:<id>" or numeric id.');
      }

      const token = await getToken();
      if (!token) {
        Alert.alert('Not logged in', 'Please log in to check in.');
        setScanned(false);
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

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const msg = err?.message || `Check-in failed (status ${res.status})`;
        throw new Error(msg);
      }

      Alert.alert('Success', `Checked in at venue #${venueId}`, [
        { text: 'OK', onPress: () => router.replace('/history') },
      ]);
    } catch (e: any) {
      Alert.alert('Scan Error', e.message || 'Could not process QR.');
      setScanned(false); // allow retry
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.center}><Text>Requesting camera permission…</Text></SafeAreaView>
    );
  }
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.center}><Text>No camera access. Enable it in Settings.</Text></SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Scan to Check-in</Text></View>
      <View style={styles.scannerBox}>
        <BarCodeScanner
          onBarCodeScanned={onScan}
          style={{ width: '100%', height: '100%', borderRadius: 12 }}
        />
      </View>
      <Text style={styles.hint}>Point your camera at a venue’s QR code.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 32, paddingHorizontal: 24, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  scannerBox: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  hint: { textAlign: 'center', paddingVertical: 16, color: '#444' },
});
