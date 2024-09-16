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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <img src="/images/minilogobn.png" alt="Logo" className="mx-auto mb-6 h-20" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
          Sistema Odontológico
        </h1>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="flex shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Ingrese la cédula del paciente"
              className="flex-grow px-6 py-4 text-lg focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-4 text-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-600 text-center mb-8 font-medium">{error}</p>
        )}

        {paciente && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-12 transition duration-300 ease-in-out hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Información del Paciente
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <p className="text-lg">
                <span className="font-semibold text-gray-600">Nombre:</span>{" "}
                {paciente.paciente}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-600">Cédula:</span>{" "}
                {paciente.cedula}
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-600">
                  Fecha de Nacimiento:
                </span>{" "}
                {new Date(paciente.nacimiento).toLocaleDateString()}
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Estudios</h3>
            <ul className="space-y-4">
              {estudios.map((estudio, index) => (
                <li
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 shadow transition duration-300 ease-in-out hover:shadow-md"
                >
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <p>
                      <span className="font-semibold text-gray-600">
                        Fecha:
                      </span>{" "}
                      {new Date(estudio.fecha).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-600">
                        Servicio:
                      </span>{" "}
                      {estudio.servicio}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-600">
                        Médico:
                      </span>{" "}
                      {estudio.medico_linea}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAdmisionSelect(estudio)}
                    className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold transition duration-300 ease-in-out hover:bg-blue-700"
                  >
                    Ver/Editar Historia Clínica
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedAdmision && (
          <div className="bg-white rounded-xl shadow-xl p-8 transition duration-300 ease-in-out hover:shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
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
    </div>
  );
}
