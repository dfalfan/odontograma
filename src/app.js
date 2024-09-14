const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const { Pool } = require("pg");

const pool = new Pool({
  user: "adempiere",
  host: "192.168.5.7",
  database: "adempiere",
  password: "adempiere",
  port: 5432,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Rutas
app.get("/", (req, res) => {
  res.send("Bienvenido a la aplicación Odontograma");
});

app.get("/api/paciente/:cedula", async (req, res) => {
  try {
    const { cedula } = req.params;
    const query = `
      SELECT DISTINCT ON (ad.xx_admission)
        ad.dateordered::date AS "fecha",
        ad.xx_admission AS "admision",
        px.name AS "paciente",
        px.value AS "cedula",
        px.birthday::date AS "nacimiento",
        pla.name AS "servicio",
        md.name AS "medico_linea",
        ad.xx_sede AS "sede"
      FROM c_order AS ad
      INNER JOIN c_bpartner AS px ON px.c_bpartner_id = ad.c_bpartner_id
      INNER JOIN c_orderline AS lad ON lad.c_order_id = ad.c_order_id
      INNER JOIN m_product AS pla ON pla.m_product_id = lad.m_product_id
      INNER JOIN c_bpartner AS md ON md.c_bpartner_id = lad.xx_vendor_id
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

// Iniciar el servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});

module.exports = app;
