import React, { useEffect, useState } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import Layout from "../components/Layout";
import KanbanColumn from "../components/Kanban/KanbanColumn";
import { uniqueId } from "lodash";
import { CSS } from "@dnd-kit/utilities";
import { io } from "socket.io-client";
import { getBoardData, createColumn } from "../services/userApiServices";
import { useParams } from "react-router-dom";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState<any[]>([]);

  const [activeTask, setActiveTask] = useState<any>(null);
  const [boardData, setBoardData] = useState({})
  const [showAddColumnButton, setShowAddColumnButton] = useState(true);
  const { boardId } = useParams<{ boardId: string }>();
  // Get the user ID and accessToken from Redux state
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem("accessToken");

  // const token = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isColumnLoading, setIsColumnLoading] = useState<boolean>(true);

  // Initialize Socket.io connection
  const socket = io("http://localhost:4000", {
    query: { userId: "9535030958" },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  const fetchBoard = async () => {
    try {
      const boardData = await getBoardData(boardId, token);
      console.log("this is board", boardData);
      return boardData;
    } catch (error) {
      console.error("Error fetching board:", error);
    }
  };

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const board = await fetchBoard();
        if (board) {
          setBoardData(board);  // Updating state after data is fetched
          console.log("this is boardData", board);

          // Extracting columns from the fetched board data and updating state
          if (board?.board?.columns) {
            setColumns(board.board.columns);
            console.log("Updated columns:", board.board.columns);
          }
        }
      } catch (error) {
        console.error("Error loading board:", error);
      } finally {
        setIsLoading(false);  // Ensure loading state is updated in all cases
      }
    };

    loadBoard();
  }, [boardId, token]);


  useEffect(() => {
    // Listen for task updates
    socket.on("taskUpdated", (updatedColumns) => {
      console.log("Received task update:", updatedColumns);
      setColumns(updatedColumns);
    });

    // Listen for column updates
    socket.on("columnUpdated", (updatedColumns) => {
      console.log("Received column update:", updatedColumns);
      setColumns(updatedColumns);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to add a new column and emit event
  // const handleAddColumn = () => {
  //   const newColumn = {
  //     id: `col-${uniqueId()}`,
  //     title: "New Column",
  //     items: [],
  //   };

  //   const updatedColumns = [...columns, newColumn];
  //   setColumns(updatedColumns);
  //   socket.emit("columnUpdated", updatedColumns);

  //   setShowAddColumnButton(false);
  // };

  const handleAddColumn = async () => {
    if (!user || !token || !boardId) {
      alert("User not authenticated or Board ID missing");
      return;
    }

    setIsColumnLoading(true);
    try {
      const newColumn = await createColumn("New Column", boardId, token);
      console.log("Created Column:", newColumn);
      toast.success("Column Created Successfully!");

      setColumns((prevColumns) => {
        const updatedColumns = [...prevColumns, newColumn.column];
        console.log(updatedColumns); // Debugging to check updated state
        return updatedColumns;
      });

    } catch (error) {
      console.error("Column creation failed:", error);
      alert("Failed to create column. Please try again.");
    } finally {
      setIsColumnLoading(false);
    }
  };



  const onDragStart = (event: any) => {
    const { active } = event;
    const activeId = active.id;

    // Find the dragged task in any column
    const draggedTask = columns
      .flatMap((col) => col.items)
      .find((task) => task.id === activeId);

    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  const onDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = over.data.current?.type === "task";
    const isOverColumn = over.data.current?.type === "column";

    setColumns((prevColumns) => {
      let updatedColumns = [...prevColumns];

      if (isActiveTask && isOverTask) {
        let sourceColumn = updatedColumns.find((col) =>
          col.items.some((task) => task.id === activeId)
        );
        let targetColumn = updatedColumns.find((col) =>
          col.items.some((task) => task.id === overId)
        );

        if (sourceColumn && targetColumn) {
          const activeIndex = sourceColumn.items.findIndex((task) => task.id === activeId);
          const overIndex = targetColumn.items.findIndex((task) => task.id === overId);

          if (sourceColumn.id === targetColumn.id) {
            sourceColumn.items = arrayMove(sourceColumn.items, activeIndex, overIndex);
          } else {
            const [movedTask] = sourceColumn.items.splice(activeIndex, 1);
            targetColumn.items.splice(overIndex, 0, movedTask);
          }
        }
      }

      if (isActiveTask && isOverColumn) {
        let sourceColumn = updatedColumns.find((col) =>
          col.items.some((task) => task.id === activeId)
        );
        let targetColumn = updatedColumns.find((col) => col.id === overId);

        if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
          const activeIndex = sourceColumn.items.findIndex((task) => task.id === activeId);
          const [movedTask] = sourceColumn.items.splice(activeIndex, 1);
          targetColumn.items.push(movedTask);
        }
      }

      socket.emit("taskUpdated", updatedColumns);
      return updatedColumns;
    });
  };

  const onDragEnd = () => {
    setActiveTask(null);
  };

  // Styling for the DragOverlay component
  const overlayStyle = {
    opacity: 0.5,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
    width: "280px",
    transform: "translateX(-80%) translateY(-50%)",
  };

  const container = {
    maxHeight: "90vh",
    maxWidth: "90%",
    alignItems: "start",
  };

  // Flatten tasks to handle sortable context properly
  const allTaskIds = columns?.length > 0
    ? columns.flatMap((col) => col.items?.map((task) => task.id) || [])
    : [];

  return (
    <>
      {
        isLoading ? (
          <div> Loading </div >
        ) : (
          <Layout>
            <ToastContainer position="top-right" autoClose={3000} />
            <h1>{boardData?.board?.name}</h1>
            <div style={{ display: "flex", gap: "10px" }}>
              <DndContext
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
              >
                <div style={container} className="flex gap-4 p-4 overflow-x-auto">
                  {columns?.length > 0 && (
                    <SortableContext
                      items={columns.map((col) => col.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      {columns.map((column) => (
                        <KanbanColumn
                          key={column.id}
                          column={column}
                          columns={columns}
                          setColumns={setColumns}
                        />
                      ))}
                    </SortableContext>
                  )}


                  <SortableContext items={allTaskIds}>
                    <div className="hidden" />
                  </SortableContext>
                </div>

                {/* Drag Overlay for visual feedback */}
                <DragOverlay>
                  {activeTask && (
                    <div
                      style={overlayStyle}
                      className="border p-3 rounded-md bg-white dark:bg-gray-700 flex justify-between items-center transition-all shadow-md hover:shadow-lg"
                    >
                      {activeTask.title}
                    </div>
                  )}
                </DragOverlay>
              </DndContext>


              <button
                onClick={handleAddColumn}
                style={{
                  maxHeight: "50px",
                  marginTop: "20px",
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all"
              >
                + Add Column
              </button>
            </div>
          </Layout>
        )
      }
    </>


  );
};

export default Dashboard;
