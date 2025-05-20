import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Image, // Asegúrate de importar Image
} from 'react-native';

const AppButton = ({
  text,
  icon,
  onPress,
}: {
  text: string;
  icon: any;
  onPress: () => void;
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => onPress());
  };

  const animatedStyle = {
    transform: [{ scale: scaleValue }],
  };

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.buttonGlass}
      >
        <Image source={icon} style={styles.icon} />
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Encabezado estilizado */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bienvenido al C.C.S.E.D.</Text>
        <Text style={styles.subHeaderText}>Explora nuestras funciones</Text>

        {/* Botones de loguearse y registrarse */}
        <View style={styles.authButtons}>
          <TouchableOpacity onPress={() => router.push('/login')} style={styles.authButton}>
            <Text style={styles.authButtonText}>Loguearme</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/register')} style={styles.authButton}>
            <Text style={styles.authButtonText}>Registrarme</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cuerpo principal */}
      <ScrollView contentContainerStyle={styles.main}>
        <AppButton
          text="Hospitales"
          icon={require('@/assets/images/hospital.png')}
          onPress={() => router.push('/hospitales')}
        />
        <AppButton
          text="Farmacias"
          icon={require('@/assets/images/farmacia.png')}
          onPress={() => router.push('/farmacias')}
        />
        <AppButton
          text="Laboratorios"
          icon={require('@/assets/images/laboratorio.png')}
          onPress={() => router.push('/laboratorios')}
        />
        <AppButton
          text="Lineas Telefonicas"
          icon={require('@/assets/images/lineastelefonicas.png')}
          onPress={() => router.push('/lineastelefonicas')}
        />
        <AppButton
          text="Consultar Doctores Activos"
          icon={require('@/assets/images/equipo-medico.png')}
          onPress={() => router.push('/doctoresactivos')}
        />
        <AppButton
          text="Comunicados"
          icon={require('@/assets/images/comunicados.png')}
          onPress={() => router.push('/comunicados')}
        />
      </ScrollView>

      {/* Pie estilizado */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024, Derechos reservados</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    height: 230,
    backgroundColor: '#103778',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    padding: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#ECF0F1',
    opacity: 0.8,
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  authButton: {
    backgroundColor: '#C43302',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center',
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  main: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonGlass: {
    backgroundColor: '#C43302',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#ABB2B9',
  },
  icon: {
    height: 50,  // Ajusta el tamaño de las imágenes si es necesario
    width: 50,   // Ajusta el tamaño de las imágenes si es necesario
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  footer: {
    height: 80,
    backgroundColor: '#103778',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#ABB2B9',
  },
});
