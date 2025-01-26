import React, { useEffect, useRef, useState } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import Layout from "../components/Layout";
import KanbanColumn from "../components/Kanban/KanbanColumn";

// import { CSS } from "@dnd-kit/utilities";
import { io } from "socket.io-client";
import { createColumn, rearrangingColumns } from "../services/columnApiService";
import { rearrangeTask, rearrangeTaskWithColumns } from "../services/columnApiService";
import { getBoardData } from "../services/boardApiServices";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// import { fetchTasks } from "../services/taskApiService";



const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState<any[]>([]);

  const [activeTask, setActiveTask] = useState<any>(null);
  const [boardData, setBoardData] = useState({})
  // const [showAddColumnButton, setShowAddColumnButton] = useState(true);
  const { boardId } = useParams<{ boardId: string }>();
  // Get the user ID and accessToken from Redux state
  //  @ts-ignore
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem("accessToken");

  // const token = localStorage.getItem("accessToken");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //  @ts-ignore
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
      //  @ts-ignore
      const boardData = await getBoardData(boardId, token);
      //console.log("this is board", boardData);
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
          //("this is boardData", board);

          // Extracting columns from the fetched board data and updating state
          if (board?.board?.columns) {
            setColumns(board.board.columns);
            //("Updated columns:", board.board.columns);
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
      //("Received task update:", updatedColumns);
      setColumns(updatedColumns);
    });

    // Listen for column updates
    socket.on("columnUpdated", (updatedColumns) => {
      //("Received column update:", updatedColumns);
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
      //("Created Column:", newColumn);
      toast.success("Column Created Successfully!");

      setColumns((prevColumns) => {
        const updatedColumns = [...prevColumns, newColumn.column];
        //(updatedColumns); // Debugging to check updated state
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

    // Find the column that contains the dragged task by ID
    const sourceColumn = columns.find((col) =>
      col.tasks.some((taskId: string) => taskId === activeId)
    );

    if (sourceColumn) {
      setActiveTask(activeId);
    }
  };

  const handleColumnReorder = async (newOrder: string[]) => {
    try {
      if (!token) {
        alert("User not authenticated");
        return;
      }
      //  @ts-ignore
      await rearrangingColumns(boardId, newOrder, token);
      toast.success("Columns reordered successfully!");
    } catch (error) {
      console.error("Reordering failed:", error);
      toast.error("Failed to reorder columns.");
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
          col.tasks.some((taskId: string) => taskId === activeId)
        );
        let targetColumn = updatedColumns.find((col) =>
          col.tasks.some((taskId: string) => taskId === overId)
        );

        if (sourceColumn && targetColumn) {
          const activeIndex = sourceColumn.tasks.findIndex((taskId: string) => taskId === activeId);
          const overIndex = targetColumn.tasks.findIndex((taskId: string) => taskId === overId);

          if (sourceColumn._id === targetColumn._id) {
            // Reordering within the same column
            sourceColumn.tasks = arrayMove(sourceColumn.tasks, activeIndex, overIndex);
          } else {
            // Moving task between different columns
            const [movedTaskId] = sourceColumn.tasks.splice(activeIndex, 1);
            targetColumn.tasks.splice(overIndex, 0, movedTaskId);
          }
        }
      }

      if (isActiveTask && isOverColumn) {
        let sourceColumn = updatedColumns.find((col) =>
          col.tasks.some((taskId: string) => taskId === activeId)
        );
        let targetColumn = updatedColumns.find((col) => col._id === overId);

        if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
          const activeIndex = sourceColumn.tasks.findIndex((taskId: string) => taskId === activeId);
          const [movedTaskId] = sourceColumn.tasks.splice(activeIndex, 1);
          targetColumn.tasks.push(movedTaskId);
        }
      }

      socket.emit("taskUpdated", updatedColumns);
      return updatedColumns;
    });
  };



  const onDragEnd = async (event: any) => {
    console.log("Drag event:", event);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) {
      return;
    }

    console.log("Over ID:", overId);

    // Check if the active and over elements are columns or tasks
    const isActiveColumn = active.data.current?.type === "column";
    const isActiveTask = active.data.current?.type === "task";

    if (isActiveColumn) {
      const oldIndex = columns.findIndex((col) => col._id === activeId);
      const newIndex = columns.findIndex((col) => col._id === overId);

      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        const reorderedColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(reorderedColumns);

        // Extract column IDs to send to the backend
        const updatedColumnIds = reorderedColumns.map((col) => col._id);
        await handleColumnReorder(updatedColumnIds);

        // Refresh columns from the server after update
        //  @ts-ignore
        getTasksForAllColumns();
      }
    }

    if (isActiveTask) {
      console.log("Active Task:", activeTask);
      let sourceColumn = null;
      let targetColumn = null;

      // Find source column
      for (const col of columns) {
        if (col.tasks.includes(activeId)) {
          sourceColumn = col;
          break;
        }
      }

      if (!sourceColumn) {
        console.error("Source column not found!");
        return;
      }

      console.log("Source Column:", sourceColumn._id);

      // Find target column (by task or column ID)
      for (const col of columns) {
        if (col.tasks.includes(overId) || col._id === overId) {
          targetColumn = col;
          break;
        }
      }

      if (!targetColumn) {
        console.error("Target column not found!");
        return;
      }

      console.log("Target Column:", targetColumn._id);

      const oldTaskIndex = sourceColumn.tasks.indexOf(activeId);
      const newTaskIndex = targetColumn.tasks.indexOf(overId) - 1;
      console.log(newTaskIndex)

      if (oldTaskIndex === -1) {
        console.error("Task not found in source column");
        return;
      }

      // Optimistic UI update
      setColumns((prevColumns) => {
        const updatedColumns = [...prevColumns];

        if (sourceColumn._id === targetColumn._id) {
          // Reordering within the same column
          updatedColumns.find(col => col._id === sourceColumn._id).tasks = arrayMove(
            sourceColumn.tasks,
            oldTaskIndex,
            newTaskIndex === -1 ? sourceColumn.tasks.length - 1 : newTaskIndex
          );
        } else {
          // Moving task between columns
          const [movedTask] = updatedColumns
            .find(col => col._id === sourceColumn._id)
            .tasks.splice(oldTaskIndex, 1);

          updatedColumns.find(col => col._id === targetColumn._id).tasks.splice(
            newTaskIndex === -1 ? targetColumn.tasks.length : newTaskIndex,
            0,
            movedTask
          );
        }

        return updatedColumns;
      });

      // Send API request to update task order
      try {
        if (sourceColumn._id === targetColumn._id) {
          //  @ts-ignore
          const updatedTaskIds = targetColumn.tasks.map((task) => task);
          //  @ts-ignore
          await rearrangeTask(boardId, targetColumn._id, updatedTaskIds, token);
        } else {
          //  @ts-ignore
          const updatedTaskIds = targetColumn.tasks.map((task) => task._id);
          //  @ts-ignore
          await rearrangeTaskWithColumns(boardId, sourceColumn._id, updatedTaskIds, token);
        }
        console.log("Task order updated on server.");
      } catch (error) {
        console.error("Error updating task order:", error);
      }

      // Refresh tasks for affected columns
      getTasksForColumn(sourceColumn._id);
      getTasksForColumn(targetColumn._id);
    }

    setActiveTask(null);
  };

  const columnRefs = useRef({});

  // Function to refresh tasks after drop
  const getTasksForColumn = (columnId:any) => {
    //  @ts-ignore
    if (columnRefs.current[columnId]) {
      //  @ts-ignore
      columnRefs.current[columnId].refreshTasks();
    }
  };



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
  //  @ts-ignore
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
           
            <h1>{(boardData as any)?.board?.name}</h1> 

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
                          key={column._id}
                          //  @ts-ignore
                          ref={(el) => (columnRefs.current[column._id] = el)}
                          //  @ts-ignore
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
