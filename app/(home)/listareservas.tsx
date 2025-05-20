import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { io } from "socket.io-client";

const socket = io("https://api.dataweb.tech");

interface Reserva {
  _id: string;
  tipoatencion: string;
  nombreDoctor: string;
  atendido: boolean;
  createdAt: string;
  hora: string;
  meet: string;
  nombrePaciente: string;
  celular: string;
  receta: string;
}

export default function ListaReservasScreen() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener reservas
  const fetchReservas = async () => {
    try {
      const tokenStored = await AsyncStorage.getItem('token');
      if (!tokenStored) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        'https://api.dataweb.tech/api/obteneratencionpaciente',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenStored}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setReservas(data.docs);
      } else {
        Alert.alert('Error', data.message || 'No se pudo obtener las reservas');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la operación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();

    // Configurar el listener para el socket
    socket.on('notificacionAtencion', (data) => {
      Alert.alert(
        'Notificación de Atención',
        `Genial ya te atendieron`
      );
      
      // Actualizar los datos al recibir la notificación
      fetchReservas();
    });

    // Limpiar el listener al desmontar el componente
    return () => {
      socket.off('notificacionAtencion');
    };
  }, []);

  const handleAtencion = (item: Reserva) => {
    socket.emit('atencion', {
      id: item._id,
      username: item.nombrePaciente,
      celular: item.celular,
    });
  };

  const renderItem = ({ item }: { item: Reserva }) => {
    const fecha = new Date(item.createdAt).toLocaleDateString();
    const hora = new Date(item.createdAt).toLocaleTimeString();

    const abrirEnlaceMeet = async (meeting: string) => {
      try {
        await Linking.openURL(meeting);
      } catch (error) {
        alert("No se pudo abrir el enlace de Google Meet.");
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.itemTitle}>Fecha: {fecha}</Text>
          <Text style={styles.itemTitle}>Hora: {hora}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.itemDetails}>
            Tipo de Atención: {item.tipoatencion}
          </Text>
          <Text style={styles.itemDetails}>
            Doctor asignado: {item.nombreDoctor || "Aún no asignado"}
          </Text>
          <Text style={styles.itemDetails}>
            Estado de atención: {item.atendido ? "Atendido" : "Aún no atendido"}
          </Text>
        </View>

        {item.tipoatencion === "virtual" && item.atendido && item.meet && !item.receta &&(
          <TouchableOpacity style={styles.button} onPress={() => abrirEnlaceMeet(item.meet)}>
            <Text style={styles.buttonText}>Unirse a Google Meet</Text>
          </TouchableOpacity>
        )}

        {item.receta && (
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Receta',item.receta)}>
            <Text style={styles.buttonText}>Ver Receta</Text>
          </TouchableOpacity>
        )}

        {!item.atendido && (
          <TouchableOpacity
            style={[styles.button, styles.unattendedButton]}
            onPress={() => handleAtencion(item)}
          >
            <Text style={styles.buttonText}>Hazle saber a los doctores!!!</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={{ fontSize: 16, marginTop: 10 }}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Reservas</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/registrarreserva')}
      >
        <Text style={styles.buttonText}>Registrar Reserva</Text>
      </TouchableOpacity>

      {reservas ? (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noReservations}>No tienes reservas registradas</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    list: { paddingBottom: 20 },
    button: { marginTop: 10, padding: 10, backgroundColor: '#1E88E5', borderRadius: 5 },
    buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noReservations: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555555',
        marginTop: 20,
    },
    infoContainer: {
        marginBottom: 10,
      },
    itemDetails: {
        fontSize: 14,
        color: "#555",
      },
    itemTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
      },
    detailsContainer: {
        marginBottom: 10,
      },
    unattendedButton: { backgroundColor: '#B71C1C' },
  });