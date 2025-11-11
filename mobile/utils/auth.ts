import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';

export async function saveToken(token: string) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    console.log('Token saved to AsyncStorage');
  } catch (err) {
    console.log('Error saving token:', err);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    console.log('Token loaded from AsyncStorage:', token);
    return token;
  } catch (err) {
    console.log('Error loading token:', err);
    return null;
  }
}

export async function clearToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    console.log('Token cleared from AsyncStorage');
  } catch (err) {
    console.log('Error clearing token:', err);
  }
}
