import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import KanbanTask from "./KanbanTask";
// import { v4 as uniqueId } from "uuid";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { RiDragMove2Fill } from "react-icons/ri";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { UseSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { toast, ToastContainer } from 'react-toastify'
// import { addTask } from "../../redux/slices/taskSlice";
import { addNewTask, fetchTasks } from "../../services/taskApiService";
import { editColumn } from "../../services/columnApiService";
import TaskModal from "../TaskModal";

// Initialize socket connection
const socket = io('http://localhost:4000', {
  query: { userId: "9535030958" }, // Set a fixed user ID
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});
//@ts-ignore
interface ColumnProps {
  column: {
    id: string;
    title: string;
    items: { id: string; title: string }[];
  };
  columns: any[];
  setColumns: (columns: any[]) => void;
}
//@ts-ignore
const KanbanColumn = forwardRef(({ column, columns, setColumns }, ref) => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<any>()
  //@ts-ignore
  const dispatch = useDispatch();
  const { setNodeRef, isOver } = useDroppable({ id: column._id });
  const { attributes, listeners, setNodeRef: sortableRef, transform, transition } = useSortable({
    id: column._id,
    data: { type: "column" },
  });
  //@ts-ignore
  const [taskVersion, setTaskVersion] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const { boardId } = useParams<{ boardId: string }>();
  // Get the user ID and accessToken from Redux state
  //@ts-ignore
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem("accessToken");


  // useEffect(() => {
  //   // Listen for real-time column updates
  //   socket.on("columnUpdated", (updatedColumns) => {
  //     setColumns(updatedColumns);
  //   });

  //   return () => {
  //     socket.off("columnUpdated");
  //   };
  // }, [setColumns]);

  // Delete the column
  const handleDeleteColumn = () => {
    //@ts-ignore
    const updatedColumns = columns.filter((col) => col.id !== column.id);
    setColumns(updatedColumns);

    // Emit event to the server
    socket.emit("deleteColumn", { columnId: column.id });
  };

  // Save the edited column title
  const handleSaveColumn = async () => {
    //("Column ID:", column._id);  // Check the value of columnId
    //("Board ID:", boardId);    // Check the value of boardId
    if (!user || !token || !boardId) {
      alert("User not authenticated or Board ID missing");
      return;
    }

    setIsEditing(true);  // Enable editing mode
    //('this is column title', columnTitle)
    try {
      const updatedColumn = await editColumn(boardId, column._id, columnTitle, token);
      //("Updated Column:", updatedColumn);
      toast.success("Column Updated Successfully!");
      //@ts-ignore
      setColumns((prevColumns) =>
        //@ts-ignore
        prevColumns.map((col) =>
          col.id === column._id ? { ...col, ...updatedColumn.column } : col
        )
      );
    } catch (error) {
      console.error("Column update failed:", error);
      alert("Failed to update column. Please try again.");
    } finally {
      setIsEditing(false);
    }
    //('this is column title', columnTitle)

    if (!columnTitle.trim()) return;
    //@ts-ignore
    const updatedColumns = columns.map((col) =>
      col.id === column._id ? { ...col, title: columnTitle } : col
    );

    setColumns(updatedColumns);
    setIsEditing(false);

    // Emit event to the server
    // socket.emit("editColumn", { columnId: column.id, title: columnTitle });
  };

  // Add new task to the column
  //@ts-ignore
  const handleAddTask = async (newTask) => {
    //(newTask)
    //("Adding task to column:", column._id);

    if (!boardId || !column._id || !token) {
      alert("Required data is missing.");
      return;
    }

    // New task data to be sent to the backend
    const newTaskData = {
      title: `${newTask.taskName}`,
      description: `${newTask.description}`,
      dueDate: "2025-01-30T00:00:00.000Z",
      columnId: column._id,
    };

    try {
      // Call API to add a new task
      const updatedTask = await addNewTask(boardId, column._id, newTaskData, token);
      //("Updated Column:", updatedTask);

      // Show success message
      toast.success("Task Updated Successfully!");

      // Update the column state with the new task
      //@ts-ignore
      setColumns((prevColumns) =>
        //@ts-ignore
        prevColumns.map((col) =>
          col.id === column._id ? { ...col, items: [...col.items, updatedTask] } : col
        )
      );

    } catch (error) {
      console.error("Task creation failed:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      // Close the modal after the operation
      setShowModal(false);
      window.location.reload();
    }
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


  const getTasks = async () => {
    try {
      //@ts-ignore
      const taskData = await fetchTasks(boardId, column._id, token);
      if (taskData) {
        setTasks(taskData?.column?.tasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // Expose getTasks function to parent component (Dashboard)
  useImperativeHandle(ref, () => ({
    refreshTasks: getTasks,
  }));

  return (
    <div style={style}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div ref={setNodeRef} className="transition-all duration-300">
        <div className="flex justify-between items-center mb-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                style={{ marginRight: "2px" }}
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                autoFocus
                className="p-1 border rounded w-full"
              />
              <button
                onClick={handleSaveColumn}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h3
              onDoubleClick={() => setIsEditing(true)}
              className="font-bold text-lg cursor-pointer"
            >
              {columnTitle}
            </h3>
          )}

          <div className="flex space-x-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
                <FaEdit />
              </button>
            )}

            <button onClick={handleDeleteColumn} className="text-red-500 hover:text-red-700">
              <FaTrash />
            </button>
            <span ref={sortableRef} style={{ cursor: "grab" }} {...attributes} {...listeners}>
              <RiDragMove2Fill />
            </span>
          </div>
        </div>
        {tasks?.length > 0 && (
          <>
            <SortableContext items={tasks.map((task: any) => task._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">

                {tasks?.map((task: any) => (
                  <KanbanTask key={task.id} task={task} columnId={column._id} columns={columns} setColumns={setColumns} />
                ))}
              </div>

            </SortableContext>
          </>

        )}


      </div>
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        <FaPlus /> Add Task
      </button>
      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSave={handleAddTask}
        />
      )}
    </div>
  );
});

export default KanbanColumn;
