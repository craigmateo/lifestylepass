import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' }, // hide bottom tabs
        headerShown: false,               // we draw our own headers
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="activities" />
      <Tabs.Screen name="scan" />
    </Tabs>
  );
}
