import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HistoriaClinicaForm from "./HistoriaClinicaForm";

export default function WelcomeScreen() {
  const [cedula, setCedula] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [estudios, setEstudios] = useState([]);
  const [error, setError] = useState("");
  const [selectedAdmision, setSelectedAdmision] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/paciente/${cedula}`);
      if (!response.ok) {
        throw new Error("Paciente no encontrado");
      }
      const data = await response.json();
      if (data.length > 0) {
        setPaciente(data[0]);
        setEstudios(data);
        setError("");
      } else {
        setError("No se encontraron registros para este paciente");
      }
    } catch (err) {
      setError(err.message);
      setPaciente(null);
      setEstudios([]);
    }
  };

 const handleAdmisionSelect = async (admision) => {
   try {
     const response = await fetch(`/api/historia-clinica/${admision.admision}`);
     if (response.ok) {
       const historiaClinica = await response.json();
       setSelectedAdmision({ ...admision, historiaClinica });
     } else if (response.status === 404) {
       // Si no se encuentra la historia clínica, creamos una nueva
       setSelectedAdmision({
         ...admision,
         historiaClinica: null, // Indicamos que es una nueva historia clínica
       });
     } else {
       throw new Error("Error al cargar la historia clínica");
     }
   } catch (error) {
     console.error("Error al obtener la historia clínica:", error);
     setError(
       "Error al cargar la historia clínica. Por favor, intente de nuevo."
     );
   }
 };


  const handleSaveHistoriaClinica = async (formData) => {
    try {
      const response = await fetch("/api/historia-clinica", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Error al guardar la historia clínica");
      }
      console.log("Historia clínica guardada con éxito");
    } catch (error) {
      console.error("Error al guardar la historia clínica:", error);
      setError("Error al guardar la historia clínica");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8 flex flex-col items-center">
      <img src="/images/minilogobn.png" alt="Logo" className="w-20 mb-4" />
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">
        Historia Clínica Odontológica
      </h1>

      <form onSubmit={handleSearch} className="w-full max-w-lg mb-8">
        <div className="flex shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ingrese la cédula del paciente"
            className="flex-grow px-4 py-2 text-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 text-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <AnimatePresence>
        {paciente && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-2xl"
          >
            <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Información del Paciente
              </h2>
              <p>
                <strong>Nombre:</strong> {paciente.paciente}
              </p>
              <p>
                <strong>Cédula:</strong> {paciente.cedula}
              </p>
              <p>
                <strong>Fecha de Nacimiento:</strong>{" "}
                {new Date(paciente.nacimiento).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Estudios</h3>
              <ul className="space-y-4">
                {estudios.map((estudio, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 shadow"
                  >
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(estudio.fecha).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Servicio:</strong> {estudio.servicio}
                    </p>
                    <p>
                      <strong>Médico:</strong> {estudio.medico_linea}
                    </p>
                    <button
                      onClick={() => handleAdmisionSelect(estudio)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold transition duration-300 ease-in-out hover:bg-blue-700"
                    >
                      Ver/Editar Historia Clínica
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedAdmision && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="mt-8 w-full max-w-4xl"
        >
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Historia Clínica - Admisión {selectedAdmision.admision}
            </h2>
            <HistoriaClinicaForm
              pacienteId={paciente.c_bpartner_id}
              admisionId={selectedAdmision.admision}
              onSave={handleSaveHistoriaClinica}
              selectedAdmision={selectedAdmision}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
