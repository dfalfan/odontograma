import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HistoriaClinicaForm from "./HistoriaClinicaForm";
import { FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      const response = await fetch(
        `/api/historia-clinica/${admision.admision}`
      );
      if (response.ok) {
        const historiaClinica = await response.json();
        setSelectedAdmision({ ...admision, historiaClinica });
      } else if (response.status === 404) {
        setSelectedAdmision({
          ...admision,
          historiaClinica: null,
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
     toast.success("Historia clínica guardada con éxito");
     // Actualizar el estado local después de guardar
     setSelectedAdmision((prevState) => ({
       ...prevState,
       historiaClinica: formData,
     }));
   } catch (error) {
     console.error("Error al guardar la historia clínica:", error);
     setError("Error al guardar la historia clínica");
     toast.error("Error al guardar la historia clínica");
   }
 };


  // Configuración de las animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <img
            src="/images/minilogobn.png"
            alt="Logo"
            className="w-24 mx-auto mb-6"
          />
          <h1 className="text-4xl font-extrabold text-blue-600">
            Historia Clínica Odontológica
          </h1>
        </header>
        <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8">
          <div className="flex shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ingrese la cédula del paciente"
              className="flex-grow px-4 py-3 text-lg focus:outline-none bg-white"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 text-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </form>
        {error && (
          <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>
        )}
        <AnimatePresence mode="wait">
          {paciente && (
            <motion.div
              key="patient-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Información del Paciente
                </h2>
                <div className="space-y-2">
                  <p>
                    <strong className="font-semibold">Nombre:</strong>{" "}
                    {paciente.paciente}
                  </p>
                  <p>
                    <strong className="font-semibold">Cédula:</strong>{" "}
                    {paciente.cedula}
                  </p>
                  <p>
                    <strong className="font-semibold">
                      Fecha de Nacimiento:
                    </strong>{" "}
                    {new Date(paciente.nacimiento).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="md:col-span-2 bg-white rounded-xl shadow-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Estudios
                </h3>
                <ul className="space-y-4">
                  {estudios.map((estudio, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-gray-50 rounded-lg p-4 shadow transition-all duration-300 ${
                        selectedAdmision &&
                        selectedAdmision.admision === estudio.admision
                          ? "border-2 border-blue-500 ring-2 ring-blue-300"
                          : "hover:bg-gray-100"
                      } ${estudio.admision_cerrada ? "bg-gray-200" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="grid grid-cols-2 gap-2">
                          <p>
                            <strong className="font-semibold">Fecha:</strong>{" "}
                            {new Date(estudio.fecha).toLocaleDateString()}
                          </p>
                          <p>
                            <strong className="font-semibold">Servicio:</strong>{" "}
                            {estudio.servicio}
                          </p>
                          <p>
                            <strong className="font-semibold">Médico:</strong>{" "}
                            {estudio.medico_linea}
                          </p>
                        </div>
                        {estudio.admision_cerrada && (
                          <div className="flex items-center text-red-600">
                            <FaLock className="mr-1" />
                            <span className="text-sm font-semibold">
                              Cerrada
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleAdmisionSelect(estudio)}
                        className={`w-full mt-2 px-4 py-2 rounded-md font-semibold transition duration-300 ease-in-out ${
                          selectedAdmision &&
                          selectedAdmision.admision === estudio.admision
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : estudio.admision_cerrada
                            ? "bg-gray-200 text-gray-400"
                            : "bg-gray-400 text-white hover:bg-gray-600"
                        }`}
                      >
                        {selectedAdmision &&
                        selectedAdmision.admision === estudio.admision
                          ? "Seleccionado"
                          : "Ver Historia Clínica"}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedAdmision && (
            <motion.div
              key="historia-clinica"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="bg-white rounded-xl shadow-xl p-6"
            >
              <div className="bg-blue-600 text-white p-4 rounded-t-xl mb-6">
                <h2 className="text-2xl font-bold mb-2">Historia Clínica</h2>
                <div className="flex justify-between items-center">
                  <p className="text-lg">
                    <span className="font-semibold">Servicio:</span>{" "}
                    {selectedAdmision.servicio}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Fecha:</span>{" "}
                    {new Date(selectedAdmision.fecha).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-semibold">Admisión:</span>{" "}
                  {selectedAdmision.admision}
                </p>
                {selectedAdmision.admision_cerrada && (
                  <p className="text-sm mt-2 font-bold">
                    Esta admisión está cerrada y no puede ser editada.
                  </p>
                )}
              </div>
              <HistoriaClinicaForm
                pacienteId={paciente.c_bpartner_id}
                admisionId={selectedAdmision.admision}
                onSave={handleSaveHistoriaClinica}
                selectedAdmision={selectedAdmision}
                readOnly={selectedAdmision.admision_cerrada}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
