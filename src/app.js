const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: "adempiere",
  host: "192.168.5.7",
  database: "adempiere",
  password: "adempiere",
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Rutas
app.get("/", (req, res) => {
  res.send("Bienvenido a la aplicación Odontograma");
});

app.get("/api/paciente/:cedula", async (req, res) => {
  try {
    let { cedula } = req.params;
    if (!cedula.startsWith("V")) {
      cedula = "V" + cedula;
    }
    const query = `
      SELECT DISTINCT ON (ad.xx_admission)
        ad.dateordered::date AS "fecha",
        ad.xx_admission AS "admision",
        px.name AS "paciente",
        px.value AS "cedula",
        px.c_bpartner_id AS "c_bpartner_id",
        px.birthday::date AS "nacimiento",
        pla.name AS "servicio",
        md.name AS "medico_linea",
        ad.xx_sede AS "sede",
        COALESCE(o.admision_cerrada, false) AS "admision_cerrada"
      FROM c_order AS ad
      INNER JOIN c_bpartner AS px ON px.c_bpartner_id = ad.c_bpartner_id
      INNER JOIN c_orderline AS lad ON lad.c_order_id = ad.c_order_id
      INNER JOIN m_product AS pla ON pla.m_product_id = lad.m_product_id
      INNER JOIN c_bpartner AS md ON md.c_bpartner_id = lad.xx_vendor_id
      LEFT JOIN xx_odonto AS o ON o.xx_admission = ad.xx_admission
      WHERE ad.xx_services IN (1044558, 1050864)
        AND px.value = $1
      ORDER BY ad.xx_admission DESC, ad.dateordered::date DESC
    `;
    const result = await pool.query(query, [cedula]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "Paciente no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener Historia Clínica
app.post("/api/historia-clinica", async (req, res) => {
  try {
    let {
      xx_admission,
      c_bpartner_id,
      motivoConsulta,
      enfermedadActual,
      antecedentesPatologicosHereditarios,
      alergias,
      habitos,
      antecedentesPersonalesPatologicos,
      intervencionQuirurgica,
      problemaHemorragia,
      medicamentoActual,
      alergiaLatex,
      examenRadiografico,
      odontodiagrama,
      embarazo,
      anticonceptivo,
      reemplazoHormonal,
      observaciones,
      diagnostico,
      admision_cerrada, // Asegúrate de desestructurar este campo
    } = req.body;

    // Asegúrate de que xx_admission y c_bpartner_id sean números
    xx_admission = parseInt(xx_admission, 10);
    c_bpartner_id = parseInt(c_bpartner_id, 10);

    if (isNaN(xx_admission) || isNaN(c_bpartner_id)) {
      throw new Error("xx_admission y c_bpartner_id deben ser números válidos");
    }

    // Asegúrate de que admision_cerrada sea un booleano
    admision_cerrada = !!admision_cerrada;

    console.log("Datos recibidos:", JSON.stringify(req.body, null, 2));

    const query = `
      INSERT INTO xx_odonto (
        xx_admission, c_bpartner_id, motivo_consulta, enfermedad_actual,
        antecedentes_patologicos_hereditarios, es_alergico, alergias, habitos,
        antecedentes_personales_patologicos, intervencion_quirurgica,
        problema_hemorragia, medicamento_actual, alergia_latex,
        examen_radiografico, odontodiagrama, embarazo, anticonceptivo, reemplazo_hormonal,
        observaciones, diagnostico, admision_cerrada
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (xx_admission) DO UPDATE SET
        c_bpartner_id = EXCLUDED.c_bpartner_id,
        motivo_consulta = EXCLUDED.motivo_consulta,
        enfermedad_actual = EXCLUDED.enfermedad_actual,
        antecedentes_patologicos_hereditarios = EXCLUDED.antecedentes_patologicos_hereditarios,
        es_alergico = EXCLUDED.es_alergico,
        alergias = EXCLUDED.alergias,
        habitos = EXCLUDED.habitos,
        antecedentes_personales_patologicos = EXCLUDED.antecedentes_personales_patologicos,
        intervencion_quirurgica = EXCLUDED.intervencion_quirurgica,
        problema_hemorragia = EXCLUDED.problema_hemorragia,
        medicamento_actual = EXCLUDED.medicamento_actual,
        alergia_latex = EXCLUDED.alergia_latex,
        examen_radiografico = EXCLUDED.examen_radiografico,
        odontodiagrama = EXCLUDED.odontodiagrama,
        embarazo = EXCLUDED.embarazo,
        anticonceptivo = EXCLUDED.anticonceptivo,
        reemplazo_hormonal = EXCLUDED.reemplazo_hormonal,
        observaciones = EXCLUDED.observaciones,
        diagnostico = EXCLUDED.diagnostico,
        admision_cerrada = EXCLUDED.admision_cerrada
    `;

    const result = await pool.query(query, [
      xx_admission,
      c_bpartner_id,
      motivoConsulta,
      enfermedadActual,
      antecedentesPatologicosHereditarios,
      alergias.esAlergico,
      JSON.stringify(alergias),
      JSON.stringify(habitos),
      JSON.stringify(antecedentesPersonalesPatologicos),
      JSON.stringify(intervencionQuirurgica),
      problemaHemorragia,
      JSON.stringify(medicamentoActual),
      JSON.stringify(alergiaLatex),
      JSON.stringify(examenRadiografico),
      JSON.stringify(odontodiagrama),
      JSON.stringify(embarazo),
      JSON.stringify(anticonceptivo),
      JSON.stringify(reemplazoHormonal),
      observaciones,
      diagnostico,
      admision_cerrada, // Asegúrate de incluir este campo en los valores de la consulta
    ]);

    console.log("Resultado de la consulta:", result);

    res.json({ message: "Historia clínica guardada con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al guardar la historia clínica" });
  }
});

// Obtener Historia Clínica
app.get("/api/historia-clinica/:admisionId", async (req, res) => {
  try {
    const { admisionId } = req.params;
    const query = `
      SELECT * FROM xx_odonto
      WHERE xx_admission = $1
    `;
    const result = await pool.query(query, [admisionId]);

    if (result.rows.length > 0) {
      const historiaClinica = result.rows[0];
      
      // Asegúrate de que los campos JSON se parseen correctamente
      const jsonFields = ['alergias', 'habitos', 'antecedentes_personales_patologicos', 'intervencion_quirurgica', 'medicamento_actual', 'alergia_latex', 'examen_radiografico', 'odontodiagrama', 'embarazo', 'anticonceptivo', 'reemplazo_hormonal'];
      
      jsonFields.forEach(field => {
        if (typeof historiaClinica[field] === 'string') {
          try {
            historiaClinica[field] = JSON.parse(historiaClinica[field]);
          } catch (e) {
            console.error(`Error parsing JSON for field ${field}:`, e);
            historiaClinica[field] = {};
          }
        }
      });

      res.json(historiaClinica);
    } else {
      res.status(404).json({ message: "Historia clínica no encontrada" });
    }
  } catch (err) {
    console.error("Error al obtener la historia clínica:", err);
    res.status(500).json({ message: "Error al obtener la historia clínica" });
  }
});

// Ruta para cerrar la admisión
app.post("/api/historia-clinica/:admisionId/cerrar", async (req, res) => {
  try {
    const { admisionId } = req.params;
    const query = `
      UPDATE xx_odonto
      SET admision_cerrada = TRUE
      WHERE xx_admission = $1
    `;
    await pool.query(query, [admisionId]);
    res.json({ message: "Admisión cerrada con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al cerrar la admisión" });
  }
});

// Ruta para manejar todas las demás solicitudes y servir index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Iniciar el servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});

module.exports = app;
