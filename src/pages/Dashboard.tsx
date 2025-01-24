import React, { useState } from "react";
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

const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState([]);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [showAddColumnButton, setShowAddColumnButton] = useState(true);

  // Function to add a new column
  const handleAddColumn = () => {
    const newColumn = {
      id: `col-${uniqueId()}`,
      title: "New Column",
      items: [],
    };
    setColumns([...columns, newColumn]);
    setShowAddColumnButton(false);
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

      return updatedColumns;
    });
  };

  const onDragEnd = () => {
    setActiveTask(null);
  };

  const overlayStyle = {
    opacity: 0.5,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
    width: '280px',
    transform: "translateX(-80%) translateY(-50%)",
  };

  const container = {
    maxHeight: "90vh",
    maxWidth: "90%",
    alignItems: 'start'
  }

  const allTaskIds = columns.flatMap((col) => col.items.map((task) => task.id));

  return (
    <Layout>
      <div style={{ display: 'flex', gap: '10px' }}>
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div style={container} className="flex gap-4 p-4 overflow-x-auto">
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

            <SortableContext items={allTaskIds}>
              <div className="hidden" />
            </SortableContext>

            {/* Add Column Button */}
          </div>

          {/* Drag Overlay to make the dragging visible and styled correctly */}
          <DragOverlay >
            {activeTask && (
              <div style={overlayStyle} className="border p-3 rounded-md bg-white dark:bg-gray-700 flex justify-between items-center transition-all shadow-md hover:shadow-lg">
                {activeTask.title}
              </div>
            )}
          </DragOverlay>
        </DndContext>
        {showAddColumnButton ? (
          <button
            onClick={handleAddColumn}
            className="px-6 py-3 bg-green-500 text-white rounded-md text-lg font-semibold hover:bg-green-600 transition-all"
          >
            Create Your Column
          </button>
        ) : (
          <button
            onClick={handleAddColumn}
            style={{
              maxHeight: '50px',
              marginTop: '20px'
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all"
          >
            + Add Column
          </button>
        )}
      </div>

    </Layout>
  );
};

export default Dashboard;
