import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="hospitales" options={{
        title: 'Atras'
      }}/>
      <Stack.Screen name="doctoresactivos" options={{
        title: 'Atras'
      }}/>
      <Stack.Screen name="comunicados" options={{
        title: 'Atras'
      }}/>
      <Stack.Screen name="farmacias" options={{
        title: 'Atras'
      }}/>
      <Stack.Screen name="laboratorios" options={{
        title: 'Atras'
      }}/>
      <Stack.Screen name="lineastelefonicas" options={{
        title: 'Atras'
      }}/>
      <Stack.Screen name="login" options={{
        title: 'Atras'
      }}/>
      <Stack.Screen name="register" options={{
        title: 'Atras'
      }}/>

      <Stack.Screen name="paginapaciente" options={{ headerShown: false }}/>
      
    </Stack>
  );
}