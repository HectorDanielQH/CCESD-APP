import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token recuperado:', token);
  
        if (token) {
          // Verificar el token con el backend
          const response = await fetch('https://api.dataweb.tech/api/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            console.log(response);
            const data = await response.json(); // Esperar la resolución de la promesa
            console.log('Respuesta del servidor:', data);
  
            router.push('/paginapaciente');
          } else {
            console.log('Token inválido o expirado.');
            await AsyncStorage.removeItem('token');
          }
        } else {
          console.log('No se encontró un token almacenado.');
        }
      } catch (error) {
        console.error('Error verificando el token:', error);
      }
    };
  
    checkLoggedIn();
  }, []);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api.dataweb.tech/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.headers.get('set-cookie');
      const tokenMatch = result.match(/token=([^;]+)/);
      setLoading(false);

      if (response.ok) {
        // Si el token se devuelve en la respuesta JSON (en lugar de las cookies)
        const token = tokenMatch[1]; // Asumimos que el token viene en el campo 'token'

        if (token) {
          await AsyncStorage.setItem('token', token);
          console.log("Token:", token);
          Alert.alert('Éxito', 'Login exitoso');
          router.push('/paginapaciente');
        } else {
          console.log("No se encontró el token en la respuesta.");
          Alert.alert('Error', 'No se pudo obtener el token.');
        }
      } else {
        Alert.alert('Error', result.message || 'Ocurrió un error. Inténtalo de nuevo.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
