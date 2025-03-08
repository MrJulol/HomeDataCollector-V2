const app = require("express")();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("express-cors");

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

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

app.get("/steps/one", authenticate, (req, res) => {
  const { user, date } = req.body;
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

app.get("/steps/list", authenticate, (req, res) => {
  const { user } = req.body;
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

app.get("/steps/total", authenticate, (req, res) => {
  const { user } = req.body;
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
