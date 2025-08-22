const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 3001;
const secretKey = "your-secret-key"; // Change this to a long, random string

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000', 'http://localhost'],
  credentials: true
}));

app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mydb",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], secretKey);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];
    client.release();

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.id, username: user.username, roleId: user.role_id },
        secretKey,
        {
          expiresIn: "2h",
        }
      );
      return res.json({ token });
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.get("/api/rubrica", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const client = await pool.connect();
        const sortBy = req.query.sortBy || "id";
    const order = req.query.order || "asc";
    const allowedSortBy = ["id", "nome", "cognome", "telefono", "email", "indirizzo"];
    if (!allowedSortBy.includes(sortBy)) {
      return res.status(400).send("Invalid sort column");
    }

    const result = await client.query(`SELECT * FROM rubrica ORDER BY ${sortBy} ${order.toUpperCase()} LIMIT $1 OFFSET $2`, [pageSize, offset]);
    const totalResult = await client.query("SELECT COUNT(*) FROM rubrica");
    const total = parseInt(totalResult.rows[0].count);
    res.json({ data: result.rows, total });
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.post("/api/rubrica", verifyToken, async (req, res) => {
  const { nome, cognome, telefono, email, indirizzo } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO rubrica (nome, cognome, telefono, email, indirizzo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, cognome, telefono, email, indirizzo]
    );
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.put("/api/rubrica/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nome, cognome, telefono, email, indirizzo } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE rubrica SET nome = $1, cognome = $2, telefono = $3, email = $4, indirizzo = $5 WHERE id = $6 RETURNING *",
      [nome, cognome, telefono, email, indirizzo, id]
    );
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.delete("/api/rubrica/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const client = await pool.connect();
    await client.query("DELETE FROM rubrica WHERE id = $1", [id]);
    res.status(204).send();
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
