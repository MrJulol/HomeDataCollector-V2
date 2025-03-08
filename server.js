const app = require("express")();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("express-cors");
const swaggerDocs = require("./swagger");

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

swaggerDocs(app);

const authenticate = (req, res, next) => {
  if (req.headers.authorization === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

const connect = () => {
  return mysql.createConnection({
    host: "192.168.0.249",
    user: "store",
    password: "Store@12345",
    database: "store",
  });
};

/**
 * @swagger
 * /steps:
 *   post:
 *     summary: Create a new step entry
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               steps:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               user:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created
 *       500:
 *         description: Internal server error
 */
app.post("/steps", authenticate, (req, res) => {
    const { steps, date, user } = req.body;
    console.log(req.body);
    const connection = connect();

    connection.query(
        `INSERT INTO t_step (user, date, steps) VALUES (?, ?, ?)`,
        [user, date, steps],
        (error, _) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(201).send("Created");
            }
        }
    );

    connection.end();
});

/**
 * @swagger
 * /steps/one:
 *   get:
 *     summary: Get steps for a specific date
 *     tags: [Steps]
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: number
 *         required: true
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
app.get("/steps/one", authenticate, (req, res) => {
    const { user, date } = req.query;
    const connection = connect();

    connection.query(
        `SELECT Steps, Date FROM t_step WHERE user = ? AND date = DATE(?)`,
        [user, date],
        (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        }
    );

    connection.end();
});

/**
 * @swagger
 * /steps/list:
 *   get:
 *     summary: Get list of steps for a user
 *     tags: [Steps]
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
app.get("/steps/list", authenticate, (req, res) => {
    const { user } = req.query;
    const connection = connect();

    connection.query(
        `SELECT Steps, Date FROM t_step WHERE user = ?`,
        [user],
        (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        }
    );

    connection.end();
});

/**
 * @swagger
 * /steps/total:
 *   get:
 *     summary: Get total steps for a user
 *     tags: [Steps]
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
app.get("/steps/total", authenticate, (req, res) => {
    const { user } = req.query;
    const connection = connect();

    connection.query(
        `SELECT SUM(Steps) AS Total FROM t_step WHERE user = ?`,
        [user],
        (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results[0]);
            }
        }
    );

    connection.end();
});

/**
 * @swagger
 * /steps:
 *   delete:
 *     summary: Delete steps for a specific date
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Deleted
 *       500:
 *         description: Internal server error
 */
app.delete("/steps", authenticate, (req, res) => {
    const { user, date } = req.body;
    const connection = connect();

    connection.query(
        `DELETE FROM t_step WHERE user = ? AND date = DATE(?)`,
        [user, date],
        (error, _) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send("Deleted");
            }
        }
    );

    connection.end();
});

/**
 * @swagger
 * /steps:
 *   put:
 *     summary: Update steps for a specific date
 *     tags: [Steps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               steps:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal server error
 */
app.put("/steps", authenticate, (req, res) => {
    const { user, date, steps } = req.body;
    console.log(req.body);
    console.log(user, date, steps);
    const connection = connect();

    connection.query(
        `UPDATE t_step SET steps = ? WHERE user = ? AND date = DATE(?)`,
        [steps, user, date],
        (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send(results);
            }
        }
    );

    connection.end();
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
