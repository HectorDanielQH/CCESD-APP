import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Define la interfaz para los doctores
interface Doctor {
  _id: string;
  username: string;
  horarios: string;
  aceptacion: boolean;
}

export default function DoctoresScreen() {
  const [doctores, setDoctores] = useState<Doctor[] | null>(null);

  // Fetch de doctores
  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const response = await fetch('https://api.dataweb.tech/api/obtenerdoctores');

        if (!response.ok) {
          console.error(`Error HTTP: ${response.status}`);
          return;
        }

        const data: Doctor[] = await response.json();
        setDoctores(data);
      } catch (error) {
        console.error('Error al obtener los doctores:', error);
      }
    };

    fetchDoctores();
  }, []);

  return (
    <View style={styles.container} >
      <Text style={styles.title}>Doctores en linea</Text>

      {doctores ? (
        doctores.length > 0 ? (
          <ScrollView contentContainerStyle={styles.cardsContainer}>
            {doctores.map((doctor) => (
              <TouchableOpacity
                key={doctor._id}
                style={styles.card}
              >
                <Image
                  source={require('@/assets/images/doctor.png')} // Asegúrate de tener este ícono en tus assets
                  style={styles.icon}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{doctor.username}</Text>
                  <Text style={styles.cardSubtitle}>{doctor.horarios}</Text>
                  <Text style={[styles.cardStatus, doctor.aceptacion ? styles.accepted : styles.rejected]}>
                    {doctor.aceptacion ? 'En linea' : 'No en linea'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResults}>No hay doctores disponibles</Text>
        )
      ) : (
        <ActivityIndicator size="large" color="#007BFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7FA', // Fondo claro
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E', // Azul oscuro
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEBEE', // Fondo rojo claro para el ícono
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E', // Azul oscuro
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#455A64', // Gris azulado
    marginBottom: 5,
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  accepted: {
    color: '#388E3C', // Verde para aceptados
  },
  rejected: {
    color: '#D32F2F', // Rojo para no aceptados
  },
  noResults: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#757575', // Gris medio
    textAlign: 'center',
  },
});
