import React, { useState, useEffect } from "react";
import { rectSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import KanbanTask from "./KanbanTask";
import { v4 as uniqueId } from "uuid";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { RiDragMove2Fill } from "react-icons/ri";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { addTask } from "../../redux/slices/taskSlice";

// Initialize socket connection
const socket = io('http://localhost:4000', {
  query: { userId: "9535030958" }, // Set a fixed user ID
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

interface ColumnProps {
  column: {
    id: string;
    title: string;
    items: { id: string; title: string }[];
  };
  columns: any[];
  setColumns: (columns: any[]) => void;
}

const KanbanColumn: React.FC<ColumnProps> = ({ column, columns, setColumns }) => {
  const dispatch = useDispatch();
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const { attributes, listeners, setNodeRef: sortableRef, transform, transition } = useSortable({
    id: column.id,
    data: { type: "column" },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  useEffect(() => {
    // Listen for real-time column updates
    socket.on("columnUpdated", (updatedColumns) => {
      setColumns(updatedColumns);
    });

    return () => {
      socket.off("columnUpdated");
    };
  }, [setColumns]);

  // Delete the column
  const handleDeleteColumn = () => {
    const updatedColumns = columns.filter((col) => col.id !== column.id);
    setColumns(updatedColumns);

    // Emit event to the server
    socket.emit("deleteColumn", { columnId: column.id });
  };

  // Enable column editing mode
  const handleEditColumn = () => {
    setIsEditing(true);
  };

  // Save the edited column title
  const handleSaveColumn = () => {
    if (!columnTitle.trim()) return;
    const updatedColumns = columns.map((col) =>
      col.id === column.id ? { ...col, title: columnTitle } : col
    );

    setColumns(updatedColumns);
    setIsEditing(false);

    // Emit event to the server
    socket.emit("editColumn", { columnId: column.id, title: columnTitle });
  };

  // Add new task to the column
  const handleAddTask = () => {
    console.log("Adding task to column:", column.id);
    const newTask = { id: uniqueId(), title: `New Task ${column.items.length + 1}` };

    const updatedColumns = columns.map((col) =>
      col.id === column.id
        ? {
          ...col,
          items: [...col.items, newTask],
        }
        : col
    );

    console.log('add', updatedColumns)
    setColumns(updatedColumns);
    // Prepare task data
    const newTaskData = {
      title: `New Task ${column.items.length + 1}`,
      description: "This is a dummy task",
      dueDate: new Date().toISOString(),
      columnId: column.id,
    };

    // Dispatch Redux action to add task
    dispatch(addTask({ boardId: "123123123", columnId: column.id, taskData: newTaskData }));

    // Emit event to the server via socket
    // socket.emit("addTask", { id: column.id, task: newTaskData });
    // Emit event to the server
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    minWidth: "400px",
    backgroundColor: isOver ? "#e0f2fe" : "#f4f4f4",
  };

  return (
    <div style={style}>
      <div ref={setNodeRef} className="transition-all duration-300">
        <div className="flex justify-between items-center mb-2">
          {isEditing ? (
            <input
              type="text"
              style={{ marginRight: "2px" }}
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              onBlur={handleSaveColumn}
              autoFocus
              className="p-1 border rounded w-full"
            />
          ) : (
            <h3 onDoubleClick={handleEditColumn} className="font-bold text-lg cursor-pointer">
              {column.title}
            </h3>
          )}
          <div className="flex space-x-2">
            <button onClick={handleEditColumn} className="text-blue-500 hover:text-blue-700">
              <FaEdit />
            </button>
            <button onClick={handleDeleteColumn} className="text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
            <span ref={sortableRef} style={{ cursor: "grab" }} {...attributes} {...listeners}>
              <RiDragMove2Fill />
            </span>
          </div>
        </div>

        <SortableContext items={column.items.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {column.items.map((task) => (
              <KanbanTask key={task.id} task={task} columnId={column.id} columns={columns} setColumns={setColumns} />
            ))}
          </div>
        </SortableContext>
      </div>
      <button
        onClick={handleAddTask}
        className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        <FaPlus /> Add Task
      </button>
    </div>
  );
};

export default KanbanColumn;
