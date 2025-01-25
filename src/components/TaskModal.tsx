import React, { useState } from "react";

interface TaskModalProps {
    onClose: () => void;
    onSave: (taskData: any) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSave }) => {
    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("Pending");
    const [assignedTo, setAssignedTo] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    const colors = ["green", "red", "blue", "black", "purple"];

    const handleSubmit = () => {
        if (!taskName || !description || !assignedTo) {
            alert("Please fill all fields");
            return;
        }
        onSave({
            taskName,
            description,
            status,
            assignedTo,
            color: selectedColor,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[400px]">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    Create New Task
                </h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <textarea
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Assigned To"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div className="flex gap-2">
                        {colors.map((color) => (
                            <div
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-10 h-10 rounded-full cursor-pointer border-2 ${selectedColor === color
                                    ? "border-black dark:border-white"
                                    : "border-gray-300"
                                    }`}
                                style={{ backgroundColor: color }}
                            ></div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
