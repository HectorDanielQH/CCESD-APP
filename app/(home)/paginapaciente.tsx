import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function PacienteScreen() {
  const [loading, setLoading] = useState(true); // Estado para manejar el loading
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [token, setToken] = useState<string | null>(null); // Guardar el token
  const [nombre, setNombre] = useState<string | null>(null);

  // Función para verificar el token en el inicio
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const tokenStored = await AsyncStorage.getItem('token');
        if (!tokenStored) {
          router.push('/login');
          return;
        }

        const response = await fetch('https://api.dataweb.tech/api/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenStored}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setNombre(data.username);
        if (response.ok) {
          setToken(tokenStored); // Guardar el token si es válido
        } else {
          Alert.alert('Error', data.message || 'Token no válido');
          router.push('/login');
        }
      } catch (err) {
        Alert.alert('Error', 'Error de conexión');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Función de logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente');
    router.push('/');
  };

  // Función para llamar a la API de registrar atención
  const handleRegisterAtencion = () => {
    router.push('/registrarreserva');
  };

  const handleObtenerAtencionpaciente = async () => {
    try {
      const response = await fetch('https://api.dataweb.tech/api/obteneratencionpaciente', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        router.push('/listareservas');
      } else {
        Alert.alert('Error', data.message || 'Error al registrar');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la operación');
    }
  };


  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verificando sesión...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BIENVENID@ {nombre}</Text>
      <Image
        source={require('@/assets/images/user.png')} // Asegúrate de tener este ícono en tus assets
        style={styles.icon}
      />
      <View style={styles.buttonContainer}>
        <Button title="Registrar Atención" onPress={handleRegisterAtencion} />
        <Button title="Mis atenciones" onPress={handleObtenerAtencionpaciente} />
      </View>
      <Button title="Logout" onPress={handleLogout} color="#d32f2f"/>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFEBEE',
    marginHorizontal:'auto'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 10,
    gap: 10,
  },
});
