import React, { useState } from 'react';
import { Button } from 'react-native';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { saveToken } from '../utils/auth';
import { API_BASE_URL } from '../config';
const isDev = process.env.NODE_ENV === 'development';

export default function AuthScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('craig2@example.com');
  const [password, setPassword] = useState('secret1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(isDev ? 'Dev Tester' : '');
  const [confirm, setConfirm] = useState(isDev ? 'secret1234' : '');

React.useEffect(() => {
  if (mode === 'signup' && isDev) {
    setName((v) => v || 'Dev Tester');
    setEmail((v) => v || `dev${Date.now()}@example.com`);
    setPassword((v) => v || 'secret1234');   // >= 8 chars
    setConfirm((v) => v || 'secret1234');
  }
}, [mode]);

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setName('');
    setEmail('');
    setPassword('');
    setConfirm('');
    setError(null);
  };

  const validate = () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return false;
    }
    if (mode === 'signup') {
      if (!name.trim()) {
        Alert.alert('Missing name', 'Please enter your name.');
        return false;
      }
      if (password.length < 8) {
        Alert.alert('Password too short', 'Use at least 8 characters.');
        return false;
      }
      if (password !== confirm) {
        Alert.alert('Passwords do not match', 'Please confirm your password.');
        return false;
      }
    }
    return true;
  };

const handleSubmit = async () => {
  console.log('handleSubmit start, mode =', mode);
  if (!validate()) {
    console.log('validate() returned false; aborting');
    return;
  }

  setLoading(true);
  setError?.(null); // if you added error state earlier

  try {
    if (mode === 'signup') {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
      };

      console.log('SIGNUP →', `${API_BASE_URL}/signup`, { ...payload, password: '********' });

      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      console.log('SIGNUP status:', res.status);
      console.log('SIGNUP raw:', raw);

      let data: any = null;
      try { data = raw ? JSON.parse(raw) : null; } catch {}

      if (!res.ok) {
        const validation = data?.errors ? Object.values(data.errors).flat().join('\n') : null;
        const msg = validation || data?.message || `Sign up failed (HTTP ${res.status})`;
        throw new Error(msg);
      }

      // prefer token from signup response
      let token = data?.token;

      // if no token, auto-login
      if (!token) {
        console.log('No token from signup → trying auto-login');
        const loginRes = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const loginRaw = await loginRes.text();
        console.log('AUTO-LOGIN status:', loginRes.status);
        console.log('AUTO-LOGIN raw:', loginRaw);

        let loginData: any = null;
        try { loginData = loginRaw ? JSON.parse(loginRaw) : null; } catch {}
        if (!loginRes.ok || !loginData?.token) {
          const msg = loginData?.message || `Auto-login failed (HTTP ${loginRes.status})`;
          throw new Error(msg);
        }
        token = loginData.token;
      }

      await saveToken(token);
      Alert.alert('Account created', 'You are now logged in.');
      router.replace('/');
      return;
    }

    // LOGIN path unchanged (for completeness)
    const payload = { email: email.trim(), password };
    console.log('LOGIN →', `${API_BASE_URL}/login`, { ...payload, password: '********' });

    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();
    console.log('LOGIN status:', res.status);
    console.log('LOGIN raw:', raw);

    let data: any = null;
    try { data = raw ? JSON.parse(raw) : null; } catch {}

    if (!res.ok) {
      const msg = data?.message
        || (data?.errors ? Object.values(data.errors).flat().join('\n') : null)
        || `Login failed (HTTP ${res.status})`;
      throw new Error(msg);
    }

    if (!data?.token) throw new Error('No token returned by server.');
    await saveToken(data.token);
    Alert.alert('Welcome back!', 'Logged in successfully.');
    router.replace('/');
  } catch (err: any) {
    console.error('Auth error:', err);
    Alert.alert('Error', err?.message || 'Something went wrong.');
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        {mode === 'login' ? 'Log In' : 'Create Account'}
      </Text>

      {mode === 'signup' && (
        <>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </>
      )}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {mode === 'signup' && (
        <>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />
        </>
      )}

      <TouchableOpacity
  style={[styles.button, loading && styles.buttonDisabled]}
  onPress={() => {
    console.log('Touchable submit pressed');
    handleSubmit();
  }}
  disabled={loading}
  activeOpacity={0.8}
>
  {loading ? (
    <ActivityIndicator />
  ) : (
    <Text style={styles.buttonText}>
      {mode === 'login' ? 'Log In' : 'Sign Up'}
    </Text>
  )}
</TouchableOpacity>


      <TouchableOpacity onPress={switchMode} style={styles.switch}>
        <Text style={styles.switchText}>
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={[styles.button, { backgroundColor: '#555', marginTop: 10 }]}
  onPress={async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: 'Quick Test',
          email: `quicktest${Date.now()}@example.com`,
          password: 'secret1234',
        }),
      });
      const raw = await res.text();
      console.log('Quick signup status:', res.status);
      console.log('Quick signup raw:', raw);
      Alert.alert('Quick signup', `HTTP ${res.status}`);
    } catch (e: any) {
      Alert.alert('Quick signup error', e.message ?? 'unknown');
    }
  }}
>
  <Text style={styles.buttonText}>Quick Signup Test</Text>
</TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, margin: 16, paddingHorizontal: 24, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 18 },
  label: { fontSize: 13, color: '#555', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switch: { paddingVertical: 14, alignItems: 'center' },
  switchText: { color: '#007AFF', fontWeight: '500' },
});
