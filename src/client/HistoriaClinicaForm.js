import React, { useState, useEffect } from "react";
import Odontodiagrama from "./Odontodiagrama";
import {
  FaAllergies,
  FaXRay,
  FaSave,
  FaSmoking,
  FaNotesMedical,
  FaCut,
  FaTint,
  FaPills,
  FaBaby,
  FaComments,
  FaStethoscope,
  FaLock,
} from "react-icons/fa";

export default function HistoriaClinicaForm({
  pacienteId,
  admisionId,
  onSave,
  selectedAdmision,
}) {
  const [formData, setFormData] = useState({
    xx_admission: admisionId,
    c_bpartner_id: pacienteId,
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
    embarazo: {
      esta: false,
      tiempoGestacion: "",
    },
    anticonceptivo: {
      toma: false,
      cual: "",
    },
    reemplazoHormonal: {
      toma: false,
      cual: "",
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
    observaciones: "",
    diagnostico: "",
    admision_cerrada: false,
  });

  useEffect(() => {
    if (selectedAdmision) {
      const defaultFormData = {
        xx_admission: admisionId,
        c_bpartner_id: pacienteId,
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
        embarazo: {
          esta: false,
          tiempoGestacion: "",
        },
        anticonceptivo: {
          toma: false,
          cual: "",
        },
        reemplazoHormonal: {
          toma: false,
          cual: "",
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
        observaciones: "",
        diagnostico: "",
      };

      if (selectedAdmision.historiaClinica) {
        console.log(
          "Datos recibidos en HistoriaClinicaForm:",
          selectedAdmision.historiaClinica
        );
        setFormData({
          ...defaultFormData,
          ...selectedAdmision.historiaClinica,
          xx_admission:
            selectedAdmision.historiaClinica.xx_admission || admisionId,
          c_bpartner_id:
            selectedAdmision.historiaClinica.c_bpartner_id || pacienteId,
          motivoConsulta:
            selectedAdmision.historiaClinica.motivo_consulta || "",
          enfermedadActual:
            selectedAdmision.historiaClinica.enfermedad_actual || "",
          antecedentesPatologicosHereditarios:
            selectedAdmision.historiaClinica
              .antecedentes_patologicos_hereditarios || "",
          alergias: {
            ...defaultFormData.alergias,
            ...selectedAdmision.historiaClinica.alergias,
            esAlergico: selectedAdmision.historiaClinica.es_alergico || false,
          },
          habitos: {
            ...defaultFormData.habitos,
            ...selectedAdmision.historiaClinica.habitos,
          },
          antecedentesPersonalesPatologicos: {
            ...defaultFormData.antecedentesPersonalesPatologicos,
            ...selectedAdmision.historiaClinica
              .antecedentes_personales_patologicos,
          },
          intervencionQuirurgica: {
            ...defaultFormData.intervencionQuirurgica,
            ...selectedAdmision.historiaClinica.intervencion_quirurgica,
          },
          medicamentoActual: {
            ...defaultFormData.medicamentoActual,
            ...selectedAdmision.historiaClinica.medicamento_actual,
          },
          alergiaLatex: {
            ...defaultFormData.alergiaLatex,
            ...selectedAdmision.historiaClinica.alergia_latex,
          },
          embarazo: {
            ...defaultFormData.embarazo,
            ...selectedAdmision.historiaClinica.embarazo,
          },
          anticonceptivo: {
            ...defaultFormData.anticonceptivo,
            ...selectedAdmision.historiaClinica.anticonceptivo,
          },
          reemplazoHormonal: {
            ...defaultFormData.reemplazoHormonal,
            ...selectedAdmision.historiaClinica.reemplazo_hormonal,
          },
          examenRadiografico: {
            ...defaultFormData.examenRadiografico,
            ...selectedAdmision.historiaClinica.examen_radiografico,
          },
          odontodiagrama: selectedAdmision.historiaClinica.odontodiagrama || {},
          observaciones: selectedAdmision.historiaClinica.observaciones || "",
          diagnostico: selectedAdmision.historiaClinica.diagnostico || "",
          admision_cerrada:
            selectedAdmision.historiaClinica.admision_cerrada || false,
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [selectedAdmision, admisionId, pacienteId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      const keys = name.split(".");
      let newState = { ...prevState };
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = type === "checkbox" ? checked : value;

      return newState;
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
    const formDataToSend = {
      ...formData,
      xx_admission: parseInt(formData.xx_admission, 10),
      c_bpartner_id: parseInt(formData.c_bpartner_id, 10),
    };
    onSave(formDataToSend);
  };

  const handleCerrarAdmision = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres cerrar esta admisión? Esta acción no se puede deshacer."
      )
    ) {
      try {
        const response = await fetch(
          `/api/historia-clinica/${admisionId}/cerrar`,
          {
            method: "POST",
          }
        );
        if (response.ok) {
          setFormData((prev) => ({ ...prev, admision_cerrada: true }));
          alert("Admisión cerrada con éxito");
        } else {
          throw new Error("Error al cerrar la admisión");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cerrar la admisión");
      }
    }
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

        {/* Sección: Intervención Quirúrgica */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaCut className="mr-2 text-red-500" />
            Intervención Quirúrgica
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="intervencionQuirurgica"
                name="intervencionQuirurgica.realizada"
                checked={formData.intervencionQuirurgica.realizada}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="intervencionQuirurgica">
                ¿Ha sido sometido a alguna intervención quirúrgica?
              </label>
            </div>
            {formData.intervencionQuirurgica.realizada && (
              <textarea
                name="intervencionQuirurgica.especificaciones"
                value={formData.intervencionQuirurgica.especificaciones}
                onChange={handleInputChange}
                placeholder="Especifique"
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        </div>

        {/* Sección: Problema de Hemorragia */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaTint className="mr-2 text-red-500" />
            Problema de Hemorragia
          </h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="problemaHemorragia"
              name="problemaHemorragia"
              checked={formData.problemaHemorragia}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="problemaHemorragia">
              ¿Ha tenido algún problema de hemorragia después de la cirugía?
            </label>
          </div>
        </div>

        {/* Sección: Medicamento Actual */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaPills className="mr-2 text-blue-500" />
            Medicamento Actual
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="medicamentoActual"
                name="medicamentoActual.toma"
                checked={formData.medicamentoActual.toma}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="medicamentoActual">
                ¿Está tomando actualmente algún medicamento?
              </label>
            </div>
            {formData.medicamentoActual.toma && (
              <textarea
                name="medicamentoActual.especificaciones"
                value={formData.medicamentoActual.especificaciones}
                onChange={handleInputChange}
                placeholder="Especifique"
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        </div>

        {/* Sección: Alergia al Látex */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaAllergies className="mr-2 text-yellow-500" />
            Alergia al Látex
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="alergiaLatex"
                name="alergiaLatex.esAlergico"
                checked={formData.alergiaLatex.esAlergico}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="alergiaLatex">
                ¿Es alérgico al látex o algún otro material?
              </label>
            </div>
            {formData.alergiaLatex.esAlergico && (
              <textarea
                name="alergiaLatex.especificaciones"
                value={formData.alergiaLatex.especificaciones}
                onChange={handleInputChange}
                placeholder="Especifique"
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        </div>

        {/* Sección: Embarazo y Anticonceptivos */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaBaby className="mr-2 text-pink-500" />
            Embarazo y Anticonceptivos
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="embarazo"
                name="embarazo.esta"
                checked={formData.embarazo.esta}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="embarazo">¿Está embarazada?</label>
            </div>
            {formData.embarazo.esta && (
              <input
                type="text"
                name="embarazo.tiempoGestacion"
                value={formData.embarazo.tiempoGestacion}
                onChange={handleInputChange}
                placeholder="Tiempo de gestación"
                className="w-full p-2 border rounded"
              />
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anticonceptivo"
                name="anticonceptivo.toma"
                checked={formData.anticonceptivo.toma}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="anticonceptivo">
                ¿Está tomando algún anticonceptivo?
              </label>
            </div>
            {formData.anticonceptivo.toma && (
              <input
                type="text"
                name="anticonceptivo.cual"
                value={formData.anticonceptivo.cual}
                onChange={handleInputChange}
                placeholder="¿Cuál?"
                className="w-full p-2 border rounded"
              />
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reemplazoHormonal"
                name="reemplazoHormonal.toma"
                checked={formData.reemplazoHormonal.toma}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="reemplazoHormonal">
                ¿Está tomando algún reemplazo hormonal?
              </label>
            </div>
            {formData.reemplazoHormonal.toma && (
              <input
                type="text"
                name="reemplazoHormonal.cual"
                value={formData.reemplazoHormonal.cual}
                onChange={handleInputChange}
                placeholder="¿Cuál?"
                className="w-full p-2 border rounded"
              />
            )}
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
          <Odontodiagrama
            onChange={handleOdontodiagramaChange}
            initialData={formData.odontodiagrama || {}}
          />
        </div>

        {/* Nueva sección: Observaciones */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaComments className="mr-2 text-blue-500" />
            Observaciones
          </h3>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
            placeholder="Ingrese las observaciones relevantes"
          />
        </div>

        {/* Nueva sección: Diagnóstico */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition duration-300 ease-in-out hover:shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaStethoscope className="mr-2 text-green-500" />
            Diagnóstico
          </h3>
          <textarea
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
            placeholder="Ingrese el diagnóstico del paciente"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={formData.admision_cerrada}
          className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out ${
            formData.admision_cerrada ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaSave className="mr-2" />
          Guardar Historia Clínica
        </button>
        <button
          type="button"
          onClick={handleCerrarAdmision}
          disabled={formData.admision_cerrada}
          className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out ${
            formData.admision_cerrada ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FaLock className="mr-2" />
          Aprobar y Cerrar Admisión
        </button>
      </div>
      {formData.admision_cerrada && (
        <div className="text-red-600 font-bold text-center mt-4">
          Esta admisión está cerrada y no puede ser modificada.
        </div>
      )}
    </form>
  );
}
