import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Linking } from 'react-native';

// Define la interfaz para los hospitales
interface Hospitales {
  _id: string;
  hospital: string;
  nivel: string;
  telefono: string;
  horariosvisita: {
    turnomañana: string;
    turnotarde: string;
  };
  servicios: string;
  ubicación: [number, number]; // Coordenadas [latitud, longitud]
}

export default function HospitalesScreen() {
  const [hospitales, setHospitales] = useState<Hospitales[] | null>(null);

  // Fetch de hospitales
  useEffect(() => {
    const fetchHospitales = async () => {
      try {
        const response = await fetch('https://api.dataweb.tech/api/obtenerhospitalespage');

        if (!response.ok) {
          console.error(`Error HTTP: ${response.status}`);
          return;
        }

        const data: Hospitales[] = await response.json();
        setHospitales(data);
      } catch (error) {
        console.error('Error al obtener los hospitales:', error);
      }
    };

    fetchHospitales();
  }, []);

  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(err => console.error('Error al abrir Google Maps:', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hospitales</Text>

      {hospitales ? (
        hospitales.length > 0 ? (
          <ScrollView contentContainerStyle={styles.cardsContainer}>
            {hospitales.map((hospital) => (
              <TouchableOpacity key={hospital._id} style={styles.card}>
                <Image
                  source={require('@/assets/images/hospital.png')} // Asegúrate de tener este ícono en tus assets
                  style={styles.icon}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{hospital.hospital}</Text>
                  <Text style={styles.cardSubtitle}>Nivel: {hospital.nivel}</Text>
                  <Text style={styles.cardSubtitle}>Servicios: {hospital.servicios}</Text>
                  <Text style={styles.cardSubtitle}>Teléfono: {hospital.telefono}</Text>

                  {/* Mostrar los horarios */}
                  <Text style={styles.cardSubtitle}>
                    Turno mañana: {hospital.horariosvisita.turnomañana}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Turno tarde: {hospital.horariosvisita.turnotarde}
                  </Text>

                  {/* Botón para abrir Google Maps */}
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => openGoogleMaps(hospital.ubicación[0], hospital.ubicación[1])}
                  >
                    <Text style={styles.mapButtonText}>Abrir en Google Maps</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResults}>No hay hospitales disponibles</Text>
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
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
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
    backgroundColor: '#FFEBEE',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#455A64',
    marginBottom: 5,
  },
  mapButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noResults: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#757575',
    textAlign: 'center',
  },
});
