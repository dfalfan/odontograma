import React, { useState } from "react";
import Odontodiagrama from "./Odontodiagrama";
import {
  FaAllergies,
  FaXRay,
  FaSave,
  FaSmoking,
  FaNotesMedical,
} from "react-icons/fa";

export default function HistoriaClinicaForm({
  pacienteId,
  admisionId,
  onSave,
}) {
  const [formData, setFormData] = useState({
    motivoConsulta: "",
    enfermedadActual: "",
    antecedentesPatologicosHereditarios: "",
    alergias: {
      esAlergico: false,
      tipos: {
        antibioticos: false,
        analgesicos: false,
        anestesicos: false,
        barbituricos: false,
        yodo: false,
        animales: false,
        alimentos: false,
        otros: false,
      },
      especifiqueOtros: "",
    },
    habitos: {
      succionDedos: false,
      usoProlongadoBiberones: false,
      usoProlongadoChupones: false,
      onicofagia: false,
      queilofagia: false,
      morderLapicesGanchos: false,
      alcohol: false,
      fumar: false,
    },
    antecedentesPersonalesPatologicos: {
      hipertension: false,
      hipotension: false,
      tuberculosis: false,
      diabetes: false,
      hepatitis: false,
      renales: false,
      cancer: false,
      gastricos: false,
      endocrinos: false,
      disnea: false,
      epistaxis: false,
      asma: false,
      enfRespiratorias: false,
      convulsiones: false,
      epilepsia: false,
      enfCardiaca: false,
      inmunologicas: false,
      vihSida: false,
      congenitas: false,
      drogadiccion: false,
      amigdalitis: false,
      respiradorBucal: false,
      traumatismo: false,
      fiebreReumatica: false,
      anemia: false,
      hemofilia: false,
      herpes: false,
      viasUrinarias: false,
      venereas: false,
      migrana: false,
      sinusitis: false,
      rinitisAlergica: false,
      gripeFrecuente: false,
      especificaciones: "",
    },
    intervencionQuirurgica: {
      realizada: false,
      especificaciones: "",
    },
    problemaHemorragia: false,
    medicamentoActual: {
      toma: false,
      especificaciones: "",
    },
    alergiaLatex: {
      esAlergico: false,
      especificaciones: "",
    },
    examenRadiografico: {
      tipos: {
        periapical: false,
        interproximal: false,
        oclusal: false,
        panoramica: false,
        cefalica: false,
        otras: false,
      },
      especificaciones: "",
      observaciones: "",
    },
    odontodiagrama: {},
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      if (name.includes(".")) {
        const [section, subsection, field] = name.split(".");
        if (section === "alergias" && subsection === "esAlergico" && !checked) {
          // Si se desmarca "¿Es alérgico a algún medicamento?", resetea todos los tipos
          return {
            ...prevState,
            alergias: {
              esAlergico: false,
              tipos: Object.keys(prevState.alergias.tipos).reduce(
                (acc, key) => ({ ...acc, [key]: false }),
                {}
              ),
              especifiqueOtros: "",
            },
          };
        }
        return {
          ...prevState,
          [section]: {
            ...prevState[section],
            [subsection]:
              subsection === "tipos"
                ? { ...prevState[section][subsection], [field]: checked }
                : checked,
          },
        };
      }
      return {
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleOdontodiagramaChange = (newState, simplifiedOdonto) => {
    setFormData((prevData) => ({
      ...prevData,
      odontodiagrama: simplifiedOdonto,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData((currentFormData) => {
      onSave(currentFormData);
      return currentFormData;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        {/* Sección: Información General */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Información General
          </h3>
          <div className="space-y-4">
            {[
              "motivoConsulta",
              "enfermedadActual",
              "antecedentesPatologicosHereditarios",
            ].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <textarea
                  id={field}
                  name={field}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                  value={formData[field]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Alergias */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaAllergies className="mr-2 text-red-500" />
            Alergias
          </h3>
          <div className="mt-2">
            <div className="flex items-center mb-4">
              <input
                id="esAlergico"
                name="alergias.esAlergico"
                type="checkbox"
                checked={formData.alergias.esAlergico}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="esAlergico"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                ¿Es alérgico a algún medicamento?
              </label>
            </div>
            {formData.alergias.esAlergico && (
              <div className="ml-6 space-y-2">
                {Object.entries(formData.alergias.tipos).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      id={`alergias-${key}`}
                      name={`alergias.tipos.${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`alergias-${key}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </div>
                ))}
                {formData.alergias.tipos.otros && (
                  <div className="mt-2">
                    <label
                      htmlFor="especifiqueOtros"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Especifique
                    </label>
                    <textarea
                      id="especifiqueOtros"
                      name="alergias.especifiqueOtros"
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-300 ease-in-out"
                      value={formData.alergias.especifiqueOtros}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sección: Hábitos */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaSmoking className="mr-2 text-green-500" />
            Hábitos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.habitos).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  id={`habitos-${key}`}
                  name={`habitos.${key}`}
                  type="checkbox"
                  checked={value}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`habitos-${key}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {key
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Antecedentes Personales Patológicos */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaNotesMedical className="mr-2 text-red-500" />
            Antecedentes Personales Patológicos
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(formData.antecedentesPersonalesPatologicos).map(
              ([key, value]) =>
                key !== "especificaciones" && (
                  <div key={key} className="flex items-center">
                    <input
                      id={`antecedentes-${key}`}
                      name={`antecedentesPersonalesPatologicos.${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`antecedentes-${key}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {key
                        .split(/(?=[A-Z])/)
                        .join(" ")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                  </div>
                )
            )}
          </div>
          <div className="mt-4">
            <label
              htmlFor="antecedentesEspecificaciones"
              className="block text-sm font-medium text-gray-700"
            >
              Especificaciones
            </label>
            <textarea
              id="antecedentesEspecificaciones"
              name="antecedentesPersonalesPatologicos.especificaciones"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-300 ease-in-out"
              value={
                formData.antecedentesPersonalesPatologicos.especificaciones
              }
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Sección: Examen Radiográfico */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaXRay className="mr-2 text-blue-500" />
            Examen Radiográfico
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.examenRadiografico.tipos).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      id={`examenRadiografico-${key}`}
                      name={`examenRadiografico.tipos.${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`examenRadiografico-${key}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </div>
                )
              )}
            </div>
            {["especificaciones", "observaciones"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={`examenRadiografico${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  }`}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <textarea
                  id={`examenRadiografico${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  }`}
                  name={`examenRadiografico.${field}`}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-300 ease-in-out"
                  value={formData.examenRadiografico[field]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Odontodiagrama */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <Odontodiagrama onChange={handleOdontodiagramaChange} />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        >
          <FaSave className="mr-2" />
          Guardar Historia Clínica
        </button>
      </div>
    </form>
  );
}
