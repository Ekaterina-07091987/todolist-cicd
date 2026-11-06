require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const API_KEY = process.env.API_KEY || "my-secret-key";

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

app.use("/api/tasks", checkApiKey);

let tasks = [];
let nextId = 1;

app.get("/api/tasks", async (req, res) => {
  try {
    res.json(tasks);
  } catch (e) {
    console.error("Ошибка при получении задач", e.message);
    res.status(500).json({ error: "Ошибка при запросе к API" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = {
      id: nextId++,
      text: req.body.text,
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Ошибка при добавлении задачи", error.message);
    res.status(500).json({ error: "Ошибка при добавлении задачи" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    tasks = tasks.filter((task) => task.id !== id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Ошибка при удалении задачи", error.message);
    res.status(500).json({ error: "Ошибка при удалении задачи" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Задача не найдена" });
    }

    tasks[taskIndex].text = req.body.text;
    res.json(tasks[taskIndex]);
  } catch (error) {
    console.error("Ошибка при обновлении задачи", error.message);
    res.status(500).json({ error: "Ошибка при обновлении" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`сервер запущен на порту ${PORT}`);
});