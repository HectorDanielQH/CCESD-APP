import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { io } from "socket.io-client";
const socket = io("https://api.dataweb.tech");

export default function FormularioReserva() {
    const [tipoatencion, setTipoAtencion] = useState(""); // Tipo de atención
    const [domicilio, setDomicilio] = useState(""); // Dirección
    const [celular, setCelular] = useState(""); // Número de celular
    const [loading, setLoading] = useState(false);

  // Función para validar el formulario
  const validarCampos = (): boolean => {
    if (!tipoatencion) {
      Alert.alert("Error", "Debe seleccionar un tipo de atención.");
      return false;
    }
    if (!domicilio) {
      Alert.alert("Error", "Debe ingresar el domicilio de referencia.");
      return false;
    }
    if (!celular) {
      Alert.alert("Error", "Debe ingresar un número de celular.");
      return false;
    }
    return true;
  };

  const enviarDatos = async () => {
    if (!validarCampos()) return;

    setLoading(true);

    try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch("https://api.dataweb.tech/api/registraratencion", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tipoatencion,
                domicilio,
                celular,
            }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos.");
      }

      console.log(response.json());
      /*socket.emit('atencion', {
        id: item._id,
        username: item.nombrePaciente,
        celular: item.celular,
      });*/
      Alert.alert("Éxito", "Datos enviados correctamente.");
      router.push("/listareservas"); // Redirigir al homescreen
      setTipoAtencion("");
      setDomicilio("");
      setCelular("");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reservar Atención</Text>

      <Text style={styles.label}>Tipo de Atención:</Text>
        <Picker
            selectedValue={tipoatencion}
            onValueChange={(itemValue) => setTipoAtencion(itemValue)}
            style={styles.picker}
            >
            <Picker.Item label="Seleccione una opción..." value="" />
            <Picker.Item label="Atención Presencial" value="presencial" />
            <Picker.Item label="Atención Virtual" value="virtual" />
        </Picker>

      {/* Campo para el domicilio */}
      <Text style={styles.label}>Dirección de Domicilio de referencia</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej.: Calle Ingavi s/n"
        value={domicilio}
        onChangeText={setDomicilio}
      />

      {/* Campo para el número de celular */}
      <Text style={styles.label}>Número de celular de referencia</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        placeholder="Ej.: 68383838"
        value={celular}
        onChangeText={setCelular}
      />

      {/* Botón para enviar */}
      <Button
        title={loading ? "Cargando..." : "Enviar"}
        onPress={enviarDatos}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: "#ffffff",
    marginBottom: 15,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
});
