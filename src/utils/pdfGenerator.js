const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const {
  toothNames,
  partTranslations,
  dentalConditions,
} = require("../utils/odontoConstants");

function translateOdontograma(odontodata) {
  const translations = [];
  for (const [tooth, parts] of Object.entries(odontodata)) {
    for (const [part, conditionCode] of Object.entries(parts)) {
      const condition = dentalConditions.find((c) => c.code === conditionCode);
      if (condition) {
        translations.push(
          `${toothNames[tooth] || `Diente ${tooth}`} (${tooth}) superficie ${
            partTranslations[part]
          } ${condition.name}`
        );
      }
    }
  }
  return translations;
}

function generatePDF(historiaClinica, filePath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 80, bottom: 50, left: 30, right: 30 }, // Reducir margen izquierdo
      });
      const stream = fs.createWriteStream(filePath);

      stream.on("error", (err) => {
        console.error("Error en el stream de escritura:", err);
        reject(err);
      });

      doc.pipe(stream);

      // Colores y estilos
      const colors = {
        primary: "#0077be",
        secondary: "#333333",
        background: "#f4f4f4",
      };

      // Fuentes
      doc.registerFont(
        "Regular",
        path.join(__dirname, "../../public/fonts/Roboto-Regular.ttf")
      );
      doc.registerFont(
        "Bold",
        path.join(__dirname, "../../public/fonts/Roboto-Bold.ttf")
      );
      doc.registerFont(
        "Italic",
        path.join(__dirname, "../../public/fonts/Roboto-Italic.ttf")
      );

      //ENCABEZADO

      function addHeader() {
        // Fondo del encabezado
        doc.rect(0, 0, doc.page.width, 80).fill(colors.primary);

        // Cargar y añadir el logo
        doc.image(
          path.join(__dirname, "../../public/images/logocompletoblanco.png"),
          50,
          25,
          {
            width: 150,
          }
        );

        // Texto del encabezado alineado a la derecha
        doc.fontSize(20).font("Bold").fillColor("white"); // Tamaño de fuente reducido

        const rightMargin = 50;
        const textWidth = 200;
        const x = doc.page.width - textWidth - rightMargin;

        doc.text("HISTORIA", x, 7, { width: textWidth, align: "right" });
        doc.text("CLÍNICA", x, 30, { width: textWidth, align: "right" });
        doc.text("ODONTOLÓGICA", x, 53, { width: textWidth, align: "right" });

        // Restablecer la posición del cursor después del encabezado
        doc.moveDown(0.6).text("", 50, doc.y);
      }

      //FOOTER

      function addFooter() {
        const pageNumber = doc.bufferedPageRange().count;
        doc
          .fontSize(10)
          .fillColor(colors.secondary)
          .text(`Página ${pageNumber}`, 0, doc.page.height - 50, {
            align: "center",
          });
      }

      // Función addSection modificada para mantener la alineación a la izquierda
      function addSection(title) {
        doc
          .fontSize(14)
          .font("Bold")
          .fillColor(colors.primary)
          .text(title, { underline: true })
          .moveDown(0.5);

        // Restaurar el estilo normal para el contenido
        doc.fontSize(12).font("Regular").fillColor(colors.secondary);
      }

      // Inicio del documento
      addHeader();

      // Resetear la posición y los márgenes para el contenido principal
      doc.moveDown(2).font("Regular").fontSize(12).fillColor(colors.secondary);

      // Información del Paciente
      addSection("Información del Paciente");
      const patientInfo = [
        {
          label: "Nombre",
          value: historiaClinica.paciente || "No especificado",
        },
        { label: "Cédula", value: historiaClinica.cedula || "No especificada" },
        {
          label: "Fecha de Nacimiento",
          value: historiaClinica.nacimiento
            ? new Date(historiaClinica.nacimiento).toLocaleDateString()
            : "No especificada",
        },
      ];

      doc.fontSize(12).font("Regular").fillColor(colors.secondary);
      patientInfo.forEach(({ label, value }) => {
        doc
          .font("Bold")
          .text(`${label}:`, { continued: true })
          .font("Regular")
          .text(` ${value}`)
          .moveDown(0.5);
      });

      doc.moveDown();

      // Motivo de Consulta
      addSection("Motivo de Consulta");
      doc
        .font("Regular")
        .fontSize(12)
        .fillColor(colors.secondary)
        .text(historiaClinica.motivo_consulta || "No especificado");
      doc.moveDown();

      // Enfermedad Actual
      addSection("Enfermedad Actual");
      doc
        .font("Regular")
        .fontSize(12)
        .fillColor(colors.secondary)
        .text(historiaClinica.enfermedad_actual || "No especificada");
      doc.moveDown();

      // Antecedentes Patológicos Hereditarios
      addSection("Antecedentes Patológicos Hereditarios");
      doc
        .font("Regular")
        .fontSize(12)
        .fillColor(colors.secondary)
        .text(
          historiaClinica.antecedentes_patologicos_hereditarios ||
            "No especificados"
        );
      doc.moveDown();

      // Alergias
      addSection("Alergias");
      const alergias =
        typeof historiaClinica.alergias === "string"
          ? JSON.parse(historiaClinica.alergias)
          : historiaClinica.alergias;
      if (alergias && alergias.esAlergico) {
        doc.text("El paciente es alérgico a:");
        Object.entries(alergias.tipos).forEach(([key, value]) => {
          if (value)
            doc.text(`- ${key.charAt(0).toUpperCase() + key.slice(1)}`);
        });
        if (alergias.especifiqueOtros)
          doc.text(`- ${alergias.especifiqueOtros}`);
      } else {
        doc.text("El paciente no presenta alergias conocidas.");
      }
      doc.moveDown();

      // Hábitos
      addSection("Hábitos");
      const habitos =
        typeof historiaClinica.habitos === "string"
          ? JSON.parse(historiaClinica.habitos)
          : historiaClinica.habitos;

      if (habitos && Object.values(habitos).some((value) => value)) {
        doc.text("El paciente presenta los siguientes hábitos:");
        Object.entries(habitos).forEach(([key, value]) => {
          if (value) {
            const habitoFormateado = key
              .split(/(?=[A-Z])/)
              .join(" ")
              .toLowerCase()
              .replace(/^./, (str) => str.toUpperCase());
            doc.text(`- ${habitoFormateado}`);
          }
        });
      } else {
        doc.text("No se registraron hábitos específicos.");
      }
      doc.moveDown();

      // Antecedentes Personales Patológicos
      addSection("Antecedentes Personales Patológicos");
      const antecedentes =
        typeof historiaClinica.antecedentes_personales_patologicos === "string"
          ? JSON.parse(historiaClinica.antecedentes_personales_patologicos)
          : historiaClinica.antecedentes_personales_patologicos;

      if (antecedentes) {
        const antecedentesMarcados = Object.entries(antecedentes)
          .filter(
            ([key, value]) => value === true && key !== "especificaciones"
          )
          .map(([key, _]) =>
            key
              .split(/(?=[A-Z])/)
              .join(" ")
              .toLowerCase()
              .replace(/^./, (str) => str.toUpperCase())
          );

        if (antecedentesMarcados.length > 0 || antecedentes.especificaciones) {
          doc.text("El paciente presenta los siguientes antecedentes:");
          antecedentesMarcados.forEach((antecedente) => {
            doc.text(`- ${antecedente}`);
          });

          if (
            antecedentes.especificaciones &&
            antecedentes.especificaciones.trim() !== ""
          ) {
            doc.text(`- ${antecedentes.especificaciones.trim()}`);
          }
        } else {
          doc.text(
            "No se registraron antecedentes personales patológicos específicos."
          );
        }
      } else {
        doc.text(
          "No hay información sobre antecedentes personales patológicos."
        );
      }
      doc.moveDown();

      // Intervención Quirúrgica
      addSection("Intervención Quirúrgica");
      const intervencionQuirurgica =
        typeof historiaClinica.intervencion_quirurgica === "string"
          ? JSON.parse(historiaClinica.intervencion_quirurgica)
          : historiaClinica.intervencion_quirurgica;

      if (intervencionQuirurgica && intervencionQuirurgica.realizada) {
        doc.text("El paciente ha sido sometido a intervención quirúrgica.");
        if (intervencionQuirurgica.especificaciones) {
          doc.text("Detalles:");
          doc.text(intervencionQuirurgica.especificaciones);
        }
      } else {
        doc.text("El paciente no ha sido sometido a intervención quirúrgica.");
      }
      doc.moveDown();

      // Problema de Hemorragia
      addSection("Problema de Hemorragia");
      const problemaHemorragia =
        typeof historiaClinica.problema_hemorragia === "string"
          ? JSON.parse(historiaClinica.problema_hemorragia)
          : historiaClinica.problema_hemorragia;

      if (problemaHemorragia && problemaHemorragia.esProblema) {
        doc.text("El paciente presenta un problema de hemorragia.");
        if (problemaHemorragia.especificaciones) {
          doc.text("Detalles:");
          doc.text(problemaHemorragia.especificaciones);
        }
      } else {
        doc.text("El paciente no presenta un problema de hemorragia.");
      }

      doc.moveDown();

      // Medicamento Actual
      addSection("Medicamento Actual");

      const medicamentoActual =
        typeof historiaClinica.medicamento_actual === "string"
          ? JSON.parse(historiaClinica.medicamento_actual)
          : historiaClinica.medicamento_actual;

      if (medicamentoActual && medicamentoActual.toma) {
        doc.text("El paciente toma el siguiente medicamento:");
        doc.text(medicamentoActual.especificaciones);
      } else {
        doc.text("El paciente no toma medicamentos.");
      }

      doc.moveDown();

      // Alergia al Látex
      addSection("Alergia al Látex");

      const alergiaLatex =
        typeof historiaClinica.alergia_latex === "string"
          ? JSON.parse(historiaClinica.alergia_latex)
          : historiaClinica.alergia_latex;

      if (alergiaLatex && alergiaLatex.esAlergico) {
        doc.text("El paciente es alérgico al Látex.");
        if (alergiaLatex.especificaciones) {
          doc.text("Detalles:");
          doc.text(alergiaLatex.especificaciones);
        }
      } else {
        doc.text("El paciente no es alérgico al Látex.");
      }

      doc.moveDown();

      // Embarazo y Anticonceptivos
      addSection("Embarazo y Anticonceptivos");
      const embarazo =
        typeof historiaClinica.embarazo === "string"
          ? JSON.parse(historiaClinica.embarazo)
          : historiaClinica.embarazo;

      if (embarazo && embarazo.esta) {
        doc.text("Paciente está en estado.");
        if (embarazo.tiempoGestacion) {
          doc.text(`Tiempo de gestación: ${embarazo.tiempoGestacion}`);
        }
      } else {
        doc.text("Paciente no está en estado.");
      }

      doc.moveDown();

      // Anticonceptivo
      addSection("Anticonceptivo");

      const anticonceptivo =
        typeof historiaClinica.anticonceptivo === "string"
          ? JSON.parse(historiaClinica.anticonceptivo)
          : historiaClinica.anticonceptivo;

      if (anticonceptivo && anticonceptivo.toma) {
        doc.text("Paciente toma el siguiente anticonceptivo:");
        doc.text(anticonceptivo.cual);
      } else {
        doc.text("Paciente no toma anticonceptivos.");
      }

      doc.moveDown();

      // Reemplazo hormonal

      addSection("Reemplazo hormonal");

      const reemplazoHormonal =
        typeof historiaClinica.reemplazo_hormonal === "string"
          ? JSON.parse(historiaClinica.reemplazo_hormonal)
          : historiaClinica.reemplazo_hormonal;

      if (reemplazoHormonal && reemplazoHormonal.toma) {
        doc.text("Paciente toma el siguiente reemplazo hormonal:");
        doc.text(reemplazoHormonal.cual);
      } else {
        doc.text("Paciente no toma reemplazos hormonales.");
      }

      doc.moveDown();

      // Examen Radiográfico
      addSection("Examen Radiográfico");

      const examenRadiografico =
        typeof historiaClinica.examen_radiografico === "string"
          ? JSON.parse(historiaClinica.examen_radiografico)
          : historiaClinica.examen_radiografico;

      if (examenRadiografico && examenRadiografico.tipos) {
        const tipos = Object.entries(examenRadiografico.tipos)
          .filter(([key, value]) => value && key !== "otras")
          .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1));

        if (
          tipos.length > 0 ||
          examenRadiografico.especificaciones ||
          examenRadiografico.observaciones
        ) {
          doc.text("Tipos de examen realizados:");
          tipos.forEach((tipo) => {
            doc.text(`- ${tipo}`);
          });

          if (
            examenRadiografico.especificaciones &&
            examenRadiografico.especificaciones.trim() !== ""
          ) {
            doc.moveDown(0.5);
            doc.font("Bold").text("Especificaciones de radiografía:");
            doc
              .font("Regular")
              .text(examenRadiografico.especificaciones.trim());
          }

          if (
            examenRadiografico.observaciones &&
            examenRadiografico.observaciones.trim() !== ""
          ) {
            doc.moveDown(0.5);
            doc.font("Bold").text("Observaciones de radiografía:");
            doc.font("Regular").text(examenRadiografico.observaciones.trim());
          }
        } else {
          doc.text("No se realizaron exámenes radiográficos específicos.");
        }
      } else {
        doc.text("No hay información sobre exámenes radiográficos.");
      }

      doc.moveDown();

      // Odontograma
      addSection("Odontograma");

      const odontodata =
        typeof historiaClinica.odontodiagrama === "string"
          ? JSON.parse(historiaClinica.odontodiagrama)
          : historiaClinica.odontodiagrama;

      const odontogramaDescriptions = translateOdontograma(odontodata);

      if (odontogramaDescriptions.length > 0) {
        doc.text("Detalles del odontograma:");
        odontogramaDescriptions.forEach((description) => {
          doc.text(`- ${description}`);
        });
      } else {
        doc.text("No se registraron detalles en el odontograma.");
      }

      doc.moveDown();

      doc.end();

      stream.on("finish", () => {
        console.log("PDF generado con éxito en:", filePath);
        resolve();
      });
    } catch (err) {
      console.error("Error al generar el PDF:", err);
      reject(err);
    }
  });
}

module.exports = { generatePDF };
