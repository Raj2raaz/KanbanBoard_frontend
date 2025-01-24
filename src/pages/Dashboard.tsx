import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Layout from '../components/Layout';
import KanbanColumn from '../components/KanbanColumn';
import { io } from 'socket.io-client';

// Use a fixed custom socket ID
const customSocketId = "9535030958";
const socket = io('http://localhost:4000', {
  query: { userId: customSocketId },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const initialColumns = [
  {
    id: 'todo',
    title: 'To Do',
    items: ['Task 1', 'Task 2', 'Task 3'],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: ['Task 4', 'Task 5'],
  },
  {
    id: 'done',
    title: 'Done',
    items: ['Task 6'],
  },
];

export default function Dashboard() {
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    console.log(`Connected with custom ID: ${customSocketId}`);

    // Listen for task updates
    socket.on('taskUpdated', (updatedColumns) => {
      console.log('Received task update:', updatedColumns);
      setColumns(updatedColumns);
    });

    // Listen for column updates
    socket.on('columnUpdated', (updatedColumns) => {
      console.log('Received column update:', updatedColumns);
      setColumns(updatedColumns);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    let newColumns = [...columns];

    if (active.data.current?.type === 'column') {
      const activeIndex = columns.findIndex(col => col.id === active.id);
      const overIndex = columns.findIndex(col => col.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        newColumns = arrayMove(columns, activeIndex, overIndex);
      }
      socket.emit('columnUpdated', newColumns);
    } else if (active.data.current?.type === 'task') {
      const sourceColumn = columns.find(col => col.items.includes(active.id));
      const targetColumn = columns.find(col => col.id === over.id || col.items.includes(over.id));

      if (sourceColumn && targetColumn && sourceColumn !== targetColumn) {
        sourceColumn.items = sourceColumn.items.filter(item => item !== active.id);
        targetColumn.items.push(active.id);
      }
      socket.emit('taskUpdated', newColumns);
    }

    setColumns(newColumns);
  };

  return (
    <Layout>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} columns={columns} setColumns={setColumns} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </Layout>
  );
}
