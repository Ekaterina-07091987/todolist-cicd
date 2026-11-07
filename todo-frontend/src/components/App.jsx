import { useState, useEffect } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import "../App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const API_URL = "/api/tasks";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
        return res.json();
      })
      .then(setTasks)
      .catch((err) => console.error("Ошибка загрузки задач:", err));
  }, []);

  const handleAddTask = async () => {
    if (!inputValue.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputValue }),
      });

      if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setInputValue("");
    } catch (err) {
      console.error("Ошибка при добавлении задачи:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении задачи:", err);
    }
  };

  const handleUpdateTask = async (id, newText) => {
    try {
      const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });

      if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);

      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      console.error("Ошибка при обновлении задачи:", err);
    }
  };

  return (
    <div className="App">
      <h1>Мой список дел</h1>

      <TaskInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onAddTask={handleAddTask}
      />

      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
      />

      <p>Задач: {tasks.length}</p>
    </div>
  );
}

export default App;