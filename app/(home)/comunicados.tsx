import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

interface Comunicado {
  _id: string;
  comunicado: string;
  imagen: string;
}

export default function ComunicadosScreen() {
  const [comunicados, setComunicados] = useState<Comunicado[] | null>(null);

  useEffect(() => {
    const fetchComunicados = async () => {
      try {
        const response = await fetch('https://api.dataweb.tech/api/obtenercomunicadospage');
        const data: Comunicado[] = await response.json();
        setComunicados(data);
      } catch (error) {
        console.error('Error al obtener comunicados:', error);
      }
    };

    fetchComunicados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comunicados</Text>

      {comunicados ? (
        comunicados.length > 0 ? (
          <ScrollView contentContainerStyle={styles.cardsContainer}>
            {comunicados.map((comunicado) => (
              <TouchableOpacity key={comunicado._id} style={styles.card}>
                <Image
                  source={{ uri: `https://api.dataweb.tech/${comunicado.imagen}` }}
                  style={styles.image}
                />
                <Text style={styles.comunicadoText}>{comunicado.comunicado}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResults}>No hay comunicados disponibles</Text>
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
    padding: 16,
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
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  comunicadoText: {
    fontSize: 16,
    color: '#333',
    padding: 15,
    textAlign: 'justify',
    lineHeight: 24,
  },
  noResults: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
