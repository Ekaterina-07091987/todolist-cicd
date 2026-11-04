import { useState, useEffect } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import "../App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const API_URL = "http://localhost:4000/api/tasks";
  const API_KEY = "my-secret-key";

  useEffect(() => {
    fetch(API_URL, {
      headers: { "x-api-key": API_KEY },
    })
      .then((res) => res.json())
      .then(setTasks)
      .catch((err) => console.error("Ошибка:", err));
  }, []);

  const handleAddTask = async () => {
    if (!inputValue.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ text: inputValue }),
      });

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setInputValue("");
    } catch (e) {
      console.error("Ошибка при добавлении", e);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "x-api-key": API_KEY },
      });

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error("Ошибка при удалении", e);
    }
  };

  const handleUpdateTask = async (id, newText) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ text: newText }),
      });

      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (e) {
      console.error("Ошибка при обновлении", e);
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