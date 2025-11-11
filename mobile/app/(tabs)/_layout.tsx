import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: 'Venues', headerShown: true }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'My Check-ins', headerShown: true }}
      />
    </Tabs>
  );
}
