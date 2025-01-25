import React, { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { RiDragMove2Fill } from "react-icons/ri";
import io from "socket.io-client";

interface TaskProps {
    task: { id: string; title: string };
    columnId: string;
    columns: any[];
    setColumns: (columns: any[]) => void;
}

// Initialize socket connection
const socket = io('http://localhost:4000', {
    query: { userId: "9535030958" }, // Set a fixed user ID
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});

const KanbanTask: React.FC<TaskProps> = ({ task, columnId, columns, setColumns }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { type: "task", columnId },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);

    useEffect(() => {
        // Listen for task updates via socket
        socket.on("taskUpdated", (updatedColumns) => {
            setColumns(updatedColumns);
        });

        return () => {
            socket.off("taskUpdated");
        };
    }, [setColumns]);

    // Function to handle task deletion
    const handleDeleteTask = () => {
        const updatedColumns = columns.map((col) =>
            col.id === columnId
                ? { ...col, items: col.items.filter((item) => item.id !== task.id) }
                : col
        );

        setColumns(updatedColumns);

        // Emit event to the server
        socket.emit("deleteTask", { taskId: task.id, columnId });
    };

    // Function to toggle editing mode
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Function to save the edited task title
    const handleSaveEdit = () => {
        if (!newTitle.trim()) return;

        const updatedColumns = columns.map((col) =>
            col.id === columnId
                ? {
                    ...col,
                    items: col.items.map((item) =>
                        item.id === task.id ? { ...item, title: newTitle } : item
                    ),
                }
                : col
        );

        setColumns(updatedColumns);
        setIsEditing(false);

        // Emit event to the server
        socket.emit("editTask", { taskId: task.id, columnId, newTitle });
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
        backgroundColor: isDragging ? "#e0f2fe" : "#fff",
    };

    return (
        <div
            className="border p-3 rounded-md bg-white dark:bg-gray-700 flex justify-between items-center transition-all shadow-md hover:shadow-lg"
            style={style}
        >
            {isEditing ? (
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                    className="border p-2 rounded-md w-full text-gray-800 dark:text-gray-200"
                    autoFocus
                />
            ) : (
                <span className="text-gray-900 dark:text-gray-100 w-full">{task.title}</span>
            )}

            <div className="flex gap-2">
                {isEditing ? (
                    <FaSave className="cursor-pointer text-green-500" onClick={handleSaveEdit} />
                ) : (
                    <FaEdit className="cursor-pointer text-gray-500" onClick={handleEditClick} />
                )}
                <FaTrash className="cursor-pointer text-red-500" onClick={handleDeleteTask} />
                <span
                    style={{ cursor: "grab" }}
                    ref={setNodeRef}
                    {...attributes}
                    {...listeners}
                >
                    <RiDragMove2Fill />
                </span>
            </div>
        </div>
    );
};

export default KanbanTask;
