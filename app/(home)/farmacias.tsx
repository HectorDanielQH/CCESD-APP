import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native';

// Define la interfaz para las farmacias
interface Farmacia {
  _id: string;
  farmacia: string;
  telefono: string;
  horariosatencion: {
    turnomañana: string;
    turnotarde: string;
    turnonoche: string;
  };
  ubicación: [number, number]; // Coordenadas [latitud, longitud]
}

export default function FarmaciasScreen() {
  const [farmacias, setFarmacias] = useState<Farmacia[] | null>(null);

  // Fetch de farmacias
  useEffect(() => {
    const fetchFarmacias = async () => {
      try {
        const response = await fetch('https://api.dataweb.tech/api/obtenerfarmaciaspage');

        if (!response.ok) {
          console.error(`Error HTTP: ${response.status}`);
          return;
        }

        const data: Farmacia[] = await response.json();
        setFarmacias(data);
      } catch (error) {
        console.error('Error al obtener las farmacias:', error);
      }
    };

    fetchFarmacias();
  }, []);

  // Función para abrir Google Maps
  const openInMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
      console.error("No se pudo abrir Google Maps", err)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farmacias</Text>

      {farmacias ? (
        farmacias.length > 0 ? (
          <ScrollView contentContainerStyle={styles.cardsContainer}>
            {farmacias.map((farmacia) => (
              <TouchableOpacity key={farmacia._id} style={styles.card}>
                <Image
                  source={require('@/assets/images/farmacia.png')} // Asegúrate de tener este ícono en tus assets
                  style={styles.icon}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{farmacia.farmacia}</Text>
                  <Text style={styles.cardSubtitle}>Teléfono: {farmacia.telefono}</Text>

                  {/* Mostrar los horarios */}
                  <Text style={styles.cardSubtitle}>Turno mañana: {farmacia.horariosatencion.turnomañana}</Text>
                  <Text style={styles.cardSubtitle}>Turno tarde: {farmacia.horariosatencion.turnotarde}</Text>
                  <Text style={styles.cardSubtitle}>Turno noche: {farmacia.horariosatencion.turnonoche}</Text>

                  {/* Botón para redirigir a Google Maps */}
                  <TouchableOpacity
                    style={styles.mapsButton}
                    onPress={() => openInMaps(farmacia.ubicación[0], farmacia.ubicación[1])}
                  >
                    <Text style={styles.mapsButtonText}>Ver en Google Maps</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResults}>No hay farmacias disponibles</Text>
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
  mapsButton: {
    marginTop: 10,
    backgroundColor: '#1A237E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  mapsButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noResults: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#757575',
    textAlign: 'center',
  },
});
