import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { saveToken } from '../utils/auth';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const LoginScreen: React.FC = () => {
  const router = useRouter();

  // Default to known-good test user
  const [email, setEmail] = useState('craig2@example.com');
  const [password, setPassword] = useState('secret1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      email: email.trim(), // trim spaces just in case
      password: password,
    };

    console.log('Attempting login with:', payload);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Login HTTP status:', res.status);

      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        console.log('Could not parse login JSON response');
      }

      console.log('Login response JSON:', data);

      if (!res.ok) {
        const message =
          data?.message || `Login failed with status ${res.status}`;
        throw new Error(message);
      }

      if (!data?.token) {
        throw new Error('No token in login response');
      }

      await saveToken(data.token);
      console.log('Token saved, navigating to home');

      router.replace('/');
    } catch (err: any) {
      console.log('Login error:', err);
      setError(err.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login to Lifestyle Pass</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />

        {error && <Text style={styles.error}>Error: {error}</Text>}

        {loading ? (
          <ActivityIndicator style={{ marginTop: 12 }} />
        ) : (
          <Button title="Log In" onPress={handleLogin} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});
