import React, { useState } from "react";
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

  const handleAdmisionSelect = (admision) => {
    setSelectedAdmision(admision);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Sistema Odontológico</h1>

      <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
        <div className="flex">
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ingrese la cédula del paciente"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            Buscar
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {paciente && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">
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

          <h3 className="text-xl font-semibold mt-6 mb-2">Estudios</h3>
          <ul>
            {estudios.map((estudio, index) => (
              <li key={index} className="mb-2 p-2 bg-gray-100 rounded">
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
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Ver/Editar Historia Clínica
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedAdmision && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">
            Historia Clínica - Admisión {selectedAdmision.admision}
          </h2>
          <HistoriaClinicaForm
            pacienteId={paciente.cedula}
            admisionId={selectedAdmision.admision}
            onSave={handleSaveHistoriaClinica}
          />
        </div>
      )}
    </div>
  );
}
