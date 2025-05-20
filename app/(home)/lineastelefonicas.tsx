import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';

// Define la interfaz para las líneas telefónicas
interface LineaTelefonica {
  _id: string;
  institucion: string;
  telefono: string;
}

export default function LineasTelefonicasScreen() {
  const [telefonos, setTelefonos] = useState<LineaTelefonica[] | null>(null);

  // Fetch de líneas telefónicas
  useEffect(() => {
    const fetchTelefonos = async () => {
      try {
        const response = await fetch('https://api.dataweb.tech/api/obtenertelefonopage');

        if (!response.ok) {
          console.error(`Error HTTP: ${response.status}`);
          return;
        }

        const data: LineaTelefonica[] = await response.json();
        setTelefonos(data);
      } catch (error) {
        console.error('Error al obtener las líneas telefónicas:', error);
      }
    };

    fetchTelefonos();
  }, []);

  // Función para realizar la llamada
  const hacerLlamada = (telefono: string) => {
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Líneas Telefónicas de Emergencia</Text>

      {telefonos ? (
        telefonos.length > 0 ? (
          <ScrollView contentContainerStyle={styles.cardsContainer}>
            {telefonos.map((linea) => (
              <View key={linea._id} style={styles.card}>
                <Text style={styles.cardTitle}>{linea.institucion}</Text>
                <Text style={styles.cardSubtitle}>Teléfono: {linea.telefono}</Text>
                
                {/* Botón para llamar */}
                <TouchableOpacity onPress={() => hacerLlamada(linea.telefono)} style={styles.callButton}>
                  <Text style={styles.callButtonText}>Llamar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResults}>No hay líneas telefónicas disponibles</Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#455A64',
    marginBottom: 10,
  },
  callButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResults: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#757575',
    textAlign: 'center',
  },
});
