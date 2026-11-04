import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDeleteTask, onUpdateTask }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onUpdate={onUpdateTask}
        />
      ))}
    </ul>
  );
}