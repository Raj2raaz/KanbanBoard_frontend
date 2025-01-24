import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { RiDragMove2Fill } from "react-icons/ri";
import { DragOverlay } from "@dnd-kit/core";

interface TaskProps {
    task: { id: string; title: string };
    columnId: string;
    columns: any[];
    setColumns: (columns: any[]) => void;
}

const KanbanTask: React.FC<TaskProps> = ({ task, columnId, columns, setColumns }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { type: "task", columnId },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);

    // Function to handle task deletion
    const handleDeleteTask = () => {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === columnId
                    ? { ...col, items: col.items.filter((item) => item.id !== task.id) }
                    : col
            )
        );
    };

    // Function to toggle editing mode
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Function to save the edited task title
    const handleSaveEdit = () => {
        if (!newTitle.trim()) return;
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === columnId
                    ? {
                        ...col,
                        items: col.items.map((item) =>
                            item.id === task.id ? { ...item, title: newTitle } : item
                        ),
                    }
                    : col
            )
        );
        setIsEditing(false);
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
                    style={{ cursor: 'grab' }}
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
