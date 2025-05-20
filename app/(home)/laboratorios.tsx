import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

// Define la interfaz para los laboratorios
interface Laboratorios {
  _id: string;
  laboratorio: string;
  telefono: string;
  horariosatención: {
    turnomañana: string;
    turnotarde: string;
  };
  servicios: string;
  ubicación: [number, number]; // Coordenadas [latitud, longitud]
}

export default function LaboratoriosScreen() {
  const [laboratorios, setLaboratorios] = useState<Laboratorios[] | null>(null);

  // Fetch de laboratorios
  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const response = await fetch('https://api.dataweb.tech/api/obtenerlaboratoriospage');

        if (!response.ok) {
          console.error(`Error HTTP: ${response.status}`);
          return;
        }

        const data: Laboratorios[] = await response.json();
        setLaboratorios(data);
      } catch (error) {
        console.error('Error al obtener los laboratorios:', error);
      }
    };

    fetchLaboratorios();
  }, []);

  const abrirEnMapas = (latitud: number, longitud: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`;
    Linking.openURL(url).catch((err) =>
      console.error('Error al abrir la aplicación de mapas:', err)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laboratorios</Text>

      {laboratorios ? (
        laboratorios.length > 0 ? (
          <ScrollView contentContainerStyle={styles.cardsContainer}>
            {laboratorios.map((laboratorio) => (
              <TouchableOpacity key={laboratorio._id} style={styles.card}>
                <Image
                  source={require('@/assets/images/laboratorio.png')} // Asegúrate de tener este ícono en tus assets
                  style={styles.icon}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{laboratorio.laboratorio}</Text>
                  <Text style={styles.cardSubtitle}>Servicios: {laboratorio.servicios}</Text>
                  <Text style={styles.cardSubtitle}>Teléfono: {laboratorio.telefono}</Text>

                  {/* Mostrar los horarios */}
                  <Text style={styles.cardSubtitle}>
                    Turno mañana: {laboratorio.horariosatención.turnomañana}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Turno tarde: {laboratorio.horariosatención.turnotarde}
                  </Text>

                  {/* Botón para abrir en mapas */}
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() =>
                      abrirEnMapas(laboratorio.ubicación[0], laboratorio.ubicación[1])
                    }
                  >
                    <Text style={styles.mapButtonText}>Abrir en Google Maps</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResults}>No hay laboratorios disponibles</Text>
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
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  mapButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noResults: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#757575',
    textAlign: 'center',
  },
});
