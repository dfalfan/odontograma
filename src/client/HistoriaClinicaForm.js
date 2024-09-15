import React, { useState } from "react";
import Odontodiagrama from "./Odontodiagrama";

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
    observacionesOdontodiagrama: "",
    diagnostico: "",
    pronostico: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="motivoConsulta"
            className="block text-sm font-medium text-gray-700"
          >
            Motivo de Consulta
          </label>
          <textarea
            id="motivoConsulta"
            name="motivoConsulta"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.motivoConsulta}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label
            htmlFor="enfermedadActual"
            className="block text-sm font-medium text-gray-700"
          >
            Enfermedad Actual
          </label>
          <textarea
            id="enfermedadActual"
            name="enfermedadActual"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.enfermedadActual}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label
            htmlFor="antecedentesPatologicosHereditarios"
            className="block text-sm font-medium text-gray-700"
          >
            Antecedentes Patológicos Hereditarios
          </label>
          <textarea
            id="antecedentesPatologicosHereditarios"
            name="antecedentesPatologicosHereditarios"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.antecedentesPatologicosHereditarios}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Alergias</h3>
          <div className="mt-2">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="esAlergico"
                  name="alergias.esAlergico"
                  type="checkbox"
                  checked={formData.alergias.esAlergico}
                  onChange={handleInputChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="esAlergico"
                  className="font-medium text-gray-700"
                >
                  ¿Es alérgico a algún medicamento?
                </label>
              </div>
            </div>
            {formData.alergias.esAlergico && (
              <div className="mt-2 space-y-2 ml-6">
                {Object.entries(formData.alergias.tipos).map(([key, value]) => (
                  <div key={key} className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={`alergias-${key}`}
                        name={`alergias.tipos.${key}`}
                        type="checkbox"
                        checked={value}
                        onChange={handleInputChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={`alergias-${key}`}
                        className="font-medium text-gray-700"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                    </div>
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={formData.alergias.especifiqueOtros}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Aquí puedes agregar secciones similares para hábitos y antecedentes personales patológicos */}

        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Examen Radiográfico
          </h3>
          <div className="mt-2 space-y-2">
            {Object.entries(formData.examenRadiografico.tipos).map(
              ([key, value]) => (
                <div key={key} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id={`examenRadiografico-${key}`}
                      name={`examenRadiografico.tipos.${key}`}
                      type="checkbox"
                      checked={value}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={`examenRadiografico-${key}`}
                      className="font-medium text-gray-700"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </div>
                </div>
              )
            )}
            <div>
              <label
                htmlFor="examenRadiograficoEspecificaciones"
                className="block text-sm font-medium text-gray-700"
              >
                Especificaciones
              </label>
              <textarea
                id="examenRadiograficoEspecificaciones"
                name="examenRadiografico.especificaciones"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.examenRadiografico.especificaciones}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor="examenRadiograficoObservaciones"
                className="block text-sm font-medium text-gray-700"
              >
                Observaciones
              </label>
              <textarea
                id="examenRadiograficoObservaciones"
                name="examenRadiografico.observaciones"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.examenRadiografico.observaciones}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-6">
              <Odontodiagrama />
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Guardar Historia Clínica
        </button>
      </div>
    </form>
  );
}
